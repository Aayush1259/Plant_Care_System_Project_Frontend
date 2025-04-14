
import { callGeminiAPI } from "./apiService";
import { createIdentificationPrompt, createDiseasePrompt } from "./promptGenerators";
import { prepareImageForProcessing } from "@/services/imageProcessingService";

/**
 * Identifies a plant using the Gemini API
 * @param imageUrl The image URL to analyze
 * @param rawImageFile Optional raw image file
 * @param type The type of identification to perform: "identification" or "disease"
 */
export const identifyPlantWithGemini = async (imageUrl, rawImageFile, type = "identification") => {
  try {
    console.log(`Starting plant ${type} analysis...`);
    
    // Process the image for API submission
    const { base64Image, file } = await prepareImageForProcessing(imageUrl, rawImageFile);
    
    // Generate the appropriate prompt based on analysis type
    const prompt = type === "identification" 
      ? createIdentificationPrompt() 
      : createDiseasePrompt();
    
    console.log(`Sending ${type} analysis request to Gemini API...`);
    
    // Call the Gemini API
    const rawResponse = await callGeminiAPI(base64Image, prompt, file.type);
    
    // Process the response based on the analysis type
    let result;
    
    if (type === "identification") {
      result = processIdentificationResponse(rawResponse);
      console.log("Plant identification complete:", result.commonName);
    } else {
      result = processDiseaseResponse(rawResponse);
      console.log("Plant disease analysis complete:", result.disease);
    }
    
    return { result, rawResponse };
  } catch (error) {
    console.error(`Error in plant ${type} analysis:`, error);
    throw error;
  }
};

/**
 * Process the raw identification response from Gemini
 */
const processIdentificationResponse = (rawResponse) => {
  // Extract information from the response text
  const commonName = extractField(rawResponse, "Detected Plant") || 
                     extractField(rawResponse, "Common Name") || 
                     "Unknown Plant";
  
  const scientificName = extractField(rawResponse, "Scientific Name") || "Unknown";
  
  // Extract care tips as an array
  const careSection = extractSection(rawResponse, "Care Information");
  const careTips = careSection
    ? careSection
        .split("\n")
        .filter(line => line.trim().startsWith("-") || line.includes(":"))
        .map(line => line.trim())
    : [];
  
  // Return structured data
  return {
    commonName,
    scientificName,
    careTips,
    summary: extractSection(rawResponse, "Quick Summary"),
    growthInfo: extractSection(rawResponse, "Growth Information"),
    additionalTips: extractSection(rawResponse, "Additional Tips"),
  };
};

/**
 * Process the raw disease response from Gemini
 */
const processDiseaseResponse = (rawResponse) => {
  // Extract information from the response text
  const plant = extractField(rawResponse, "Detected Plant") || "Unknown Plant";
  const disease = extractField(rawResponse, "Disease") || "Unknown Disease";
  const severity = extractField(rawResponse, "Severity level") || 
                  extractField(rawResponse, "Severity") || 
                  "Moderate";
  
  // Extract treatment recommendations
  const treatmentSection = extractSection(rawResponse, "Treatment");
  const treatment = treatmentSection
    ? treatmentSection
        .split("\n")
        .filter(line => line.trim().startsWith("-") || line.includes(":"))
        .map(line => line.trim().replace(/^-\s*/, ""))
    : [];
  
  // Extract prevention recommendations
  const preventionSection = extractSection(rawResponse, "Prevention");
  const prevention = preventionSection
    ? preventionSection
        .split("\n")
        .filter(line => line.trim().startsWith("-") || line.includes(":"))
        .map(line => line.trim().replace(/^-\s*/, ""))
    : [];
  
  // Return structured data
  return {
    plant,
    disease,
    severity,
    treatment,
    prevention,
    symptoms: extractSection(rawResponse, "Symptoms"),
    cause: extractSection(rawResponse, "Cause"),
  };
};

/**
 * Extract a specific field from the response text
 */
const extractField = (text, fieldName) => {
  const regex = new RegExp(`${fieldName}\\s*:?\\s*(.+?)(?=\\n\\s*\\d+\\.|\n\\s*[A-Za-z]+:|\n\n|$)`, 'is');
  const match = text.match(regex);
  return match ? match[1].trim() : "";
};

/**
 * Extract a section from the response text
 */
const extractSection = (text, sectionName) => {
  const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\s*\\d+\\.|\n\\s*[A-Za-z]+:|\n\n|$)`, 'is');
  const match = text.match(regex);
  return match ? match[1].trim() : "";
};
