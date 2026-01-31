import { WeatherForecast } from '@/components/weather-forecast';

export default function WeatherPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Weather Forecast</h1>
        <p className="mt-2 text-muted-foreground">
          Detailed 7-day forecast for Lahore, Pakistan.
        </p>
      </div>
      <WeatherForecast />
    </div>
  );
}
