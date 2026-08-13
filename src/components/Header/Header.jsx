import {
  Menu,
  Globe,
  ChevronDown,
  User,
} from "lucide-react";

import "./Header.css";

function Header({
  activeTab,
  onNavigate,
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
            className="icon-button menu-button"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <button
            className="brand"
            onClick={() =>
              handleNavClick("Stays", null)
            }
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

        <div className="header-right">


          <button
            className="icon-button user-button"
            aria-label="Account"
          >
            <User size={21} />
          </button>


        </div>

      </div>
    </header>
  );
}

export default Header;