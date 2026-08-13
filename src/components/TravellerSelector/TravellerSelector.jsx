import { Minus, Plus, User } from "lucide-react";

import "./TravellerSelector.css";


function TravellerSelector({
  travellers,
  setTravellers,
}) {

  const increaseTravellers = () => {
    setTravellers((current) => current + 1);
  };


  const decreaseTravellers = () => {
    setTravellers((current) => {

      if (current <= 1) {
        return 1;
      }

      return current - 1;
    });
  };


  return (
    <div className="traveller-selector">

      <div className="traveller-selector-info">

        <div className="traveller-icon">
          <User size={20} />
        </div>

        <div>
          <span className="traveller-label">
            Travellers
          </span>

          <strong>
            {travellers}{" "}
            {travellers === 1
              ? "traveller"
              : "travellers"}
          </strong>
        </div>

      </div>


      <div className="traveller-controls">

        <button
          type="button"
          className="traveller-button"
          onClick={decreaseTravellers}
          disabled={travellers === 1}
          aria-label="Decrease travellers"
        >
          <Minus size={18} />
        </button>


        <span className="traveller-count">
          {travellers}
        </span>


        <button
          type="button"
          className="traveller-button"
          onClick={increaseTravellers}
          aria-label="Increase travellers"
        >
          <Plus size={18} />
        </button>

      </div>

    </div>
  );
}


export default TravellerSelector;