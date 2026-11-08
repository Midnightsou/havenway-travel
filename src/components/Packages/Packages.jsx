import { Plane, Hotel, Check, Sparkles, Plus } from "lucide-react";
import flights from "../../data/flight";
import rooms from "../../data/rooms";
import hotels from "../../data/hotel";
import packages from "../../data/packages";
import { formatShortDate } from "../../utils/dates";
import "./Packages.css";

function Packages({
  travellers = 1,
  startDate,
  endDate,
  nights = 0,
  selectedPackage = null,
  selectedHotel = null,
  onSelectPackage,
}) {
  const flightPlan = flights.economy || Object.values(flights)[0];
  const dateRange = startDate && endDate
    ? `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`
    : "";

  if (!packages.length || !flightPlan) {
    return (
      <section className="packages" id="packages">
        <div className="container">
          <p>No travel packages are available right now.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="packages" id="packages">
      <div className="container">
        <div className="package-heading">
          <div>
            <span className="section-eyebrow">Bundle &amp; save</span>
            <h2>Flight + stay packages</h2>
            <p>Los Angeles to Washington · {dateRange}</p>
          </div>
          <div className="package-badge"><Sparkles size={18} />Available travel packages</div>
        </div>

        <div className="package-list">
          {packages.map((pkg) => {
            const room = rooms.find((item) => String(item.id) === String(pkg.roomId));
            const hotel = hotels.find((item) =>
              String(item.id) === String(selectedHotel || room?.hotelId)
            );
            const hotelTotal = (room?.pricePerNight || 0) * nights;
            const flightTotal = (
              (flightPlan.outbound?.price || 0) +
              (flightPlan.return?.price || 0)
            ) * travellers;
            const savings = Math.round(hotelTotal * (Number(pkg.discount) || 0));
            const packageTotal = hotelTotal + flightTotal - savings;
            const isSelected = String(selectedPackage) === String(pkg.id);

            return (
              <article className="package-card" key={pkg.id}>
                <div className="package-card-top">
                  <div>
                    <span className="package-type">{pkg.type || "Travel package"}</span>
                    <h3>{pkg.name}</h3>
                    <p>{pkg.description || "A convenient package for your trip."}</p>
                  </div>
                  <div className="package-price">
                    <span>Package total</span>
                    <strong>${packageTotal}</strong>
                    <small>for {travellers} {travellers === 1 ? "traveler" : "travelers"}</small>
                  </div>
                </div>

                <div className="package-sections">
                  <div className="package-section">
                    <div className="package-section-title">
                      <div className="package-icon flight"><Plane size={20} /></div>
                      <div>
                        <span>Flights</span>
                        <strong>Round trip · {flightPlan.name}</strong>
                      </div>
                    </div>
                    <div className="package-route">
                      <div>
                        <strong>{flightPlan.outbound?.from?.airport || "Departure"}</strong>
                        <span>{flightPlan.outbound?.from?.city}</span>
                        <small>{flightPlan.outbound?.from?.time}</small>
                      </div>
                      <div className="package-route-line"><Plane size={16} /></div>
                      <div>
                        <strong>{flightPlan.outbound?.to?.airport || "Arrival"}</strong>
                        <span>{flightPlan.outbound?.to?.city}</span>
                        <small>{flightPlan.outbound?.to?.time}</small>
                      </div>
                    </div>
                    <div className="package-section-total">
                      <span>Flight total</span><strong>${flightTotal}</strong>
                    </div>
                  </div>

                  <div className="package-section">
                    <div className="package-section-title">
                      <div className="package-icon hotel"><Hotel size={20} /></div>
                      <div>
                        <span>Hotel</span>
                        <strong>{hotel?.name || "Your selected hotel"}</strong>
                      </div>
                    </div>
                    {room ? (
                      <div className="package-hotel">
                        <div className="package-hotel-image">
                          {room.images?.[0] && <img src={room.images[0]} alt={room.name} />}
                        </div>
                        <div>
                          <strong>{room.name}</strong>
                          <span>{room.beds} · {room.guests}</span>
                          <small>{dateRange} · {nights} nights</small>
                        </div>
                      </div>
                    ) : (
                      <p>Select a hotel room to see its package price.</p>
                    )}
                    <div className="package-section-total">
                      <span>Stay total{pkg.discount ? ` (save ${Math.round(pkg.discount * 100)}%)` : ""}</span>
                      <strong>${hotelTotal - savings}</strong>
                    </div>
                  </div>
                </div>

                <div className="package-total">
                  <div>
                    <strong>{pkg.name}</strong>
                    <span>Flight and stay for {travellers} {travellers === 1 ? "traveler" : "travelers"}</span>
                  </div>
                  <strong className="package-total-price">${packageTotal}</strong>
                </div>

                {onSelectPackage && (
                  <button
                    className={`select-package-button${isSelected ? " package-selected" : ""}`}
                    onClick={() => onSelectPackage(isSelected ? null : pkg.id)}
                  >
                    {isSelected ? <><Check size={17} /> Package added to trip</> : <><Plus size={17} /> Add package to trip</>}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Packages;
