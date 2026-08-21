import BookingConfirmation from "../components/BookingConfirmation/BookingConfirmation";

function BookingConfirmationPage({ booking, onReturnHome }) {
  return (
    <BookingConfirmation
      booking={booking}
      onReturnHome={onReturnHome}
    />
  );
}

export default BookingConfirmationPage;
