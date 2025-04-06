
import { useState } from "react";
import { X, Camera, Image, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const PlantId = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const galleryImages = [
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png"
  ];
  
  return (
    <div className="page-container animate-fade-in">
      <Header title="Plant ID" showClose onClose={() => {}} />
      
      {/* Main Camera View / Upload Area */}
      <div className="mt-4 bg-grey-100 rounded-lg flex items-center justify-center h-64 overflow-hidden">
        {selectedImage ? (
          <img src={selectedImage} alt="Selected plant" className="w-full h-full object-cover" />
        ) : (
          <Camera size={64} className="text-grey-400" />
        )}
      </div>
      
      {/* Photo Upload Options */}
      <div className="mt-6 text-center mb-6">
        <p className="text-sm text-grey-500">Or pick a photo from your gallery</p>
      </div>
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-4">
        {galleryImages.map((image, index) => (
          <div 
            key={index}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <img src={image} alt={`Gallery image ${index}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="fixed bottom-6 left-0 right-0 px-4">
        <Link to="/plants/new">
          <button className="btn-primary w-full">Continue</button>
        </Link>
      </div>
    </div>
  );
};

export default PlantId;
