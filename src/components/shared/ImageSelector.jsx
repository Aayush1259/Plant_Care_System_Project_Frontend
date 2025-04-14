
import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImageSelector = ({
  selectedImage,
  onImageSelected,
  analyzing = false,
  hasResult = false,
  showToastOnSelection = true,
  placeholderText = "Upload an image to analyze"
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleClearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelected(null);
  };

  return (
    <div className="relative mt-4 mb-6">
      {selectedImage ? (
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={selectedImage} 
            alt="Selected plant" 
            className="w-full h-64 object-cover rounded-lg"
          />
          {!hasResult && (
            <button 
              onClick={handleClearImage}
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1"
              disabled={analyzing}
            >
              <X className="h-5 w-5 text-black" />
            </button>
          )}
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          onClick={handleClick}
        >
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">{placeholderText}</p>
          <Button variant="outline" className="mt-4" onClick={handleClick}>
            Select Image
          </Button>
        </div>
      )}
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={analyzing}
      />
    </div>
  );
};

export default ImageSelector;
