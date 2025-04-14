
import React, { useRef } from "react";
import { Camera, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ImageSelector = ({
  selectedImage,
  onImageSelected,
  analyzing,
  hasResult,
  showToastOnSelection = false,
  title,
  placeholderText = "Upload a photo to identify",
}) => {
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
      
      if (showToastOnSelection) {
        toast({
          title: "Image Selected",
          description: "Your image has been selected for analysis.",
          duration: 3000,
        });
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-2">
      {title && <h3 className="font-medium mb-2">{title}</h3>}
      
      {selectedImage && !hasResult ? (
        <div className="relative overflow-hidden rounded-lg">
          <img 
            src={selectedImage} 
            alt="Selected plant" 
            className="w-full h-64 object-cover rounded-lg"
          />
          
          {!analyzing && (
            <div className="absolute bottom-2 right-2">
              <Button 
                className="bg-plant-green h-9 w-9 p-0 rounded-full"
                onClick={handleButtonClick}
              >
                <Camera size={18} />
              </Button>
            </div>
          )}
        </div>
      ) : !hasResult && (
        <div 
          className="border-2 border-dashed border-grey-300 rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center text-grey-500">
            <Image size={48} className="mb-2 text-grey-400" />
            <p>{placeholderText}</p>
            <Button variant="outline" className="mt-4" onClick={handleButtonClick}>
              <Camera size={16} className="mr-2" />
              Take or upload photo
            </Button>
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        capture="environment"
      />
    </div>
  );
};

export default ImageSelector;
