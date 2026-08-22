import BookingModal from "../components/BookingModal/BookingModal";

function BookingPage({
  trip,
  onClose,
  onConfirm,
  submitting = false,
}) {
  return (
    <BookingModal
      trip={trip}
      onClose={onClose}
      onConfirm={onConfirm}
      submitting={submitting}
    />
  );
}

export default BookingPage;
