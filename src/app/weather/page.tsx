'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, BrainCircuit, MessageSquare, AlertCircle } from 'lucide-react';
import type { WeatherBasedAdviceOutput } from '@/ai/flows/weather-based-advice';

import { weatherAdviceSchema, type WeatherAdviceFormValues } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getWeatherBasedAdviceAction } from '@/app/actions';
import { SpeakButton } from '@/components/speak-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const languageOptions = [
    { value: 'ur-PK', label: 'Urdu' },
    { value: 'pa-IN', label: 'Punjabi' },
    { value: 'sd-IN', label: 'Sindhi' },
    { value: 'ps-AF', label: 'Pashto' },
];

const pakistanLocations = [
  // Using a smaller list for weather, assuming a regional forecast is sufficient.
  'Lahore', 'Karachi', 'Peshawar', 'Quetta', 'Faisalabad', 'Multan', 'Hyderabad', 'Islamabad'
];


export default function WeatherPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<WeatherBasedAdviceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState('ur-PK');

  const form = useForm<WeatherAdviceFormValues>({
    resolver: zodResolver(weatherAdviceSchema),
    defaultValues: {
      location: 'Lahore',
      language: 'Urdu',
    },
  });

  const onSubmit = (values: WeatherAdviceFormValues) => {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const response = await getWeatherBasedAdviceAction(values);
      if (response.success) {
        setResult(response.success);
      } else {
        setError(response.error || 'An unknown error occurred.');
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline">Weather Based Advisory</h1>
        <p className="mt-2 text-muted-foreground">
          Get AI-powered farming advice based on the 7-day weather forecast for your location.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <FormItem>
                  <FormLabel>Language</FormLabel>
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

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2 h-4 w-4" />
                )}
                Get Farming Advice
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
              <p className="mt-2">Analyzing weather and generating advice...</p>
            </div>
          )}

          {result && (
            <Card className="mt-6 bg-primary/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Sparkles className="h-6 w-6 text-primary" />
                    AI Weather Advisory
                  </CardTitle>
                  <SpeakButton lang={language} textToSpeak={`${result.forecastSummary}. ${result.advice}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" />Forecast Summary</h3>
                  <p className="text-foreground/80 pl-6 whitespace-pre-wrap">{result.forecastSummary}</p>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">Actionable Advice</h3>
                  <p className="text-foreground/80 pl-6 whitespace-pre-wrap">{result.advice}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
