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
} from "lucide-react";

import rooms from "../../data/rooms";
import flights from "../../data/flight";
import cars from "../../data/cars";

import "./BookingModal.css";


function BookingModal({
  selectedRoom,
  selectedCar,
  onClose,
  onConfirm,
  travellers = 1,
}) {

  const [traveler, setTraveler] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });


  const room = rooms.find(
    (item) => item.id === selectedRoom
  );

  const car = cars.find(
    (item) => item.id === selectedCar
  );

  const rentalDays = 3;


  const flightTotal =
    (flights.outbound.price +
      flights.return.price) *
    travellers;


  const hotelTotal = room
    ? room.pricePerNight * room.nights
    : 0;


  const carTotal = car
    ? car.pricePerDay * rentalDays
    : 0;


  const tripTotal =
    flightTotal + hotelTotal + carTotal;


  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setTraveler((current) => ({
      ...current,
      [name]: value,
    }));

  };


  const handleSubmit = (event) => {

    event.preventDefault();


    onConfirm({
      traveler,
      room,
      car,
      flightTotal,
      hotelTotal,
      carTotal,
      tripTotal,
      travellers,
    });

  };


  return (
    <div
      className="booking-overlay"
      onClick={onClose}
    >

      <div
        className="booking-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="booking-modal-header">

          <div>

            <span className="section-eyebrow">
              Review your trip
            </span>

            <h2>
              Complete your booking
            </h2>

          </div>


          <button
            className="booking-close"
            onClick={onClose}
            aria-label="Close booking"
          >
            <X size={22} />
          </button>

        </div>


        <form
          className="booking-content"
          onSubmit={handleSubmit}
        >

          {/* LEFT */}

          <div className="booking-main">

            <section className="booking-section">

              <div className="booking-section-title">

                <User size={21} />

                <div>
                  <h3>Traveler details</h3>

                  <p>
                    Enter the details for the traveler.
                  </p>
                </div>

              </div>


              <div className="traveler-form">

                <label>

                  First name

                  <input
                    type="text"
                    name="firstName"
                    value={traveler.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                  />

                </label>


                <label>

                  Last name

                  <input
                    type="text"
                    name="lastName"
                    value={traveler.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                  />

                </label>


                <label className="full-width">

                  <span>
                    <Mail size={16} />
                    Email address
                  </span>

                  <input
                    type="email"
                    name="email"
                    value={traveler.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />

                </label>


                <label className="full-width">

                  <span>
                    <Phone size={16} />
                    Phone number
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    value={traveler.phone}
                    onChange={handleChange}
                    placeholder="+1 202 555 0123"
                    required
                  />

                </label>

              </div>

            </section>


            {/* TRIP REVIEW */}

            <section className="booking-section">

              <div className="booking-section-title">

                <Plane size={21} />

                <div>
                  <h3>Flight details</h3>

                  <p>
                    Round-trip flight · {travellers}{" "}
                    {travellers === 1
                      ? "traveler"
                      : "travelers"}
                  </p>
                </div>

              </div>


              <div className="booking-flight">

                <div>

                  <span>
                    Oct 12 · Departure
                  </span>

                  <strong>
                    {flights.outbound.from.airport}
                    {" → "}
                    {flights.outbound.to.airport}
                  </strong>

                  <small>
                    {flights.outbound.from.time}
                    {" – "}
                    {flights.outbound.to.time}
                  </small>

                </div>

              </div>


              <div className="booking-flight">

                <div>

                  <span>
                    Oct 15 · Return
                  </span>

                  <strong>
                    {flights.return.from.airport}
                    {" → "}
                    {flights.return.to.airport}
                  </strong>

                  <small>
                    {flights.return.from.time}
                    {" – "}
                    {flights.return.to.time}
                  </small>

                </div>

              </div>

            </section>


            {/* HOTEL */}

            {room && (
              <section className="booking-section">

                <div className="booking-section-title">

                  <Hotel size={21} />

                  <div>
                    <h3>Hotel stay</h3>

                    <p>
                      Oct 12 – Oct 15 · 3 nights
                    </p>
                  </div>

                </div>


                <div className="booking-hotel">

                  <div className="booking-hotel-image">

                    <img
                      src={room.images[0]}
                      alt={room.name}
                    />

                  </div>


                  <div>

                    <strong>
                      The Westin Los Angeles Airport
                    </strong>

                    <span>
                      {room.name}
                    </span>

                    <small>
                      {room.beds}
                      {" · "}
                      {room.guests}
                    </small>

                  </div>

                </div>

              </section>
            )}


            {/* CAR RENTAL */}

            {car && (
              <section className="booking-section">

                <div className="booking-section-title">

                  <Car size={21} />

                  <div>
                    <h3>Car rental</h3>

                    <p>
                      Oct 12 – Oct 15 · {rentalDays} days
                    </p>
                  </div>

                </div>


                <div className="booking-hotel">

                  <div className="booking-car-icon">
                    <Car size={28} />
                  </div>


                  <div>

                    <strong>
                      {car.name}
                    </strong>

                    <span>
                      {car.type} · {car.seats} seats
                    </span>

                    <small>
                      Pickup at LAX
                    </small>

                  </div>

                </div>

              </section>
            )}

          </div>


          {/* RIGHT SIDE */}

          <aside className="booking-sidebar">

            <div className="booking-price-card">

              <h3>
                Price summary
              </h3>


              <div className="booking-price-row">

                <span>
                  Round-trip flights · {travellers}{" "}
                  {travellers === 1
                    ? "traveler"
                    : "travelers"}
                </span>

                <strong>
                  ${flightTotal}
                </strong>

              </div>


              {room && (
                <div className="booking-price-row">

                  <span>
                    Hotel · {room.nights} nights
                  </span>

                  <strong>
                    ${hotelTotal}
                  </strong>

                </div>
              )}


              {car && (
                <div className="booking-price-row">

                  <span>
                    Car rental · {rentalDays} days
                  </span>

                  <strong>
                    ${carTotal}
                  </strong>

                </div>
              )}


              <div className="booking-total">

                <span>
                  Total trip price
                </span>

                <strong>
                  ${tripTotal}
                </strong>

              </div>


              <button
                type="submit"
                className="confirm-booking-button"
              >
                Confirm booking
              </button>


              <div className="booking-security">

                <ShieldCheck size={17} />

                <span>
                  Your booking details are secure.
                </span>

              </div>

            </div>


            <button
              type="button"
              className="return-to-trip"
              onClick={onClose}
            >
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