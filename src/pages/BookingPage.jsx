import BookingModal from "../components/BookingModal/BookingModal";

function BookingPage({
  trip,
  onClose,
  onConfirm,
  submitting = false,
  paymentLink = null,
  bookingReference = "",
  onContinueToPayment,
}) {
  return (
    <BookingModal
      trip={trip}
      onClose={onClose}
      onConfirm={onConfirm}
      submitting={submitting}
      paymentLink={paymentLink}
      bookingReference={bookingReference}
      onContinueToPayment={
        onContinueToPayment
      }
    />
  );
}

export default BookingPage;