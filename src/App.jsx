import { useState, useEffect, useRef } from "react";
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


const API_BASE_URL =
  "http://localhost:5000";


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

  const [paymentSession, setPaymentSession] =
    useState(
      storedTrip?.paymentSession ?? null
    );

  const [creatingPayment, setCreatingPayment] =
    useState(false);

  const creatingPaymentRef = useRef(false);

  const [bookingGuard, setBookingGuard] =
    useState(null);

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
      paymentSession,
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
    paymentSession,
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


  /*
   * Create the ONE Bitcoin payment session.
   *
   * This runs once, right when the user
   * clicks "Pay". BitcoinPayment must never
   * create another one — it only monitors
   * the bookingId returned here.
   */

  const createPaymentSession = async (
    bookingToPay
  ) => {

    if (creatingPaymentRef.current) {
      return false;
    }

    creatingPaymentRef.current = true;

    setCreatingPayment(true);

    const payment =
      bookingToPay ?? paymentBooking;

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/create-payment`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: [
              payment?.traveler?.firstName,
              payment?.traveler?.lastName,
            ]
              .filter(Boolean)
              .join(" "),

            email:
              payment?.traveler?.email || "",

            phone:
              payment?.traveler?.phone || "",

            travellers:
              payment?.travellers ?? 1,

            startDate:
              payment?.startDate ?? null,

            endDate:
              payment?.endDate ?? null,

            nights:
              payment?.nights ?? 0,

            days:
              payment?.days ?? 0,

            selectedHotel:
              payment?.hotel?.id ?? null,

            selectedRoom:
              payment?.room?.id ?? null,

            selectedFlight:
              payment?.flight?.plan ?? null,

            selectedCar:
              payment?.car?.id ?? null,

            selectedActivities:
              payment?.selectedActivities ??
              selectedActivities,

            selectedPackage:
              payment?.selectedPackage ??
              selectedPackage,

            usdTotal:
              payment?.totals?.tripTotal ??
              payment?.totals?.total ??
              0,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Failed to create payment session"
        );
      }

      /*
       * This is the ONE payment session.
       * BitcoinPayment only receives these
       * values — it never creates its own.
       */

      setPaymentSession({
        bookingId: data.bookingId,

        btcAddress: data.btcAddress,

        btcAmount: Number(data.expectedBtc),

        btcPrice: Number(data.btcPrice),

        paymentStartedAt:
          data.paymentStartedAt,
      });

      console.log(
        "Payment session created:",
        data
      );

      return true;

    } catch (error) {

      console.error(
        "Payment session creation failed:",
        error
      );

      setPaymentSession(null);

      alert(
        "Unable to start Bitcoin payment. Please try again."
      );

      return false;

    } finally {

      creatingPaymentRef.current = false;

      setCreatingPayment(false);

    }

  };


  const handleConfirmBooking = async (
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
        phone:
          bookingData?.traveler?.phone ||
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

    const paymentReady =
      await createPaymentSession(
        completeBooking
      );

    if (!paymentReady) {
      return;
    }

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

    setPaymentSession(null);

    navigate("/confirmation");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 120);

  };


  const handleBackToBooking = () => {

    setPaymentSession(null);

    setPaymentBooking(null);

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

    setPaymentSession(null);

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
            submitting={creatingPayment}
          />
        }
      />

      <Route
        path="/payment"
        element={
          <BitcoinPaymentPage
            booking={paymentBooking}
            paymentSession={paymentSession}
            creatingPayment={creatingPayment}
            onRetryCreate={() =>
              createPaymentSession()
            }
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