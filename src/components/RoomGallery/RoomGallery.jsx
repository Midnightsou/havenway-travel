import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import "./RoomGallery.css";

function RoomGallery({ images, roomName }) {
  const galleryImages = Array.isArray(images) && images.length
    ? images
    : ["/images/hotel/room 1.jpg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [roomName, images]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % galleryImages.length);
  }, [galleryImages.length]);
  const showPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, showNext, showPrevious]);

  return (
    <>
      <div className="room-gallery">
        <div className="room-gallery-main">
          <img src={galleryImages[activeIndex]} alt={`${roomName} ${activeIndex + 1}`} />
          {galleryImages.length > 1 && (
            <>
              <button className="room-gallery-arrow room-gallery-prev" onClick={showPrevious} aria-label="Previous photo">
                <ChevronLeft size={24} />
              </button>
              <button className="room-gallery-arrow room-gallery-next" onClick={showNext} aria-label="Next photo">
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <button className="room-gallery-expand" onClick={() => setLightboxOpen(true)} aria-label="View full screen">
            <Maximize2 size={18} />
          </button>
          <span className="room-gallery-counter">{activeIndex + 1} / {galleryImages.length}</span>
        </div>
        {galleryImages.length > 1 && (
          <div className="room-gallery-thumbnails">
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={index === activeIndex ? "room-thumbnail active" : "room-thumbnail"}
                onClick={() => setActiveIndex(index)}
                aria-label={`View ${roomName} photo ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="room-lightbox">
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close gallery">
            <X size={28} />
          </button>
          {galleryImages.length > 1 && (
            <button className="lightbox-arrow lightbox-prev" onClick={showPrevious} aria-label="Previous photo">
              <ChevronLeft size={32} />
            </button>
          )}
          <img src={galleryImages[activeIndex]} alt={`${roomName} full view`} className="lightbox-image" />
          {galleryImages.length > 1 && (
            <button className="lightbox-arrow lightbox-next" onClick={showNext} aria-label="Next photo">
              <ChevronRight size={32} />
            </button>
          )}
          <div className="lightbox-counter">{activeIndex + 1} / {galleryImages.length}</div>
        </div>
      )}
    </>
  );
}

export default RoomGallery;
