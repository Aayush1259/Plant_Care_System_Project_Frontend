
import React from "react";

const DiseaseSampleGallery = ({ 
  images, 
  onSelectImage 
}) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-6 mb-4">
      <p className="text-sm text-grey-500 mb-2">Or pick a sample image:</p>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div 
            key={index}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={() => onSelectImage(image)}
          >
            <img src={image} alt={`Gallery image ${index}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseaseSampleGallery;
