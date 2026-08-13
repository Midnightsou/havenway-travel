import {
  Car,
  Users,
  Briefcase,
  Settings2,
  Check,
} from "lucide-react";

import cars from "../../data/cars";

import "./CarRental.css";


function CarRental({
  travellers = 1,
  selectedCar,
  onSelectCar,
}) {

  const rentalDays = 3;

  return (
    <section
      className="car-rental"
      id="cars"
    >

      <div className="container">

        <div className="car-section-heading">

          <div>
            <span className="section-eyebrow">
              Get around
            </span>

            <h2>
              Car rental options
            </h2>

            <p>
              Los Angeles · Oct 12 – Oct 15, 2026 ·
              {rentalDays} days
            </p>
          </div>

          <div className="car-badge">
            <Car size={18} />

            Pickup at LAX
          </div>

        </div>


        <div className="car-list">

          {cars.map((car) => {

            const total =
              car.pricePerDay * rentalDays;

            const isSelected =
              selectedCar === car.id;

            return (
              <article
                className={`car-card ${
                  isSelected ? "selected" : ""
                }`}
                key={car.id}
              >

                <div className="car-card-top">

                  <div>
                    <span className="car-type">
                      {car.type}
                    </span>

                    <h3>
                      {car.name}
                    </h3>
                  </div>

                  <div className="car-price">
                    <span>
                      ${car.pricePerDay} per day
                    </span>

                    <strong>
                      ${total}
                    </strong>

                    <small>
                      for {rentalDays} days
                    </small>
                  </div>

                </div>


                <div className="car-features">

                  <div>
                    <Users size={18} />

                    <span>
                      {car.seats} seats
                    </span>
                  </div>

                  <div>
                    <Briefcase size={18} />

                    <span>
                      {car.bags} bags
                    </span>
                  </div>

                  <div>
                    <Settings2 size={18} />

                    <span>
                      {car.transmission}
                    </span>
                  </div>

                </div>


                <div className="car-benefits">

                  {car.features.map((feature) => (
                    <div
                      className="car-benefit"
                      key={feature}
                    >
                      <Check size={16} />

                      <span>
                        {feature}
                      </span>
                    </div>
                  ))}

                </div>


                <div className="car-total">

                  <span>
                    Rental total
                  </span>

                  <strong>
                    ${total}
                  </strong>

                </div>


                <button
                  className={`select-car-button ${
                    isSelected ? "car-selected" : ""
                  }`}
                  onClick={() =>
                    onSelectCar(car.id)
                  }
                >
                  {isSelected
                    ? "Selected"
                    : "Select"}
                </button>

              </article>
            );
          })}

        </div>


        {selectedCar && (() => {

          const car = cars.find(
            (item) =>
              item.id === selectedCar
          );

          const total =
            car.pricePerDay * rentalDays;

          return (
            <div className="selected-car-summary">

              <div>

                <span>
                  Selected car
                </span>

                <strong>
                  {car.name}
                </strong>

              </div>


              <div className="selected-car-price">

                <span>
                  Rental total
                </span>

                <strong>
                  ${total}
                </strong>

              </div>

            </div>
          );

        })()}

      </div>

    </section>
  );
}

export default CarRental;