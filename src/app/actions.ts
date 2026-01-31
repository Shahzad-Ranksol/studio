'use server';

import { getCropTimingSuggestions } from '@/ai/flows/crop-timing-suggestions';
import { predictYieldAndProvideInsights } from '@/ai/flows/yield-prediction-and-insights';
import { cropTimingSchema, yieldPredictionSchema } from '@/lib/schemas';
import type { CropTimingFormValues, YieldPredictionFormValues } from '@/lib/schemas';

export async function getCropTimingSuggestionsAction(values: CropTimingFormValues) {
  const validatedFields = cropTimingSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid input.',
    };
  }

  try {
    const result = await getCropTimingSuggestions(validatedFields.data);
    return { success: result };
  } catch (error) {
    console.error(error);
    return {
      error: 'An error occurred while getting suggestions. Please try again.',
    };
  }
}

export async function getYieldPredictionAction(values: YieldPredictionFormValues) {
  const validatedFields = yieldPredictionSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid input.',
    };
  }

  try {
    const result = await predictYieldAndProvideInsights(validatedFields.data);
    return { success: result };
  } catch (error) {
    console.error(error);
    return {
      error: 'An error occurred while predicting yield. Please try again.',
    };
  }
}
