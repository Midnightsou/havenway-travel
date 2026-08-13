import {
  MapPin,
  CalendarDays,
  Users,
  Search,
} from "lucide-react";

import TravellerSelector from "../TravellerSelector/TravellerSelector";

import "./SearchBar.css";


function SearchBar({
  travellers,
  setTravellers,
}) {
  return (
    <section className="search-section">

      <div className="container">

        <div className="search-bar">

          <button className="search-field location-field">

            <MapPin size={21} />

            <div className="field-content">
              <span className="field-label">
                Destination
              </span>

              <strong>
                Los Angeles, California
              </strong>
            </div>

          </button>


          <button className="search-field">

            <CalendarDays size={21} />

            <div className="field-content">
              <span className="field-label">
                Dates
              </span>

              <strong>
                Oct 12 – Oct 15, 2026
              </strong>
            </div>

          </button>


          <button className="search-field">

            <Users size={21} />

            <div className="field-content">
              <span className="field-label">
                Travelers
              </span>

              <strong>
                {travellers}{" "}
                {travellers === 1
                  ? "traveler"
                  : "travelers"}
              </strong>
            </div>

          </button>



        </div>


        <div className="search-traveller-selector">

          <TravellerSelector
            travellers={travellers}
            setTravellers={setTravellers}
          />

        </div>

      </div>

    </section>
  );
}

export default SearchBar;