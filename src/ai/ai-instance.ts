
import { GoogleGenerativeAI } from '@genkit-ai/googleai';
import { z } from 'zod';

// API key from the environment or directly in code (for demo purposes)
const API_KEY = "AIzaSyDAxUv4BTwOT6COqs3c_wSgzYc37CGF5rE";

// Create an instance of the Google AI client
export const googleAI = new GoogleGenerativeAI(API_KEY);

// Create a generative model instance for Gemini 2.0 Flash
export const model = googleAI.getGenerativeModel({ 
  model: "gemini-2.0-flash"
});

// Base schema for responses that include a success flag and error message
export const BaseResponseSchema = z.object({
  success: z.boolean().default(true),
  error: z.string().optional(),
});

// Utility function to handle errors consistently
export const handleAIError = (error: unknown): { success: false; error: string } => {
  console.error('AI processing error:', error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown AI processing error';
  return { success: false, error: errorMessage };
};

// Common image input schema
export const ImageInputSchema = z.object({
  imageUrl: z.string().url('A valid image URL is required'),
});
