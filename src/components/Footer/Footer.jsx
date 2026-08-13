import {
  Plane,
  Hotel,
  Map,
  CircleHelp,
  ChevronUp,
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

        </div>


        {/* TRAVEL FEATURES */}

        <div className="footer-features">

          <div className="footer-feature">

            <div className="footer-feature-icon">
              <Plane size={20} />
            </div>

            <div>
              <strong>
                Flights included
              </strong>

              <span>
                Round-trip travel details
              </span>
            </div>

          </div>


          <div className="footer-feature">

            <div className="footer-feature-icon">
              <Hotel size={20} />
            </div>

            <div>
              <strong>
                Hotel stay
              </strong>

              <span>
                3 nights in Los Angeles
              </span>
            </div>

          </div>


          <div className="footer-feature">

            <div className="footer-feature-icon">
              <Map size={20} />
            </div>

            <div>
              <strong>
                Full itinerary
              </strong>

              <span>
                Your trip organized in one place
              </span>
            </div>

          </div>


          <div className="footer-feature">

            <div className="footer-feature-icon">
              <CircleHelp size={20} />
            </div>

            <div>
              <strong>
                Travel support
              </strong>

              <span>
                Important trip information
              </span>
            </div>

          </div>

        </div>


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