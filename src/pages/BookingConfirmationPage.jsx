
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import BookingConfirmation from "../components/BookingConfirmation/BookingConfirmation";

import hotels from "../data/hotel";
import rooms from "../data/rooms";
import cars from "../data/cars";
import flights from "../data/flight";
import activities from "../data/activities";

import { generateItinerary } from "../data/itinerary";

const API_BASE_URL =
  "https://api.havenway-travels.cv";


function BookingConfirmationPage({
  booking: localBooking,
  onReturnHome,
}) {

  const [searchParams] =
    useSearchParams();

  const bookingId =
    searchParams.get("bookingId");

  const [booking, setBooking] =
    useState(localBooking || null);

  const [loading, setLoading] =
    useState(Boolean(bookingId));

  const [error, setError] =
    useState("");


  useEffect(() => {

    /*
     * User 1 already has the complete
     * booking in App.jsx.
     *
     * No need to fetch anything.
     */
    if (!bookingId) {
      setBooking(localBooking || null);
      setLoading(false);
      return;
    }


    /*
     * User 2 entered through a shared
     * payment link.
     *
     * Their browser does not have the
     * original booking in React state,
     * so load it from the backend.
     */

    const loadBooking = async () => {

      try {

        setLoading(true);
        setError("");


        const response =
          await fetch(
            `${API_BASE_URL}/api/payment-link/${bookingId}`
          );


        const data =
          await response.json();


        if (
          !response.ok ||
          !data.success ||
          !data.booking
        ) {

          throw new Error(
            data.error ||
              "Unable to load booking"
          );

        }


        const serverBooking =
          data.booking;


        /*
         * Reconstruct the same booking
         * structure used by User 1.
         */

        const hotel =
          serverBooking.selectedHotel
            ? hotels.find(
                (item) =>
                  item.id ===
                  serverBooking.selectedHotel
              )
            : null;


        const room =
          serverBooking.selectedRoom
            ? rooms.find(
                (item) =>
                  item.id ===
                  serverBooking.selectedRoom
              )
            : null;


        const car =
          serverBooking.selectedCar
            ? cars.find(
                (item) =>
                  item.id ===
                  serverBooking.selectedCar
              )
            : null;


        const flight =
          serverBooking.selectedFlight
            ? flights[
                serverBooking.selectedFlight
              ]
            : null;


        const selectedActivities =
          serverBooking.selectedActivities || [];


        const activityObjects =
          selectedActivities
            .map((activityId) =>
              activities.find(
                (item) =>
                  item.id === activityId
              )
            )
            .filter(Boolean);


        const travellers =
          serverBooking.travellers ?? 1;


        /*
         * Calculate totals from the same
         * source data used by User 1.
         */

        const flightTotal =
          flight
            ? (
                flight.outbound.price +
                flight.return.price
              ) * travellers
            : 0;


        const hotelTotal =
          room
            ? room.pricePerNight *
              (serverBooking.nights ?? 0)
            : 0;


        const carTotal =
          car
            ? car.pricePerDay *
              (serverBooking.days ?? 0)
            : 0;


        const activitiesTotal =
          activityObjects.reduce(
            (total, activity) =>
              total +
              activity.pricePerPerson *
                travellers,
            0
          );


        const packageTotal = 0;


        /*
         * Prefer the authoritative USD
         * total stored on the booking.
         *
         * If it is unavailable, calculate it.
         */

        const calculatedTotal =
          flightTotal +
          hotelTotal +
          carTotal +
          activitiesTotal +
          packageTotal;


        const tripTotal =
          Number(serverBooking.usdTotal) ||
          calculatedTotal;


        const itinerary =
          generateItinerary(
            serverBooking.startDate,
            serverBooking.endDate,
            flight
          );


        /*
         * The backend currently stores the
         * traveler as one "name" field.
         *
         * Split it for the existing
         * confirmation component.
         */

        const travelerName =
          serverBooking.traveler?.name ||
          "";


        const nameParts =
          travelerName.trim().split(/\s+/);


        const firstName =
          nameParts.shift() || "";


        const lastName =
          nameParts.join(" ");


        const reconstructedBooking = {

          bookingReference:
            serverBooking.bookingReference ||
            `HW-${serverBooking.id
              ?.slice(0, 6)
              .toUpperCase()}`,

          traveler: {

            firstName,

            lastName,

            email:
              serverBooking.traveler?.email ||
              "",

            phone:
              serverBooking.traveler?.phone ||
              "",

          },

          travellers,

          startDate:
            serverBooking.startDate,

          endDate:
            serverBooking.endDate,

          nights:
            serverBooking.nights ?? 0,

          days:
            serverBooking.days ?? 0,

          flight:
            flight
              ? {
                  plan:
                    serverBooking.selectedFlight,

                  name:
                    flight.name,

                  outbound: {
                    ...flight.outbound,
                    date:
                      serverBooking.startDate,
                  },

                  return: {
                    ...flight.return,
                    date:
                      serverBooking.endDate,
                  },
                }
              : null,

          hotel,

          room,

          car,

          activities:
            activityObjects,

          package: null,

          selectedActivities,

          itinerary,

          totals: {

            flightTotal,

            hotelTotal,

            carTotal,

            activitiesTotal,

            packageTotal,

            tripTotal,

          },

          paymentBookingId:
            serverBooking.id,

          paymentStatus:
            serverBooking.paymentStatus,

        };


        setBooking(
          reconstructedBooking
        );


      } catch (err) {

        console.error(
          "Failed to load confirmation booking:",
          err
        );

        setError(
          err.message ||
            "Unable to load booking"
        );

      } finally {

        setLoading(false);

      }

    };


    loadBooking();

  }, [
    bookingId,
    localBooking,
  ]);


  if (loading) {

    return (
      <section className="confirmation-page">

        <div className="confirmation-container">

          <div className="confirmation-success">

            <h1>
              Loading your confirmation...
            </h1>

            <p>
              Retrieving your booking details.
            </p>

          </div>

        </div>

      </section>
    );

  }


  if (error || !booking) {

    return (
      <section className="confirmation-page">

        <div className="confirmation-container">

          <div className="confirmation-success">

            <h1>
              Booking unavailable
            </h1>

            <p>
              {error ||
                "We could not load your booking confirmation."}
            </p>

          </div>

          <button
            className="confirmation-home-button"
            onClick={onReturnHome}
          >
            Back to Havenway Travel
          </button>

        </div>

      </section>
    );

  }


  return (
    <BookingConfirmation
      booking={booking}
      onReturnHome={onReturnHome}
    />
  );

}


export default BookingConfirmationPage;
