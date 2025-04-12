
import { toast } from "@/components/ui/use-toast";
import { prepareImageForProcessing } from "@/services/imageProcessingService";
import { 
  handlePlantIdentification, 
  handlePlantDiseaseDetection 
} from "@/api/plant-api";

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
    
    console.log(`Sending ${analyzeType} request to Gemini API...`);
    
    let result;
    let rawResponse = '';
    
    // Call the appropriate API handler based on the analysis type
    if (analyzeType === "identification") {
      result = await handlePlantIdentification(base64Image);
      
      // Format the raw response text for backward compatibility
      if (result.success) {
        rawResponse = `Detected Plant: ${result.commonName || 'Unknown'}\n` +
          `Scientific Name: ${result.scientificName || 'Unknown'}\n` +
          `Quick Summary:\n- Plant identified with ${result.confidence || 'unknown'}% confidence\n\n` +
          `Care Information:\n`;
          
        if (result.careTips && result.careTips.length > 0) {
          rawResponse += result.careTips.map(tip => `- ${tip}`).join('\n');
        }
      }
      
      // Process for the old format expected by the UI
      return {
        result: {
          name: result.commonName || 'Unknown plant',
          scientificName: result.scientificName || 'Unknown scientific name',
          confidence: result.confidence || 90,
          careInfo: {
            light: result.careTips?.find(tip => tip.toLowerCase().includes('light')) || 'Moderate light',
            water: result.careTips?.find(tip => tip.toLowerCase().includes('water')) || 'Regular watering',
            humidity: result.careTips?.find(tip => tip.toLowerCase().includes('humid')) || 'Average humidity',
            temperature: result.careTips?.find(tip => tip.toLowerCase().includes('temp')) || '65-85°F (18-29°C)',
            soil: result.careTips?.find(tip => tip.toLowerCase().includes('soil')) || 'Well-draining potting mix'
          },
          summary: `${result.commonName || 'This plant'} (${result.scientificName || 'Unknown scientific name'})`,
          growthInfo: {
            content: result.careTips?.join('\n') || ''
          },
          additionalInfo: {
            content: ''
          }
        },
        rawResponse
      };
    } else {
      result = await handlePlantDiseaseDetection(base64Image);
      
      // Format the raw response text for backward compatibility
      if (result.success) {
        rawResponse = `Detected Plant: ${result.diseaseName?.split(' ')[0] || 'Unknown'}\n` +
          `Disease: ${result.isDisease ? result.diseaseName : 'No disease detected'}\n` +
          `Quick Summary:\n- ${result.isDisease ? 'Disease detected' : 'Plant appears healthy'}\n\n` +
          `Symptoms:\n`;
          
        if (result.symptoms && result.symptoms.length > 0) {
          rawResponse += result.symptoms.map(symptom => `- ${symptom}`).join('\n');
        }
        
        rawResponse += '\n\nCause:\n';
        if (result.causes && result.causes.length > 0) {
          rawResponse += result.causes.map(cause => `- ${cause}`).join('\n');
        }
        
        rawResponse += '\n\nTreatment:\n';
        if (result.treatments && result.treatments.length > 0) {
          rawResponse += result.treatments.map(treatment => `- ${treatment}`).join('\n');
        }
        
        rawResponse += '\n\nPrevention:\n';
        if (result.prevention && result.prevention.length > 0) {
          rawResponse += result.prevention.map(prevention => `- ${prevention}`).join('\n');
        }
      }
      
      // Process for the old format expected by the UI
      return {
        result: {
          plant: result.diseaseName?.split(' ')[0] || 'Unknown plant',
          disease: result.isDisease ? result.diseaseName : 'No disease detected',
          summary: result.isDisease ? 'Disease detected' : 'Plant appears healthy',
          symptoms: result.symptoms?.join('\n') || 'No specific symptoms identified',
          cause: result.causes?.join('\n') || 'Unknown cause',
          treatment: result.treatments?.join('\n') || 'Consult a plant specialist',
          prevention: result.prevention?.join('\n') || 'Maintain proper plant care',
          additionalInfo: result.fertilizerRecommendations?.join('\n') || ''
        },
        rawResponse
      };
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
