
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/BottomNavbar";
import { createGeminiPrompt } from "@/firebase/config";

import ImageSelector from "@/components/plant-identification/ImageSelector";
import SampleGallery from "@/components/plant-identification/SampleGallery";
import IdentificationResults from "@/components/plant-identification/IdentificationResults";
import AnalyzingIndicator from "@/components/plant-identification/AnalyzingIndicator";
import ExperienceLevelSelector from "@/components/plant-identification/ExperienceLevelSelector";

import { identifyPlantWithGemini } from "@/utils/plantIdentificationUtils";
import { saveToMyGarden, shareResults, downloadResults, PlantResult } from "@/services/plantIdentificationService";

const PlantId = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rawImageFile, setRawImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<PlantResult | null>(null);
  const [rawResponse, setRawResponse] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "hobbyist" | "expert">("hobbyist");
  const { toast } = useToast();
  
  const galleryImages = [
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png"
  ];
  
  const handleFileChange = (file: File) => {
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
  };

  const handleSampleImageSelection = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setRawImageFile(null);
    setResult(null);
    setRawResponse("");
  };

  const identifyPlant = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    
    try {
      const response = await identifyPlantWithGemini(
        selectedImage,
        rawImageFile,
        experienceLevel,
        createGeminiPrompt
      ) as { result: PlantResult, rawResponse: string };
      
      setResult(response.result);
      setRawResponse(response.rawResponse);
      setAnalyzing(false);
      
      toast({
        title: "Plant Identified!",
        description: `We found a match: ${response.result.name}`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error identifying plant:", error);
      setAnalyzing(false);
      toast({
        title: "Error",
        description: typeof error === 'string' ? error : "Failed to identify plant.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSaveToGarden = async () => {
    if (!selectedImage || !result) return;
    await saveToMyGarden(selectedImage, result, rawResponse, experienceLevel);
  };

  const handleShareResults = async () => {
    if (!result) return;
    await shareResults(result);
  };

  const handleDownloadResults = () => {
    if (!result || !rawResponse) return;
    downloadResults(result, rawResponse);
  };

  const resetIdentification = () => {
    setSelectedImage(null);
    setRawImageFile(null);
    setResult(null);
    setRawResponse("");
  };
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <Header title="Plant Identification" showBack />
      
      {/* Experience Level Selector */}
      {!analyzing && !result && (
        <ExperienceLevelSelector 
          experienceLevel={experienceLevel}
          onExperienceLevelChange={setExperienceLevel}
        />
      )}
      
      {/* Main Camera View / Upload Area or Analyzing state */}
      {analyzing ? (
        <AnalyzingIndicator />
      ) : (
        <ImageSelector
          selectedImage={selectedImage}
          onImageSelected={handleFileChange}
          analyzing={analyzing}
          hasResult={!!result}
        />
      )}
      
      {/* Results Section */}
      {result && (
        <IdentificationResults 
          result={result}
          onSaveToGarden={handleSaveToGarden}
          onShareResults={handleShareResults}
          onDownloadResults={handleDownloadResults}
          onIdentifyAnother={resetIdentification}
        />
      )}
      
      {/* Sample Gallery for quick testing */}
      {!result && !analyzing && (
        <SampleGallery 
          galleryImages={galleryImages}
          onImageSelected={handleSampleImageSelection}
        />
      )}
      
      {/* Identify Button */}
      {selectedImage && !result && !analyzing && (
        <Button 
          className="w-full bg-plant-green mt-4" 
          onClick={identifyPlant}
          disabled={analyzing}
        >
          Identify Plant
        </Button>
      )}
      
      <BottomNavbar />
    </div>
  );
};

export default PlantId;
