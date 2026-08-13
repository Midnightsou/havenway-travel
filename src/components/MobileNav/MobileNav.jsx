import {
  Search,
  Plane,
  Hotel,
  CalendarDays,
  ReceiptText,
} from "lucide-react";

import "./MobileNav.css";

function MobileNav({
  activeTab,
  onNavigate,
}) {
  const navItems = [
    {
      label: "Search",
      icon: Search,
      tab: null,
      target: null,
    },
    {
      label: "Flight",
      icon: Plane,
      tab: "Flights",
      target: null,
    },
    {
      label: "Hotel",
      icon: Hotel,
      tab: "Stays",
      target: "rooms",
    },
    {
      label: "Plan",
      icon: CalendarDays,
      tab: "Stays",
      target: "itinerary",
    },
    {
      label: "Summary",
      icon: ReceiptText,
      tab: "Stays",
      target: "summary",
    },
  ];

  const handleNavClick = (
    tab,
    target
  ) => {
    if (tab === null && target === null) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (onNavigate) {
      onNavigate(tab, target);
    }
  };

  return (
    <nav className="mobile-nav">

      {navItems.map((item) => {

        const Icon = item.icon;

        return (
          <button
            key={item.label}
            onClick={() =>
              handleNavClick(
                item.tab,
                item.target
              )
            }
          >

            <Icon size={20} />

            <span>
              {item.label}
            </span>

          </button>
        );
      })}

    </nav>
  );
}

export default MobileNav;