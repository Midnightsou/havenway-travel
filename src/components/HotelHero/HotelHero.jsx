import { useState } from "react";
import {
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  Star,
} from "lucide-react";

import hotel from "../../data/hotel";
import HotelGallery from "../HotelGallery/HotelGallery";
import hotelImages from "../../data/hotelImages";

import "./HotelHero.css";

function HotelHero() {
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <>
      <section className="hotel-hero">
        <div className="container">

          {/* Breadcrumb */}
         


          {/* Image Gallery */}
          <div className="hotel-gallery">

            <div className="gallery-main">
              <img
                src={hotel.images[0]}
                alt={hotel.name}
              />

              <button
                className="see-more-photos-mobile"
                onClick={() => setGalleryOpen(true)}
              >
                See all {hotelImages.length} photos
              </button>
            </div>


            <div className="gallery-side">

              <div className="gallery-image">
                <img
                  src={hotel.images[1]}
                  alt={`${hotel.name} exterior`}
                />
              </div>

              <div className="gallery-image">
                <img
                  src={hotel.images[2]}
                  alt={`${hotel.name} room`}
                />
              </div>

              <div className="gallery-image">
                <img
                  src={hotel.images[3]}
                  alt={`${hotel.name} amenities`}
                />
              </div>

              <div className="gallery-image last-image">

                <img
                  src={hotel.images[4]}
                  alt={`${hotel.name} hotel`}
                />

                <button
                  className="see-more-photos"
                  onClick={() => setGalleryOpen(true)}
                >
                  See all {hotelImages.length} photos
                </button>

              </div>

            </div>


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

              <h1>{hotel.name}</h1>

              <div className="hotel-rating">

                <div className="rating-score">
                  {hotel.rating}
                </div>

                <div className="rating-details">
                  <strong>{hotel.ratingLabel}</strong>

                  <span>
                    {hotel.reviewCount.toLocaleString()} reviews
                  </span>
                </div>

              </div>


              <div className="hotel-location">

                <MapPin size={19} />

                <span>{hotel.location}</span>

              </div>


              <p className="hotel-description">
                {hotel.description}
              </p>

            </div>


            <div className="hotel-highlights">

              <div className="highlight">
                <Star size={20} />
                <span>Comfortable stay</span>
              </div>

              <div className="highlight">
                <Star size={20} />
                <span>Near Los Angeles Airport</span>
              </div>

            </div>

          </div>

        </div>
      </section>


      <HotelGallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />

    </>
  );
}

export default HotelHero;