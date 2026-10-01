from django.urls import path

from .views import MpesaCallbackView, MpesaTransactionListView, StkPushView

app_name = "payments"

urlpatterns = [
    path("payments/mpesa/stk-push/", StkPushView.as_view(), name="mpesa-stk-push"),
    path("payments/mpesa/callback/", MpesaCallbackView.as_view(), name="mpesa-callback"),
    path(
        "payments/mpesa/transactions/",
        MpesaTransactionListView.as_view(),
        name="mpesa-transactions",
    ),
]
