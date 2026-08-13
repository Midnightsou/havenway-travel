import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
} from "lucide-react";

import "./RoomGallery.css";


function RoomGallery({ images, roomName }) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [lightboxOpen, setLightboxOpen] =
    useState(false);


  const nextImage = () => {
    setActiveIndex((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };


  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };


  useEffect(() => {

    const handleKeyDown = (event) => {

      if (!lightboxOpen) return;

      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

    };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [lightboxOpen, images.length]);


  return (
    <>
      <div className="room-gallery">

        {/* MAIN IMAGE */}

        <div className="room-gallery-main">

          <img
            src={images[activeIndex]}
            alt={`${roomName} ${activeIndex + 1}`}
          />


          <button
            className="
              room-gallery-arrow
              room-gallery-prev
            "
            onClick={previousImage}
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>


          <button
            className="
              room-gallery-arrow
              room-gallery-next
            "
            onClick={nextImage}
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>


          <button
            className="room-gallery-expand"
            onClick={() =>
              setLightboxOpen(true)
            }
            aria-label="View full screen"
          >
            <Maximize2 size={18} />
          </button>


          <span className="room-gallery-counter">
            {activeIndex + 1} / {images.length}
          </span>

        </div>


        {/* THUMBNAILS */}

        <div className="room-gallery-thumbnails">

          {images.map((image, index) => (

            <button
              key={image}
              className={
                index === activeIndex
                  ? "room-thumbnail active"
                  : "room-thumbnail"
              }
              onClick={() =>
                setActiveIndex(index)
              }
            >

              <img
                src={image}
                alt={`${roomName} thumbnail ${index + 1}`}
              />

            </button>

          ))}

        </div>

      </div>


      {/* LIGHTBOX */}

      {lightboxOpen && (

        <div className="room-lightbox">

          <button
            className="lightbox-close"
            onClick={() =>
              setLightboxOpen(false)
            }
            aria-label="Close gallery"
          >
            <X size={28} />
          </button>


          <button
            className="
              lightbox-arrow
              lightbox-prev
            "
            onClick={previousImage}
            aria-label="Previous photo"
          >
            <ChevronLeft size={32} />
          </button>


          <img
            src={images[activeIndex]}
            alt={`${roomName} full view`}
            className="lightbox-image"
          />


          <button
            className="
              lightbox-arrow
              lightbox-next
            "
            onClick={nextImage}
            aria-label="Next photo"
          >
            <ChevronRight size={32} />
          </button>


          <div className="lightbox-counter">
            {activeIndex + 1} / {images.length}
          </div>

        </div>

      )}

    </>
  );
}


export default RoomGallery;