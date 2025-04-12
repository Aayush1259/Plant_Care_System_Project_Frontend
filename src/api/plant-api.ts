
import { identifyPlant } from '../ai/flows/identify-plant';
import { detectPlantDisease } from '../ai/flows/detect-plant-disease';
import { getPlantCareAdvice } from '../ai/flows/green-ai-assistant';

/**
 * API handlers for plant-related AI functionality
 */

/**
 * Handles plant identification requests
 */
export async function handlePlantIdentification(imageUrl: string) {
  try {
    console.log("Starting plant identification API flow");
    const result = await identifyPlant({ imageUrl });
    console.log("Plant identification completed:", result.success);
    return result;
  } catch (error) {
    console.error('Plant identification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to identify plant. Please try again.'
    };
  }
}

/**
 * Handles plant disease detection requests
 */
export async function handlePlantDiseaseDetection(imageUrl: string) {
  try {
    console.log("Starting plant disease detection API flow");
    const result = await detectPlantDisease({ imageUrl });
    console.log("Plant disease detection completed:", result.success);
    return result;
  } catch (error) {
    console.error('Plant disease detection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze plant health. Please try again.'
    };
  }
}

/**
 * Handles plant care advice requests
 */
export async function handlePlantCareAdvice(question: string, plantType?: string) {
  try {
    console.log("Starting plant care advice API flow");
    const result = await getPlantCareAdvice({ question, plantType });
    console.log("Plant care advice completed:", result.success);
    return result;
  } catch (error) {
    console.error('Plant care advice error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get plant care advice. Please try again.'
    };
  }
}
