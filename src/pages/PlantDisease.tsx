
import { useState, useRef } from "react";
import { Camera, Image, RefreshCw, Download, Share2, BookMarked } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/BottomNavbar";
import { storage, db, auth } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { identifyPlantWithGemini } from "@/utils/plantIdentificationUtils";
import AnalyzingIndicator from "@/components/plant-identification/AnalyzingIndicator";

const PlantDisease = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rawImageFile, setRawImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [rawResponse, setRawResponse] = useState<string>("");
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
      setRawResponse("");
      
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
  
  const shareResults = async () => {
    if (!result) return;
    
    try {
      const shareData = {
        title: `Plant Disease: ${result.disease}`,
        text: `I identified a plant disease (${result.disease}) using Plant Care System! ${result.treatment}`,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared!",
          description: "Disease diagnosis results shared successfully.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Sharing Not Available",
          description: "Your browser doesn't support native sharing.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing Failed",
        description: "Unable to share results at this time.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  const downloadResults = () => {
    if (!result || !rawResponse) return;
    
    try {
      // Create text content
      const content = `
PLANT DISEASE DIAGNOSIS REPORT
==============================
Generated on: ${new Date().toLocaleString()}

DETECTED PLANT: ${result.plant || "Unknown"}
DISEASE: ${result.disease}

${rawResponse}
`;
      
      // Create download link
      const element = document.createElement("a");
      const file = new Blob([content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `PlantDisease_${result.disease.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Download Complete",
        description: "Plant disease report downloaded successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error downloading results:", error);
      toast({
        title: "Download Failed",
        description: "Unable to download results at this time.",
        variant: "destructive",
        duration: 3000,
      });
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
        plant: result.plant || "Unknown plant",
        disease: result.disease,
        summary: result.summary || "",
        symptoms: result.symptoms,
        cause: result.cause,
        treatment: result.treatment,
        prevention: result.prevention,
        additionalInfo: result.additionalInfo || "",
        rawAnalysis: rawResponse,
        image: downloadURL,
        dateAdded: serverTimestamp(),
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

  const analyzeDisease = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    
    try {
      const response = await identifyPlantWithGemini(
        selectedImage,
        rawImageFile,
        "disease"
      ) as { result: any, rawResponse: string };
      
      setResult(response.result);
      setRawResponse(response.rawResponse);
      setAnalyzing(false);
      
      toast({
        title: "Disease Detected",
        description: `We've identified: ${response.result.disease}`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error analyzing disease:", error);
      setAnalyzing(false);
      toast({
        title: "Error",
        description: typeof error === 'string' ? error : "Failed to analyze plant disease.",
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
      {analyzing ? (
        <AnalyzingIndicator type="disease" />
      ) : (
        <div className="mt-4 bg-grey-100 rounded-lg flex items-center justify-center h-64 overflow-hidden">
          {selectedImage ? (
            <img src={selectedImage} alt="Selected plant" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center">
              <Camera size={48} className="text-grey-400" />
              <p className="mt-2 text-grey-500">Upload a photo of the diseased plant</p>
            </div>
          )}
        </div>
      )}
      
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
          <div className="flex flex-col">
            {result.plant && result.plant !== "Unknown" && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Plant:</span>
                <span className="font-medium">{result.plant}</span>
              </div>
            )}
            <h3 className="font-semibold text-lg mt-2">Disease: {result.disease}</h3>
          </div>
          
          {result.summary && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <p className="text-sm">{result.summary}</p>
            </div>
          )}
          
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="symptoms">
              <AccordionTrigger className="text-md font-medium">Symptoms</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm whitespace-pre-line">{result.symptoms}</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cause">
              <AccordionTrigger className="text-md font-medium">Cause</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm whitespace-pre-line">{result.cause}</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="treatment">
              <AccordionTrigger className="text-md font-medium">Treatment</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm whitespace-pre-line">{result.treatment}</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="prevention">
              <AccordionTrigger className="text-md font-medium">Prevention</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm whitespace-pre-line">{result.prevention}</p>
              </AccordionContent>
            </AccordionItem>
            
            {result.additionalInfo && (
              <AccordionItem value="additional">
                <AccordionTrigger className="text-md font-medium">Additional Information</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm whitespace-pre-line">{result.additionalInfo}</p>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
          
          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button 
              className="w-full bg-plant-green" 
              onClick={saveDiagnosisHistory}
            >
              <BookMarked className="mr-2 h-4 w-4" />
              Save Diagnosis
            </Button>
            
            <Button
              className="w-full"
              variant="outline"
              onClick={shareResults}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            
            <Button
              className="w-full col-span-2"
              variant="secondary"
              onClick={downloadResults}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      )}
      
      {/* Sample Gallery for quick testing */}
      {!result && !analyzing && (
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
                  setRawResponse("");
                }}
              >
                <img src={image} alt={`Gallery image ${index}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Analyze Button */}
      {selectedImage && !result && !analyzing && (
        <Button 
          className="w-full bg-plant-green mt-4" 
          onClick={analyzeDisease}
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
            setRawResponse("");
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
