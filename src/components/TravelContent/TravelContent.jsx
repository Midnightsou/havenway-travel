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
  startDate,
  endDate,
  nights,
  days,
  hotels,
  selectedHotel,
  selectedRoom,
  onSelectRoom,
  selectedFlight,
  onSelectFlight,
  selectedCar,
  onSelectCar,
  selectedActivities,
  onSelectActivities,
  selectedPackage,
  onSelectPackage,
  onContinue,
}) {

  const activeHotel =
    selectedHotel
      ? hotels?.find(
          (hotel) => hotel.id === selectedHotel
        )
      : undefined;

  if (activeTab === "Stays") {
    return (
      <>
        <HotelHero hotel={activeHotel} />

        <HotelOverview hotel={activeHotel} />

        <HotelRooms
          selectedRoom={selectedRoom}
          onSelectRoom={onSelectRoom}
          startDate={startDate}
          endDate={endDate}
          nights={nights}
        />

        <Itinerary
          startDate={startDate}
          endDate={endDate}
          selectedFlight={selectedFlight}
        />

        <TripSummary
          selectedRoom={selectedRoom}
          selectedCar={selectedCar}
          selectedFlight={selectedFlight}
          selectedActivities={selectedActivities}
          selectedPackage={selectedPackage}
          selectedHotel={selectedHotel}
          onContinue={onContinue}
          travellers={travellers}
          startDate={startDate}
          endDate={endDate}
          nights={nights}
          days={days}
        />
      </>
    );
  }


  if (activeTab === "Flights") {
    return (
      <FlightPlan
        travellers={travellers}
        startDate={startDate}
        endDate={endDate}
        selectedFlight={selectedFlight}
        onSelectFlight={onSelectFlight}
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
          startDate={startDate}
          endDate={endDate}
          days={days}
        />

        <TripSummary
          selectedRoom={selectedRoom}
          selectedCar={selectedCar}
          selectedFlight={selectedFlight}
          selectedActivities={selectedActivities}
          selectedPackage={selectedPackage}
          selectedHotel={selectedHotel}
          onContinue={onContinue}
          travellers={travellers}
          startDate={startDate}
          endDate={endDate}
          nights={nights}
          days={days}
        />
      </>
    );
  }


  if (activeTab === "Packages") {
    return (
      <Packages
        travellers={travellers}
        startDate={startDate}
        endDate={endDate}
        nights={nights}
        selectedPackage={selectedPackage}
        selectedHotel={selectedHotel}
        onSelectPackage={onSelectPackage}
      />
    );
  }


  if (activeTab === "Things to do") {
    return (
      <Activities
        travellers={travellers}
        startDate={startDate}
        endDate={endDate}
        selectedActivities={selectedActivities}
        onSelectActivities={onSelectActivities}
      />
    );
  }


  return null;
}


export default TravelContent;