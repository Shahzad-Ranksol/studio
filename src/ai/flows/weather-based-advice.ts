'use server';

/**
 * @fileOverview Generates weather-based agricultural advice.
 *
 * - getWeatherBasedAdvice - Generates advice based on weather.
 * - WeatherBasedAdviceInput - Input schema.
 * - WeatherBasedAdviceOutput - Output schema.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherBasedAdviceInputSchema = z.object({
  location: z.string().describe('The geographical location of the farm.'),
  language: z.string().describe('The language for the response (e.g., "Urdu", "Punjabi", "English").'),
});
export type WeatherBasedAdviceInput = z.infer<typeof WeatherBasedAdviceInputSchema>;

const WeatherBasedAdviceOutputSchema = z.object({
  advice: z.string().describe('Actionable agricultural advice based on the weather forecast.'),
  forecastSummary: z.string().describe('A brief summary of the weather forecast.'),
});
export type WeatherBasedAdviceOutput = z.infer<typeof WeatherBasedAdviceOutputSchema>;

// Mock weather data for Lahore. In a real application, this would come from a weather API.
const mockForecast = {
    "location": "Lahore, Pakistan",
    "forecast": [
        { "day": "Today", "condition": "Sunny", "high": 34, "low": 22, "humidity": 45, "wind_speed": 10 },
        { "day": "Monday", "condition": "Cloudy", "high": 32, "low": 23, "humidity": 55, "wind_speed": 12 },
        { "day": "Tuesday", "condition": "Partly Cloudy", "high": 33, "low": 24, "humidity": 50, "wind_speed": 15 },
        { "day": "Wednesday", "condition": "Rainy", "high": 29, "low": 22, "humidity": 75, "wind_speed": 20 },
        { "day": "Thursday", "condition": "Sunny", "high": 35, "low": 25, "humidity": 40, "wind_speed": 8 },
        { "day": "Friday", "condition": "Sunny", "high": 36, "low": 26, "humidity": 38, "wind_speed": 7 },
        { "day": "Saturday", "condition": "Partly Cloudy", "high": 34, "low": 25, "humidity": 48, "wind_speed": 11 },
    ]
};

export async function getWeatherBasedAdvice(
  input: WeatherBasedAdviceInput
): Promise<WeatherBasedAdviceOutput> {
  return weatherBasedAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherBasedAdvicePrompt',
  input: {schema: z.object({
    language: z.string(),
    forecast: z.string(),
    location: z.string(),
  })},
  output: {schema: WeatherBasedAdviceOutputSchema},
  prompt: `You are an expert agricultural advisor for farmers in Pakistan. Your task is to provide clear, actionable advice based on the provided weather forecast for a specific location. The advice should be easy to understand and focused on practical farming activities.

The response must be in the specified language: {{{language}}}.

Location: {{{location}}}
Weather Forecast Data (JSON):
{{{forecast}}}

Based on this forecast, provide the following:
1.  **Forecast Summary**: A brief, easy-to-understand summary of the next 7 days. Mention key events like rain, high winds, or extreme heat.
2.  **Actionable Advice**: Provide specific recommendations for the week. Your advice should cover topics like:
    *   **Irrigation**: When should the farmer irrigate their fields? Should they increase or decrease watering based on rain?
    *   **Spraying (Pesticides/Fungicides)**: Are the conditions favorable for spraying? Advise on the best days to spray (e.g., low wind, no rain expected) and when to avoid it.
    *   **Harvesting**: If crops are near harvesting, how does the weather affect the timing?
    *   **General Crop Care**: Any other important activities or precautions based on the weather (e.g., protecting from heat stress, managing post-rain conditions).

Keep the language simple and direct. The farmer relies on your guidance.
`,
});

const weatherBasedAdviceFlow = ai.defineFlow(
  {
    name: 'weatherBasedAdviceFlow',
    inputSchema: WeatherBasedAdviceInputSchema,
    outputSchema: WeatherBasedAdviceOutputSchema,
  },
  async ({ location, language }) => {
    // In a real app, you would fetch weather data for the given `location` here.
    // We are using mock data for demonstration.
    const forecastString = JSON.stringify(mockForecast.forecast, null, 2);

    const {output} = await prompt({
        location: location, // The mock forecast is for Lahore, but we pass the user's location to the prompt for context.
        language: language,
        forecast: forecastString,
    });
    return output!;
  }
);
