
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
export const GEMINI_API_KEY = "AIzaSyDJSVr2ZrK5h8WXktRAMEs0UBTECK2uf0c";
export const GEMINI_MODEL = "gemini-pro-vision";
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models";

// Helper functions for the Gemini API
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
