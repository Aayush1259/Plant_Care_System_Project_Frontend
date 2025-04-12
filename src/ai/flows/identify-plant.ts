
import { z } from 'zod';
import { model, handleAIError, BaseResponseSchema, ImageInputSchema } from '../ai-instance';

// Define the schema for plant identification response
export const PlantIdentificationSchema = BaseResponseSchema.extend({
  commonName: z.string().optional(),
  scientificName: z.string().optional(),
  careTips: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(100).optional(),
});

// Type inference from schema
export type PlantIdentification = z.infer<typeof PlantIdentificationSchema>;

/**
 * Identifies a plant from an image URL
 * @param imageUrl URL of the plant image to identify
 * @returns Plant identification details
 */
export async function identifyPlant(input: z.infer<typeof ImageInputSchema>): Promise<PlantIdentification> {
  try {
    // Parse and validate input
    const { imageUrl } = ImageInputSchema.parse(input);

    // Create prompt for plant identification
    const prompt = `You are an expert botanist. Identify the plant species in the image provided. 
    Provide the common name, scientific name, and care tips for the plant. 
    Format your response as follows:
    Common Name: [plant common name]
    Scientific Name: [plant scientific name]
    Care Tips:
    - [care tip 1]
    - [care tip 2]
    - [etc.]
    Confidence: [your confidence level as a percentage between 0-100]
    `;

    // Call the Gemini model with image
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: imageUrl } }
          ]
        }
      ],
    });

    // Process the response
    const responseText = result.response.text();
    
    // Extract information using regex
    const commonName = responseText.match(/Common Name:\s*(.+)/i)?.[1]?.trim();
    const scientificName = responseText.match(/Scientific Name:\s*(.+)/i)?.[1]?.trim();
    
    // Extract care tips as an array
    const careTipsMatch = responseText.match(/Care Tips:([\s\S]*?)(?=Confidence:|$)/i);
    const careTips = careTipsMatch ? 
      careTipsMatch[1]
        .split('-')
        .map(tip => tip.trim())
        .filter(tip => tip.length > 0) : 
      [];
    
    // Extract confidence level
    const confidenceMatch = responseText.match(/Confidence:\s*(\d+)/i);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1], 10) : undefined;

    // Return structured data
    return PlantIdentificationSchema.parse({
      success: true,
      commonName,
      scientificName,
      careTips,
      confidence
    });
  } catch (error) {
    console.error("Plant identification error:", error);
    return handleAIError(error);
  }
}
