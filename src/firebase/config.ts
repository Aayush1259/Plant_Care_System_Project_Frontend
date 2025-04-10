
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb9WFMsE25X_HXGKXduWP1OMyD5XP14xI",
  authDomain: "plantcaresystem-34f70.firebaseapp.com",
  projectId: "plantcaresystem-34f70",
  storageBucket: "plantcaresystem-34f70.firebasestorage.app",
  messagingSenderId: "67008333961",
  appId: "1:67008333961:android:37d1fae5c3b08c8ba79e58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Gemini API key and config
export const GEMINI_API_KEY = "AIzaSyDAxUv4BTwOT6COqs3c_wSgzYc37CGF5rE";
export const GEMINI_MODEL = "gemini-2.0-flash-exp";
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models";

// Helper functions for the Gemini API
export const createGeminiPrompt = (type: "identification" | "disease", experienceLevel: "beginner" | "hobbyist" | "expert" = "hobbyist") => {
  const basePrompt = type === "identification" 
    ? "Analyze this plant image and provide details in the following format:\n\n"
    : "Analyze this plant/leaf image and provide a detailed report on any diseases or issues:\n\n";
  
  let levelPrompt = "";
  if (experienceLevel === "beginner") {
    levelPrompt = "Use simple, non-technical language with clear explanations and step-by-step instructions.\n";
  } else if (experienceLevel === "hobbyist") {
    levelPrompt = "Mix common and technical terms with brief explanations for specialized concepts.\n";
  } else {
    levelPrompt = "Use technical terminology and provide detailed scientific information including advanced care techniques.\n";
  }
  
  if (type === "identification") {
    return basePrompt + levelPrompt + 
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
  } else {
    return basePrompt + levelPrompt +
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
  }
};

// Helper function to extract info from Gemini responses
export const extractFromGeminiResponse = (text: string, field: string): string => {
  const regex = new RegExp(`${field}\\s*:?\\s*(.+?)(?=\\n\\s*\\d+\\.|\n\n|$)`, 'is');
  const match = text.match(regex);
  return match ? match[1].trim() : "";
};

// Function to extract plant name
export const extractPlantName = (text: string): string => {
  const detectedPlantMatch = extractFromGeminiResponse(text, "Detected Plant");
  if (detectedPlantMatch) return detectedPlantMatch;
  
  // Fallback to look for "Plant Name" if "Detected Plant" isn't found
  const plantNameMatch = extractFromGeminiResponse(text, "Plant Name");
  return plantNameMatch || "Unknown Plant";
};

export default app;
