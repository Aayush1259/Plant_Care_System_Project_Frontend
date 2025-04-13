
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AnalyzingIndicator from "@/components/plant-identification/AnalyzingIndicator";
import DiseaseResults from "./DiseaseResults";
import DiseaseSampleGallery from "./DiseaseSampleGallery";
import ImageUploader from "./ImageUploader";
import ActionButtons from "./ActionButtons";
import { identifyPlantWithGemini } from "@/utils/plantIdentificationUtils";
import { storage, db, auth } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const PlantDiseaseDetector: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rawImageFile, setRawImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [rawResponse, setRawResponse] = useState<string>("");
  const { toast } = useToast();
  
  const galleryImages = [
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png"
  ];

  const handleImageSelected = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setRawImageFile(file);
    setResult(null);
    setRawResponse("");
  };

  const handleSampleImageSelect = (image: string) => {
    setSelectedImage(image);
    setRawImageFile(null);
    setResult(null);
    setRawResponse("");
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

  const resetState = () => {
    setSelectedImage(null);
    setRawImageFile(null);
    setResult(null);
    setRawResponse("");
  };
  
  return (
    <div>
      {/* Analyzing Indicator or Image Uploader */}
      {analyzing ? (
        <AnalyzingIndicator type="disease" />
      ) : (
        <ImageUploader
          selectedImage={selectedImage}
          onImageSelected={handleImageSelected}
          analyzing={analyzing}
          hasResult={!!result}
        />
      )}
      
      {/* Results Section */}
      {result && (
        <DiseaseResults
          result={result}
          onSaveDiagnosis={saveDiagnosisHistory}
          onShareResults={shareResults}
          onDownloadResults={downloadResults}
          onAnalyzeAnother={resetState}
        />
      )}
      
      {/* Sample Gallery for quick testing */}
      {!result && !analyzing && (
        <DiseaseSampleGallery 
          images={galleryImages} 
          onSelectImage={handleSampleImageSelect} 
        />
      )}
      
      {/* Analyze Button */}
      <ActionButtons
        selectedImage={selectedImage}
        result={result}
        analyzing={analyzing}
        onAnalyze={analyzeDisease}
        onReset={resetState}
      />
    </div>
  );
};

export default PlantDiseaseDetector;
