'use server';

/**
 * @fileOverview Predicts crop yield and provides insights for improvement.
 *
 * - predictYieldAndProvideInsights - Predicts crop yield and provides insights.
 * - YieldPredictionInput - The input type for the predictYieldAndProvideInsights function.
 * - YieldPredictionOutput - The return type for the predictYieldAndProvideInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const YieldPredictionInputSchema = z.object({
  cropType: z.string().describe('The type of crop (e.g., wheat, rice, corn).'),
  location: z.string().describe('The geographic location of the farm.'),
  historicalData: z
    .string()
    .describe(
      'Historical yield data for the specified crop and location, as a JSON string.'
    ),
  currentConditions: z
    .string()
    .describe(
      'Current environmental conditions (e.g., weather, soil moisture), as a JSON string.'
    ),
  farmingPractices: z
    .string()
    .describe(
      'Description of current farming practices (e.g., irrigation, fertilization), as a JSON string.'
    ),
  language: z.string().describe('The language for the response (e.g., "Urdu", "Punjabi", "English").'),
});
export type YieldPredictionInput = z.infer<typeof YieldPredictionInputSchema>;

const YieldPredictionOutputSchema = z.object({
  predictedYield: z
    .string()
    .describe('The predicted crop yield (e.g., in bushels per acre).'),
  insights: z.string().describe('Actionable insights for improving crop yield.'),
});
export type YieldPredictionOutput = z.infer<typeof YieldPredictionOutputSchema>;

export async function predictYieldAndProvideInsights(
  input: YieldPredictionInput
): Promise<YieldPredictionOutput> {
  return predictYieldAndProvideInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'yieldPredictionPrompt',
  input: {schema: YieldPredictionInputSchema},
  output: {schema: YieldPredictionOutputSchema},
  prompt: `You are an expert agricultural advisor.  Based on the provided information, predict the crop yield and provide actionable insights for improvement. Respond in this language: {{{language}}}.

Crop Type: {{{cropType}}}
Location: {{{location}}}
Historical Data: {{{historicalData}}}
Current Conditions: {{{currentConditions}}}
Farming Practices: {{{farmingPractices}}}

Consider the following when providing insights:
- Optimal planting and harvesting times
- Irrigation strategies
- Fertilization techniques
- Pest and disease management
- Soil health improvements

Predicted Yield: 
Insights: `,
});

const predictYieldAndProvideInsightsFlow = ai.defineFlow(
  {
    name: 'predictYieldAndProvideInsightsFlow',
    inputSchema: YieldPredictionInputSchema,
    outputSchema: YieldPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
