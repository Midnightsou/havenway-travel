import {
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import BitcoinPayment from "../components/BitcoinPayment/BitcoinPayment";


function BitcoinPaymentPage({
  booking,
  paymentSession,
  creatingPayment,
  onRetryCreate,
  onBack,
  onPaymentComplete,
}) {

  const sessionReady = Boolean(
    paymentSession &&
      paymentSession.bookingId &&
      paymentSession.btcAddress &&
      Number(paymentSession.btcAmount) > 0
  );

  if (!sessionReady) {
    return (
      <section className="bitcoin-payment">

        <div className="bitcoin-payment-container">

          <div className="bitcoin-payment-header">

            <span className="section-eyebrow">
              Secure payment
            </span>

            <h1>
              {creatingPayment
                ? "Creating your payment session"
                : "Payment session unavailable"}
            </h1>

            <p>
              {creatingPayment
                ? "Calculating your Bitcoin amount. One moment please."
                : "We could not find a Bitcoin payment session for this booking. Please return to your booking and try again."}
            </p>

          </div>

          <div className="bitcoin-payment-card payment-session-missing">

            {!creatingPayment && onRetryCreate && (
              <button
                className="bitcoin-refresh-button retry-session-button"
                onClick={onRetryCreate}
              >
                <RefreshCw size={16} />
                Retry Bitcoin payment
              </button>
            )}

            <button
              className="bitcoin-back-button retry-session-button"
              onClick={onBack}
            >
              <ArrowLeft size={17} />
              Back to booking
            </button>

          </div>

        </div>

      </section>
    );
  }

  return (
    <BitcoinPayment
      booking={booking}
      bookingId={paymentSession.bookingId}
      btcAddress={paymentSession.btcAddress}
      btcAmount={paymentSession.btcAmount}
      btcPrice={paymentSession.btcPrice}
      paymentStartedAt={paymentSession.paymentStartedAt}
      onBack={onBack}
      onPaymentComplete={onPaymentComplete}
    />
  );
}

export default BitcoinPaymentPage;
