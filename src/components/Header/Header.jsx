import "./Header.css";

function Header({
  activeTab,
  onNavigate,
  onGoHome,
}) {

  const navItems = [
    {
      label: "Flights",
      tab: "Flights",
      section: "flights",
    },
    {
      label: "Stays",
      tab: "Stays",
      section: "rooms",
    },
    {
      label: "Things to do",
      tab: "Things to do",
      section: null,
    },
    {
      label: "Itinerary",
      tab: "Stays",
      section: "itinerary",
    },
    {
      label: "Trip summary",
      tab: "Stays",
      section: "summary",
    },
  ];


  const handleNavClick = (
    tab,
    section
  ) => {

    if (onNavigate) {
      onNavigate(tab, section);
    }

  };


  return (
    <header className="header">
      <div className="container header-container">

        <div className="header-left">
          <button
            className="brand"
            onClick={onGoHome}
          >
            Havenway
          </button>

          <nav className="desktop-nav">

            {navItems.map((item) => (
              <button
                key={item.label}
                className={
                  item.tab === activeTab
                    ? "nav-link active"
                    : "nav-link"
                }
                onClick={() =>
                  handleNavClick(
                    item.tab,
                    item.section
                  )
                }
              >
                {item.label}
              </button>
            ))}

          </nav>
        </div>

      </div>
    </header>
  );
}

export default Header;