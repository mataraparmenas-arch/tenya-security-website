import uuid

from django.conf import settings
from django.db import models


class MpesaTransaction(models.Model):
    """A single Lipa na M-Pesa (STK push) payment attempt."""

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SUCCESS = "SUCCESS", "Success"
        FAILED = "FAILED", "Failed"
        QUEUED = "QUEUED", "Queued"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    initiated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="mpesa_transactions",
    )

    phone_number = models.CharField(max_length=15, blank=True)
    # Nullable: unmatched callbacks (payments posted straight to the paybill)
    # may arrive before we know anything about the payment, and declined
    # pushes carry no amount in the metadata.
    amount = models.DecimalField(
        max_digits=14, decimal_places=2, null=True, blank=True
    )
    account_reference = models.CharField(
        max_length=30,
        help_text="Member number or savings account number the payment belongs to",
    )
    description = models.CharField(max_length=100, default="SACCO contribution")

    merchant_request_id = models.CharField(max_length=64, blank=True)
    checkout_request_id = models.CharField(max_length=64, blank=True, db_index=True)

    status = models.CharField(
        max_length=12, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    result_code = models.IntegerField(null=True, blank=True)
    result_description = models.CharField(max_length=255, blank=True)
    mpesa_receipt_number = models.CharField(max_length=30, blank=True, db_index=True)
    transaction_date = models.CharField(max_length=20, blank=True)

    credited_account_number = models.CharField(
        max_length=20,
        blank=True,
        help_text="Savings account automatically credited on success (if matched)",
    )
    raw_callback = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):  # pragma: no cover
        return f"{self.mpesa_receipt_number or self.checkout_request_id or self.id} {self.status}"
