import BitcoinPayment from "../components/BitcoinPayment/BitcoinPayment";

function BitcoinPaymentPage({
  booking,
  paymentStartedAt,
  onBack,
  onPaymentComplete,
}) {
  return (
    <BitcoinPayment
      booking={booking}
      paymentStartedAt={paymentStartedAt}
      onBack={onBack}
      onPaymentComplete={onPaymentComplete}
    />
  );
}

export default BitcoinPaymentPage;
