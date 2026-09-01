import { useState } from "react";
import {
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  Star,
} from "lucide-react";

import hotelData from "../../data/hotel";
import HotelGallery from "../HotelGallery/HotelGallery";
import hotelImages from "../../data/hotelImages";

import "./HotelHero.css";

function HotelHero({ hotel }) {

  const [galleryOpen, setGalleryOpen] = useState(false);

  const activeHotel = hotel ?? hotelData[0];

  return (
    <>
      <section className="hotel-hero">
        <div className="container">

          {/* Breadcrumb */}
         


          {/* Image Gallery */}
          <div className="hotel-gallery">

            <div className="gallery-main">
              <img
                src={activeHotel.images[0]}
                alt={activeHotel.name}
              />

              <button
                className="see-more-photos-mobile"
                onClick={() => setGalleryOpen(true)}
              >
                See all  photos
              </button>
            </div>


            <div className="gallery-side">

              <div className="gallery-image">
                <img
                  src={activeHotel.images[1]}
                  alt={`${activeHotel.name} exterior`}
                />
              </div>

              <div className="gallery-image">
                <img
                  src={activeHotel.images[2]}
                  alt={`${activeHotel.name} room`}
                />
              </div>

              <div className="gallery-image">
                <img
                  src={activeHotel.images[3]}
                  alt={`${activeHotel.name} amenities`}
                />
              </div>

              <div className="gallery-image last-image">

                <img
                  src={activeHotel.images[4]}
                  alt={`${activeHotel.name} hotel`}
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

              <h1>{activeHotel.name}</h1>

              <div className="hotel-rating">

                <div className="rating-score">
                  {activeHotel.rating}
                </div>

                <div className="rating-details">
                  <strong>{activeHotel.ratingLabel}</strong>

                  <span>
                    {activeHotel.reviewCount.toLocaleString()} reviews
                  </span>
                </div>

              </div>


              <div className="hotel-location">

                <MapPin size={19} />

                <span>{activeHotel.location}</span>

              </div>


              <p className="hotel-description">
                {activeHotel.description}
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