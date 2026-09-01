import {
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import BitcoinPayment from "../components/BitcoinPayment/BitcoinPayment";

const API_BASE_URL =
  "https://api.havenway-travels.cv";

function BitcoinPaymentPage({
  booking,
  paymentSession,
  creatingPayment,
  onRetryCreate,
  onBack,
  onPaymentComplete,
}) {
  const [sharedBooking, setSharedBooking] =
    useState(null);

  const [loadingSharedBooking, setLoadingSharedBooking] =
    useState(false);

  /*
   * If this page was reached from the normal
   * checkout flow, use the existing paymentSession.
   *
   * If it was reached through a shared payment
   * link, load the booking from the API.
   */

  useEffect(() => {
    if (
      paymentSession?.bookingId ||
      !booking?.id
    ) {
      return;
    }

    const loadSharedBooking = async () => {
      try {
        setLoadingSharedBooking(true);

        const response = await fetch(
          `${API_BASE_URL}/api/payment-link/${booking.id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              "Unable to load payment session"
          );
        }

        setSharedBooking(data.booking);

      } catch (error) {
        console.error(
          "Shared payment session error:",
          error
        );

      } finally {
        setLoadingSharedBooking(false);
      }
    };

    loadSharedBooking();

  }, [
    booking?.id,
    paymentSession?.bookingId,
  ]);


  /*
   * Normal checkout payment session.
   */

  if (paymentSession?.bookingId) {
    const sessionReady = Boolean(
      paymentSession.bookingId &&
      paymentSession.btcAddress &&
      Number(
        paymentSession.btcAmount
      ) > 0
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

              {!creatingPayment &&
                onRetryCreate && (
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
        paymentToken={
          paymentSession.paymentToken
        }
        btcAddress={
          paymentSession.btcAddress
        }
        btcAmount={
          paymentSession.btcAmount
        }
        btcPrice={
          paymentSession.btcPrice
        }
        paymentStartedAt={
          paymentSession.paymentStartedAt
        }
        onBack={onBack}
        onPaymentComplete={
          onPaymentComplete
        }
      />
    );
  }


  /*
   * Shared payment link.
   */

  if (loadingSharedBooking) {
    return (
      <section className="bitcoin-payment">

        <div className="bitcoin-payment-container">

          <div className="bitcoin-payment-header">

            <span className="section-eyebrow">
              Secure payment
            </span>

            <h1>
              Loading payment
            </h1>

            <p>
              Preparing your Bitcoin payment details...
            </p>

          </div>

        </div>

      </section>
    );
  }


  if (!sharedBooking) {
    return (
      <section className="bitcoin-payment">

        <div className="bitcoin-payment-container">

          <div className="bitcoin-payment-header">

            <span className="section-eyebrow">
              Secure payment
            </span>

            <h1>
              Payment unavailable
            </h1>

            <p>
              We could not load this payment session.
            </p>

          </div>

          <div className="bitcoin-payment-card payment-session-missing">

            <button
              className="bitcoin-back-button retry-session-button"
              onClick={onBack}
            >
              <ArrowLeft size={17} />
              Back
            </button>

          </div>

        </div>

      </section>
    );
  }


  /*
   * Convert the shared booking response
   * into the shape BitcoinPayment expects.
   */

  const sharedPaymentSession = {
    bookingId:
      sharedBooking.id,

    /*
     * IMPORTANT:
     * Shared API calls this expectedBtc.
     * BitcoinPayment expects btcAmount.
     */

    btcAmount:
      sharedBooking.expectedBtc,

    btcAddress:
      sharedBooking.btcAddress,

    /*
     * Shared links do not need to expose
     * the token again to the payment UI.
     */

    paymentToken:
      null,

    btcPrice:
      sharedBooking.expectedBtc > 0 &&
      sharedBooking.usdTotal > 0
        ? sharedBooking.usdTotal /
          sharedBooking.expectedBtc
        : 0,

    paymentStartedAt:
      null,
  };


  const sharedPaymentBooking = {
    ...sharedBooking,

    id:
      sharedBooking.id,

    travellers:
      sharedBooking.travellers,

    totals: {
      tripTotal:
        Number(
          sharedBooking.usdTotal
        ),
    },
  };


  return (
    <BitcoinPayment
      booking={sharedPaymentBooking}

      bookingId={
        sharedPaymentSession.bookingId
      }

      paymentToken={
        sharedPaymentSession.paymentToken
      }

      btcAddress={
        sharedPaymentSession.btcAddress
      }

      btcAmount={
        sharedPaymentSession.btcAmount
      }

      btcPrice={
        sharedPaymentSession.btcPrice
      }

      paymentStartedAt={
        sharedPaymentSession.paymentStartedAt
      }

      onBack={onBack}

      onPaymentComplete={
        onPaymentComplete
      }
    />
  );
}

export default BitcoinPaymentPage;