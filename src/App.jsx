import { useState } from "react";

import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import TravelTabs from "./components/TravelTabs/TravelTabs";
import TravelContent from "./components/TravelContent/TravelContent";
import Footer from "./components/Footer/Footer";
import MobileNav from "./components/MobileNav/MobileNav";

import BookingModal from "./components/BookingModal/BookingModal";
import BookingConfirmation from "./components/BookingConfirmation/BookingConfirmation";

import Home from "./components/Home/Home";

import { getTripDuration } from "./utils/dates";

import rooms from "./data/rooms";
import cars from "./data/cars";
import flights from "./data/flight";

import {
  generateItinerary,
} from "./data/itinerary";

import "./styles/global.css";
import "./styles/responsive.css";


function App() {

  const [currentPage, setCurrentPage] =
    useState("home");

  const [activeTab, setActiveTab] =
    useState("Stays");

  const [travellers, setTravellers] =
    useState(1);

  const [startDate, setStartDate] =
    useState(null);

  const [endDate, setEndDate] =
    useState(null);

  const [selectedRoom, setSelectedRoom] =
    useState(null);

  const [selectedCar, setSelectedCar] =
    useState(null);

  const [selectedActivities, setSelectedActivities] =
    useState([]);

  const [selectedPackage, setSelectedPackage] =
    useState(null);

  const [bookingOpen, setBookingOpen] =
    useState(false);

  const [booking, setBooking] =
    useState(null);

  const { nights, days } =
    getTripDuration(startDate, endDate);


  const trip = {
    startDate,
    endDate,
    travellers,
    nights,
    days,
    roomId: selectedRoom,
    carId: selectedCar,
    activityIds: selectedActivities,
    packageId: selectedPackage,
  };


  const handleNavigate = (
    tab,
    sectionId
  ) => {

    setCurrentPage("travel");

    setActiveTab(tab);

    setTimeout(() => {

      if (sectionId) {

        const section =
          document.getElementById(
            sectionId
          );

        if (section) {

          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          return;
        }

      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    }, 120);

  };


  const handleGoHome = () => {

    setCurrentPage("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  const handleContinueBooking = () => {

    if (!selectedRoom && !selectedCar) return;

    setBookingOpen(true);

  };


  const handleConfirmBooking = (
    bookingData
  ) => {

    const bookingReference =
      `HW-${Math.floor(
        100000 + Math.random() * 900000
      )}`;


    const room = selectedRoom
      ? rooms.find(
          (item) => item.id === selectedRoom
        )
      : null;

    const car = selectedCar
      ? cars.find(
          (item) => item.id === selectedCar
        )
      : null;


    /*
     * Pricing
     */

    const flightTotal =
      (flights.outbound.price +
        flights.return.price) *
      travellers;

    const hotelTotal = room
      ? room.pricePerNight * nights
      : 0;

    const carTotal = car
      ? car.pricePerDay * days
      : 0;

    const total =
      flightTotal +
      hotelTotal +
      carTotal;

    const itinerary =
      generateItinerary(
        startDate,
        endDate
      );


    /*
     * Build the complete booking object.
     *
     * ...bookingData comes first so the
     * calculated fields below are
     * authoritative.
     */

    const completeBooking = {

      ...bookingData,

      bookingReference,

      traveler: {
        firstName:
          bookingData?.traveler?.firstName ||
          "",
        lastName:
          bookingData?.traveler?.lastName ||
          "",
        email:
          bookingData?.traveler?.email ||
          "",
      },

      travellers,

      startDate,
      endDate,

      nights,
      days,

      flight: {
        outbound: {
          ...flights.outbound,
          date: startDate,
        },
        return: {
          ...flights.return,
          date: endDate,
        },
      },

      hotel: {
        name: "The Westin Los Angeles Airport",
      },

      room: room || null,

      car: car || null,

      itinerary,

      totals: {
        flights: flightTotal,
        hotel: hotelTotal,
        car: carTotal,
        activities: 0,
        package: 0,
        total,
      },

    };


    /*
     * Keep the complete booking object
     * intact.
     */

    setBooking(completeBooking);

    setBookingOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  const handleReturnHome = () => {

    setBooking(null);

    setSelectedRoom(null);

    setSelectedCar(null);

    setSelectedActivities([]);

    setSelectedPackage(null);

    setCurrentPage("home");

  };


  if (booking) {

    return (
      <BookingConfirmation
        booking={booking}
        onReturnHome={handleReturnHome}
      />
    );

  }


  if (currentPage === "home") {

    return (
      <>
        <Header
          activeTab="Home"
          onNavigate={handleNavigate}
          onGoHome={handleGoHome}
        />

        <Home
          onNavigate={handleNavigate}
        />

        <Footer
          onNavigate={handleNavigate}
        />

        <MobileNav
          activeTab="Home"
          onNavigate={handleNavigate}
          onGoHome={handleGoHome}
        />
      </>
    );

  }


  return (
    <>

      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onGoHome={handleGoHome}
      />


      <TravelTabs
        activeTab={activeTab}
        setActiveTab={(tab) => {

          setActiveTab(tab);

          setCurrentPage("travel");

        }}
      />


      <main>

        <SearchBar
          activeTab={activeTab}
          onTabChange={(tab) => {

            setActiveTab(tab);

            setCurrentPage("travel");

          }}
          travellers={travellers}
          setTravellers={setTravellers}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />


        <TravelContent
          activeTab={activeTab}
          travellers={travellers}
          startDate={startDate}
          endDate={endDate}
          nights={nights}
          days={days}
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
          selectedCar={selectedCar}
          onSelectCar={setSelectedCar}
          selectedActivities={selectedActivities}
          onSelectActivities={setSelectedActivities}
          selectedPackage={selectedPackage}
          onSelectPackage={setSelectedPackage}
          onContinue={handleContinueBooking}
        />

      </main>


      <Footer
        onNavigate={handleNavigate}
      />


      <MobileNav
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onGoHome={handleGoHome}
      />


      {bookingOpen && (

        <BookingModal
          trip={trip}
          onClose={() =>
            setBookingOpen(false)
          }
          onConfirm={handleConfirmBooking}
        />

      )}

    </>
  );

}

export default App;