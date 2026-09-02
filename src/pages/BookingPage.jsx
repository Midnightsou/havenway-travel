import BookingModal from "../components/BookingModal/BookingModal";

function BookingPage({
  trip,
  onClose,
  onConfirm,
  submitting = false,
  paymentLink = null,
  bookingReference = "",
  onContinueToPayment,
  onShareItinerary,
  creatingSharedTrip = false,
  sharedTripLink = null,
  sharedTripCopied = false,
}) {
  return (
    <BookingModal
      trip={trip}
      onClose={onClose}
      onConfirm={onConfirm}
      submitting={submitting}
      paymentLink={paymentLink}
      bookingReference={bookingReference}
      onContinueToPayment={onContinueToPayment}
      onShareItinerary={onShareItinerary}
      creatingSharedTrip={creatingSharedTrip}
      sharedTripLink={sharedTripLink}
      sharedTripCopied={sharedTripCopied}
    />
  );
}

export default BookingPage;