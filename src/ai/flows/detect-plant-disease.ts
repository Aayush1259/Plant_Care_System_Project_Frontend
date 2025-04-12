
import { z } from 'zod';
import { model, handleAIError, BaseResponseSchema, ImageInputSchema } from '../ai-instance';
import { getFertilizerInfo } from '../../services/fertilizer';

// Define the schema for plant disease detection response
export const PlantDiseaseSchema = BaseResponseSchema.extend({
  isDisease: z.boolean().default(false),
  diseaseName: z.string().optional(),
  symptoms: z.array(z.string()).optional(),
  causes: z.array(z.string()).optional(),
  treatments: z.array(z.string()).optional(),
  prevention: z.array(z.string()).optional(),
  fertilizerRecommendations: z.array(z.string()).optional(),
});

// Type inference from schema
export type PlantDisease = z.infer<typeof PlantDiseaseSchema>;

/**
 * Tool to determine if disease information should be included
 */
function shouldIncludeDiseaseInfo(responseText: string): boolean {
  // Check if the response indicates a disease is present
  const diseaseIndications = [
    /disease detected/i,
    /disease present/i,
    /is infected/i,
    /shows symptoms of/i,
    /suffering from/i
  ];
  
  return diseaseIndications.some(pattern => pattern.test(responseText));
}

/**
 * Detects plant diseases from an image URL
 * @param imageUrl URL of the plant image to analyze
 * @returns Plant disease information
 */
export async function detectPlantDisease(input: z.infer<typeof ImageInputSchema>): Promise<PlantDisease> {
  try {
    // Parse and validate input
    const { imageUrl } = ImageInputSchema.parse(input);

    // Create prompt for plant disease detection
    const prompt = `You are an expert plant pathologist. Analyze the image of the plant and determine if it has any diseases. 
    Based on the image, determine if a disease is present. If a disease is present, provide the name of the disease, symptoms, causes, treatments, and prevention methods.
    Format your response as follows:
    
    Disease Status: [Yes/No]
    Disease Name: [name of disease if present, otherwise "Healthy plant"]
    
    Symptoms:
    - [symptom 1]
    - [symptom 2]
    
    Causes:
    - [cause 1]
    - [cause 2]
    
    Treatments:
    - [treatment 1]
    - [treatment 2]
    
    Prevention:
    - [prevention 1]
    - [prevention 2]
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
    
    // Determine if a disease is present
    const diseaseStatusMatch = responseText.match(/Disease Status:\s*(Yes|No)/i);
    const isDisease = diseaseStatusMatch ? 
      diseaseStatusMatch[1].toLowerCase() === 'yes' : 
      shouldIncludeDiseaseInfo(responseText);
    
    // Extract disease name
    const diseaseName = responseText.match(/Disease Name:\s*(.+)/i)?.[1]?.trim();
    
    // Extract sections as arrays
    function extractSection(sectionName: string): string[] {
      const sectionMatch = responseText.match(new RegExp(`${sectionName}:([\s\S]*?)(?=\\b\\w+:|$)`, 'i'));
      return sectionMatch ? 
        sectionMatch[1]
          .split('-')
          .map(item => item.trim())
          .filter(item => item.length > 0) : 
        [];
    }
    
    const symptoms = extractSection('Symptoms');
    const causes = extractSection('Causes');
    const treatments = extractSection('Treatments');
    const prevention = extractSection('Prevention');
    
    // Get fertilizer recommendations if disease is present
    const fertilizerRecommendations = isDisease ? 
      await getFertilizerInfo(diseaseName || 'unknown disease') : 
      [];

    // Return structured data
    return PlantDiseaseSchema.parse({
      success: true,
      isDisease,
      diseaseName: isDisease ? diseaseName : 'Healthy plant',
      symptoms: isDisease ? symptoms : [],
      causes: isDisease ? causes : [],
      treatments: isDisease ? treatments : [],
      prevention: isDisease ? prevention : [],
      fertilizerRecommendations
    });
  } catch (error) {
    return handleAIError(error);
  }
}
