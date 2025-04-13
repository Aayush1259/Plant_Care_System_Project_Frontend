
import React, { useRef } from "react";
import { Camera, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageSelectorProps {
  selectedImage: string | null;
  onImageSelected: (file: File) => void;
  analyzing: boolean;
  hasResult: boolean;
  showToastOnSelection?: boolean;
  title?: string;
  placeholderText?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  selectedImage,
  onImageSelected,
  analyzing,
  hasResult,
  showToastOnSelection = false,
  title,
  placeholderText = "Upload a photo to identify",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
      
      if (showToastOnSelection) {
        toast({
          title: "Image Selected",
          description: "Your plant image has been successfully selected.",
          duration: 3000,
        });
      }
    }
  };

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.capture = "environment";
      fileInputRef.current.click();
    }
  };

  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
      
      {/* Image upload area with optional title */}
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      
      {/* Main Camera View / Upload Area */}
      <div className="mt-4 bg-grey-100 rounded-lg flex items-center justify-center h-64 overflow-hidden">
        {selectedImage ? (
          <img src={selectedImage} alt="Selected plant" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center">
            <Camera size={48} className="text-grey-400" />
            <p className="mt-2 text-grey-500">{placeholderText}</p>
          </div>
        )}
      </div>
      
      {/* Camera and Gallery Buttons */}
      {!analyzing && !hasResult && (
        <div className="mt-4 flex gap-4">
          <Button 
            className="flex-1 bg-plant-green" 
            onClick={openCamera}
          >
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </Button>
          <Button 
            className="flex-1" 
            variant="outline"
            onClick={openGallery}
          >
            <Image className="mr-2 h-4 w-4" />
            Choose from Gallery
          </Button>
        </div>
      )}
    </>
  );
};

export default ImageSelector;
