
import {
  Star,
  ArrowLeft,
  MessageSquareQuote,
} from "lucide-react";

import "./ReviewsPage.css";

function ReviewsPage() {
  const reviews = [
    {
      name: "Michael Anderson",
      location: "Los Angeles, California",
      rating: 5,
      date: "August 2026",
      text:
        "The room was clean, comfortable, and exactly what I needed for my trip. The reception staff were welcoming and helpful from the moment I arrived. Everything felt well organized.",
    },
    {
      name: "Sarah Williams",
      location: "Washington, D.C.",
      rating: 5,
      date: "July 2026",
      text:
        "I had a very smooth experience with Havenway. The booking process was straightforward, and the hotel room was spacious and nicely maintained. The reception was also excellent.",
    },
    {
      name: "Daniel Carter",
      location: "Chicago, Illinois",
      rating: 5,
      date: "July 2026",
      text:
        "Really enjoyed my stay. The room was nice and comfortable, and the hotel had a pleasant atmosphere. The reception team were friendly and quick to assist whenever I needed anything.",
    },
    {
      name: "Emily Johnson",
      location: "New York, New York",
      rating: 5,
      date: "June 2026",
      text:
        "Havenway made planning my trip much easier. My booking details were clear, the room was clean, and the reception staff were professional. I would definitely use the service again.",
    },
    {
      name: "James Thompson",
      location: "Houston, Texas",
      rating: 5,
      date: "June 2026",
      text:
        "Everything went smoothly from booking to check-in. The room was comfortable and well presented, and the reception was warm and welcoming. It was a very pleasant experience overall.",
    },
    {
      name: "Olivia Martinez",
      location: "Miami, Florida",
      rating: 5,
      date: "May 2026",
      text:
        "I was impressed with how simple the whole process was. The accommodation was nice, the room was clean, and the reception staff were very helpful. Havenway made my trip feel much more organized.",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="reviews-page">
      {/* HERO */}

      <section className="reviews-hero">
        <div className="reviews-container">

          <button
            className="reviews-back"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="reviews-hero-content">
            <span className="reviews-eyebrow">
              Guest experiences
            </span>

            <h1>
              What our travelers say
            </h1>

            <p>
              Hear from travelers who have used Havenway
              to plan their stays and journeys.
            </p>
          </div>

        </div>
      </section>


      {/* RATING SUMMARY */}

      <section className="reviews-summary-section">
        <div className="reviews-container">

          <div className="reviews-summary">

            <div className="reviews-summary-icon">
              <MessageSquareQuote size={24} />
            </div>

            <div className="reviews-summary-content">

              <div className="reviews-rating">
                <strong>5.0</strong>

                <div className="reviews-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>

              <p>
                Based on recent Havenway traveler experiences
              </p>

            </div>

            <div className="reviews-summary-count">
              <strong>6</strong>
              <span>Traveler reviews</span>
            </div>

          </div>

        </div>
      </section>


      {/* REVIEWS */}

      <section className="reviews-list-section">
        <div className="reviews-container">

          <div className="reviews-section-heading">
            <span>Traveler feedback</span>

            <h2>
              Recent experiences with Havenway
            </h2>
          </div>


          <div className="reviews-grid">

            {reviews.map((review) => (
              <article
                className="review-card"
                key={`${review.name}-${review.date}`}
              >

                <div className="review-card-top">

                  <div className="review-stars">

                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill="currentColor"
                      />
                    ))}

                  </div>

                  <span className="review-date">
                    {review.date}
                  </span>

                </div>


                <p className="review-text">
                  “{review.text}”
                </p>


                <div className="review-author">

                  <div className="review-author-details">

                    <strong>
                      {review.name}
                    </strong>

                    <span>
                      {review.location}
                    </span>

                  </div>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>


      {/* CTA */}

      <section className="reviews-cta-section">
        <div className="reviews-container">

          <div className="reviews-cta">

            <div>
              <span className="reviews-eyebrow">
                Ready to travel?
              </span>

              <h2>
                Plan your next journey with Havenway.
              </h2>

              <p>
                Find your flight, choose your stay, and
                organize your trip in one place.
              </p>
            </div>

            <button
              className="reviews-cta-button"
              onClick={() => {
                window.history.pushState(
                  {},
                  "",
                  "/stays"
                );

                window.dispatchEvent(
                  new PopStateEvent("popstate")
                );

                scrollToTop();
              }}
            >
              Start planning
            </button>

          </div>

        </div>
      </section>

    </main>
  );
}

export default ReviewsPage;

