import { useState } from "react";
import {
  Heart,
  Share2,
  MapPin,
  Star,
} from "lucide-react";

import hotelData from "../../data/hotel";
import HotelGallery from "../HotelGallery/HotelGallery";

import "./HotelHero.css";

function HotelHero({ hotel }) {

  const [galleryOpen, setGalleryOpen] = useState(false);

  const activeHotel = hotel ?? hotelData[0];
  const images = Array.isArray(activeHotel.images) && activeHotel.images.length
    ? activeHotel.images
    : ["/images/hotel/image 1.jpeg"];
  const highlights = Array.isArray(activeHotel.highlights)
    ? activeHotel.highlights.filter(Boolean).slice(0, 3)
    : [];

  return (
    <>
      <section className="hotel-hero">
        <div className="container">

          {/* Image Gallery */}
          <div className={`hotel-gallery ${images.length === 1 ? "single-image" : ""}`}>

            <div className="gallery-main">
              <img
                src={images[0]}
                alt={activeHotel.name}
              />

              <button
                className="see-more-photos"
                onClick={() => setGalleryOpen(true)}
              >
                See all {images.length} photos
              </button>
            </div>

            {images.length > 1 && (
              <div className="gallery-side">
                {images.slice(1, 5).map((image, index) => (
                  <div className="gallery-image" key={`${image}-${index}`}>
                    <img
                      src={image}
                      alt={`${activeHotel.name} photo ${index + 2}`}
                    />
                  </div>
                ))}
              </div>
            )}


            {/* Gallery actions */}

            <div className="gallery-actions">

              <button
                className="gallery-action"
                aria-label="Share hotel"
              >
                <Share2 size={21} />
              </button>

              <button
                className="gallery-action"
                aria-label="Save hotel"
              >
                <Heart size={21} />
              </button>

            </div>

          </div>


          {/* Hotel information */}

          <div className="hotel-info">

            <div className="hotel-main-info">

              <h1>{activeHotel.name}</h1>

              <div className="hotel-rating">

                <div className="rating-score">
                  {activeHotel.rating || "—"}
                </div>

                <div className="rating-details">
                  <strong>{activeHotel.ratingLabel || activeHotel.rating_label || "Guest rating"}</strong>

                  <span>
                    {Number(activeHotel.reviewCount ?? activeHotel.review_count ?? 0).toLocaleString()} reviews
                  </span>
                </div>

              </div>


              <div className="hotel-location">

                <MapPin size={19} />

                <span>{activeHotel.location}</span>

              </div>


              {activeHotel.description && (
                <p className="hotel-description">
                  {activeHotel.description}
                </p>
              )}

            </div>


            <div className="hotel-highlights">

              {(highlights.length ? highlights : ["Comfortable stay"]).map((highlight) => (
                <div className="highlight" key={highlight}>
                  <Star size={20} />
                  <span>{highlight}</span>
                </div>
              ))}

            </div>

          </div>

        </div>
      </section>


      <HotelGallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={images}
        hotelName={activeHotel.name}
      />

    </>
  );
}

export default HotelHero;