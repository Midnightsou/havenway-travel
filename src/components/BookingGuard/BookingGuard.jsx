import {
  Hotel,
  Plane,
  Car,
  X,
} from "lucide-react";

import "./BookingGuard.css";


function BookingGuard({
  type,
  onClose,
  onChoose,
  onContinueWithoutCar,
}) {

  const content = {

    room: {
      icon: Hotel,

      title: "Select a room",

      description:
        "Please select a hotel room before continuing with your booking.",

      action: "Choose a room",
    },


    flight: {
      icon: Plane,

      title: "Select a flight",

      description:
        "Please select a flight plan before continuing with your booking.",

      action: "Choose a flight",
    },


    car: {
      icon: Car,

      title: "Would you like to add a car?",

      description:
        "A rental car can make getting around during your trip easier. You can also continue your booking without one.",

      action: "Choose a car",
    },

  };


  const guard = content[type];

  if (!guard) return null;

  const Icon = guard.icon;


  return (

    <div
      className="booking-guard-overlay"
      onClick={onClose}
    >

      <div
        className="booking-guard"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <button
          type="button"
          className="booking-guard-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>


        <div className="booking-guard-icon">

          <Icon size={28} />

        </div>


        <h2>
          {guard.title}
        </h2>


        <p>
          {guard.description}
        </p>


        <div className="booking-guard-actions">

          <button
            type="button"
            className="booking-guard-primary"
            onClick={onChoose}
          >
            {guard.action}
          </button>


          {type === "car" && (

            <button
              type="button"
              className="booking-guard-secondary"
              onClick={
                onContinueWithoutCar
              }
            >
              Continue without car
            </button>

          )}

        </div>

      </div>

    </div>

  );

}


export default BookingGuard;