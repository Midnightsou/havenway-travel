import {
  Bitcoin,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import {
  useState,
  useEffect,
} from "react";

import "./BitcoinPayment.css";


const API_BASE_URL =
  "https://server-snowy-rho-84.vercel.app";

const PAYMENT_WINDOW = 20 * 60;
const POLL_INTERVAL = 15000;
const DEV_PAYMENT_SIMULATOR = false;


function BitcoinPayment({
  booking,
  bookingId,
  btcAddress,
  btcAmount,
  btcPrice,
  paymentStartedAt,
  onBack,
  onPaymentComplete,
}) {

  const [copied, setCopied] =
    useState(false);

  const [paymentDetected, setPaymentDetected] =
    useState(false);

  const [checkingPayment, setCheckingPayment] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState("");

  const [secondsRemaining, setSecondsRemaining] =
    useState(PAYMENT_WINDOW);

  const [transactionId, setTransactionId] =
    useState("");


  const usdTotal = Number(
    booking?.totals?.tripTotal ??
      booking?.totals?.total ??
      0
  );

  const travellerCount =
    booking?.travellers ?? 1;

  const numericBtcAmount = Number(btcAmount);

  const formattedBtcAmount =
    Number.isFinite(numericBtcAmount)
      ? numericBtcAmount.toFixed(8)
      : "0.00000000";

  const numericBtcPrice = Number(btcPrice);

  const checkForPayment = async () => {
    if (!bookingId) {
      return;
    }

    try {
      setCheckingPayment(true);
      setPaymentError("");

      const response = await fetch(
        `${API_BASE_URL}/api/check-payment?bookingId=${encodeURIComponent(bookingId)}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to check Bitcoin payment"
        );
      }

      const data = await response.json();

      console.log("Bitcoin payment status:", data);

      if (
        data.success &&
        data.paymentFound &&
        data.confirmed
      ) {
        setPaymentDetected(true);

        setTransactionId(
          data.transactionId ||
            data.txid ||
            "UNKNOWN"
        );

        return;
      }

      setPaymentDetected(false);

    } catch (error) {

      console.error(
        "Bitcoin payment check failed:",
        error
      );

      setPaymentError(
        "Unable to check the Bitcoin network. Retrying..."
      );

    } finally {
      setCheckingPayment(false);
    }
  };

  useEffect(() => {
    if (DEV_PAYMENT_SIMULATOR) {
      const simulator = setTimeout(() => {
        setPaymentDetected(true);
        setTransactionId(
          "DEV-TEST-TRANSACTION"
        );
      }, 8000);

      return () => {
        clearTimeout(simulator);
      };
    }

    if (!bookingId) {
      return;
    }

    checkForPayment();

    const interval = setInterval(
      checkForPayment,
      POLL_INTERVAL
    );

    return () => {
      clearInterval(interval);
    };

  }, [bookingId]);

  useEffect(() => {
    if (!paymentStartedAt) {
      return;
    }

    const updateTimer = () => {
      const elapsed =
        Math.floor(
          (Date.now() -
            new Date(paymentStartedAt).getTime()) /
            1000
        );

      const remaining =
        Math.max(
          PAYMENT_WINDOW - elapsed,
          0
        );

      setSecondsRemaining(remaining);
    };

    updateTimer();

    const interval = setInterval(
      updateTimer,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [paymentStartedAt]);

  const minutes =
    Math.floor(secondsRemaining / 60);

  const seconds =
    secondsRemaining % 60;

  const formattedTime =
    `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;


  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(
        btcAddress
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy Bitcoin address:",
        error
      );
    }
  };

  const handleContinue = () => {
    if (!paymentDetected) {
      return;
    }

    onPaymentComplete();
  };

  return (
    <section className="bitcoin-payment">

      <div className="bitcoin-payment-container">

        {/* BACK */}

        <button
          className="bitcoin-back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back to booking
        </button>


        {/* HEADER */}

        <div className="bitcoin-payment-header">

          <div className="bitcoin-icon">
            <Bitcoin size={30} />
          </div>

          <span className="section-eyebrow">
            Secure payment
          </span>

          <h1>
            Pay with Bitcoin
          </h1>

          <p>
            Complete your booking by sending
            Bitcoin to the address below.
          </p>

        </div>


        {/* PAYMENT CARD */}

        <div className="bitcoin-payment-card">

          {/* USD TOTAL */}

          <div className="bitcoin-total">

            <span>
              Total trip price
            </span>

            <strong>
              ${usdTotal.toFixed(2)}
            </strong>

            {numericBtcPrice > 0 && (
              <div className="btc-conversion">
                <span>
                  Amount to send
                </span>

                <strong>
                  {formattedBtcAmount} BTC
                </strong>

                <small>
                  1 BTC ≈ ${numericBtcPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </small>
              </div>
            )}

            <small>
              {travellerCount}{" "}
              {travellerCount === 1
                ? "traveler"
                : "travelers"}
            </small>

          </div>


          <div className="bitcoin-divider" />


          {/* BTC AMOUNT */}

          <div className="bitcoin-amount">

            <span>
              Bitcoin amount
            </span>

            <strong>
              {formattedBtcAmount} BTC
            </strong>

          </div>


          {/* RATE */}

          {numericBtcPrice > 0 && (
            <div className="bitcoin-rate">

              <span>
                Current BTC rate
              </span>

              <strong>
                1 BTC = $
                {numericBtcPrice.toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>
          )}


          {/* QR */}

          <div className="bitcoin-qr-wrapper">

            <div className="bitcoin-qr">

              <img
                src="/images/hotel/btc qr code.png"
                alt="Bitcoin payment QR code"
                className="bitcoin-qr-image"
              />

            </div>

          </div>


          <p className="bitcoin-qr-label">
            Scan this QR code with your Bitcoin wallet
          </p>


          {/* ADDRESS */}

          <div className="bitcoin-address-section">

            <span>
              Bitcoin address
            </span>

            <div className="bitcoin-address">

              <code>
                {btcAddress}
              </code>

              <button
                onClick={copyAddress}
                aria-label="Copy Bitcoin address"
              >

                {copied ? (
                  <Check size={18} />
                ) : (
                  <Copy size={18} />
                )}

              </button>

            </div>

            {copied && (
              <small className="copy-success">
                Address copied
              </small>
            )}

          </div>


          {/* PAYMENT WINDOW */}

          <div
            className={`payment-countdown ${
              secondsRemaining <= 0 ? "expired" : ""
            }`}
          >

            <Clock size={18} />

            <div>

              <strong>
                Payment window
              </strong>

              <span>
                {formattedTime} remaining
              </span>

            </div>

          </div>

          {secondsRemaining <= 0 && (
            <div className="payment-expired">
              <Clock size={19} />

              <div>
                <strong>
                  Payment window expired
                </strong>

                <span>
                  This payment session has expired.
                  Please start a new payment.
                </span>
              </div>
            </div>
          )}


          {/* WARNING */}

          <div className="bitcoin-warning">

            <Bitcoin size={18} />

            <p>
              Send exactly{" "}
              <strong>
                {formattedBtcAmount} BTC
              </strong>{" "}
              to the address provided.
            </p>

          </div>


          {/* PAYMENT STATUS */}

          <div className="bitcoin-status">
            <div className="status-icon">
              <Clock size={18} />
            </div>

            <div>
              {paymentDetected ? (
                <>
                  <strong>Payment confirmed</strong>
                  <span>
                    Your Bitcoin payment is confirmed. You can now continue to your booking confirmation.
                  </span>
                </>
              ) : secondsRemaining <= 0 ? (
                <>
                  <strong>Payment window expired</strong>
                  <span>
                    Please start a new payment session.
                  </span>
                </>
              ) : (
                <>
                  <strong>Waiting for Bitcoin payment</strong>
                  <span>
                    Checking the blockchain automatically · {checkingPayment ? "Checking..." : "Waiting for transaction"}
                  </span>
                </>
              )}
            </div>
          </div>

          {paymentDetected && (
            <button
              className="bitcoin-paid-button"
              onClick={handleContinue}
            >
              Continue to confirmation
            </button>
          )}

          {transactionId && (
            <div className="bitcoin-transaction">
              <span>Transaction</span>
              <code>{transactionId}</code>
            </div>
          )}

          {paymentError && (
            <div className="bitcoin-error payment-error">
              <span>{paymentError}</span>
            </div>
          )}

          {/* SECURITY */}

          <div className="bitcoin-security">

            <ShieldCheck size={17} />

            <span>
              Your booking is confirmed only
              after payment verification.
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}


export default BitcoinPayment;