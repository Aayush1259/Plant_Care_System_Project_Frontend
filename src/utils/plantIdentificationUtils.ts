
import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL, extractFromGeminiResponse, extractPlantName } from "@/firebase/config";
import { toast } from "@/components/ui/use-toast";

// Function to convert base64 to file
export const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
};

export const identifyPlantWithGemini = async (
  selectedImage: string,
  rawImageFile: File | null,
  analyzeType: "identification" | "disease"
) => {
  try {
    // Prepare image data for Gemini API
    let imageBlob: Blob;
    let file: File;
    
    if (rawImageFile) {
      imageBlob = await rawImageFile.slice(0, rawImageFile.size, rawImageFile.type);
      file = new File([imageBlob], rawImageFile.name, { type: rawImageFile.type });
    } else {
      imageBlob = dataURItoBlob(selectedImage);
      file = new File([imageBlob], "plant_image.jpg", { type: 'image/jpeg' });
    }

    // Convert image to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (!e.target?.result) {
          toast({
            title: "Error",
            description: "Failed to process image.",
            variant: "destructive",
            duration: 3000,
          });
          reject("Failed to process image");
          return;
        }
        
        const base64Image = e.target.result.toString().split(',')[1];
        
        try {
          // Get prompt based on type of analysis
          const prompt = analyzeType === "identification" 
            ? createSimpleIdentificationPrompt() 
            : createSimpleDiseasePrompt();
          
          // Call Gemini API
          const response = await fetch(`${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: file.type,
                      data: base64Image
                    }
                  }
                ]
              }]
            })
          });
          
          const data = await response.json();
          
          if (data.error) {
            console.error("Gemini API error:", data.error);
            reject(`Failed to ${analyzeType === "identification" ? "identify plant" : "analyze disease"}. Please try again.`);
            return;
          }
          
          // Parse the response text
          const responseText = data.candidates[0]?.content?.parts[0]?.text || "";
          
          if (analyzeType === "identification") {
            // For plant identification
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
            
            // Store the results with enhanced data
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
            
            resolve({
              result: plantResult, 
              rawResponse: responseText
            });
          } else {
            // For disease analysis
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
            
            // Store the results
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
            
            resolve({
              result: diseaseResult,
              rawResponse: responseText
            });
          }
        } catch (error) {
          console.error("Error calling Gemini API:", error);
          reject(`Failed to ${analyzeType === "identification" ? "identify plant" : "analyze disease"}. Please try again.`);
        }
      };
      
      reader.onerror = () => {
        reject("Failed to process image.");
      };
      
      reader.readAsDataURL(file);
    });
    
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image.");
  }
};

// Simplified prompts
const createSimpleIdentificationPrompt = () => {
  return "Analyze this plant image and provide details in the following format:\n\n" +
    "1. Detected Plant: [name of the plant species]\n" +
    "2. Scientific Name: [latin name]\n" +
    "3. Quick Summary:\n" +
    "   - Brief description of the plant\n" +
    "   - Native origin\n" +
    "   - Common uses\n\n" +
    "4. Care Information:\n" +
    "   - Light: [light requirements]\n" +
    "   - Water: [watering needs]\n" +
    "   - Humidity: [humidity requirements]\n" +
    "   - Temperature: [ideal temperature range]\n" +
    "   - Soil: [soil preferences]\n\n" +
    "5. Growth Information:\n" +
    "   - Expected size/height\n" +
    "   - Growth rate\n" +
    "   - Special considerations\n\n" +
    "6. Additional Tips:\n" +
    "   - Common issues to watch for\n" +
    "   - Seasonal care adjustments\n" +
    "   - Propagation methods\n\n" +
    "Begin your report with 'Detected Plant:' followed by the species name.";
};

const createSimpleDiseasePrompt = () => {
  return "Analyze this plant/leaf image and provide a detailed report on any diseases or issues:\n\n" +
    "0. Detected Plant: [identify the plant species]\n" +
    "1. Disease: [name of disease or problem]\n" +
    "2. Quick Summary:\n" +
    "   - Severity level\n" +
    "   - Urgency of treatment\n\n" +
    "3. Symptoms:\n" +
    "   - Visible symptoms in the image\n" +
    "   - Progression of symptoms\n\n" +
    "4. Cause:\n" +
    "   - What causes this disease/condition\n" +
    "   - Contributing factors\n\n" +
    "5. Treatment:\n" +
    "   - Immediate steps\n" +
    "   - Ongoing treatment\n" +
    "   - Products or methods to use\n\n" +
    "6. Prevention:\n" +
    "   - How to prevent this in the future\n" +
    "   - Early warning signs\n\n" +
    "7. Additional Information:\n" +
    "   - Impact on plant health\n" +
    "   - Potential spread to other plants\n\n" +
    "Begin your report with 'Detected Plant:' followed by the species name.";
};
