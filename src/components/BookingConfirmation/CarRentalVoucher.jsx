import { Printer, Car } from "lucide-react";
import { formatDate } from "../../utils/dates";

const pending = "To be confirmed";

export default function CarRentalVoucher({ booking, car, total, travelerName }) {
  // Supplier-issued details belong to the reservation, not the vehicle catalog.
  const rental = booking.carRentalDetails ?? {};
  const fields = [
    ["Rental company", rental.companyName],
    ["Rental reservation number", rental.reservationNumber],
    ["Pickup location", rental.pickupLocation],
    ["Return / drop-off location", rental.dropoffLocation],
    ["Pickup date", formatDate(rental.pickupDate || booking.startDate)],
    ["Pickup time (local)", rental.pickupTime],
    ["Return date", formatDate(rental.returnDate || booking.endDate)],
    ["Return time (local)", rental.returnTime],
    ["Company address", rental.companyAddress],
    ["Company contact information", rental.companyContact],
    ["Confirmed vehicle", rental.confirmedVehicle || "Exact vehicle to be confirmed by the rental company"],
    ["Supplier voucher number", rental.voucherNumber],
  ];

  const printVoucher = () => {
    document.body.classList.add("printing-rental-voucher");
    const cleanup = () => {
      document.body.classList.remove("printing-rental-voucher");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    try {
      window.print();
    } catch (error) {
      cleanup();
      throw error;
    }
  };

  return (
    <article className="rental-voucher" aria-label="Car rental voucher">
      <header className="rental-voucher-header">
        <div>
          <span className="rental-voucher-brand">Havenway Travels · Car rental</span>
          <h3><Car size={20} /> Rental voucher details</h3>
          <p>Keep these details with you for pickup and return.</p>
        </div>
        <button type="button" className="print-button" onClick={printVoucher}>
          <Printer size={16} /> Print rental voucher
        </button>
      </header>
      <div className="rental-voucher-booking">
        <div><span>Lead traveler</span><strong>{travelerName}</strong></div>
        <div><span>Havenway booking reference</span><strong>{booking.bookingReference || booking.id || pending}</strong></div>
        <div><span>Selected vehicle / category</span><strong>{car.name || car.type || pending}</strong></div>
        <div><span>Rental total · USD</span><strong>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}</strong></div>
      </div>
      <dl className="rental-voucher-grid">
        {fields.map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value || pending}</dd></div>
        ))}
      </dl>
      <dl className="rental-voucher-policies">
        <div><dt>Rental terms and conditions</dt><dd>{rental.terms || "Supplier terms have not been provided. Confirm driver requirements, mileage, fuel policy, cancellation rules, and late-return charges before pickup."}</dd></div>
        <div><dt>Security deposit</dt><dd>{rental.depositInformation || "Deposit amount and accepted payment methods are to be confirmed by the rental company."}</dd></div>
        <div><dt>Insurance and coverage</dt><dd>{rental.insuranceDetails || "Coverage, exclusions, and any excess / deductible are to be confirmed by the rental company."}</dd></div>
      </dl>
      <p className="rental-voucher-note">The Havenway booking reference is separate from the rental company’s reservation number. Any details marked “To be confirmed” are pending supplier confirmation. This summary does not replace a supplier-issued voucher.</p>
    </article>
  );
}
