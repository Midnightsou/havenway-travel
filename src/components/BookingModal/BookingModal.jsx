import { useState } from "react";

import {
  X,
  Plane,
  Hotel,
  Car,
  User,
  Mail,
  Phone,
  ShieldCheck,
  ArrowLeft,
  Ticket,
  Sparkles,
} from "lucide-react";

import rooms from "../../data/rooms";
import flights from "../../data/flight";
import cars from "../../data/cars";
import activities from "../../data/activities";
import packages from "../../data/packages";
import hotels from "../../data/hotel";

import { formatShortDate } from "../../utils/dates";

import {
  calculateFlightTotal,
  calculateHotelTotal,
  calculateCarTotal,
  calculateActivitiesTotal,
  calculatePackageTotal,
} from "../../utils/pricing";

import "./BookingModal.css";


function BookingModal({ trip, onClose, onConfirm }) {

  const {
    startDate,
    endDate,
    travellers = 1,
    nights = 0,
    days = 0,
    roomId = null,
    flightId = null,
    carId = null,
    activityIds = [],
    packageId = null,
    selectedHotel = null,
  } = trip;

  const [traveler, setTraveler] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const room = roomId
    ? rooms.find((item) => item.id === roomId)
    : null;

  const hotel = selectedHotel
    ? hotels.find((item) => item.id === selectedHotel)
    : null;

  const car = carId
    ? cars.find((item) => item.id === carId)
    : null;

  const selectedActivities = activityIds
    .map((id) => activities.find((item) => item.id === id))
    .filter(Boolean);

  const pkg = packageId
    ? packages.find((item) => item.id === packageId)
    : null;

  const rentalDays = days;

  const flightPlan = flightId
    ? flights[flightId]
    : flights.economy;

  const flightTotal = calculateFlightTotal(
    flightId,
    travellers
  );
  const hotelTotal = calculateHotelTotal(roomId, nights);
  const carTotal = calculateCarTotal(carId, rentalDays);
  const activitiesTotal = calculateActivitiesTotal(activityIds, travellers);
  const packageTotal = calculatePackageTotal(packageId, travellers, nights);

  const tripTotal =
    flightTotal + hotelTotal + carTotal + activitiesTotal + packageTotal;

  const dateRange = startDate && endDate
    ? `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`
    : "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTraveler((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm({ traveler });
  };

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(event) => event.stopPropagation()}>

        <div className="booking-modal-header">
          <div>
            <span className="section-eyebrow">Review your trip</span>
            <h2>Complete your booking</h2>
          </div>
          <button className="booking-close" onClick={onClose} aria-label="Close booking">
            <X size={22} />
          </button>
        </div>

        <form className="booking-content" onSubmit={handleSubmit}>

          <div className="booking-main">

            <section className="booking-section">
              <div className="booking-section-title">
                <User size={21} />
                <div>
                  <h3>Traveler details</h3>
                  <p>Enter the details for the traveler.</p>
                </div>
              </div>

              <div className="traveler-form">
                <label>
                  First name
                  <input type="text" name="firstName" value={traveler.firstName} onChange={handleChange} placeholder="First name" required />
                </label>
                <label>
                  Last name
                  <input type="text" name="lastName" value={traveler.lastName} onChange={handleChange} placeholder="Last name" required />
                </label>
                <label className="full-width">
                  <span><Mail size={16} /> Email address</span>
                  <input type="email" name="email" value={traveler.email} onChange={handleChange} placeholder="name@example.com" required />
                </label>
                <label className="full-width">
                  <span><Phone size={16} /> Phone number</span>
                  <input type="tel" name="phone" value={traveler.phone} onChange={handleChange} placeholder="+1 202 555 0123" required />
                </label>
              </div>
            </section>

            <section className="booking-section">
              <div className="booking-section-title">
                <Plane size={21} />
                <div>
                  <h3>Flight details</h3>
                  <p>Round-trip flight · {travellers} {travellers === 1 ? "traveler" : "travelers"}</p>
                </div>
              </div>

              <div className="booking-flight">
                <div>
                  <span>{startDate ? formatShortDate(startDate) : ""} · Departure</span>
                  <strong>{flightPlan.outbound.from.airport} → {flightPlan.outbound.to.airport}</strong>
                  <small>{flightPlan.outbound.from.time} – {flightPlan.outbound.to.time}</small>
                </div>
              </div>

              <div className="booking-flight">
                <div>
                  <span>{endDate ? formatShortDate(endDate) : ""} · Return</span>
                  <strong>{flightPlan.return.from.airport} → {flightPlan.return.to.airport}</strong>
                  <small>{flightPlan.return.from.time} – {flightPlan.return.to.time}</small>
                </div>
              </div>
            </section>

            {room && (
              <section className="booking-section">
                <div className="booking-section-title">
                  <Hotel size={21} />
                  <div>
                    <h3>Hotel stay</h3>
                    <p>{dateRange} · {nights} nights</p>
                  </div>
                </div>
                <div className="booking-hotel">
                  <div className="booking-hotel-image">
                    <img src={room.images[0]} alt={room.name} />
                  </div>
                  <div>
                    <strong>{hotel?.name || "Your selected hotel"}</strong>
                    <span>{room.name}</span>
                    <small>{room.beds} · {room.guests}</small>
                  </div>
                </div>
              </section>
            )}

            {car && (
              <section className="booking-section">
                <div className="booking-section-title">
                  <Car size={21} />
                  <div>
                    <h3>Car rental</h3>
                    <p>{dateRange} · {rentalDays} days</p>
                  </div>
                </div>
                <div className="booking-hotel">
                  <div className="booking-car-icon"><Car size={28} /></div>
                  <div>
                    <strong>{car.name}</strong>
                    <span>{car.type} · {car.seats} seats</span>
                    <small>Pickup at LAX</small>
                  </div>
                </div>
              </section>
            )}

            {selectedActivities.length > 0 && (
              <section className="booking-section">
                <div className="booking-section-title">
                  <Ticket size={21} />
                  <div>
                    <h3>Activities</h3>
                    <p>{selectedActivities.length} {selectedActivities.length === 1 ? "experience" : "experiences"}</p>
                  </div>
                </div>
                <div className="booking-activities">
                  {selectedActivities.map((activity) => (
                    <div className="booking-activity-item" key={activity.id}>
                      <Ticket size={17} />
                      <div>
                        <strong>{activity.name}</strong>
                        <span>{activity.location} · {activity.duration}</span>
                      </div>
                      <strong>${activity.pricePerPerson * travellers}</strong>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {pkg && (
              <section className="booking-section">
                <div className="booking-section-title">
                  <Sparkles size={21} />
                  <div>
                    <h3>Package</h3>
                    <p>Flight + hotel bundled</p>
                  </div>
                </div>
                <div className="booking-package">
                  <Sparkles size={20} />
                  <div>
                    <strong>{pkg.name}</strong>
                    <span>Save 15% on your bundle</span>
                  </div>
                </div>
              </section>
            )}

          </div>

          <aside className="booking-sidebar">
            <div className="booking-price-card">
              <h3>Price summary</h3>

              <div className="booking-price-row">
                <span>Round-trip flights · {travellers} {travellers === 1 ? "traveler" : "travelers"}</span>
                <strong>${flightTotal}</strong>
              </div>

              {room && (
                <div className="booking-price-row">
                  <span>Hotel · {nights} nights</span>
                  <strong>${hotelTotal}</strong>
                </div>
              )}

              {car && (
                <div className="booking-price-row">
                  <span>Car rental · {rentalDays} days</span>
                  <strong>${carTotal}</strong>
                </div>
              )}

              {selectedActivities.length > 0 && (
                <div className="booking-price-row">
                  <span>Activities</span>
                  <strong>${activitiesTotal}</strong>
                </div>
              )}

              {pkg && (
                <div className="booking-price-row">
                  <span>Package</span>
                  <strong>${packageTotal}</strong>
                </div>
              )}

              <div className="booking-total">
                <span>Total trip price</span>
                <strong>${tripTotal}</strong>
              </div>

              <button type="submit" className="confirm-booking-button">
                Confirm booking
              </button>

              <div className="booking-security">
                <ShieldCheck size={17} />
                <span>Your booking details are secure.</span>
              </div>
            </div>

            <button type="button" className="return-to-trip" onClick={onClose}>
              <ArrowLeft size={17} />
              Return to trip
            </button>
          </aside>

        </form>
      </div>
    </div>
  );
}

export default BookingModal;