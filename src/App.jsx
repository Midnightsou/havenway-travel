import { useState } from "react";

import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import TravelTabs from "./components/TravelTabs/TravelTabs";
import TravelContent from "./components/TravelContent/TravelContent";
import Footer from "./components/Footer/Footer";
import MobileNav from "./components/MobileNav/MobileNav";

import BookingModal from "./components/BookingModal/BookingModal";
import BookingConfirmation from "./components/BookingConfirmation/BookingConfirmation";

import "./styles/global.css";
import "./styles/responsive.css";


function App() {

  const [activeTab, setActiveTab] =
    useState("Cars");

  const [travellers, setTravellers] =
    useState(1);

  const [selectedRoom, setSelectedRoom] =
    useState(null);

  const [selectedCar, setSelectedCar] =
    useState(null);

  const [bookingOpen, setBookingOpen] =
    useState(false);

  const [booking, setBooking] =
    useState(null);


  const handleNavigate = (
    tab,
    sectionId
  ) => {

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


    // Car-only booking: keep the car selected
    // and return to Stays so the user can
    // also choose a room.
    if (bookingData.car && !bookingData.room) {

      setBookingOpen(false);

      handleNavigate("Stays", "rooms");

      return;
    }


    setBooking({
      ...bookingData,
      bookingReference,
    });

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

  };


  if (booking) {
    return (
      <BookingConfirmation
        booking={booking}
        onReturnHome={handleReturnHome}
      />
    );
  }


  return (
    <>
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />

      <TravelTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main>

        <SearchBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          travellers={travellers}
          setTravellers={setTravellers}
        />

        <TravelContent
          activeTab={activeTab}
          travellers={travellers}
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
          selectedCar={selectedCar}
          onSelectCar={setSelectedCar}
          onContinue={handleContinueBooking}
        />

      </main>


      <Footer />


      <MobileNav
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />


      {bookingOpen && (
        <BookingModal
          selectedRoom={selectedRoom}
          selectedCar={selectedCar}
          onClose={() =>
            setBookingOpen(false)
          }
          onConfirm={handleConfirmBooking}
          travellers={travellers}
        />
      )}

    </>
  );
}

export default App;