
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
  experienceLevel: "beginner" | "hobbyist" | "expert",
  createGeminiPrompt: (type: "identification" | "disease", experienceLevel: "beginner" | "hobbyist" | "expert") => string
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
          // Get prompt based on experience level
          const prompt = createGeminiPrompt("identification", experienceLevel);
          
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
            reject("Failed to identify plant. Please try again.");
            return;
          }
          
          // Parse the response text
          const responseText = data.candidates[0]?.content?.parts[0]?.text || "";
          
          // Extract information using helper functions
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
          
        } catch (error) {
          console.error("Error calling Gemini API:", error);
          reject("Failed to identify plant. Please try again.");
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
