"""Thin client around the Safaricom Daraja API.

Configuration comes from environment variables (see backend/.env.example):

    MPESA_ENVIRONMENT   sandbox | production
    MPESA_CONSUMER_KEY  Daraja app consumer key
    MPESA_CONSUMER_SECRET
    MPESA_SHORTCODE     Business shortcode (paybill / till)
    MPESA_PASSKEY       Lipa na M-Pesa online passkey
    MPESA_CALLBACK_URL  https://<your-api-domain>/api/v1/payments/mpesa/callback/
"""

import base64
import logging
from datetime import datetime

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

SANDBOX_BASE_URL = "https://sandbox.safaricom.co.ke"
PRODUCTION_BASE_URL = "https://api.safaricom.co.ke"


class MpesaNotConfigured(Exception):
    """Raised when the Daraja credentials are missing."""


class DarajaError(Exception):
    """Raised when Daraja rejects a request."""

    def __init__(self, message, response=None):
        super().__init__(message)
        self.response = response


def _env(name):
    return (getattr(settings, name, "") or "").strip()


def normalize_phone(phone: str) -> str:
    """Convert 07xxxxxxxx / +2547xxxxxxxx to the 2547xxxxxxxx format Daraja expects."""
    digits = "".join(ch for ch in phone if ch.isdigit())
    if digits.startswith("0") and len(digits) == 10:
        digits = "254" + digits[1:]
    if digits.startswith("254") and len(digits) == 12:
        return digits
    if digits.startswith("7") and len(digits) == 9:
        return "254" + digits
    raise ValueError(f"'{phone}' is not a valid Kenyan phone number")


class DarajaClient:
    def __init__(self):
        self.environment = _env("MPESA_ENVIRONMENT") or "sandbox"
        self.consumer_key = _env("MPESA_CONSUMER_KEY")
        self.consumer_secret = _env("MPESA_CONSUMER_SECRET")
        self.shortcode = _env("MPESA_SHORTCODE")
        self.passkey = _env("MPESA_PASSKEY")
        self.callback_url = _env("MPESA_CALLBACK_URL")
        self.base_url = (
            PRODUCTION_BASE_URL if self.environment == "production" else SANDBOX_BASE_URL
        )

    @property
    def is_configured(self) -> bool:
        return all(
            [self.consumer_key, self.consumer_secret, self.shortcode, self.passkey]
        )

    def _require_config(self):
        if not self.is_configured:
            raise MpesaNotConfigured(
                "M-Pesa is not configured. Set MPESA_CONSUMER_KEY, "
                "MPESA_CONSUMER_SECRET, MPESA_SHORTCODE and MPESA_PASSKEY in the "
                "backend environment (get sandbox keys at developer.safaricom.co.ke)."
            )

    def get_access_token(self) -> str:
        self._require_config()
        try:
            resp = requests.get(
                f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials",
                auth=(self.consumer_key, self.consumer_secret),
                timeout=30,
            )
            data = resp.json()
        except requests.RequestException as exc:  # pragma: no cover - network
            raise DarajaError(f"Could not reach Daraja: {exc}") from exc
        token = data.get("access_token")
        if not token:
            raise DarajaError(
                f"Daraja auth failed: {data.get('error_description') or data}", data
            )
        return token

    def _lipa_password(self, timestamp: str) -> str:
        raw = f"{self.shortcode}{self.passkey}{timestamp}"
        return base64.b64encode(raw.encode()).decode()

    def stk_push(self, phone: str, amount, account_reference: str, description: str):
        """Initiate Lipa na M-Pesa Online (STK push). Returns the Daraja JSON payload."""
        self._require_config()
        phone = normalize_phone(phone)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

        if not self.callback_url:
            logger.warning(
                "MPESA_CALLBACK_URL is empty — Daraja responses will not reach this server"
            )

        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": self._lipa_password(timestamp),
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),  # Daraja rejects decimal amounts
            "PartyA": phone,
            "PartyB": self.shortcode,
            "PhoneNumber": phone,
            "CallBackURL": self.callback_url
            or "https://example.com/api/v1/payments/mpesa/callback/",
            "AccountReference": account_reference[:12],
            "TransactionDesc": (description or "SACCO contribution")[:13],
        }

        token = self.get_access_token()
        resp = requests.post(
            f"{self.base_url}/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        )
        data = resp.json()
        if str(data.get("ResponseCode", "0")) != "0":
            raise DarajaError(
                data.get("errorMessage")
                or data.get("CustomerMessage")
                or data.get("ResponseDescription")
                or str(data),
                data,
            )
        return data


def parse_callback(payload: dict) -> dict:
    """Extract the useful fields from a Safaricom STK callback body."""
    stk = payload.get("Body", {}).get("stkCallback", {})
    result = {
        "merchant_request_id": stk.get("MerchantRequestID", ""),
        "checkout_request_id": stk.get("CheckoutRequestID", ""),
        "result_code": stk.get("ResultCode"),
        "result_description": stk.get("ResultDesc", ""),
        "amount": None,
        "mpesa_receipt_number": "",
        "transaction_date": "",
        "phone_number": "",
    }
    items = (stk.get("CallbackMetadata") or {}).get("Item") or []
    for item in items:
        name, value = item.get("Name"), item.get("Value")
        if name == "Amount":
            result["amount"] = value
        elif name == "MpesaReceiptNumber":
            result["mpesa_receipt_number"] = value
        elif name == "TransactionDate":
            result["transaction_date"] = str(value)
        elif name == "PhoneNumber":
            result["phone_number"] = str(value)
    return result
