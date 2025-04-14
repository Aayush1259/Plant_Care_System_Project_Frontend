
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { identifyPlantWithGemini } from "@/utils/plantIdentificationUtils";

/**
 * Custom hook to manage the plant disease detection state and logic
 */
export const usePlantDisease = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [rawImageFile, setRawImageFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [rawResponse, setRawResponse] = useState("");
  const { toast } = useToast();

  const handleImageSelected = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setRawImageFile(file);
    setResult(null);
    setRawResponse("");
  };

  const handleSampleImageSelect = (image) => {
    setSelectedImage(image);
    setRawImageFile(null);
    setResult(null);
    setRawResponse("");
  };

  const analyzeDisease = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    
    try {
      const response = await identifyPlantWithGemini(
        selectedImage,
        rawImageFile,
        "disease"
      );
      
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

  return {
    selectedImage,
    rawImageFile,
    analyzing,
    result,
    rawResponse,
    handleImageSelected,
    handleSampleImageSelect,
    analyzeDisease,
    resetState
  };
};
