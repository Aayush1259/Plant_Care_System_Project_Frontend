
import { GEMINI_API_KEY, GEMINI_API_URL } from "@/firebase/config";
import { toast } from "@/components/ui/use-toast";

/**
 * Makes an API call to the Gemini Vision API
 * @param base64Image - Base64 encoded image
 * @param prompt - The prompt to send to Gemini
 * @param mimeType - The MIME type of the image
 * @returns The response from the Gemini API
 */
export const callGeminiAPI = async (
  base64Image,
  prompt,
  mimeType
) => {
  try {
    console.log("Calling Gemini API with prompt:", prompt.substring(0, 100) + "...");
    
    // Use the updated model
    const modelToUse = "gemini-2.0-flash";
    
    // Call Gemini API directly from the app
    const response = await fetch(`${GEMINI_API_URL}/${modelToUse}:generateContent?key=${GEMINI_API_KEY}`, {
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
                mimeType: mimeType,
                data: base64Image
              }
            }
          ]
        }]
      })
    });
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API HTTP error:", response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Gemini API response received");
    
    // Check for API errors
    if (data.error) {
      console.error("Gemini API error:", data.error);
      throw new Error(data.error.message || "Unknown API error");
    }
    
    // Extract response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("No text in response from Gemini API");
    }
    
    console.log("Processed response text length:", responseText.length);
    return responseText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

/**
 * Utility function to convert a data URI to a Blob
 */
export const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
};
