'use server';

import { getCropTimingSuggestions } from '@/ai/flows/crop-timing-suggestions';
import { predictYieldAndProvideInsights } from '@/ai/flows/yield-prediction-and-insights';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { getWeatherBasedAdvice } from '@/ai/flows/weather-based-advice';
import { cropTimingSchema, yieldPredictionSchema, weatherAdviceSchema } from '@/lib/schemas';
import type { CropTimingFormValues, YieldPredictionFormValues, WeatherAdviceFormValues } from '@/lib/schemas';

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

export async function textToSpeechAction(text: string, lang: string = 'ur-PK') {
  if (!text) {
    return {
      error: 'No text provided.',
    };
  }
  try {
    const result = await textToSpeech(text, lang);
    return { success: result };
  } catch (error) {
    console.error(error);
    return {
      error: 'An error occurred during text-to-speech conversion.',
    };
  }
}

export async function getWeatherBasedAdviceAction(values: WeatherAdviceFormValues) {
  const validatedFields = weatherAdviceSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid input.',
    };
  }

  try {
    const result = await getWeatherBasedAdvice(validatedFields.data);
    return { success: result };
  } catch (error) {
    console.error(error);
    return {
      error: 'An error occurred while getting weather advice. Please try again.',
    };
  }
}
