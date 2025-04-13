
import React from "react";
import { useToast } from "@/hooks/use-toast";
import AnalyzingIndicator from "@/components/plant-identification/AnalyzingIndicator";
import DiseaseResults from "./DiseaseResults";
import DiseaseSampleGallery from "./DiseaseSampleGallery";
import ImageSelector from "@/components/shared/ImageSelector";
import AnalyzeButton from "./AnalyzeButton";

import { usePlantDisease } from "@/hooks/usePlantDisease";
import { saveDiagnosisHistory, shareResults, downloadResults } from "@/utils/diseaseUtils";

const PlantDiseaseDetector: React.FC = () => {
  const { toast } = useToast();
  const {
    selectedImage,
    rawImageFile,
    analyzing,
    result,
    rawResponse,
    handleImageSelected,
    handleSampleImageSelect,
    analyzeDisease,
    resetState
  } = usePlantDisease();
  
  const galleryImages = [
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png"
  ];

  const handleSaveDiagnosis = () => {
    if (selectedImage && result) {
      saveDiagnosisHistory(selectedImage, result, rawResponse, toast);
    }
  };

  const handleShareResults = () => {
    if (result) {
      shareResults(result, toast);
    }
  };

  const handleDownloadResults = () => {
    if (result && rawResponse) {
      downloadResults(result, rawResponse, toast);
    }
  };
  
  return (
    <div>
      {analyzing ? (
        <AnalyzingIndicator type="disease" />
      ) : (
        <ImageSelector
          selectedImage={selectedImage}
          onImageSelected={handleImageSelected}
          analyzing={analyzing}
          hasResult={!!result}
          showToastOnSelection={true}
          placeholderText="Upload a photo to diagnose"
        />
      )}
      
      {result && (
        <DiseaseResults
          result={result}
          onSaveDiagnosis={handleSaveDiagnosis}
          onShareResults={handleShareResults}
          onDownloadResults={handleDownloadResults}
          onAnalyzeAnother={resetState}
        />
      )}
      
      {!result && !analyzing && (
        <DiseaseSampleGallery 
          images={galleryImages} 
          onSelectImage={handleSampleImageSelect} 
        />
      )}
      
      {selectedImage && !result && !analyzing && (
        <AnalyzeButton 
          onClick={analyzeDisease}
          disabled={analyzing}
        />
      )}
    </div>
  );
};

export default PlantDiseaseDetector;
