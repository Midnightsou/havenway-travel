import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import TravelTabs from "../components/TravelTabs/TravelTabs";
import TravelContent from "../components/TravelContent/TravelContent";
import Footer from "../components/Footer/Footer";
import MobileNav from "../components/MobileNav/MobileNav";

function TravelPage({
  activeTab,
  setActiveTab,
  travellers,
  setTravellers,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
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
  onNavigate,
  onGoHome,
}) {
  return (
    <>
      <Header
        activeTab={activeTab}
        onNavigate={onNavigate}
        onGoHome={onGoHome}
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
          hotels={hotels}
          selectedHotel={selectedHotel}
          selectedRoom={selectedRoom}
          onSelectRoom={onSelectRoom}
          selectedFlight={selectedFlight}
          onSelectFlight={onSelectFlight}
          selectedCar={selectedCar}
          onSelectCar={onSelectCar}
          selectedActivities={selectedActivities}
          onSelectActivities={onSelectActivities}
          selectedPackage={selectedPackage}
          onSelectPackage={onSelectPackage}
          onContinue={onContinue}
        />
      </main>

      <Footer onNavigate={onNavigate} />

      <MobileNav
        activeTab={activeTab}
        onNavigate={onNavigate}
        onGoHome={onGoHome}
      />
    </>
  );
}

export default TravelPage;