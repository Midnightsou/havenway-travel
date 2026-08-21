import BookingModal from "../components/BookingModal/BookingModal";

function BookingPage({ trip, onClose, onConfirm }) {
  return (
    <BookingModal
      trip={trip}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export default BookingPage;
