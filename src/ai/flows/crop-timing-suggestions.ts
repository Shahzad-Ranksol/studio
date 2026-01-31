'use server';

/**
 * @fileOverview A Genkit flow that suggests optimal planting and harvesting times for crops.
 *
 * - getCropTimingSuggestions - A function that returns crop timing suggestions.
 * - CropTimingSuggestionsInput - The input type for the getCropTimingSuggestions function.
 * - CropTimingSuggestionsOutput - The return type for the getCropTimingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropTimingSuggestionsInputSchema = z.object({
  location: z
    .string()
    .describe('The geographical location where the crops are planted.'),
  cropType: z.string().describe('The type of crop being planted.'),
  weatherForecast: z
    .string()
    .describe('The weather forecast for the specified location.'),
  language: z.string().describe('The language for the response (e.g., "Urdu", "Punjabi", "English").'),
});

export type CropTimingSuggestionsInput = z.infer<
  typeof CropTimingSuggestionsInputSchema
>;

const CropTimingSuggestionsOutputSchema = z.object({
  plantingTime: z
    .string()
    .describe('The suggested optimal planting time for the crop.'),
  harvestingTime: z
    .string()
    .describe('The suggested optimal harvesting time for the crop.'),
  considerations: z
    .string()
    .describe('Additional considerations for crop timing.'),
});

export type CropTimingSuggestionsOutput = z.infer<
  typeof CropTimingSuggestionsOutputSchema
>;

export async function getCropTimingSuggestions(
  input: CropTimingSuggestionsInput
): Promise<CropTimingSuggestionsOutput> {
  return cropTimingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropTimingSuggestionsPrompt',
  input: {schema: CropTimingSuggestionsInputSchema},
  output: {schema: CropTimingSuggestionsOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the farmer's location, crop type, and weather forecast, provide the optimal planting and harvesting times. Respond in this language: {{{language}}}.

Location: {{{location}}}
Crop Type: {{{cropType}}}
Weather Forecast: {{{weatherForecast}}}

Consider any potential risks or challenges and provide additional considerations to maximize yield.

Output in JSON format:
`,
});

const cropTimingSuggestionsFlow = ai.defineFlow(
  {
    name: 'cropTimingSuggestionsFlow',
    inputSchema: CropTimingSuggestionsInputSchema,
    outputSchema: CropTimingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI model failed to generate suggestions. Please try again.');
    }
    return output;
  }
);
