'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, ChevronsUpDown, Loader2, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import type { CropTimingSuggestionsOutput } from '@/ai/flows/crop-timing-suggestions';

import { cropTimingSchema, type CropTimingFormValues } from '@/lib/schemas';
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
import { getCropTimingSuggestionsAction } from '@/app/actions';
import { VoiceInputButton } from './voice-input-button';
import { SpeakButton } from './speak-button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const cropOptions = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize'];
const languageOptions = [
    { value: 'ur-PK', label: 'Urdu' },
    { value: 'pa-PK', label: 'Punjabi' },
    { value: 'sd-PK', label: 'Sindhi' },
    { value: 'ps-PK', label: 'Pashto' },
];

export function CropTimingForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CropTimingSuggestionsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState('ur-PK');

  const form = useForm<CropTimingFormValues>({
    resolver: zodResolver(cropTimingSchema),
    defaultValues: {
      cropType: '',
      location: '',
      weatherForecast: 'Sunny with occasional clouds, temperatures between 25-35°C for the next 10 days.',
    },
  });

  const onSubmit = (values: CropTimingFormValues) => {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const response = await getCropTimingSuggestionsAction(values);
      if (response.success) {
        setResult(response.success);
      } else {
        setError(response.error || 'An unknown error occurred.');
      }
    });
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue('location', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, { shouldValidate: true });
        },
        () => {
          form.setError('location', { type: 'manual', message: 'Unable to retrieve location.' });
        }
      );
    } else {
      form.setError('location', { type: 'manual', message: 'Geolocation is not supported by your browser.' });
    }
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
                    <div className="relative">
                      <FormControl>
                          <Input list="crop-options" {...field} placeholder="e.g., Wheat" />
                      </FormControl>
                      <datalist id="crop-options">
                          {cropOptions.map((crop) => <option key={crop} value={crop} />)}
                      </datalist>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Voice Input Language</FormLabel>
                <Select onValueChange={setLanguage} defaultValue={language}>
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
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} placeholder="e.g., Lahore, Punjab" />
                    </FormControl>
                    <Button type="button" variant="outline" size="icon" onClick={handleLocation} aria-label="Use current location">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weatherForecast"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weather Forecast</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Textarea {...field} placeholder="Describe the upcoming weather..." />
                    </FormControl>
                    <VoiceInputButton lang={language} onTranscript={(t) => form.setValue('weatherForecast', t, { shouldValidate: true })} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Get Suggestions
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
            <p className="mt-2">Generating suggestions...</p>
          </div>
        )}

        {result && (
          <Card className="mt-6 bg-primary/10">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Sparkles className="h-6 w-6 text-primary" />
                  AI-Powered Suggestions
                </CardTitle>
                <SpeakButton textToSpeak={`Planting time: ${result.plantingTime}. Harvesting time: ${result.harvestingTime}. Considerations: ${result.considerations}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Calendar className="h-4 w-4" />Optimal Planting Time</h3>
                <p className="text-foreground/80 pl-6">{result.plantingTime}</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Calendar className="h-4 w-4" />Optimal Harvesting Time</h3>
                <p className="text-foreground/80 pl-6">{result.harvestingTime}</p>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">Additional Considerations</h3>
                <p className="text-foreground/80 pl-6">{result.considerations}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
