from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import SavingsAccount
from members.models import Member
from users.models import User

from .daraja import normalize_phone
from .models import MpesaTransaction


class PhoneNumberTests(TestCase):
    def test_normalizes_local_format(self):
        self.assertEqual(normalize_phone("0712345678"), "254712345678")

    def test_rejects_garbage(self):
        with self.assertRaises(ValueError):
            normalize_phone("not-a-phone")


class MpesaApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            email="admin@test.dev", username="admin", password="pass12345"
        )
        self.client.force_authenticate(self.admin)
        self.member = Member.objects.create(
            first_name="John",
            middle_name="K",
            last_name="Mwangi",
            national_id="12345678",
            phone_number="0712345678",
            email="john@test.dev",
            date_of_birth="1994-01-01",
            kra_pin="A123456789",
            country="Kenya",
            county="Nairobi",
            city="Nairobi",
        )

    def test_stk_push_reports_missing_config_cleanly(self):
        resp = self.client.post(
            "/api/v1/payments/mpesa/stk-push/",
            {"phone_number": "0712345678", "amount": "500", "account_reference": "X1"},
            format="json",
        )
        self.assertEqual(resp.status_code, 503)
        self.assertIn("not configured", resp.data["detail"])

    def test_stk_push_validates_phone(self):
        resp = self.client.post(
            "/api/v1/payments/mpesa/stk-push/",
            {"phone_number": "bad", "amount": "500", "account_reference": "X1"},
            format="json",
        )
        self.assertEqual(resp.status_code, 400)

    def test_callback_credits_account_and_is_idempotent(self):
        from accounts.models import SavingsProduct

        product, _ = SavingsProduct.objects.get_or_create(
            name="Savings", code="SAV"
        )
        account = SavingsAccount.objects.create(
            member=self.member, product=product, balance=Decimal("0")
        )

        txn = MpesaTransaction.objects.create(
            initiated_by=self.admin,
            phone_number="254712345678",
            amount=Decimal("500"),
            account_reference=account.account_number,
            checkout_request_id="ws_CO_12345",
        )
        payload = {
            "Body": {
                "stkCallback": {
                    "MerchantRequestID": "29115-34620561-1",
                    "CheckoutRequestID": "ws_CO_12345",
                    "ResultCode": 0,
                    "ResultDesc": "The service request is processed successfully.",
                    "CallbackMetadata": {
                        "Item": [
                            {"Name": "Amount", "Value": 500},
                            {"Name": "MpesaReceiptNumber", "Value": "NLJ7RT61SV"},
                            {"Name": "TransactionDate", "Value": 20261001214325},
                            {"Name": "PhoneNumber", "Value": 254712345678},
                        ]
                    },
                }
            }
        }
        client = APIClient()  # callback is public
        resp = client.post("/api/v1/payments/mpesa/callback/", payload, format="json")
        self.assertEqual(resp.status_code, 200)

        txn.refresh_from_db()
        account.refresh_from_db()
        self.assertEqual(txn.status, MpesaTransaction.Status.SUCCESS)
        self.assertEqual(account.balance, Decimal("500"))
        self.assertEqual(txn.credited_account_number, account.account_number)

        # Safaricom retry must not double-credit
        resp = client.post("/api/v1/payments/mpesa/callback/", payload, format="json")
        self.assertEqual(resp.status_code, 200)
        account.refresh_from_db()
        self.assertEqual(account.balance, Decimal("500"))

    def test_unmatched_callback_is_recorded_for_audit(self):
        payload = {
            "Body": {
                "stkCallback": {
                    "MerchantRequestID": "55",
                    "CheckoutRequestID": "ws_CO_UNKNOWN",
                    "ResultCode": 0,
                    "ResultDesc": "ok",
                    "CallbackMetadata": {
                        "Item": [
                            {"Name": "Amount", "Value": 250},
                            {"Name": "MpesaReceiptNumber", "Value": "QK99XXXX"},
                            {"Name": "PhoneNumber", "Value": 254700000001},
                        ]
                    },
                }
            }
        }
        resp = APIClient().post("/api/v1/payments/mpesa/callback/", payload, format="json")
        self.assertEqual(resp.status_code, 200)
        txn = MpesaTransaction.objects.get(checkout_request_id="ws_CO_UNKNOWN")
        self.assertEqual(txn.status, MpesaTransaction.Status.SUCCESS)
        self.assertEqual(txn.amount, 250)
        self.assertEqual(txn.credited_account_number, "")

    def test_unmatched_declined_callback_without_metadata(self):
        payload = {
            "Body": {
                "stkCallback": {
                    "MerchantRequestID": "56",
                    "CheckoutRequestID": "ws_CO_UNKNOWN2",
                    "ResultCode": 1032,
                    "ResultDesc": "Request cancelled by user",
                }
            }
        }
        resp = APIClient().post("/api/v1/payments/mpesa/callback/", payload, format="json")
        self.assertEqual(resp.status_code, 200)
        txn = MpesaTransaction.objects.get(checkout_request_id="ws_CO_UNKNOWN2")
        self.assertEqual(txn.status, MpesaTransaction.Status.FAILED)
        self.assertIsNone(txn.amount)

    def test_declined_callback_marks_failed(self):
        txn = MpesaTransaction.objects.create(
            phone_number="254712345678",
            amount=Decimal("100"),
            account_reference="X1",
            checkout_request_id="ws_CO_999",
        )
        payload = {
            "Body": {
                "stkCallback": {
                    "MerchantRequestID": "1",
                    "CheckoutRequestID": "ws_CO_999",
                    "ResultCode": 1032,
                    "ResultDesc": "Request cancelled by user",
                }
            }
        }
        resp = APIClient().post("/api/v1/payments/mpesa/callback/", payload, format="json")
        self.assertEqual(resp.status_code, 200)
        txn.refresh_from_db()
        self.assertEqual(txn.status, MpesaTransaction.Status.FAILED)
        self.assertEqual(txn.result_code, 1032)
