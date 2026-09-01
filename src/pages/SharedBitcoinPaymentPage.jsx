import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BitcoinPayment from "../components/BitcoinPayment/BitcoinPayment";

const API_BASE_URL =
  "https://api.havenway-travels.cv";

function SharedBitcoinPaymentPage() {

  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] =
    useState(null);

  const [paymentSession, setPaymentSession] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    loadPaymentSession();

  }, [bookingId]);


  const loadPaymentSession = async () => {

    try {

      setLoading(true);
      setError("");


      /*
       * Load the existing booking first.
       */

      const bookingResponse =
        await fetch(
          `${API_BASE_URL}/api/payment-link/${bookingId}`
        );


      const bookingData =
        await bookingResponse.json();


      if (
        !bookingResponse.ok ||
        !bookingData.success
      ) {

        throw new Error(
          bookingData.error ||
            "Unable to load booking"
        );

      }


      setBooking(
        bookingData.booking
      );


      /*
       * Load the EXISTING payment session.
       *
       * This does NOT create a new
       * payment session.
       */

      const paymentResponse =
        await fetch(
          `${API_BASE_URL}/api/payment-session/${bookingId}`
        );


      const paymentData =
        await paymentResponse.json();


      if (
        !paymentResponse.ok ||
        !paymentData.success
      ) {

        throw new Error(
          paymentData.error ||
            "Unable to load payment session"
        );

      }


      setPaymentSession(
        paymentData.paymentSession
      );


    } catch (err) {

      console.error(
        "Shared payment error:",
        err
      );

      setError(
        err.message ||
          "Unable to load payment"
      );

    } finally {

      setLoading(false);

    }

  };


  const handlePaymentComplete = () => {

    /*
     * The shared payer has successfully
     * paid the existing booking.
     *
     * We cannot rely on App.jsx's
     * paymentBooking state because this
     * person entered through a shared URL.
     *
     * Send the booking ID to confirmation.
     */

    navigate(
      `/confirmation?bookingId=${bookingId}`
    );

  };


  if (loading) {

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
              Preparing your existing Bitcoin
              payment session...
            </p>

          </div>

        </div>

      </section>
    );

  }


  if (error) {

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
              {error}
            </p>

          </div>

          <div className="bitcoin-payment-card">

            <button
              className="bitcoin-back-button"
              onClick={() =>
                navigate(
                  `/pay/${bookingId}`
                )
              }
            >
              ← Back
            </button>

          </div>

        </div>

      </section>
    );

  }


  if (!paymentSession) {

    return null;

  }


  return (
    <BitcoinPayment
      booking={booking}

      bookingId={
        paymentSession.bookingId
      }

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
        paymentSession.btcAmount > 0 &&
        paymentSession.usdTotal > 0
          ? paymentSession.usdTotal /
            paymentSession.btcAmount
          : null
      }

      paymentStartedAt={
        paymentSession.paymentStartedAt
      }

      onBack={() =>
        navigate(
          `/pay/${bookingId}`
        )
      }

      onPaymentComplete={
        handlePaymentComplete
      }
    />
  );

}


export default SharedBitcoinPaymentPage;