
import { GoogleGenerativeAI } from '@google/generative-ai';

// API key from the environment or directly in code (for demo purposes)
const API_KEY = "AIzaSyDAxUv4BTwOT6COqs3c_wSgzYc37CGF5rE";

// Create an instance of the Google AI client
export const googleAI = new GoogleGenerativeAI(API_KEY);

// Create a generative model instance for Gemini 2.0 Flash
export const model = googleAI.getGenerativeModel({ 
  model: "gemini-2.0-flash"
});

// Utility function to handle errors consistently
export const handleAIError = (error) => {
  console.error('AI processing error:', error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown AI processing error';
  return { success: false, error: errorMessage };
};
