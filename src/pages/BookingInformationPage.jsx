import {
  ArrowLeft,
  Plane,
  Hotel,
  FileCheck,
  CreditCard,
  Mail,
  Clock,
  ShieldCheck,
} from "lucide-react";

import "./BookingInformationPage.css";

function BookingInformationPage() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <main className="booking-info-page">

      {/* HERO */}

      <section className="booking-info-hero">
        <div className="booking-info-container">

          <button
            className="booking-info-back"
            onClick={handleBack}
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="booking-info-hero-content">

            <span className="booking-info-eyebrow">
              Booking information
            </span>

            <h1>
              Everything you need to know about your booking.
            </h1>

            <p>
              Learn how Havenway bookings work, what you
              receive after payment, and what to expect
              before your trip.
            </p>

          </div>

        </div>
      </section>


      {/* OVERVIEW */}

      <section className="booking-info-overview">
        <div className="booking-info-container">

          <div className="booking-info-overview-grid">

            <div className="booking-info-overview-card">
              <div className="booking-info-icon">
                <Plane size={22} />
              </div>

              <h3>Flights</h3>

              <p>
                Select your preferred flight itinerary
                during the booking process. Your flight
                details are included in your booking
                information.
              </p>
            </div>


            <div className="booking-info-overview-card">
              <div className="booking-info-icon">
                <Hotel size={22} />
              </div>

              <h3>Accommodation</h3>

              <p>
                Choose your hotel and available room
                before completing your booking. Your
                selected accommodation is recorded with
                your trip details.
              </p>
            </div>


            <div className="booking-info-overview-card">
              <div className="booking-info-icon">
                <FileCheck size={22} />
              </div>

              <h3>Booking confirmation</h3>

              <p>
                Once your payment has been successfully
                confirmed, your booking confirmation and
                trip details will be available.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* HOW IT WORKS */}

      <section className="booking-info-section">
        <div className="booking-info-container">

          <div className="booking-info-heading">
            <span>How it works</span>

            <h2>
              From planning to confirmation
            </h2>

            <p>
              Havenway keeps the booking process simple
              and organized.
            </p>
          </div>


          <div className="booking-info-steps">

            <div className="booking-info-step">

              <div className="booking-info-step-number">
                01
              </div>

              <div>
                <h3>
                  Choose your trip
                </h3>

                <p>
                  Select your destination, travel dates,
                  number of travelers, flight, and
                  accommodation.
                </p>
              </div>

            </div>


            <div className="booking-info-step">

              <div className="booking-info-step-number">
                02
              </div>

              <div>
                <h3>
                  Review your booking
                </h3>

                <p>
                  Check your traveler details, itinerary,
                  selected services, and total trip cost
                  before continuing.
                </p>
              </div>

            </div>


            <div className="booking-info-step">

              <div className="booking-info-step-number">
                03
              </div>

              <div>
                <h3>
                  Complete payment
                </h3>

                <p>
                  Follow the payment instructions shown
                  during checkout. Your payment must be
                  successfully confirmed before the
                  booking is finalized.
                </p>
              </div>

            </div>


            <div className="booking-info-step">

              <div className="booking-info-step-number">
                04
              </div>

              <div>
                <h3>
                  Receive confirmation
                </h3>

                <p>
                  After successful payment confirmation,
                  your booking details and confirmation
                  information are provided for your trip.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* WHAT YOU RECEIVE */}

      <section className="booking-info-section booking-info-receipts">
        <div className="booking-info-container">

          <div className="booking-info-heading">
            <span>Your booking</span>

            <h2>
              What your confirmation includes
            </h2>
          </div>


          <div className="booking-info-details">

            <div className="booking-info-detail">

              <div className="booking-info-detail-icon">
                <FileCheck size={20} />
              </div>

              <div>
                <h3>
                  Booking reference
                </h3>

                <p>
                  A unique booking reference associated
                  with your Havenway trip.
                </p>
              </div>

            </div>


            <div className="booking-info-detail">

              <div className="booking-info-detail-icon">
                <Plane size={20} />
              </div>

              <div>
                <h3>
                  Flight details
                </h3>

                <p>
                  Your selected flight itinerary, travel
                  dates, and relevant flight information.
                </p>
              </div>

            </div>


            <div className="booking-info-detail">

              <div className="booking-info-detail-icon">
                <Hotel size={20} />
              </div>

              <div>
                <h3>
                  Hotel and room details
                </h3>

                <p>
                  Your selected accommodation and room
                  information for the stay.
                </p>
              </div>

            </div>


            <div className="booking-info-detail">

              <div className="booking-info-detail-icon">
                <Mail size={20} />
              </div>

              <div>
                <h3>
                  Traveler information
                </h3>

                <p>
                  The traveler details submitted during
                  the booking process.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* PAYMENT NOTE */}

      <section className="booking-info-section">
        <div className="booking-info-container">

          <div className="booking-info-notice">

            <div className="booking-info-notice-icon">
              <CreditCard size={21} />
            </div>

            <div>
              <h3>
                Payment confirmation
              </h3>

              <p>
                A booking is not considered fully
                confirmed until the required payment has
                been successfully verified. Keep your
                booking reference and payment information
                for your records.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* SUPPORT */}

      <section className="booking-info-support">
        <div className="booking-info-container">

          <div className="booking-info-support-card">

            <div className="booking-info-support-icon">
              <ShieldCheck size={23} />
            </div>

            <div>
              <span className="booking-info-eyebrow">
                Need help?
              </span>

              <h2>
                Have a question about your booking?
              </h2>

              <p>
                Contact Havenway using the contact
                information provided in the footer.
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default BookingInformationPage;
