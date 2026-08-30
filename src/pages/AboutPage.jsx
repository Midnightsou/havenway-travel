
import { ArrowLeft, MapPin, Mail, Phone } from "lucide-react";
import "./AboutPage.css";

function AboutPage({ onGoHome }) {
  return (
    <main className="info-page about-page">

      <div className="info-page-container">

        <button
          className="info-back-button"
          onClick={onGoHome}
        >
          <ArrowLeft size={18} />
          Back to Havenway
        </button>


        <header className="info-page-header">
          <span className="info-eyebrow">
            About Havenway
          </span>

          <h1>
            Travel planning made simpler.
          </h1>

          <p>
            Havenway Travel brings flights, accommodation,
            and trip planning together in one place so
            travelers can organize their journey with
            greater clarity.
          </p>
        </header>


        <section className="info-section">
          <h2>Who we are</h2>

          <p>
            Havenway Travel is a travel booking platform
            focused on helping travelers plan their trips
            through a single, straightforward experience.
          </p>

          <p>
            From selecting flights and accommodation to
            reviewing trip details before payment, Havenway
            is designed to keep the important parts of a
            journey organized in one place.
          </p>
        </section>


        <section className="info-section about-grid">

          <div className="about-card">
            <h2>Flights</h2>

            <p>
              Browse available flight options and include
              your selected itinerary in your overall trip
              plan.
            </p>
          </div>


          <div className="about-card">
            <h2>Accommodation</h2>

            <p>
              Select accommodation and rooms as part of
              your complete travel itinerary.
            </p>
          </div>


          <div className="about-card">
            <h2>Trip planning</h2>

            <p>
              Keep your selected travel arrangements,
              dates, travelers, and trip costs together
              before completing your booking.
            </p>
          </div>

        </section>


        <section className="info-section">
          <h2>Our contact information</h2>

          <div className="about-contact">

            <div>
              <MapPin size={18} />

              <span>
                Havenway Travel
                <br />
                3050 Post Oak Blvd, Unit 510
                <br />
                Houston, TX 77056
                <br />
                United States
              </span>
            </div>


            <a href="mailto:havenwaytravels@gmail.com">
              <Mail size={18} />
              havenwaytravels@gmail.com
            </a>


            <a
              href="https://wa.me/15876632982"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone size={18} />
              +1 587 663 2982
            </a>

          </div>
        </section>


        <section className="about-notice">
          <strong>Havenway Travel</strong>

          <p>
            We aim to provide travelers with a clear
            booking experience and straightforward
            information throughout the planning process.
          </p>
        </section>

      </div>

    </main>
  );
}

export default AboutPage;
