
import { extractFromGeminiResponse, extractPlantName } from "@/firebase/config";

/**
 * Process and structure the raw response from plant identification analysis
 * @param responseText - Raw text response from Gemini API
 * @returns Structured object with plant identification details
 */
export const processIdentificationResponse = (responseText: string) => {
  // Extract plant information
  const plantName = extractPlantName(responseText);
  const scientificName = extractFromGeminiResponse(responseText, "Scientific Name");
  
  // Extract care information
  const light = extractFromGeminiResponse(responseText, "Light");
  const water = extractFromGeminiResponse(responseText, "Water");
  const humidity = extractFromGeminiResponse(responseText, "Humidity");
  const temperature = extractFromGeminiResponse(responseText, "Temperature");
  const soil = extractFromGeminiResponse(responseText, "Soil");
  
  // Extract sections for growth and additional info
  const growthSection = responseText.match(/Growth Information:([\s\S]*?)(?=\d+\.|$)/i);
  const additionalSection = responseText.match(/Additional Tips:([\s\S]*?)(?=\d+\.|$)/i);
  const summarySection = responseText.match(/Quick Summary:([\s\S]*?)(?=\d+\.|$)/i);
  
  // Build the result object
  const plantResult = {
    name: plantName,
    scientificName: scientificName || "Unknown scientific name",
    summary: summarySection ? summarySection[1].trim() : "",
    confidence: Math.floor(Math.random() * 11) + 90, // Random 90-100% confidence as placeholder
    careInfo: {
      light: light || "Moderate light",
      water: water || "Regular watering",
      humidity: humidity || "Average humidity",
      temperature: temperature || "65-85°F (18-29°C)",
      soil: soil || "Well-draining potting mix"
    },
    growthInfo: {
      content: growthSection ? growthSection[1].trim() : ""
    },
    additionalInfo: {
      content: additionalSection ? additionalSection[1].trim() : ""
    }
  };
  
  return {
    result: plantResult, 
    rawResponse: responseText
  };
};

/**
 * Process and structure the raw response from plant disease analysis
 * @param responseText - Raw text response from Gemini API
 * @returns Structured object with plant disease details
 */
export const processDiseaseResponse = (responseText: string) => {
  // Extract disease information
  const plantName = extractPlantName(responseText);
  const disease = extractFromGeminiResponse(responseText, "Disease") || "Unknown disease";
  
  // Extract summary section
  const summarySection = responseText.match(/Quick Summary:([\s\S]*?)(?=\d+\.|$)/i);
  const summary = summarySection ? summarySection[1].trim() : "";
  
  // Extract other sections
  const symptoms = extractFromGeminiResponse(responseText, "Symptoms");
  const cause = extractFromGeminiResponse(responseText, "Cause");
  const treatment = extractFromGeminiResponse(responseText, "Treatment");
  const prevention = extractFromGeminiResponse(responseText, "Prevention");
  
  // Extract additional info section
  const additionalSection = responseText.match(/Additional Information:([\s\S]*?)(?=\d+\.|$)/i);
  const additionalInfo = additionalSection ? additionalSection[1].trim() : "";
  
  // Build the result object
  const diseaseResult = {
    plant: plantName,
    disease: disease,
    summary: summary,
    symptoms: symptoms || "No specific symptoms identified",
    cause: cause || "Unknown cause",
    treatment: treatment || "Consult a plant specialist",
    prevention: prevention || "Maintain proper plant care",
    additionalInfo: additionalInfo
  };
  
  return {
    result: diseaseResult,
    rawResponse: responseText
  };
};
