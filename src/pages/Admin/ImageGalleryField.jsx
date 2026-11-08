import { useRef, useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { API_BASE_URL } from "../../utils/api";

const MAX_IMAGE_SIZE = 7 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export default function ImageGalleryField({ images = [], onChange, headers, label = "Photos" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const galleryImages = Array.isArray(images)
    ? images
    : typeof images === "string"
      ? images.split(",").map((image) => image.trim()).filter(Boolean)
      : [];

  const uploadFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    setUploading(true);
    setError("");

    try {
      const newImages = [];
      for (const file of files) {
        if (!allowedTypes.has(file.type)) {
          throw new Error(`${file.name}: choose a JPG, PNG, WebP, or GIF image.`);
        }
        if (file.size > MAX_IMAGE_SIZE) {
          throw new Error(`${file.name}: images must be 7 MB or smaller.`);
        }

        const dataUrl = await readAsDataUrl(file);
        const response = await fetch(`${API_BASE_URL}/api/admin/images`, {
          method: "POST",
          headers,
          body: JSON.stringify({ fileName: file.name, dataUrl }),
        });
        const result = await response.json();
        if (!response.ok || !result.success || !result.url) {
          throw new Error(result.error || `Could not upload ${file.name}.`);
        }
        newImages.push(result.url);
        onChange([...galleryImages, ...newImages]);
      }
    } catch (uploadError) {
      setError(uploadError.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    onChange(galleryImages.filter((_, imageIndex) => imageIndex !== index));
  };

  const makeCover = (index) => {
    onChange([galleryImages[index], ...galleryImages.filter((_, imageIndex) => imageIndex !== index)]);
  };

  return (
    <div className="admin-image-field">
      <div className="admin-image-field-heading">
        <div>
          <strong>{label}</strong>
          <span>First image is used as the cover photo.</span>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <ImagePlus size={16} />
          {uploading ? "Uploading…" : "Choose photos"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={uploadFiles}
          hidden
        />
      </div>

      {error && <p className="admin-catalog-error" role="alert">{error}</p>}

      {galleryImages.length > 0 ? (
        <div className="admin-image-grid">
          {galleryImages.map((image, index) => (
            <figure className="admin-image-item" key={`${image}-${index}`}>
              <img src={image} alt={`${label} ${index + 1}`} />
              {index === 0 && <span className="admin-image-cover">Cover</span>}
              <figcaption>
                {index !== 0 && (
                  <button type="button" disabled={uploading} onClick={() => makeCover(index)} aria-label="Set as cover photo">
                    <Star size={15} /> Cover
                  </button>
                )}
                <button type="button" disabled={uploading} onClick={() => removeImage(index)} aria-label="Remove photo">
                  <Trash2 size={15} /> Remove
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <button
          type="button"
          className="admin-image-empty"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <ImagePlus size={24} />
          <span>{uploading ? "Uploading photos…" : "Choose photos from this device"}</span>
        </button>
      )}
    </div>
  );
}
