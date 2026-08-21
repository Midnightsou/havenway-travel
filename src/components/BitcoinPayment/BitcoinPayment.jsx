import {
  Bitcoin,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import {
  useState,
  useEffect,
} from "react";

import "./BitcoinPayment.css";


const BTC_ADDRESS =
  "bc1qnr8l9grr2y3k062qqrykcpeeusy90rnm9e47tn";

const PAYMENT_WINDOW = 20 * 60;
const POLL_INTERVAL = 15000;
const DEV_PAYMENT_SIMULATOR = false;


function BitcoinPayment({
  booking,
  paymentStartedAt,
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

  const expectedBtc =
    booking?.btcAmount || 0;

  const travellerCount =
    booking?.travellers ?? 1;

  const btcAmount =
    btcPrice && usdTotal ? usdTotal / btcPrice : 0;

  const formattedBtcAmount =
    Number.isFinite(btcAmount)
      ? btcAmount.toFixed(8)
      : "0.00000000";

  const fetchBitcoinPrice = async () => {
    try {
      setPriceLoading(true);
      setPriceError(false);

      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch Bitcoin price"
        );
      }

      const data = await response.json();
      const price = data?.bitcoin?.usd;

      if (!price) {
        throw new Error(
          "Bitcoin price unavailable"
        );
      }

      setBtcPrice(price);
    } catch (error) {
      console.error(
        "Bitcoin price error:",
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

  const checkForPayment = async () => {
    if (!BTC_ADDRESS || !expectedBtc) {
      return;
    }

    try {
      setCheckingPayment(true);
      setPaymentError("");

      const response = await fetch(
        `https://mempool.space/api/address/${BTC_ADDRESS}/txs`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to check blockchain"
        );
      }

      const transactions = await response.json();
      const expectedSats =
        Math.round(expectedBtc * 100000000);

      const matchingTransaction =
        transactions.find((transaction) => {
          const outputToOurAddress =
            transaction?.vout?.find(
              (output) =>
                output?.scriptpubkey_address ===
                BTC_ADDRESS
            );

          if (!outputToOurAddress) {
            return false;
          }

          const tolerance = 100;

          return (
            outputToOurAddress.value >=
            expectedSats - tolerance
          );
        });

      if (matchingTransaction) {
        setPaymentDetected(true);
        setTransactionId(
          matchingTransaction.txid ||
            "UNKNOWN"
        );
      } else {
        setPaymentDetected(false);
      }
    } catch (error) {
      console.error(
        "Blockchain payment check failed:",
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

    if (!BTC_ADDRESS || !expectedBtc) {
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
  }, [expectedBtc]);

  useEffect(() => {
    if (!paymentStartedAt) {
      return;
    }

    const updateTimer = () => {
      const elapsed =
        Math.floor(
          (Date.now() - paymentStartedAt) / 1000
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
        BTC_ADDRESS
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

            {priceLoading && (
              <small>
                Calculating Bitcoin amount...
              </small>
            )}

            {priceError && (
              <small className="btc-price-error">
                Unable to fetch the current Bitcoin price. Please try again.
              </small>
            )}

            {!priceLoading &&
              !priceError &&
              btcPrice && (
                <div className="btc-conversion">
                  <span>
                    Amount to send
                  </span>

                  <strong>
                    {formattedBtcAmount} BTC
                  </strong>

                  <small>
                    1 BTC ≈ ${btcPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
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
                {BTC_ADDRESS}
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
                  <strong>Payment detected</strong>
                  <span>
                    Bitcoin payment detected on-chain. You can now complete your booking.
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

          <button
            className="bitcoin-paid-button"
            disabled={
              !paymentDetected ||
              priceLoading ||
              !btcAmount ||
              !btcPrice ||
              secondsRemaining <= 0
            }
            onClick={handleContinue}
          >
            {paymentDetected
              ? "Continue to confirmation"
              : secondsRemaining <= 0
                ? "Payment window expired"
                : "Waiting for payment"}
          </button>


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