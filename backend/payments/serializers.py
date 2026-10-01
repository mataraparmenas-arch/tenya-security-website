from decimal import Decimal

from rest_framework import serializers

from .daraja import normalize_phone
from .models import MpesaTransaction


class StkPushSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    amount = serializers.DecimalField(
        max_digits=14, decimal_places=2, min_value=Decimal("1")
    )
    account_reference = serializers.CharField(
        max_length=30,
        help_text="Membership number (e.g. MBR0001) or savings account number (e.g. SA00000001)",
    )
    description = serializers.CharField(
        max_length=100, required=False, default="SACCO contribution"
    )

    def validate_phone_number(self, value):
        try:
            return normalize_phone(value)
        except ValueError as exc:
            raise serializers.ValidationError(str(exc)) from exc

    def validate_account_reference(self, value):
        return value.strip().upper()


class MpesaTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MpesaTransaction
        fields = [
            "id",
            "phone_number",
            "amount",
            "account_reference",
            "description",
            "status",
            "result_code",
            "result_description",
            "mpesa_receipt_number",
            "credited_account_number",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
