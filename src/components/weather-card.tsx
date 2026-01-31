import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, Droplets } from 'lucide-react';

export function WeatherCard() {
  // Mock weather data
  const weather = {
    location: 'Lahore, Pakistan',
    temperature: 34,
    condition: 'Sunny',
    humidity: 45,
  };

  const WeatherIcon = () => {
    switch (weather.condition) {
      case 'Sunny':
        return <Sun className="h-8 w-8 text-accent" />;
      case 'Cloudy':
        return <Cloud className="h-8 w-8 text-muted-foreground" />;
      case 'Rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-accent" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium font-headline">Current Weather</CardTitle>
        <WeatherIcon />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{weather.temperature}°C</div>
        <p className="text-sm text-muted-foreground">{weather.location}</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{weather.humidity}% Humidity</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
