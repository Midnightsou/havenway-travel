import "./CancellationRefundPage.css";

function CancellationRefundPage() {
  return (
    <main className="cancellation-page">
      <div className="cancellation-container">

        <header className="cancellation-header">
          <span className="cancellation-eyebrow">
            Havenway
          </span>

          <h1>Cancellation & Refund Policy</h1>

          <p>
            Please review our cancellation and refund guidelines
            before completing your booking.
          </p>
        </header>


        <section className="cancellation-section">
          <h2>1. Booking Cancellations</h2>

          <p>
            Cancellation requests should be made as soon as possible
            after a booking has been made. Refund eligibility may
            depend on the cancellation terms associated with the
            flight, hotel, or other travel service selected.
          </p>
        </section>


        <section className="cancellation-section">
          <h2>2. Hotel Cancellations</h2>

          <p>
            Hotel cancellation policies vary depending on the
            accommodation and room selected. Some bookings may allow
            cancellation within a specified period, while others may
            be non-refundable.
          </p>

          <p>
            Any applicable cancellation conditions will be provided
            as part of the booking information.
          </p>
        </section>


        <section className="cancellation-section">
          <h2>3. Flight Cancellations</h2>

          <p>
            Flight cancellations and refunds are subject to the fare
            rules and conditions applicable to the selected airline
            ticket. Certain fares may be refundable, partially
            refundable, or non-refundable.
          </p>
        </section>


        <section className="cancellation-section">
          <h2>4. Refunds</h2>

          <p>
            Where a refund is approved, the refundable amount will
            depend on the applicable booking and cancellation terms.
            Any non-refundable charges, applicable fees, or penalties
            may be deducted from the refund amount.
          </p>
        </section>


        <section className="cancellation-section">
          <h2>5. Processing Time</h2>

          <p>
            Approved refunds may require processing time before they
            are returned to the original payment method. Processing
            times may vary depending on the payment method and the
            relevant travel provider.
          </p>
        </section>


        <section className="cancellation-section">
          <h2>6. Non-Refundable Bookings</h2>

          <p>
            Bookings clearly identified as non-refundable may not be
            eligible for a refund after payment has been completed.
            Customers should carefully review the booking conditions
            before making payment.
          </p>
        </section>


        <section className="cancellation-section">
          <h2>7. Contact Havenway</h2>

          <p>
            If you need to cancel a booking or have a question about
            a refund, please contact Havenway using the contact
            information below.
          </p>

          <div className="cancellation-contact">
            <a href="mailto:havenwaytravels@gmail.com">
              havenwaytravels@gmail.com
            </a>
            
            <a
              href="https://wa.me/15876632982"
              target="_blank"
              rel="noopener noreferrer"
            >
              +1 587 663 2982
            </a>
          </div>
        </section>


        <div className="cancellation-notice">
          <strong>Important:</strong>

          <span>
            Cancellation and refund eligibility is determined by the
            applicable terms of the travel service booked.
          </span>
        </div>

      </div>
    </main>
  );
}

export default CancellationRefundPage;
