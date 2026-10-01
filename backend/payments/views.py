import logging

from django.db import transaction as db_transaction
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .daraja import DarajaClient, DarajaError, MpesaNotConfigured, parse_callback
from .models import MpesaTransaction
from .serializers import MpesaTransactionSerializer, StkPushSerializer

logger = logging.getLogger(__name__)


class StkPushView(APIView):
    """POST /api/v1/payments/mpesa/stk-push/

    Authenticated staff (or a member portal) initiates an STK push.
    The member's phone shows the M-Pesa PIN prompt; the Daraja callback
    then updates the transaction and credits the savings account.
    """

    def post(self, request):
        serializer = StkPushSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        client = DarajaClient()
        try:
            daraja_response = client.stk_push(
                phone=data["phone_number"],
                amount=data["amount"],
                account_reference=data["account_reference"],
                description=data["description"],
            )
        except MpesaNotConfigured as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except DarajaError as exc:
            return Response(
                {"detail": str(exc), "provider_response": exc.response},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        txn = MpesaTransaction.objects.create(
            initiated_by=request.user if request.user.is_authenticated else None,
            phone_number=data["phone_number"],
            amount=data["amount"],
            account_reference=data["account_reference"],
            description=data["description"],
            merchant_request_id=daraja_response.get("MerchantRequestID", ""),
            checkout_request_id=daraja_response.get("CheckoutRequestID", ""),
            status=MpesaTransaction.Status.PENDING,
        )
        return Response(
            {
                "transaction": MpesaTransactionSerializer(txn).data,
                "provider_response": daraja_response,
            },
            status=status.HTTP_201_CREATED,
        )


class MpesaCallbackView(APIView):
    """POST /api/v1/payments/mpesa/callback/

    Public webhook Safaricom calls after the member enters (or cancels)
    their M-Pesa PIN. On success the member's savings account is credited.
    Must always return 200 so Daraja does not keep retrying.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        payload = request.data
        result = parse_callback(payload)
        checkout_id = result["checkout_request_id"]

        txn = MpesaTransaction.objects.filter(checkout_request_id=checkout_id).first()
        if txn is None:
            # Unmatched callback (e.g. paybill posted directly). Record it for audit.
            txn = MpesaTransaction.objects.create(
                raw_callback=payload,
                status=MpesaTransaction.Status.QUEUED,
                checkout_request_id=checkout_id,
                merchant_request_id=result["merchant_request_id"],
                phone_number=result["phone_number"] or "",
                amount=result["amount"],
                mpesa_receipt_number=result["mpesa_receipt_number"] or "",
            )
        elif txn.status == MpesaTransaction.Status.SUCCESS and result["result_code"] == 0:
            # Idempotency: Daraja retries callbacks on timeouts — never credit twice.
            return Response({"ResultCode": 0, "ResultDesc": "Already processed"})

        txn.raw_callback = payload
        txn.merchant_request_id = result["merchant_request_id"] or txn.merchant_request_id
        txn.result_code = result["result_code"]
        txn.result_description = result["result_description"]
        if result["mpesa_receipt_number"]:
            txn.mpesa_receipt_number = result["mpesa_receipt_number"]
        txn.transaction_date = result["transaction_date"]

        if result["result_code"] == 0:
            txn.status = MpesaTransaction.Status.SUCCESS
            txn.credited_account_number = self._credit_savings(txn, result)
        else:
            txn.status = MpesaTransaction.Status.FAILED

        txn.save()
        return Response({"ResultCode": 0, "ResultDesc": "Accepted"})

    @staticmethod
    def _credit_savings(txn: MpesaTransaction, result: dict) -> str:
        """Credit the member's savings account. Returns the account number used ('' if unmatched)."""
        from accounts.models import SavingsAccount, SavingsTransaction
        from accounts.services import post_savings_transaction
        from users.models import User

        ref = (txn.account_reference or "").strip().upper()
        amount = result["amount"] if result["amount"] is not None else txn.amount

        account = SavingsAccount.objects.select_related("member").filter(
            account_number__iexact=ref
        ).first()
        if account is None:
            # Reference may be a membership number — use the member's first active account.
            account = SavingsAccount.objects.select_related("member").filter(
                member__membership_number__iexact=ref, is_active=True
            ).first()
        if account is None:
            logger.warning(
                "M-Pesa payment %s matched no savings account (ref=%s); recorded only",
                result["mpesa_receipt_number"],
                ref,
            )
            return ""

        performed_by = txn.initiated_by or User.objects.filter(is_superuser=True).first()
        if performed_by is None:
            logger.warning("No user available to attribute M-Pesa credit %s", txn.id)
            return ""

        try:
            post_savings_transaction(
                account=account,
                transaction_type=SavingsTransaction.DEPOSIT,
                amount=amount,
                user=performed_by,
                narration=(
                    f"M-Pesa deposit {result['mpesa_receipt_number']} from "
                    f"{result['phone_number'] or txn.phone_number}"
                ),
            )
        except ValueError as exc:
            logger.warning("Could not credit M-Pesa payment %s: %s", txn.id, exc)
            return ""
        return account.account_number


class MpesaTransactionListView(generics.ListAPIView):
    """GET /api/v1/payments/mpesa/transactions/ — staff audit list."""

    queryset = MpesaTransaction.objects.all()
    serializer_class = MpesaTransactionSerializer
    filterset_fields = ("status",)
    search_fields = ("mpesa_receipt_number", "phone_number", "account_reference")
