import {
  BedDouble,
  Plane,
  Car,
  Package,
  MapPin,
} from "lucide-react";

import "./TravelTabs.css";


function TravelTabs({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    {
      name: "Stays",
      icon: BedDouble,
    },
    {
      name: "Flights",
      icon: Plane,
    },
    {
      name: "Cars",
      icon: Car,
    },

  ];


  return (
    <div className="travel-tabs">

      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.name}
            type="button"
            className={
              activeTab === tab.name
                ? "travel-tab active"
                : "travel-tab"
            }
            onClick={() =>
              setActiveTab(tab.name)
            }
          >
            <Icon size={20} />

            <span>
              {tab.name}
            </span>

          </button>
        );
      })}

    </div>
  );
}


export default TravelTabs;