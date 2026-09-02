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
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BitcoinPaymentPage from "./pages/BitcoinPaymentPage";
import BookingGuard from "./components/BookingGuard/BookingGuard";
import AboutPage from "./pages/AboutPage";
import ReviewsPage from "./pages/ReviewsPage";
import BookingInformationPage from "./pages/BookingInformationPage";
import CancellationRefundPage from "./pages/CancellationRefundPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import SharedPaymentPage from "./pages/SharedPaymentPage";
import SharedBitcoinPaymentPage from "./pages/SharedBitcoinPaymentPage";
import SharedTripPage from "./pages/SharedTripPage";

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
import activities from "./data/activities";

import {
  generateItinerary,
} from "./data/itinerary";

import "./styles/global.css";
import "./styles/responsive.css";


const API_BASE_URL =
  "https://api.havenway-travels.cv";


const PAYMENT_SESSION_VERSION = 1;


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

  const handleLegalNavigate = (path) => {
    const allowedLegalRoutes = [
      "/about",
      "/reviews",
      "/booking-information",
      "/cancellation-refunds",
      "/privacy-policy",
      "/terms-of-service",
    ];

    if (!allowedLegalRoutes.includes(path)) {
      return;
    }

    navigate(path);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 120);
  };

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

  const storedPaymentSession =
    storedTrip?.paymentSession?.version ===
    PAYMENT_SESSION_VERSION
      ? storedTrip.paymentSession
      : null;

  const [paymentSession, setPaymentSession] =
    useState(storedPaymentSession);

  const [creatingPayment, setCreatingPayment] =
    useState(false);

  const creatingPaymentRef = useRef(false);

  const [bookingGuard, setBookingGuard] =
    useState(null);

  const [creatingSharedTrip, setCreatingSharedTrip] =
    useState(false);

  const [sharedTripLink, setSharedTripLink] =
    useState(null);

  const [sharedTripCopied, setSharedTripCopied] =
    useState(false);

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


  /*
   * If a selected room no longer belongs to the
   * current hotel, clear it. This protects against
   * switching hotels, page refreshes, stale session
   * storage, and any manually-invalid state.
   */
  useEffect(() => {

    if (!selectedHotel || !selectedRoom) {
      return;
    }

    const room = rooms.find(
      (item) => item.id === selectedRoom
    );

    if (!room || room.hotelId !== selectedHotel) {
      setSelectedRoom(null);
    }

  }, [selectedHotel, selectedRoom]);


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

    // Change the hotel.
    setSelectedHotel(hotelId);

    // The previously selected room may belong
    // to the old hotel, so clear it.
    setSelectedRoom(null);

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


  const handleContinueToPayment = () => {

    if (!paymentBooking || !paymentSession) {

      alert(
        "Please create the payment session first."
      );

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


  const handleShareItinerary = async () => {
    if (creatingSharedTrip) {
      return;
    }

    setCreatingSharedTrip(true);
    setSharedTripCopied(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/shared-trips`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            travellers,
            startDate,
            endDate,
            nights,
            days,

            roomId: selectedRoom,
            flightId: selectedFlight,
            carId: selectedCar,

            activityIds:
              selectedActivities,

            packageId:
              selectedPackage,

            selectedHotel,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Failed to create shared itinerary"
        );
      }

      const link =
        `${window.location.origin}/trip/${data.shareToken}`;

      setSharedTripLink(link);

      try {
        await navigator.clipboard.writeText(link);

        setSharedTripCopied(true);

        setTimeout(() => {
          setSharedTripCopied(false);
        }, 2500);
      } catch (clipboardError) {
        console.error(
          "Failed to copy shared itinerary link:",
          clipboardError
        );
      }

      return link;

    } catch (error) {
      console.error(
        "Share itinerary failed:",
        error
      );

      alert(
        "Unable to create the shared itinerary. Please try again."
      );

      return null;

    } finally {
      setCreatingSharedTrip(false);
    }
  };


  const handleContinueWithSharedTrip = (sharedTrip) => {
    if (!sharedTrip) {
      return;
    }

    /*
     * Restore the shared itinerary into
     * Havenway's existing trip state.
     */

    setTravellers(
      sharedTrip.travellers ?? 1
    );

    setStartDate(
      sharedTrip.startDate ?? null
    );

    setEndDate(
      sharedTrip.endDate ?? null
    );

    setSelectedHotel(
      sharedTrip.selectedHotel ?? null
    );

    setSelectedRoom(
      sharedTrip.roomId ?? null
    );

    setSelectedFlight(
      sharedTrip.flightId ?? null
    );

    setSelectedCar(
      sharedTrip.carId ?? null
    );

    setSelectedActivities(
      Array.isArray(sharedTrip.activityIds)
        ? sharedTrip.activityIds
        : []
    );

    setSelectedPackage(
      sharedTrip.packageId ?? null
    );

    /*
     * A shared itinerary is a fresh trip.
     * It should not inherit another user's
     * booking/payment session.
     */

    setBooking(null);
    setPaymentBooking(null);
    setPaymentSession(null);

    setSharedTripLink(null);

    navigate("/booking");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 120);
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
        version: PAYMENT_SESSION_VERSION,

        bookingId: data.bookingId,

        paymentToken:
          data.paymentToken,

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

    const activitiesTotal =
      selectedActivities.reduce((total, activityId) => {
        const activity = activities.find(
          (item) => item.id === activityId
        );

        if (!activity) return total;

        return (
          total +
          activity.pricePerPerson * travellers
        );
      }, 0);

    const packageTotal = 0;

    const total =
      flightTotal +
      hotelTotal +
      carTotal +
      activitiesTotal +
      packageTotal;

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

      hotel,

      room,

      car,

      selectedActivities,

      selectedPackage,

      itinerary,

      totals: {
        flightTotal,
        hotelTotal,
        carTotal,
        activitiesTotal,
        packageTotal,
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

    /*
     * IMPORTANT:
     *
     * Do NOT navigate to /payment here.
     *
     * The BookingModal needs to remain open
     * so User 1 can copy the payment link
     * OR continue to payment.
     */
  };


  const handlePaymentComplete = () => {

    if (!paymentBooking) {
      console.error(
        "Payment completed but paymentBooking is missing."
      );

      return;
    }

    if (!paymentSession?.bookingId) {
      console.error(
        "Payment completed but paymentSession.bookingId is missing."
      );

      alert(
        "Payment was completed, but we could not generate the payment link."
      );

      return;
    }

    /*
     * The shared payment link uses the real
     * Supabase booking ID.
     *
     * This is NOT the customer-facing
     * HW-XXXXXX booking reference.
     */

    const paymentLink =
      `${window.location.origin}/pay/${paymentSession.bookingId}`;


    const completedBooking = {
      ...paymentBooking,

      paymentLink,

      paymentBookingId:
        paymentSession.bookingId,
    };


    console.log(
      "Shared payment link:",
      paymentLink
    );


    setBooking(completedBooking);

    setPaymentBooking(null);

    setPaymentSession(null);


    /*
     * Show the paid BookingModal.
     */

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
    onLegalNavigate: handleLegalNavigate,
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
            onLegalNavigate={handleLegalNavigate}
            hotels={hotels}
            selectedHotel={selectedHotel}
            onSelectHotel={handleSelectHotel}
          />
        }
      />

      <Route
        path="/about"
        element={<AboutPage />}
      />

      <Route
        path="/reviews"
        element={<ReviewsPage />}
      />

      <Route
        path="/booking-information"
        element={<BookingInformationPage />}
      />

      <Route
        path="/cancellation-refunds"
        element={<CancellationRefundPage />}
      />

      <Route
        path="/privacy-policy"
        element={<PrivacyPolicyPage />}
      />

      <Route
        path="/terms-of-service"
        element={<TermsOfServicePage />}
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
            paymentLink={
              paymentSession?.bookingId
                ? `${window.location.origin}/pay/${paymentSession.bookingId}`
                : null
            }
            bookingReference={
              paymentBooking?.bookingReference ||
              ""
            }
            onContinueToPayment={
              handleContinueToPayment
            }
            onShareItinerary={
              handleShareItinerary
            }
            creatingSharedTrip={
              creatingSharedTrip
            }
            sharedTripLink={
              sharedTripLink
            }
            sharedTripCopied={
              sharedTripCopied
            }
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
        path="/pay/:bookingId"
        element={
          <SharedPaymentPage />
        }
      />

      <Route
        path="/pay/:bookingId/payment"
        element={
          <SharedBitcoinPaymentPage />
        }
      />

      <Route
        path="/trip/:token"
        element={
          <SharedTripPage
            onContinueWithTrip={
              handleContinueWithSharedTrip
            }
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