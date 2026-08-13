import "./TravelContent.css";

import HotelHero from "../HotelHero/HotelHero";
import HotelOverview from "../HotelOverview/HotelOverview";
import HotelRooms from "../HotelRooms/HotelRooms";
import Itinerary from "../Itinerary/Itinerary";
import TripSummary from "../TripSummary/TripSummary";

import FlightPlan from "../FlightPlan/FlightPlan";

import CarRental from "../CarRental/CarRental";

import Packages from "../Packages/Packages";

import Activities from "../Activities/Activities";


function TravelContent({
  activeTab,
  travellers,
  selectedRoom,
  onSelectRoom,
  selectedCar,
  onSelectCar,
  onContinue,
}) {

  if (activeTab === "Stays") {
    return (
      <>
        <HotelHero />

        <HotelOverview />

        <HotelRooms
          selectedRoom={selectedRoom}
          onSelectRoom={onSelectRoom}
        />

        <Itinerary />

        <TripSummary
          selectedRoom={selectedRoom}
          selectedCar={selectedCar}
          onContinue={onContinue}
          travellers={travellers}
        />
      </>
    );
  }


  if (activeTab === "Flights") {
    return (
      <FlightPlan
        travellers={travellers}
      />
    );
  }


  if (activeTab === "Cars") {
    return (
      <>
        <CarRental
          travellers={travellers}
          selectedCar={selectedCar}
          onSelectCar={onSelectCar}
        />

        <TripSummary
          selectedRoom={selectedRoom}
          selectedCar={selectedCar}
          onContinue={onContinue}
          travellers={travellers}
        />
      </>
    );
  }


  if (activeTab === "Packages") {
    return (
      <Packages
        travellers={travellers}
      />
    );
  }


  if (activeTab === "Things to do") {
    return (
      <Activities
        travellers={travellers}
      />
    );
  }


  return null;
}


export default TravelContent;