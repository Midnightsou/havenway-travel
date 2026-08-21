import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import TravelPage from "./pages/TravelPage";
import BookingPage from "./pages/BookingPage";
import BitcoinPaymentPage from "./pages/BitcoinPaymentPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BookingGuard from "./components/BookingGuard/BookingGuard";

import { getTripDuration } from "./utils/dates";

import {
  getStoredTrip,
  saveTrip,
  clearTrip,
} from "./utils/tripStorage";

import hotels from "./data/hotel";

import rooms from "./data/rooms";
import cars from "./data/cars";
import flights from "./data/flight";

import {
  generateItinerary,
} from "./data/itinerary";

import "./styles/global.css";
import "./styles/responsive.css";


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


function AppRoutes() {

  const navigate = useNavigate();
  const location = useLocation();

  const storedTrip = getStoredTrip();

  const [activeTab, setActiveTab] =
    useState("Stays");

  const [travellers, setTravellers] =
    useState(
      storedTrip?.travellers ?? 1
    );

  const [startDate, setStartDate] =
    useState(
      storedTrip?.startDate ?? null
    );

  const [endDate, setEndDate] =
    useState(
      storedTrip?.endDate ?? null
    );

  const [selectedRoom, setSelectedRoom] =
    useState(
      storedTrip?.selectedRoom ?? null
    );

  const [selectedFlight, setSelectedFlight] =
    useState(
      storedTrip?.selectedFlight ?? null
    );

  const [selectedCar, setSelectedCar] =
    useState(
      storedTrip?.selectedCar ?? null
    );

  const [selectedActivities, setSelectedActivities] =
    useState(
      storedTrip?.selectedActivities ?? []
    );

  const [selectedPackage, setSelectedPackage] =
    useState(
      storedTrip?.selectedPackage ?? null
    );

  const [selectedHotel, setSelectedHotel] =
    useState(
      storedTrip?.selectedHotel ?? null
    );

  const [booking, setBooking] =
    useState(
      storedTrip?.booking ?? null
    );

  const [paymentBooking, setPaymentBooking] =
    useState(
      storedTrip?.paymentBooking ?? null
    );

  const [bookingGuard, setBookingGuard] =
    useState(null);

  const [paymentStartedAt, setPaymentStartedAt] =
    useState(
      storedTrip?.paymentStartedAt ?? null
    );

  const { nights, days } =
    getTripDuration(startDate, endDate);


  /*
   * Automatically save the trip whenever
   * any of its values change.
   */
  useEffect(() => {

    saveTrip({
      travellers,
      startDate,
      endDate,
      selectedRoom,
      selectedFlight,
      selectedCar,
      selectedActivities,
      selectedPackage,
      selectedHotel,
      booking,
      paymentBooking,
      paymentStartedAt,
    });

  }, [
    travellers,
    startDate,
    endDate,
    selectedRoom,
    selectedFlight,
    selectedCar,
    selectedActivities,
    selectedPackage,
    selectedHotel,
    booking,
    paymentBooking,
    paymentStartedAt,
  ]);


  /*
   * Keep activeTab in sync with the
   * current route.
   */
  useEffect(() => {
    if (location.pathname === "/stays") {
      setActiveTab("Stays");
    } else if (location.pathname === "/flights") {
      setActiveTab("Flights");
    } else if (location.pathname === "/cars") {
      setActiveTab("Cars");
    }
  }, [location.pathname]);


  const trip = {
    startDate,
    endDate,
    travellers,
    nights,
    days,
    roomId: selectedRoom,
    flightId: selectedFlight,
    carId: selectedCar,
    activityIds: selectedActivities,
    packageId: selectedPackage,
    selectedHotel,
  };


  const getRouteForTab = (tab) => {
    if (tab === "Flights") return "/flights";
    if (tab === "Cars") return "/cars";
    return "/stays";
  };


  const handleNavigate = (
    tab,
    sectionId
  ) => {

    setActiveTab(tab);

    navigate(getRouteForTab(tab));

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

    navigate("/");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 120);

  };


  const handleSelectHotel = (hotelId) => {

    setSelectedHotel(hotelId);

    navigate("/stays");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 120);

  };


  const handleTabChange = (tab) => {

    setActiveTab(tab);

    navigate(getRouteForTab(tab));

  };


  const handleContinueBooking = () => {

    // Room is required

    if (!selectedRoom) {

      setBookingGuard("room");

      return;

    }


    // Flight is required

    if (!selectedFlight) {

      setBookingGuard("flight");

      return;

    }


    // Car is optional

    if (!selectedCar) {

      setBookingGuard("car");

      return;

    }


    // Everything required is selected

    navigate("/booking");

  };


  const handleGuardChoose = () => {

    const guardType =
      bookingGuard;

    setBookingGuard(null);


    if (guardType === "room") {

      navigate("/stays");

    }


    if (guardType === "flight") {

      navigate("/flights");

    }


    if (guardType === "car") {

      navigate("/cars");

    }


    setTimeout(() => {

      const sectionId =
        guardType === "room"
          ? "rooms"
          : guardType === "flight"
            ? "flights"
            : "cars";

      const section =
        document.getElementById(sectionId);

      if (section) {

        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      }

    }, 150);

  };


  const handleContinueWithoutCar = () => {

    setBookingGuard(null);

    navigate("/booking");

  };


  const handleCloseBooking = () => {

    navigate(getRouteForTab(activeTab));

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

    const hotel = selectedHotel
      ? hotels.find(
          (item) => item.id === selectedHotel
        )
      : null;


    /*
     * Pricing
     */

    const selectedFlightPlan =
      selectedFlight
        ? flights[selectedFlight]
        : null;

    const flightTotal = selectedFlightPlan
      ? (
          selectedFlightPlan.outbound.price +
          selectedFlightPlan.return.price
        ) * travellers
      : 0;

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
        endDate,
        selectedFlightPlan
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

      flight: selectedFlightPlan
        ? {
            plan: selectedFlight,
            name: selectedFlightPlan.name,

            outbound: {
              ...selectedFlightPlan.outbound,
              date: startDate,
            },

            return: {
              ...selectedFlightPlan.return,
              date: endDate,
            },
          }
        : null,

      hotel: hotel || null,

      room: room || null,

      car: car || null,

      itinerary,

      totals: {
        flightTotal,
        hotelTotal,
        carTotal,
        activitiesTotal: 0,
        packageTotal: 0,
        tripTotal: total,
      },

    };


    /*
     * Keep the complete booking object
     * intact.
     */

    setPaymentBooking(completeBooking);

    setPaymentStartedAt(
      Date.now()
    );

    navigate("/payment");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 120);

  };


  const handlePaymentComplete = () => {

    if (!paymentBooking) return;

    const completedBooking = {
      ...paymentBooking,
    };

    setBooking(completedBooking);

    setPaymentBooking(null);

    setPaymentStartedAt(null);

    navigate("/confirmation");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 120);

  };


  const handleBackToBooking = () => {

    setPaymentBooking(null);

    setPaymentStartedAt(null);

    navigate("/booking");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 120);

  };


  const handleReturnHome = () => {

    clearTrip();

    setBooking(null);

    setPaymentBooking(null);

    setSelectedRoom(null);

    setSelectedFlight(null);

    setSelectedCar(null);

    setSelectedActivities([]);

    setSelectedPackage(null);

    setSelectedHotel(null);

    setStartDate(null);

    setEndDate(null);

    setTravellers(1);

    navigate("/");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 120);

  };


  const travelPageProps = {
    setActiveTab: handleTabChange,
    travellers,
    setTravellers,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    nights,
    days,
    selectedRoom,
    onSelectRoom: setSelectedRoom,
    selectedFlight,
    onSelectFlight: setSelectedFlight,
    selectedCar,
    onSelectCar: setSelectedCar,
    selectedActivities,
    onSelectActivities: setSelectedActivities,
    selectedPackage,
    onSelectPackage: setSelectedPackage,
    selectedHotel,
    onContinue: handleContinueBooking,
    onNavigate: handleNavigate,
    onGoHome: handleGoHome,
  };


  return (
    <>

      <Routes>

      <Route
        path="/"
        element={
          <HomePage
            onNavigate={handleNavigate}
            onGoHome={handleGoHome}
            hotels={hotels}
            selectedHotel={selectedHotel}
            onSelectHotel={handleSelectHotel}
          />
        }
      />

      <Route
        path="/stays"
        element={
          <TravelPage
            activeTab="Stays"
            {...travelPageProps}
            hotels={hotels}
            selectedHotel={selectedHotel}
          />
        }
      />

      <Route
        path="/flights"
        element={
          <TravelPage
            activeTab="Flights"
            {...travelPageProps}
            hotels={hotels}
            selectedHotel={selectedHotel}
          />
        }
      />

      <Route
        path="/cars"
        element={
          <TravelPage
            activeTab="Cars"
            {...travelPageProps}
          />
        }
      />

      <Route
        path="/booking"
        element={
          <BookingPage
            trip={trip}
            onClose={handleCloseBooking}
            onConfirm={handleConfirmBooking}
          />
        }
      />

      <Route
        path="/payment"
        element={
          <BitcoinPaymentPage
            booking={paymentBooking}
            paymentStartedAt={paymentStartedAt}
            onBack={handleBackToBooking}
            onPaymentComplete={handlePaymentComplete}
          />
        }
      />

      <Route
        path="/confirmation"
        element={
          <BookingConfirmationPage
            booking={booking}
            onReturnHome={handleReturnHome}
          />
        }
      />

      </Routes>

      {bookingGuard && (

        <BookingGuard
          type={bookingGuard}
          onClose={() =>
            setBookingGuard(null)
          }
          onChoose={
            handleGuardChoose
          }
          onContinueWithoutCar={
            handleContinueWithoutCar
          }
        />

      )}

    </>
  );

}

export default App;