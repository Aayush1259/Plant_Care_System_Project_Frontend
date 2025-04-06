
import { useState } from "react";
import { Camera, Image, ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/BottomNavbar";

const PlantDisease = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  
  const galleryImages = [
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png"
  ];

  const analyzeImage = () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    
    // Simulate API call to Gemini API
    setTimeout(() => {
      setResult({
        disease: "Leaf Spot",
        cause: "Fungal infection",
        symptoms: "Brown or black spots on leaves, yellowing around spots",
        treatment: "Remove affected leaves, apply fungicide, ensure good air circulation",
        prevention: "Avoid overhead watering, space plants adequately, use disease-resistant varieties"
      });
      setAnalyzing(false);
    }, 2000);
  };
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <Header title="Plant Disease Detection" showBack />
      
      {/* Main Upload Area */}
      <div className="mt-4 bg-grey-100 rounded-lg flex items-center justify-center h-64 overflow-hidden">
        {analyzing ? (
          <div className="flex flex-col items-center">
            <RefreshCw size={48} className="text-grey-400 animate-spin" />
            <p className="mt-2 text-grey-500">Analyzing plant disease...</p>
          </div>
        ) : selectedImage ? (
          <img src={selectedImage} alt="Selected plant" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center">
            <Camera size={48} className="text-grey-400" />
            <p className="mt-2 text-grey-500">Upload a photo of the diseased plant</p>
          </div>
        )}
      </div>
      
      {/* Results Section */}
      {result && (
        <div className="mt-6 bg-secondary p-4 rounded-lg">
          <h3 className="font-semibold text-lg">Detected: {result.disease}</h3>
          
          <div className="mt-3">
            <p className="font-medium">Cause:</p>
            <p className="text-sm text-grey-500">{result.cause}</p>
          </div>
          
          <div className="mt-3">
            <p className="font-medium">Symptoms:</p>
            <p className="text-sm text-grey-500">{result.symptoms}</p>
          </div>
          
          <div className="mt-3">
            <p className="font-medium">Treatment:</p>
            <p className="text-sm text-grey-500">{result.treatment}</p>
          </div>
          
          <div className="mt-3">
            <p className="font-medium">Prevention:</p>
            <p className="text-sm text-grey-500">{result.prevention}</p>
          </div>
        </div>
      )}
      
      {/* Photo Upload Options */}
      <div className="mt-6 text-center mb-4">
        <p className="text-sm text-grey-500">Or pick a photo from your gallery</p>
      </div>
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {galleryImages.map((image, index) => (
          <div 
            key={index}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={() => {
              setSelectedImage(image);
              setResult(null);
            }}
          >
            <img src={image} alt={`Gallery image ${index}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      
      {/* Analyze Button */}
      {selectedImage && !result && !analyzing && (
        <Button 
          className="w-full bg-plant-green" 
          onClick={analyzeImage}
          disabled={analyzing}
        >
          Analyze Disease
        </Button>
      )}

      {/* Try Another Button */}
      {result && (
        <Button 
          className="w-full mt-4" 
          variant="outline" 
          onClick={() => {
            setSelectedImage(null);
            setResult(null);
          }}
        >
          Analyze Another Plant
        </Button>
      )}
      
      <BottomNavbar />
    </div>
  );
};

export default PlantDisease;
