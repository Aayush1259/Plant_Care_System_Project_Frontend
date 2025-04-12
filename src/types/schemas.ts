
import { z } from 'zod';

// Re-export schemas from various files for easy access
export * from '../ai/flows/identify-plant';
export * from '../ai/flows/detect-plant-disease';
export * from '../ai/flows/green-ai-assistant';

// Additional shared schemas can be defined here

// Schema for plant details that might be used across the application
export const PlantDetailsSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  scientificName: z.string().optional(),
  image: z.string().url().optional(),
  careTips: z.array(z.string()).optional(),
  wateringFrequency: z.string().optional(),
  lightRequirements: z.string().optional(),
  difficulty: z.enum(['easy', 'moderate', 'hard']).optional(),
  tags: z.array(z.string()).optional(),
});

export type PlantDetails = z.infer<typeof PlantDetailsSchema>;

// Schema for user's garden plant
export const GardenPlantSchema = PlantDetailsSchema.extend({
  id: z.string(),
  addedDate: z.date(),
  lastWatered: z.date().optional(),
  notes: z.string().optional(),
  location: z.string().optional(),
});

export type GardenPlant = z.infer<typeof GardenPlantSchema>;
