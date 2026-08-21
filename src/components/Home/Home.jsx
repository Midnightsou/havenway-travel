import "./Home.css";

function Home({
  onNavigate,
  hotels = [],
  selectedHotel,
  onSelectHotel,
}) {

  const handleViewStay = (hotelId) => {

    if (onSelectHotel) {
      onSelectHotel(hotelId);
      return;
    }

    onNavigate("Stays", "rooms");
  };


  return (
    <main className="home">

      {/* HERO */}

      <section className="home-hero">

        <div className="home-container">

          <div className="home-hero-content">

            <span className="home-eyebrow">
              HAVENWAY TRAVEL
            </span>

            <h1>
              Your journey
              <br />
              starts here.
            </h1>

            <p>
              Discover your stay, plan your trip,
              and experience Washington with Havenway.
            </p>

          </div>

        </div>

      </section>


      {/* STAYS */}

      <section className="home-stays">

        <div className="home-container">

          <div className="home-section-heading">

            <span className="home-eyebrow">
              STAYS
            </span>

            <h2>
              Find your perfect stay
            </h2>

            <p>
              Choose a comfortable stay for your
              Washington journey.
            </p>

          </div>


          {/* HOTEL CARDS */}

          <div className="home-hotels-grid">

            {hotels.map((hotel) => (

              <article
                key={hotel.id}
                className={`home-hotel-card ${
                  selectedHotel === hotel.id
                    ? "home-hotel-card-selected"
                    : ""
                }`}
              >

                <div className="home-hotel-image">

                  <img
                    src={
                      hotel.images?.[0] ||
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85"
                    }
                    alt={hotel.name}
                  />

                </div>


                <div className="home-hotel-content">

                  <div className="home-hotel-info">

                    <span className="home-hotel-location">
                      {hotel.location}
                    </span>

                    <h3>
                      {hotel.name}
                    </h3>

                    <div className="home-hotel-rating">

                      <strong>
                        {hotel.rating}
                      </strong>

                      <span>
                        {hotel.ratingLabel}
                      </span>

                      <small>
                        ({hotel.reviewCount} reviews)
                      </small>

                    </div>

                    <p>
                      {hotel.description}
                    </p>

                  </div>


                  <div className="home-hotel-bottom">

                    <div className="home-hotel-price">

                      <span>
                        Starting from
                      </span>

                      <strong>
                        View rooms
                      </strong>

                      <small>
                        Select your room after choosing this hotel
                      </small>

                    </div>


                    <button
                      type="button"
                      className="home-view-stay"
                      onClick={() =>
                        handleViewStay(hotel.id)
                      }
                    >
                      View Stay
                      <span>→</span>
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;