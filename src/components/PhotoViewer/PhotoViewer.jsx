import { useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./PhotoViewer.css";


function PhotoViewer({
  images,
  activeIndex,
  onClose,
  onPrevious,
  onNext,
}) {

  useEffect(() => {

    const handleKeyDown = (event) => {

      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        onPrevious();
      }

      if (event.key === "ArrowRight") {
        onNext();
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

  }, [
    onClose,
    onPrevious,
    onNext,
  ]);


  if (
    activeIndex === null ||
    !images.length
  ) {
    return null;
  }


  const activeImage =
    images[activeIndex];


  return (
    <div
      className="photo-viewer-overlay"
      onClick={onClose}
    >

      <div
        className="photo-viewer"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* CLOSE */}

        <button
          className="photo-viewer-close"
          onClick={onClose}
          aria-label="Close photo viewer"
        >
          <X size={28} />
        </button>


        {/* PREVIOUS */}

        <button
          className="
            photo-viewer-arrow
            photo-viewer-prev
          "
          onClick={onPrevious}
          aria-label="Previous photo"
        >
          <ChevronLeft size={32} />
        </button>


        {/* IMAGE */}

        <img
          src={activeImage.image}
          alt={activeImage.alt}
          className="photo-viewer-image"
        />


        {/* NEXT */}

        <button
          className="
            photo-viewer-arrow
            photo-viewer-next
          "
          onClick={onNext}
          aria-label="Next photo"
        >
          <ChevronRight size={32} />
        </button>


        {/* IMAGE INFO */}

        <div className="photo-viewer-info">

          <span>
            {activeImage.category}
          </span>

          <strong>
            {activeImage.alt}
          </strong>

        </div>


        {/* COUNTER */}

        <div className="photo-viewer-counter">

          {activeIndex + 1} / {images.length}

        </div>

      </div>

    </div>
  );
}


export default PhotoViewer;