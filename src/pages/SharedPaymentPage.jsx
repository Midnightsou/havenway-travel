import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import hotels from "../data/hotel";
import rooms from "../data/rooms";
import flights from "../data/flight";
import cars from "../data/cars";

import "./SharedPaymentPage.css";

const API_BASE_URL =
  "https://api.havenway-travels.cv";

function SharedPaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/payment-link/${bookingId}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to load payment link"
        );
      }

      const loadedBooking =
        data.booking;

      setBooking(loadedBooking);

      /*
       * Split the existing name into
       * first and last name.
       */

      const name =
        loadedBooking.traveler?.name ||
        "";

      const parts =
        name.trim().split(/\s+/);

      setFirstName(
        parts.shift() || ""
      );

      setLastName(
        parts.join(" ") || ""
      );

      setEmail(
        loadedBooking.traveler?.email ||
        ""
      );

      setPhone(
        loadedBooking.traveler?.phone ||
        "");

    } catch (err) {

      console.error(
        "Shared booking error:",
        err
      );

      setError(
        err.message ||
          "Unable to load this payment link"
      );

    } finally {

      setLoading(false);

    }
  };


  const handleContinue = async (event) => {

    event.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      setError(
        "Please complete all your information."
      );

      return;
    }

    try {

      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/payment-link/${bookingId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            firstName:
              firstName.trim(),

            lastName:
              lastName.trim(),

            email:
              email.trim(),

            phone:
              phone.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Unable to update booking"
        );
      }

      /*
       * Move to the payment page.
       *
       * We keep the booking id in the URL so
       * the payment page knows which booking
       * it belongs to.
       */

      navigate(
        `/pay/${bookingId}/payment`
      );

    } catch (err) {

      console.error(
        "Booking update error:",
        err
      );

      setError(
        err.message ||
          "Unable to continue"
      );

    } finally {

      setSaving(false);

    }
  };


  if (loading) {
    return (
      <main className="shared-payment-page">
        <div className="shared-payment-loading">
          Loading your booking...
        </div>
      </main>
    );
  }


  if (error && !booking) {
    return (
      <main className="shared-payment-page">

        <div className="shared-payment-error">

          <h1>
            Payment link unavailable
          </h1>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
          >
            Return Home
          </button>

        </div>

      </main>
    );
  }


  const hotel =
    booking?.selectedHotel
      ? hotels.find(
          (item) =>
            item.id ===
            booking.selectedHotel
        )
      : null;

  const room =
    booking?.selectedRoom
      ? rooms.find(
          (item) =>
            item.id ===
            booking.selectedRoom
        )
      : null;

  const flight =
    booking?.selectedFlight
      ? flights[
          booking.selectedFlight
        ]
      : null;

  const car =
    booking?.selectedCar
      ? cars.find(
          (item) =>
            item.id ===
            booking.selectedCar
        )
      : null;


  return (
    <main className="shared-payment-page">

      <div className="shared-payment-container">

        {/* HEADER */}

        <header className="shared-payment-header">

          <span>
            HAVENWAY TRAVEL
          </span>

          <h1>
            Complete your booking
          </h1>

          <p>
            Someone has prepared this trip
            for you. Review the itinerary,
            enter your information, and
            complete the payment.
          </p>

        </header>


        {/* ITINERARY */}

        <section className="shared-booking-card">

          <div className="shared-card-heading">

            <span>
              YOUR TRIP
            </span>

            <h2>
              Booking itinerary
            </h2>

          </div>


          <div className="shared-trip-details">

            <div className="shared-detail">

              <span>
                Dates
              </span>

              <strong>
                {booking.startDate ||
                  "Not selected"}

                {" — "}

                {booking.endDate ||
                  "Not selected"}
              </strong>

            </div>


            <div className="shared-detail">

              <span>
                Travellers
              </span>

              <strong>
                {booking.travellers}
              </strong>

            </div>

          </div>


          {/* HOTEL */}

          {hotel && (

            <div className="shared-itinerary-item">

              {hotel.images?.[0] && (

                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                />

              )}

              <div>

                <span>
                  HOTEL
                </span>

                <h3>
                  {hotel.name}
                </h3>

                <p>
                  {hotel.location}
                </p>

              </div>

            </div>

          )}


          {/* ROOM */}

          {room && (

            <div className="shared-simple-item">

              <span>
                ROOM
              </span>

              <strong>
                {room.name}
              </strong>

              <p>
                {room.beds} · {room.guests}
              </p>

            </div>

          )}


          {/* FLIGHT */}

          {flight && (

            <div className="shared-simple-item">

              <span>
                FLIGHT
              </span>

              <strong>
                {flight.name}
              </strong>

              <p>
                Flight itinerary included
              </p>

            </div>

          )}


          {/* CAR */}

          {car && (

            <div className="shared-simple-item">

              <span>
                CAR
              </span>

              <strong>
                {car.name}
              </strong>

              <p>
                Car rental included
              </p>

            </div>

          )}

        </section>


        {/* PAYMENT TOTAL */}

        <section className="shared-total-card">

          <span>
            TOTAL TO PAY
          </span>

          <strong>
            ${booking.usdTotal?.toLocaleString()}
          </strong>

          <p>
            Bitcoin payment amount will be
            calculated securely at checkout.
          </p>

        </section>


        {/* USER DETAILS */}

        <section className="shared-form-card">

          <div className="shared-card-heading">

            <span>
              PAYER INFORMATION
            </span>

            <h2>
              Your information
            </h2>

            <p>
              You can update the personal
              information before paying.
            </p>

          </div>


          {error && (

            <div className="shared-form-error">
              {error}
            </div>

          )}


          <form
            onSubmit={handleContinue}
          >

            <div className="shared-form-grid">

              <label>

                First name

                <input
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(
                      event.target.value
                    )
                  }
                  placeholder="First name"
                  required
                />

              </label>


              <label>

                Last name

                <input
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(
                      event.target.value
                    )
                  }
                  placeholder="Last name"
                  required
                />

              </label>


              <label>

                Email

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  required
                />

              </label>


              <label>

                Phone

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value
                    )
                  }
                  placeholder="Phone number"
                  required
                />

              </label>

            </div>


            <button
              type="submit"
              disabled={saving}
              className="shared-continue-button"
            >
              {saving
                ? "Saving..."
                : "Continue to payment →"}
            </button>

          </form>

        </section>

      </div>

    </main>
  );
}

export default SharedPaymentPage;