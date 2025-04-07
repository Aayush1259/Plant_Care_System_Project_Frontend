
import { useState, useRef } from "react";
import { Camera, Image, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/BottomNavbar";
import { storage, db, auth } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

const PlantDisease = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const galleryImages = [
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png"
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setResult(null);
      
      toast({
        title: "Image Selected",
        description: "Your plant image has been successfully selected.",
        duration: 3000,
      });
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

  const saveDiagnosisHistory = async () => {
    if (!selectedImage || !result) return;
    
    try {
      // Check if user is logged in
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save diagnosis history.",
          duration: 5000,
        });
        return;
      }
      
      // Convert data URL to blob for Firebase Storage
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      
      // Create a reference to Firebase Storage
      const storageRef = ref(storage, `diseases/${currentUser.uid}/${Date.now()}`);
      
      // Upload the image
      await uploadBytes(storageRef, blob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Save diagnosis data to Firestore
      const diagnosisData = {
        userId: currentUser.uid,
        disease: result.disease,
        cause: result.cause,
        symptoms: result.symptoms,
        treatment: result.treatment,
        prevention: result.prevention,
        image: downloadURL,
        dateAdded: new Date(),
      };
      
      await addDoc(collection(db, "diseaseHistory"), diagnosisData);
      
      toast({
        title: "Diagnosis Saved!",
        description: "Plant disease diagnosis has been saved to your history.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      toast({
        title: "Error",
        description: "Failed to save diagnosis to your history.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

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
      
      toast({
        title: "Disease Detected",
        description: "We've identified the plant disease.",
        duration: 3000,
      });
    }, 2000);
  };
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <Header title="Plant Disease Detection" showBack />
      
      {/* Hidden input for file selection */}
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
      
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
      
      {/* Camera and Gallery Buttons */}
      {!analyzing && !result && (
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
          
          {/* Save Diagnosis Button */}
          <Button 
            className="w-full bg-plant-green mt-4" 
            onClick={saveDiagnosisHistory}
          >
            Save Diagnosis
          </Button>
        </div>
      )}
      
      {/* Sample Gallery for quick testing */}
      <div className="mt-6 mb-4">
        <p className="text-sm text-grey-500 mb-2">Or pick a sample image:</p>
        <div className="grid grid-cols-4 gap-2">
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
      </div>
      
      {/* Analyze Button */}
      {selectedImage && !result && !analyzing && (
        <Button 
          className="w-full bg-plant-green mt-4" 
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
