import {
  Bitcoin,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import "./BitcoinPayment.css";


const BTC_PAYMENT_ADDRESS =
  "YOUR_BTC_ADDRESS_HERE";

const QUOTE_DURATION_SECONDS = 20 * 60;


function BitcoinPayment({
  booking,
  onBack,
  onPaymentComplete,
}) {

  const [btcPrice, setBtcPrice] =
    useState(null);

  const [priceLoading, setPriceLoading] =
    useState(true);

  const [priceError, setPriceError] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [expiresAt, setExpiresAt] =
    useState(null);

  const [secondsLeft, setSecondsLeft] =
    useState(QUOTE_DURATION_SECONDS);


  /*
   * Booking total
   */

  const usdTotal = Number(
    booking?.totals?.tripTotal ??
      booking?.totals?.total ??
      0
  );


  /*
   * Fetch BTC/USD price
   */

  const fetchBitcoinPrice = async () => {

    try {

      setPriceLoading(true);
      setPriceError(false);

      const response = await fetch(
        "https://mempool.space/api/v1/prices"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch Bitcoin price"
        );
      }

      const data = await response.json();

      const price = Number(data.USD);

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(
          "Invalid Bitcoin price"
        );
      }

      setBtcPrice(price);

      /*
       * Start a fresh payment quote.
       */

      const expiry =
        Date.now() +
        QUOTE_DURATION_SECONDS * 1000;

      setExpiresAt(expiry);

      setSecondsLeft(
        QUOTE_DURATION_SECONDS
      );

    } catch (error) {

      console.error(
        "Bitcoin price fetch failed:",
        error
      );

      setPriceError(true);

    } finally {

      setPriceLoading(false);

    }

  };


  useEffect(() => {

    fetchBitcoinPrice();

  }, []);


  /*
   * Countdown
   */

  useEffect(() => {

    if (!expiresAt) return;

    const timer = setInterval(() => {

      const remaining = Math.max(
        0,
        Math.ceil(
          (expiresAt - Date.now()) / 1000
        )
      );

      setSecondsLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
      }

    }, 1000);

    return () => {
      clearInterval(timer);
    };

  }, [expiresAt]);


  /*
   * BTC amount
   */

  const btcAmount = useMemo(() => {

    if (!btcPrice || !usdTotal) {
      return null;
    }

    return usdTotal / btcPrice;

  }, [usdTotal, btcPrice]);


  /*
   * Display amount.
   *
   * Bitcoin supports 8 decimal places.
   */

  const formattedBtcAmount =
    btcAmount !== null
      ? btcAmount.toFixed(8)
      : "—";


  /*
   * Countdown formatting
   */

  const minutes =
    Math.floor(secondsLeft / 60);

  const seconds =
    secondsLeft % 60;

  const formattedTime =
    `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;


  /*
   * Copy BTC address
   */

  const copyAddress = async () => {

    try {

      await navigator.clipboard.writeText(
        BTC_PAYMENT_ADDRESS
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


  /*
   * Quote expired
   */

  const quoteExpired =
    secondsLeft <= 0;


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
              Trip total
            </span>

            <strong>
              ${usdTotal.toFixed(2)}
            </strong>

          </div>


          <div className="bitcoin-divider" />


          {/* BTC AMOUNT */}

          <div className="bitcoin-amount">

            <span>
              Bitcoin amount
            </span>

            <strong>
              {priceLoading
                ? "Calculating..."
                : `${formattedBtcAmount} BTC`}
            </strong>

          </div>


          {/* RATE */}

          {!priceLoading &&
            btcPrice && (
              <div className="bitcoin-rate">

                <span>
                  Current BTC rate
                </span>

                <strong>
                  1 BTC = $
                  {btcPrice.toLocaleString(
                    "en-US",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>

              </div>
            )}


          {/* ERROR */}

          {priceError && (
            <div className="bitcoin-error">

              <span>
                We couldn't get the current
                Bitcoin price.
              </span>

              <button
                onClick={fetchBitcoinPrice}
              >
                <RefreshCw size={15} />
                Try again
              </button>

            </div>
          )}


          {/* QR */}

          <div className="bitcoin-qr-wrapper">

            <div className="bitcoin-qr">

              <span>
                QR
              </span>

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
                {BTC_PAYMENT_ADDRESS}
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
            className={`bitcoin-timer ${
              quoteExpired
                ? "expired"
                : ""
            }`}
          >

            <Clock size={18} />

            <div>

              <strong>
                {quoteExpired
                  ? "Payment quote expired"
                  : "Payment amount locked"}
              </strong>

              <span>
                {quoteExpired
                  ? "Refresh to get a new Bitcoin amount."
                  : `Quote expires in ${formattedTime}`}
              </span>

            </div>

          </div>


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


          {/* STATUS */}

          <div className="bitcoin-status">

            <div className="status-icon">
              <Clock size={18} />
            </div>

            <div>

              <strong>
                Waiting for payment
              </strong>

              <span>
                Your payment will be verified
                on the Bitcoin network.
              </span>

            </div>

          </div>


          {/* REFRESH */}

          {quoteExpired && (

            <button
              className="bitcoin-refresh-button"
              onClick={fetchBitcoinPrice}
            >
              <RefreshCw size={17} />
              Get new payment amount
            </button>

          )}


          {/* PAID */}

          {!quoteExpired && !priceError && (

            <button
              className="bitcoin-paid-button"
              disabled={
                priceLoading ||
                !btcAmount
              }
              onClick={onPaymentComplete}
            >
              I've sent the Bitcoin
            </button>

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