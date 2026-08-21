import Header from "../components/Header/Header";
import Home from "../components/Home/Home";
import Footer from "../components/Footer/Footer";
import MobileNav from "../components/MobileNav/MobileNav";

function HomePage({
  onNavigate,
  onGoHome,
  hotels,
  selectedHotel,
  onSelectHotel,
}) {
  return (
    <>
      <Header
        activeTab="Home"
        onNavigate={onNavigate}
        onGoHome={onGoHome}
      />

      <Home
        onNavigate={onNavigate}
        hotels={hotels}
        selectedHotel={selectedHotel}
        onSelectHotel={onSelectHotel}
      />

      <Footer onNavigate={onNavigate} />

      <MobileNav
        activeTab="Home"
        onNavigate={onNavigate}
        onGoHome={onGoHome}
      />
    </>
  );
}

export default HomePage;
