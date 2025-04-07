
import { useState, useRef } from "react";
import { Camera, Image, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/BottomNavbar";
import { storage, db, auth, GEMINI_API_KEY } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

const PlantDisease = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rawImageFile, setRawImageFile] = useState<File | null>(null);
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
      setRawImageFile(file);
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

  // Function to convert base64 to file
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    
    try {
      // Prepare image data for Gemini API
      let imageBlob: Blob;
      let file: File;
      
      if (rawImageFile) {
        imageBlob = await rawImageFile.slice(0, rawImageFile.size, rawImageFile.type);
        file = new File([imageBlob], rawImageFile.name, { type: rawImageFile.type });
      } else {
        imageBlob = dataURItoBlob(selectedImage);
        file = new File([imageBlob], "plant_disease.jpg", { type: 'image/jpeg' });
      }

      // Convert image to base64
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (!e.target?.result) {
          setAnalyzing(false);
          toast({
            title: "Error",
            description: "Failed to process image.",
            variant: "destructive",
            duration: 3000,
          });
          return;
        }
        
        const base64Image = e.target.result.toString().split(',')[1];
        
        try {
          // Call Gemini API
          const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [
                  {
                    text: "Analyze this plant image and identify any diseases or problems. Provide details in the following format:\n\n" +
                          "1. Disease: [name of disease or problem]\n" +
                          "2. Cause: [what causes this disease]\n" +
                          "3. Symptoms: [visible symptoms]\n" +
                          "4. Treatment: [how to treat this disease]\n" +
                          "5. Prevention: [how to prevent this disease]\n" +
                          "Please provide this information in a structured format with these exact headings."
                  },
                  {
                    inlineData: {
                      mimeType: file.type,
                      data: base64Image
                    }
                  }
                ]
              }]
            })
          });
          
          const data = await response.json();
          
          if (data.error) {
            console.error("Gemini API error:", data.error);
            setAnalyzing(false);
            toast({
              title: "Error",
              description: "Failed to analyze plant disease. Please try again.",
              variant: "destructive",
              duration: 3000,
            });
            return;
          }
          
          // Parse the response text
          const responseText = data.candidates[0]?.content?.parts[0]?.text || "";
          
          // Extract information using regex patterns
          const diseaseMatch = responseText.match(/Disease:\s*(.*?)(?:\n|$)/);
          const causeMatch = responseText.match(/Cause:\s*(.*?)(?:\n|$)/);
          const symptomsMatch = responseText.match(/Symptoms:\s*(.*?)(?:\n|$)/);
          const treatmentMatch = responseText.match(/Treatment:\s*(.*?)(?:\n|$)/);
          const preventionMatch = responseText.match(/Prevention:\s*(.*?)(?:\n|$)/);
          
          // Store the results
          const diseaseResult = {
            disease: diseaseMatch ? diseaseMatch[1].trim() : "Unknown Disease",
            cause: causeMatch ? causeMatch[1].trim() : "Unknown cause",
            symptoms: symptomsMatch ? symptomsMatch[1].trim() : "No specific symptoms identified",
            treatment: treatmentMatch ? treatmentMatch[1].trim() : "Consult a plant specialist",
            prevention: preventionMatch ? preventionMatch[1].trim() : "Maintain proper plant care"
          };
          
          setResult(diseaseResult);
          setAnalyzing(false);
          
          toast({
            title: "Disease Detected",
            description: "We've identified the plant disease.",
            duration: 3000,
          });
          
        } catch (error) {
          console.error("Error calling Gemini API:", error);
          setAnalyzing(false);
          toast({
            title: "Error",
            description: "Failed to analyze plant disease. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      };
      
      reader.onerror = () => {
        setAnalyzing(false);
        toast({
          title: "Error",
          description: "Failed to process image.",
          variant: "destructive",
          duration: 3000,
        });
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error("Error processing image:", error);
      setAnalyzing(false);
      toast({
        title: "Error",
        description: "Failed to process image.",
        variant: "destructive",
        duration: 3000,
      });
    }
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
                setRawImageFile(null);
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
            setRawImageFile(null);
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
