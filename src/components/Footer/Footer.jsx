import {
  Plane,
  Hotel,
  Map,
  CircleHelp,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import "./Footer.css";

function Footer({
  onNavigate,
}) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNavClick = (
    tab,
    section
  ) => {
    if (onNavigate) {
      onNavigate(tab, section);
    }
  };

  return (
    <footer className="footer">

      <div className="container">

        {/* TOP */}

        <div className="footer-top">

          <div className="footer-intro">

            <span className="footer-name">
              Havenway Travel
            </span>

            <p>
              Your complete travel plan in one place.
              Flights, accommodation, and itinerary
              details for your journey.
            </p>

          </div>


          {/* TRAVEL */}

          <div className="footer-column">

            <h3>Travel</h3>

            <button
              onClick={() =>
                handleNavClick("Flights", "flights")
              }
            >
              Flights
            </button>

            <button
              onClick={() =>
                handleNavClick("Stays", "rooms")
              }
            >
              Hotels
            </button>

            <button
              onClick={() =>
                handleNavClick("Stays", "itinerary")
              }
            >
              Itinerary
            </button>

          </div>


          {/* TRIP */}

          <div className="footer-column">

            <h3>Your trip</h3>

            <button
              onClick={() =>
                handleNavClick("Stays", "summary")
              }
            >
              Trip summary
            </button>

            <button
              onClick={() =>
                handleNavClick("Stays", "rooms")
              }
            >
              Room selection
            </button>

            <button
              onClick={() =>
                handleNavClick("Stays", "itinerary")
              }
            >
              Trip itinerary
            </button>

          </div>


          {/* HELP */}

          <div className="footer-column">

            <h3>Help</h3>

            <button
              onClick={() =>
                handleNavClick("Stays", "summary")
              }
            >
              Booking information
            </button>

          </div>


          {/* CONTACT */}

          <div className="footer-column footer-contact">

            <h3>Contact</h3>

            <div className="footer-contact-address">

              <MapPin size={16} />

              <span>
                Havenway Travel Agency
                <br />
                3050 Post Oak Blvd, Unit 510
                <br />
                Houston, TX 77056
                <br />
                United States
              </span>

            </div>

            <a
              className="footer-contact-link"
              href="mailto:havenwaytravels@gmail.com"
            >
              <Mail size={16} />
              havenwaytravels@gmail.com
            </a>

            <a
  className="footer-contact-link"
  href="https://wa.me/+15876632982"
  target="_blank"
  rel="noopener noreferrer"
>
  <Phone size={16} />
  +1 587 663 2982
</a>

          </div>

        </div>


        {/* TRAVEL FEATURES */}

     
        {/* BOTTOM */}

        <div className="footer-bottom">

          <span>
            © 2026 Havenway Travel. All rights reserved.
          </span>

          <button
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            Back to top
            <ChevronUp size={18} />
          </button>

        </div>

      </div>

    </footer>
  );
}

export default Footer;