
import { toast } from "@/components/ui/use-toast";
import { callGeminiAPI } from "./apiService";
import { prepareImageForProcessing } from "@/services/imageProcessingService";
import { createIdentificationPrompt, createDiseasePrompt } from "./promptGenerators";
import { processIdentificationResponse, processDiseaseResponse } from "./responseProcessors";

/**
 * Main function for identifying plants or analyzing plant diseases
 * 
 * @param selectedImage - Data URL or path to the image to analyze
 * @param rawImageFile - Optional raw File object of the image
 * @param analyzeType - Type of analysis to perform: "identification" or "disease"
 * @returns Processed and structured result with raw API response
 */
export const identifyPlantWithGemini = async (
  selectedImage: string,
  rawImageFile: File | null,
  analyzeType: "identification" | "disease"
) => {
  try {
    console.log(`Starting ${analyzeType} analysis...`);
    
    // Prepare the image
    const { base64Image, file } = await prepareImageForProcessing(selectedImage, rawImageFile);
    
    // Get prompt based on type of analysis
    const prompt = analyzeType === "identification" 
      ? createIdentificationPrompt() 
      : createDiseasePrompt();
    
    // Call Gemini API
    console.log(`Sending ${analyzeType} request to Gemini API...`);
    const responseText = await callGeminiAPI(base64Image, prompt, file.type);
    console.log(`Received ${analyzeType} response from Gemini API, processing...`);
    
    // Process the response based on the analysis type
    if (analyzeType === "identification") {
      return processIdentificationResponse(responseText);
    } else {
      return processDiseaseResponse(responseText);
    }
  } catch (error) {
    console.error(`Error in ${analyzeType}:`, error);
    
    // Show toast with error message
    toast({
      title: `${analyzeType === "identification" ? "Plant Identification" : "Disease Analysis"} Failed`,
      description: error instanceof Error ? error.message : `Failed to ${analyzeType === "identification" ? "identify plant" : "analyze disease"}. Please try again.`,
      variant: "destructive",
      duration: 5000,
    });
    
    throw new Error(`Failed to ${analyzeType === "identification" ? "identify plant" : "analyze disease"}. Please try again.`);
  }
};
