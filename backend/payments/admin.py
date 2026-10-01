from django.contrib import admin

from .models import MpesaTransaction


@admin.register(MpesaTransaction)
class MpesaTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "mpesa_receipt_number",
        "phone_number",
        "amount",
        "account_reference",
        "status",
        "credited_account_number",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = (
        "mpesa_receipt_number",
        "checkout_request_id",
        "phone_number",
        "account_reference",
    )
    readonly_fields = (
        "merchant_request_id",
        "checkout_request_id",
        "raw_callback",
        "created_at",
        "updated_at",
    )
