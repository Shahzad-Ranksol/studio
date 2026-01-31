'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, LineChart, Lightbulb, AlertCircle } from 'lucide-react';
import type { YieldPredictionOutput } from '@/ai/flows/yield-prediction-and-insights';

import { yieldPredictionSchema, type YieldPredictionFormValues } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getYieldPredictionAction } from '@/app/actions';
import { SpeakButton } from './speak-button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { VoiceInputButton } from './voice-input-button';

const languageOptions = [
    { value: 'ur-PK', label: 'Urdu' },
    { value: 'pa-PK', label: 'Punjabi' },
    { value: 'sd-PK', label: 'Sindhi' },
    { value: 'ps-PK', label: 'Pashto' },
];

const pakistanCrops = [
  // Field Crops
  'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Barley', 'Sorghum', 'Millet', 'Sunflower', 'Canola', 'Gram', 'Lentil (Masoor)', 'Mung Bean', 'Mash Bean',
  // Fruits
  'Mango', 'Orange', 'Kinnow', 'Apple', 'Banana', 'Guava', 'Dates', 'Grapes', 'Pomegranate', 'Apricot', 'Peach', 'Plum', 'Cherry', 'Fig', 'Lychee', 'Melon', 'Watermelon',
  // Vegetables
  'Potato', 'Onion', 'Tomato', 'Carrot', 'Spinach', 'Cauliflower', 'Cabbage', 'Cucumber', 'Peas', 'Okra (Ladyfinger)', 'Eggplant (Brinjal)', 'Bitter Gourd', 'Bottle Gourd', 'Radish', 'Turnip', 'Garlic', 'Ginger', 'Chilli', 'Coriander'
];

const pakistanLocations = [
  // Punjab
  'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Rahim Yar Khan', 'Jhang', 'Sheikhupura', 'Kasur', 'Okara', 'Sahiwal', 'Dera Ghazi Khan',
  // Sindh
  'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah (Shaheed Benazirabad)', 'Mirpur Khas', 'Jacobabad', 'Shikarpur', 'Tando Allahyar', 'Thatta',
  // Khyber Pakhtunkhwa
  'Peshawar', 'Abbottabad', 'Mardan', 'Swat', 'Dera Ismail Khan', 'Kohat', 'Bannu', 'Charsadda', 'Nowshera', 'Mansehra', 'Haripur',
  // Balochistan
  'Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi', 'Chaman', 'Lasbela', 'Zhob',
  // Gilgit-Baltistan
  'Gilgit', 'Skardu', 'Chilas', 'Hunza', 'Gahkuch',
  // Azad Kashmir
  'Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot', 'Bhimber'
];

export function YieldPredictionForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<YieldPredictionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState('ur-PK');

  const form = useForm<YieldPredictionFormValues>({
    resolver: zodResolver(yieldPredictionSchema),
    defaultValues: {
      cropType: 'Wheat',
      location: 'Faisalabad',
      historicalData: '{"year": 2022, "yield": "40 bushels/acre"}, {"year": 2021, "yield": "38 bushels/acre"}',
      currentConditions: '{"soil_moisture": "optimal", "temperature": "28°C", "recent_rain": "5mm"}',
      farmingPractices: '{"irrigation": "canal-based, twice a week", "fertilizer": "urea, DAP", "pest_control": "standard pesticides"}',
      language: 'Urdu',
    },
  });

  const onSubmit = (values: YieldPredictionFormValues) => {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const response = await getYieldPredictionAction(values);
      if (response.success) {
        setResult(response.success);
      } else {
        setError(response.error || 'An unknown error occurred.');
      }
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a crop" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {pakistanCrops.map((crop) => (
                            <SelectItem key={crop} value={crop}>
                            {crop}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                  <FormLabel>Voice Input Language</FormLabel>
                  <Select
                    onValueChange={(value) => {
                        setLanguage(value);
                        const langLabel = languageOptions.find(l => l.value === value)?.label || 'Urdu';
                        form.setValue('language', langLabel);
                    }}
                    defaultValue={language}
                  >
                      <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          {languageOptions.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </FormItem>
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {pakistanLocations.map((location) => (
                                <SelectItem key={location} value={location}>
                                    {location}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="historicalData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Data (JSON format)</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <VoiceInputButton lang={language} onTranscript={(t) => form.setValue('historicalData', t, { shouldValidate: true })} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Conditions (JSON format)</FormLabel>
                   <div className="flex items-center gap-2">
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                     <VoiceInputButton lang={language} onTranscript={(t) => form.setValue('currentConditions', t, { shouldValidate: true })} />
                   </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="farmingPractices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farming Practices (JSON format)</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <VoiceInputButton lang={language} onTranscript={(t) => form.setValue('farmingPractices', t, { shouldValidate: true })} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Predict Yield
            </Button>
          </form>
        </Form>
        
        {error && (
            <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {isPending && (
          <div className="mt-6 text-center text-muted-foreground">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2">Analyzing data and making predictions...</p>
          </div>
        )}

        {result && (
          <Card className="mt-6 bg-primary/10">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Prediction & Insights
                </CardTitle>
                <SpeakButton lang={language} textToSpeak={`${result.predictedYield}. ${result.insights}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><LineChart className="h-4 w-4" />Predicted Yield</h3>
                <p className="text-lg font-bold text-primary pl-6">{result.predictedYield}</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4" />Actionable Insights</h3>
                <p className="text-foreground/80 pl-6 whitespace-pre-wrap">{result.insights}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
