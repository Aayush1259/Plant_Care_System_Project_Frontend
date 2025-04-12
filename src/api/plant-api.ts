
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
    const result = await identifyPlant({ imageUrl });
    return result;
  } catch (error) {
    console.error('Plant identification error:', error);
    return {
      success: false,
      error: 'Failed to identify plant. Please try again.'
    };
  }
}

/**
 * Handles plant disease detection requests
 */
export async function handlePlantDiseaseDetection(imageUrl: string) {
  try {
    const result = await detectPlantDisease({ imageUrl });
    return result;
  } catch (error) {
    console.error('Plant disease detection error:', error);
    return {
      success: false,
      error: 'Failed to analyze plant health. Please try again.'
    };
  }
}

/**
 * Handles plant care advice requests
 */
export async function handlePlantCareAdvice(question: string, plantType?: string) {
  try {
    const result = await getPlantCareAdvice({ question, plantType });
    return result;
  } catch (error) {
    console.error('Plant care advice error:', error);
    return {
      success: false,
      error: 'Failed to get plant care advice. Please try again.'
    };
  }
}
