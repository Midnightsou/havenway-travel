import { useEffect, useState } from "react";
import { X, Images } from "lucide-react";

import hotelImages from "../../data/hotelImages";
import PhotoViewer from "../PhotoViewer/PhotoViewer";

import "./HotelGallery.css";


function HotelGallery({
  isOpen,
  onClose,
}) {

  const [activeCategory, setActiveCategory] =
    useState("All photos");

  const [activeImageIndex, setActiveImageIndex] =
    useState(null);


  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);


  useEffect(() => {
    if (!isOpen) {
      setActiveImageIndex(null);
      setActiveCategory("All photos");
    }
  }, [isOpen]);


  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setActiveImageIndex(null);
  };


  const handleCloseGallery = () => {
    setActiveImageIndex(null);
    onClose();
  };


  if (!isOpen) return null;


  const categories = [
    "All photos",
    ...new Set(
      hotelImages.map(
        (photo) => photo.category
      )
    ),
  ];


  const filteredImages =
    activeCategory === "All photos"
      ? hotelImages
      : hotelImages.filter(
          (photo) =>
            photo.category === activeCategory
        );


  const handleNextImage = () => {

    setActiveImageIndex((current) =>
      current === filteredImages.length - 1
        ? 0
        : current + 1
    );

  };


  const handlePreviousImage = () => {

    setActiveImageIndex((current) =>
      current === 0
        ? filteredImages.length - 1
        : current - 1
    );

  };


  return (
    <div className="hotel-gallery-overlay">

      <div className="hotel-gallery-modal">

        {/* HEADER */}

        <div className="hotel-gallery-header">

          <div className="hotel-gallery-title">

            <Images size={24} />

            <div>

              <h2>
                {activeCategory === "All photos"
                  ? `All ${hotelImages.length} photos`
                  : activeCategory}
              </h2>

              <span>
                Explore all available room photos
              </span>

            </div>

          </div>


          <button
            className="hotel-gallery-close"
            onClick={handleCloseGallery}
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>

        </div>


        {/* FILTERS */}

        <div className="hotel-gallery-filters">

          {categories.map((category) => (

            <button
              key={category}
              className={
                activeCategory === category
                  ? "gallery-filter active"
                  : "gallery-filter"
              }
              onClick={() =>
                handleCategoryChange(category)
              }
            >

              {category}

            </button>

          ))}

        </div>


        {/* PHOTO GRID */}

        <div className="hotel-gallery-grid">

          {filteredImages.map(
            (photo, index) => (

              <button
                key={photo.id}
                className="hotel-gallery-photo"
                type="button"
                onClick={() =>
                  setActiveImageIndex(index)
                }
              >

                <img
                  src={photo.image}
                  alt={photo.alt}
                />


                <div className="hotel-gallery-photo-info">

                  <span>
                    {photo.category}
                  </span>

                  
                </div>

              </button>

            )
          )}

        </div>


        {activeImageIndex !== null && (

          <PhotoViewer
            images={filteredImages}
            activeIndex={activeImageIndex}

            onClose={() =>
              setActiveImageIndex(null)
            }

            onPrevious={handlePreviousImage}

            onNext={handleNextImage}
          />

        )}

      </div>

    </div>
  );
}


export default HotelGallery;