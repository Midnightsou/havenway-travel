import { BedDouble, Users, Check, Wifi } from "lucide-react";
import rooms from "../../data/rooms";
import RoomGallery from "../RoomGallery/RoomGallery";
import { formatShortDate } from "../../utils/dates";
import "./HotelRooms.css";

function HotelRooms({
  hotel,
  selectedRoom,
  onSelectRoom,
  startDate,
  endDate,
  nights = 0,
}) {
  const hotelRooms = rooms.filter(
    (room) => String(room.hotelId) === String(hotel?.id)
  );
  const selected = hotelRooms.find(
    (room) => String(room.id) === String(selectedRoom)
  );
  const calculateTotal = (room) => room.pricePerNight * nights;

  return (
    <section className="hotel-rooms" id="rooms">
      <div className="container">
        <div className="rooms-heading">
          <div>
            <span className="section-eyebrow">Your stay</span>
            <h2>Choose your room</h2>
            <p>
              Check-in {startDate ? formatShortDate(startDate) : "—"} ·
              Check-out {endDate ? formatShortDate(endDate) : "—"} ·
              {nights} nights
            </p>
          </div>
        </div>

        {hotelRooms.length ? (
          <div className="room-list">
            {hotelRooms.map((room) => {
              const total = calculateTotal(room);
              const isSelected = String(selectedRoom) === String(room.id);
              const amenities = Array.isArray(room.amenities) ? room.amenities : [];

              return (
                <article className={`room-card ${isSelected ? "selected" : ""}`} key={room.id}>
                  <RoomGallery images={room.images} roomName={room.name} />
                  <div className="room-content">
                    <div className="room-info">
                      <h3>{room.name}</h3>
                      <div className="room-meta">
                        <span><BedDouble size={18} />{room.beds || "Bed details unavailable"}</span>
                        <span><Users size={18} />{room.guests || "Guest limit unavailable"}</span>
                      </div>
                      {amenities.length > 0 && (
                        <div className="room-benefits">
                          {amenities.map((amenity) => (
                            <div className="room-benefit" key={amenity}>
                              {amenity === "Free WiFi" ? <Wifi size={17} /> : <Check size={17} />}
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="room-pricing">
                      <div className="room-price">
                        <span>${room.pricePerNight} per night</span>
                        <strong>${total}</strong>
                        <small>for {nights} nights</small>
                      </div>
                      <button
                        className={`select-room-button ${isSelected ? "room-selected" : ""}`}
                        onClick={() => onSelectRoom(isSelected ? null : room.id)}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="hotel-no-rooms">
            <h3>No rooms listed yet</h3>
            <p>Room options for this property will appear here once they are available.</p>
          </div>
        )}

        {selected && (
          <div className="selected-room-summary">
            <div>
              <span>Selected room</span>
              <strong>{selected.name}</strong>
            </div>
            <div className="selected-room-price">
              <span>Hotel total</span>
              <strong>${calculateTotal(selected)}</strong>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HotelRooms;
