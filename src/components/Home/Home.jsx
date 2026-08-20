import "./Home.css";

function Home({ onNavigate }) {
  const handleViewStay = () => {
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
              A comfortable stay for your
              Washington journey.
            </p>

          </div>


          {/* HOTEL CARD */}
          <article className="home-hotel-card">

            <div className="home-hotel-image">

              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85"
                alt="Luxury hotel room"
              />

            </div>


            <div className="home-hotel-content">

              <div className="home-hotel-info">

                <span className="home-hotel-location">
                  Washington / Baltimore
                </span>

                <h3>
                  BWI Airport Marriott
                </h3>

                <p>
                  A convenient and comfortable stay
                  near Baltimore/Washington International
                  Airport.
                </p>

              </div>


              <div className="home-hotel-bottom">

                <div className="home-hotel-price">

                  <span>
                    Starting from
                  </span>

                  <strong>
                    $800+
                  </strong>

                  <small>
                    trip package
                  </small>

                </div>


                <button
                  type="button"
                  className="home-view-stay"
                  onClick={handleViewStay}
                >
                  View Stay
                  <span>→</span>
                </button>

              </div>

            </div>

          </article>

        </div>
      </section>

    </main>
  );
}

export default Home;