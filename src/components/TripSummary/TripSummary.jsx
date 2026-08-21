import {
  Plane,
  Hotel,
  BedDouble,
  Car,
  CalendarDays,
  Users,
  CheckCircle2,
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

import "./TripSummary.css";


function TripSummary({
  selectedRoom,
  selectedCar,
  selectedActivities = [],
  selectedPackage = null,
  selectedFlight = null,
  selectedHotel = null,
  onContinue,
  travellers = 1,
  startDate,
  endDate,
  nights = 0,
  days = 0,
}) {

  const room = rooms.find(
    (item) => item.id === selectedRoom
  );

  const hotel = selectedHotel
    ? hotels.find(
        (item) => item.id === selectedHotel
      )
    : null;

  const car = cars.find(
    (item) => item.id === selectedCar
  );

  const rentalDays = days;

  const flightPlan = selectedFlight
    ? flights[selectedFlight]
    : null;

  const flightTotal =
    calculateFlightTotal(selectedFlight, travellers);

  const hotelTotal =
    calculateHotelTotal(selectedRoom, nights);

  const carTotal =
    calculateCarTotal(selectedCar, rentalDays);

  const activitiesTotal =
    calculateActivitiesTotal(selectedActivities, travellers);

  const packageTotal =
    calculatePackageTotal(selectedPackage, travellers, nights);

  const tripTotal =
    flightTotal +
    hotelTotal +
    carTotal +
    activitiesTotal -
    packageTotal;

  const selectedActivityItems =
    selectedActivities
      .map((id) =>
        activities.find((item) => item.id === id)
      )
      .filter(Boolean);

  const pkg = selectedPackage
    ? packages.find((item) => item.id === selectedPackage)
    : null;


  const dateRange = startDate && endDate
    ? `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`
    : "";


  return (
    <section
      className="trip-summary"
      id="summary"
    >

      <div className="container">

        <div className="summary-heading">

          <span className="section-eyebrow">
            Your booking
          </span>

          <h2>
            Trip summary
          </h2>

          <p>
            Review your flight and hotel details
            before continuing.
          </p>

        </div>


        <div className="summary-layout">

          {/* LEFT SIDE */}

          <div className="summary-details">

            {/* FLIGHTS */}

            <div className="summary-card">

              <div className="summary-card-heading">

                <div className="summary-icon flight">
                  <Plane size={21} />
                </div>

                <div>
                  <span>
                    Flights
                  </span>

                  <strong>
                    Round trip
                  </strong>
                </div>

              </div>


              <div className="summary-flight">

                <div>
                  <strong>
                    {flightPlan?.outbound?.from?.airport}
                  </strong>

                  <span>
                    {flightPlan?.outbound?.from?.city}
                  </span>

                  <small>
                    {flightPlan?.outbound?.from?.time}
                  </small>
                </div>


                <div className="summary-flight-line">
                  <Plane size={16} />
                </div>


                <div>
                  <strong>
                    {flightPlan?.outbound?.to?.airport}
                  </strong>

                  <span>
                    {flightPlan?.outbound?.to?.city}
                  </span>

                  <small>
                    {flightPlan?.outbound?.to?.time}
                  </small>
                </div>

              </div>


              <div className="return-label">
                Return · {endDate ? formatShortDate(endDate) : ""}
              </div>


              <div className="summary-flight">

                <div>
                  <strong>
                    {flightPlan?.return?.from?.airport}
                  </strong>

                  <span>
                    {flightPlan?.return?.from?.city}
                  </span>

                  <small>
                    {flightPlan?.return?.from?.time}
                  </small>
                </div>


                <div className="summary-flight-line">
                  <Plane size={16} />
                </div>


                <div>
                  <strong>
                    {flightPlan?.return?.to?.airport}
                  </strong>

                  <span>
                    {flightPlan?.return?.to?.city}
                  </span>

                  <small>
                    {flightPlan?.return?.to?.time}
                  </small>
                </div>

              </div>


              <div className="summary-card-total">

                <span>
                  Flight total · {travellers}{" "}
                  {travellers === 1
                    ? "traveler"
                    : "travelers"}
                </span>

                <strong>
                  ${flightTotal}
                </strong>

              </div>

            </div>


            {/* HOTEL */}

            <div className="summary-card">

              <div className="summary-card-heading">

                <div className="summary-icon hotel">
                  <Hotel size={21} />
                </div>

                <div>
                  <span>
                    Hotel
                  </span>

                  <strong>
                    {hotel?.name || "Your selected hotel"}
                  </strong>
                </div>

              </div>


              {room ? (
                <>
                  <div className="selected-room-info">

                    <BedDouble size={20} />

                    <div>

                      <strong>
                        {room.name}
                      </strong>

                      <span>
                        {room.beds} · {room.guests}
                      </span>

                    </div>

                  </div>


                  <div className="hotel-dates">

                    <div>
                      <CalendarDays size={18} />

                      <span>
                        {dateRange}
                      </span>
                    </div>

                    <span>
                      {nights} nights
                    </span>

                  </div>


                  <div className="summary-card-total">

                    <span>
                      Hotel total
                    </span>

                    <strong>
                      ${hotelTotal}
                    </strong>

                  </div>

                </>
              ) : (

                <div className="no-room">

                  <BedDouble size={20} />

                  <span>
                    Select a room to see your hotel total.
                  </span>

                </div>

              )}

            </div>

            {/* CAR */}

            <div className="summary-card">

              <div className="summary-card-heading">

                <div className="summary-icon car">
                  <Car size={21} />
                </div>

                <div>
                  <span>
                    Car rental
                  </span>

                  <strong>
                    Pickup at LAX
                  </strong>
                </div>

              </div>


              {car ? (
                <>
                  <div className="selected-car-info">

                    <Car size={20} />

                    <div>

                      <strong>
                        {car.name}
                      </strong>

                      <span>
                        {car.type} · {car.seats} seats
                      </span>

                    </div>

                  </div>


                  <div className="car-dates">

                    <div>
                      <CalendarDays size={18} />

                      <span>
                        {dateRange}
                      </span>
                    </div>

                    <span>
                      {rentalDays} days
                    </span>

                  </div>


                  <div className="summary-card-total">

                    <span>
                      Car rental total
                    </span>

                    <strong>
                      ${carTotal}
                    </strong>

                  </div>

                </>
              ) : (

                <div className="no-car">

                  <Car size={20} />

                  <span>
                    Car rental — Not selected
                  </span>

                </div>

              )}

            </div>


            {/* ACTIVITIES */}

            <div className="summary-card">

              <div className="summary-card-heading">

                <div className="summary-icon activities">
                  <Ticket size={21} />
                </div>

                <div>
                  <span>
                    Activities
                  </span>

                  <strong>
                    Things to do
                  </strong>
                </div>

              </div>


              {selectedActivityItems.length > 0 ? (
                <>

                  <div className="selected-activities-list">

                    {selectedActivityItems.map((activity) => (
                      <div
                        className="selected-activity-item"
                        key={activity.id}
                      >

                        <Ticket size={17} />

                        <div>

                          <strong>
                            {activity.name}
                          </strong>

                          <span>
                            {activity.location} · {activity.duration}
                          </span>

                        </div>

                        <strong>
                          ${
                            activity.pricePerPerson *
                            travellers
                          }
                        </strong>

                      </div>
                    ))}

                  </div>


                  <div className="summary-card-total">

                    <span>
                      Activities total
                    </span>

                    <strong>
                      ${activitiesTotal}
                    </strong>

                  </div>

                </>
              ) : (

                <div className="no-car">

                  <Ticket size={20} />

                  <span>
                    No activities selected.
                  </span>

                </div>

              )}

            </div>


            {/* PACKAGE */}

            {pkg && (
              <div className="summary-card">

                <div className="summary-card-heading">

                  <div className="summary-icon package">
                    <Sparkles size={21} />
                  </div>

                  <div>
                    <span>
                      Package
                    </span>

                    <strong>
                      {pkg.name}
                    </strong>
                  </div>

                </div>


                <div className="selected-package-info">

                  <Sparkles size={20} />

                  <div>

                    <strong>
                      {pkg.name}
                    </strong>

                    <span>
                      Flight + hotel bundled · Save 15%
                    </span>

                  </div>

                </div>


                <div className="summary-card-total">

                  <span>
                    Package total
                  </span>

                  <strong>
                    ${packageTotal}
                  </strong>

                </div>

              </div>
            )}

          </div>


          {/* RIGHT SIDE */}

          <aside className="price-card">

            <div className="price-card-top">

              <span>
                Total trip price
              </span>

              <strong>
                ${tripTotal}
              </strong>

              <small>
                {travellers}{" "}
                {travellers === 1
                  ? "traveler"
                  : "travelers"}
              </small>

            </div>


            <div className="price-breakdown">

              <div>
                <span>
                  Flights
                </span>

                <strong>
                  ${flightTotal}
                </strong>
              </div>


              <div>
                <span>
                  Hotel
                </span>

                <strong>
                  {room
                    ? `$${hotelTotal}`
                    : "—"}
                </strong>
              </div>


              <div>
                <span>
                  Car rental
                </span>

                <strong>
                  {car
                    ? `$${carTotal}`
                    : "—"}
                </strong>
              </div>


              {selectedActivityItems.length > 0 && (
                <div>
                  <span>
                    Activities
                  </span>

                  <strong>
                    ${activitiesTotal}
                  </strong>
                </div>
              )}


              {pkg && (
                <div>
                  <span>
                    Package
                  </span>

                  <strong>
                    ${packageTotal}
                  </strong>
                </div>
              )}


              <div>
                <span>
                  Travelers
                </span>

                <strong>
                  {travellers}
                </strong>
              </div>

            </div>


            <div className="price-divider" />


            <div className="price-total">

              <span>
                Total
              </span>

              <strong>
                ${tripTotal}
              </strong>

            </div>


            <button
              className="continue-button"
              disabled={!room && !car}
              onClick={onContinue}
            >
              {room || car
                ? "Continue to booking"
                : "Select a room or car first"}
            </button>


            <div className="secure-booking">

              <CheckCircle2 size={17} />

              <span>
                Secure booking · No hidden fees
              </span>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}

export default TripSummary;