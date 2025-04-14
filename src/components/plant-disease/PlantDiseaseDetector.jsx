
import React from "react";
import ImageSelector from "@/components/shared/ImageSelector";
import AnalyzeButton from "@/components/plant-disease/AnalyzeButton";
import { usePlantDisease } from "@/hooks/usePlantDisease";
import { Button } from "@/components/ui/button";
import { saveToGarden, shareDiseaseResults, downloadDiseaseResults } from "@/utils/diseaseUtils";

const PlantDiseaseDetector = () => {
  const {
    selectedImage,
    analyzing,
    result,
    rawResponse,
    handleImageSelected,
    analyzeDisease,
    resetState
  } = usePlantDisease();

  const handleSaveToGarden = async () => {
    if (!selectedImage || !result) return;
    await saveToGarden(selectedImage, result, rawResponse);
  };

  const handleShareResults = async () => {
    if (!result) return;
    await shareDiseaseResults(result);
  };

  const handleDownloadResults = () => {
    if (!result || !rawResponse) return;
    downloadDiseaseResults(result, rawResponse);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Image Selection */}
      <ImageSelector
        selectedImage={selectedImage}
        onImageSelected={handleImageSelected}
        analyzing={analyzing}
        hasResult={!!result}
        placeholderText="Upload a photo to diagnose plant disease"
      />
      
      {/* Analysis Button */}
      {selectedImage && !result && !analyzing && (
        <AnalyzeButton onClick={analyzeDisease} disabled={analyzing} />
      )}
      
      {/* Analysis Results */}
      {result && (
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Analysis Results</h2>
          
          <div className="mb-4">
            <h3 className="font-medium">Disease: {result.disease}</h3>
            <p className="text-sm text-gray-600 mt-1">{result.description}</p>
          </div>
          
          {result.treatment && (
            <div className="mb-4">
              <h3 className="font-medium">Treatment:</h3>
              <p className="text-sm text-gray-600 mt-1">{result.treatment}</p>
            </div>
          )}
          
          {result.prevention && (
            <div className="mb-4">
              <h3 className="font-medium">Prevention:</h3>
              <p className="text-sm text-gray-600 mt-1">{result.prevention}</p>
            </div>
          )}
          
          <div className="flex flex-col space-y-2 mt-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSaveToGarden}
            >
              Save to My Garden
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleShareResults}
            >
              Share Results
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleDownloadResults}
            >
              Download Report
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={resetState}
            >
              Analyze Another Plant
            </Button>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {analyzing && (
        <div className="mt-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-plant-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your plant...</p>
          <p className="text-sm text-gray-500">This may take a few moments</p>
        </div>
      )}
    </div>
  );
};

export default PlantDiseaseDetector;
