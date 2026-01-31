import { z } from 'zod';

export const cropTimingSchema = z.object({
  cropType: z.string().min(3, 'Crop type must be at least 3 characters.'),
  location: z.string().min(3, 'Location is required.'),
  weatherForecast: z.string().min(10, 'Weather forecast is required.'),
  language: z.string(),
});

export const yieldPredictionSchema = z.object({
  cropType: z.string().min(3, 'Crop type must be at least 3 characters.'),
  location: z.string().min(3, 'Location is required.'),
  historicalData: z.string().min(10, 'Historical data is required.'),
  currentConditions: z.string().min(10, 'Current conditions are required.'),
  farmingPractices: z.string().min(10, 'Farming practices are required.'),
  language: z.string(),
});

export type CropTimingFormValues = z.infer<typeof cropTimingSchema>;
export type YieldPredictionFormValues = z.infer<typeof yieldPredictionSchema>;
