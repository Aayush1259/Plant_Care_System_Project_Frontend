
import { z } from 'zod';
import { model, handleAIError, BaseResponseSchema } from '../ai-instance';
import { getFertilizerInfo } from '../../services/fertilizer';

// Define input schema for assistant requests
export const AssistantInputSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  plantType: z.string().optional(),
});

// Define the schema for assistant response
export const AssistantResponseSchema = BaseResponseSchema.extend({
  answer: z.string().optional(),
  fertilizerRecommendations: z.array(z.string()).optional(),
  relatedTopics: z.array(z.string()).optional(),
});

// Type inference from schema
export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;

/**
 * Processes a plant care question and provides advice
 * @param question User's plant care question
 * @param plantType Optional plant type for context
 * @returns Personalized plant care advice
 */
export async function getPlantCareAdvice(input: z.infer<typeof AssistantInputSchema>): Promise<AssistantResponse> {
  try {
    // Parse and validate input
    const { question, plantType } = AssistantInputSchema.parse(input);

    // Create prompt for plant care assistant
    let prompt = `You are a helpful AI assistant providing personalized advice for plant care. 
    The user will ask a question about plant care, and you should provide helpful and informative advice.
    
    User question: ${question}`;
    
    // Add plant type context if available
    if (plantType) {
      prompt += `\nPlant type: ${plantType}`;
    }

    // Call the Gemini model
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Process the response
    const responseText = result.response.text();
    
    // Check if fertilizer recommendations might be relevant
    const fertilizerKeywords = ['fertilizer', 'nutrient', 'feed', 'nutrition', 'fertilize'];
    const shouldIncludeFertilizer = fertilizerKeywords.some(keyword => 
      question.toLowerCase().includes(keyword)
    );
    
    // Get fertilizer recommendations if relevant
    const fertilizerRecommendations = shouldIncludeFertilizer ? 
      await getFertilizerInfo(plantType || 'general') : 
      [];
    
    // Generate related topics based on the answer
    const relatedTopics = generateRelatedTopics(responseText);

    // Return structured data
    return AssistantResponseSchema.parse({
      success: true,
      answer: responseText,
      fertilizerRecommendations,
      relatedTopics
    });
  } catch (error) {
    console.error("Plant care advice error:", error);
    return handleAIError(error);
  }
}

/**
 * Helper function to generate related topics based on the answer
 */
function generateRelatedTopics(answer: string): string[] {
  // This is a simplified implementation
  // In a real application, you would use more sophisticated methods
  const topics = [
    'watering schedule',
    'light requirements',
    'soil composition',
    'pruning techniques',
    'pest management',
    'disease prevention',
    'propagation methods',
    'seasonal care'
  ];
  
  // Return topics that are mentioned in the answer
  return topics.filter(topic => 
    answer.toLowerCase().includes(topic.toLowerCase())
  );
}
