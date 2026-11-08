import {
  Waves,
  Utensils,
  Dumbbell,
  Wifi,
  Car,
  Plane,
  Clock,
  Check,
  Wine,
  ConciergeBell,
} from "lucide-react";

import hotelData from "../../data/hotel";

import "./HotelOverview.css";


function HotelOverview({ hotel }) {

  const activeHotel = hotel ?? hotelData[0];
  const amenities = Array.isArray(activeHotel.amenities) ? activeHotel.amenities : [];
  const highlights = Array.isArray(activeHotel.highlights) ? activeHotel.highlights : [];

  const amenityIcons = {
    "Outdoor pool": Waves,
    "Restaurant": Utensils,
    "Bar": Wine,
    "Fitness center": Dumbbell,
    "Free WiFi": Wifi,
    "Airport shuttle": Plane,
    "Parking available": Car,
    "24-hour front desk": ConciergeBell,
  };


  return (
    <section className="hotel-overview">

      <div className="container">

        {/* About property */}

        <div className="overview-section about-section">

          <h2>About this property</h2>

          <p>
            {activeHotel.longDescription || activeHotel.long_description || activeHotel.description || "Explore the property details and available rooms below."}
          </p>

        </div>


        {/* Popular amenities */}

        <div className="overview-section">

          <h2>Popular amenities</h2>

          <div className="amenities-grid">

            {amenities.length ? amenities.map((amenity) => {

              const Icon = amenityIcons[amenity];

              return (
                <div
                  className="amenity-item"
                  key={amenity}
                >
                  {Icon && <Icon size={22} />}

                  <span>{amenity}</span>
                </div>
              );

            }) : <p className="hotel-content-empty">Amenity details have not been added yet.</p>}

          </div>

        </div>


        {/* Property highlights */}

        <div className="overview-section highlights-section">

          <h2>Why you'll love it</h2>

          <div className="highlights-list">

            {highlights.length ? highlights.map((highlight) => (
              <div
                className="overview-highlight"
                key={highlight}
              >

                <div className="check-icon">
                  <Check size={17} />
                </div>

                <span>{highlight}</span>

              </div>
            )) : <p className="hotel-content-empty">Property highlights have not been added yet.</p>}

          </div>

        </div>


        {/* Check-in information */}

        <div className="overview-section stay-info-section">

          <h2>Check-in and check-out</h2>

          <div className="stay-times">

            <div className="stay-time">

              <div className="stay-time-icon">
                <Clock size={22} />
              </div>

              <div>
                <span className="stay-label">
                  Check-in
                </span>

                <strong>
                  From {activeHotel.checkIn || activeHotel.check_in || "Contact property"}
                </strong>
              </div>

            </div>


            <div className="stay-time">

              <div className="stay-time-icon">
                <Clock size={22} />
              </div>

              <div>
                <span className="stay-label">
                  Check-out
                </span>

                <strong>
                  Before {activeHotel.checkOut || activeHotel.check_out || "Contact property"}
                </strong>
              </div>

            </div>

          </div>

        </div>


        {/* Important information */}

        <div className="important-info">

          <h3>Important information</h3>

          <ul>

            <li>
              A valid photo ID and payment method may be required at check-in.
            </li>

            <li>
              Check-in and check-out times may vary depending on your reservation.
            </li>

            <li>
              Additional fees may apply for certain hotel services.
            </li>

          </ul>

        </div>

      </div>

    </section>
  );
}

export default HotelOverview;