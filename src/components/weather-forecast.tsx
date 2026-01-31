import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSun, Thermometer, Droplets } from 'lucide-react';

const mockForecast = [
  { day: 'Today', condition: 'Sunny', high: 34, low: 22, humidity: 45 },
  { day: 'Mon', condition: 'Cloudy', high: 32, low: 23, humidity: 55 },
  { day: 'Tue', condition: 'Partly Cloudy', high: 33, low: 24, humidity: 50 },
  { day: 'Wed', condition: 'Rainy', high: 29, low: 22, humidity: 75 },
  { day: 'Thu', condition: 'Sunny', high: 35, low: 25, humidity: 40 },
  { day: 'Fri', condition: 'Sunny', high: 36, low: 26, humidity: 38 },
  { day: 'Sat', condition: 'Partly Cloudy', high: 34, low: 25, humidity: 48 },
];

const WeatherIcon = ({ condition, className }: { condition: string, className?: string }) => {
  switch (condition) {
    case 'Sunny':
      return <Sun className={className} />;
    case 'Cloudy':
      return <Cloud className={className} />;
    case 'Rainy':
      return <CloudRain className={className} />;
    case 'Partly Cloudy':
      return <CloudSun className={className} />;
    default:
      return <Sun className={className} />;
  }
};

export function WeatherForecast() {
  const [today, ...week] = mockForecast;

  return (
    <div className="space-y-6">
      <Card className="bg-primary/10">
        <CardHeader>
          <CardTitle className="font-headline">Current Conditions: {today.day}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <WeatherIcon condition={today.condition} className="w-16 h-16 text-accent" />
            <div>
              <p className="text-5xl font-bold">{today.high}°C</p>
              <p className="text-muted-foreground">{today.condition}</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-muted-foreground" />
              <span>High: {today.high}° / Low: {today.low}°</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-muted-foreground" />
              <span>Humidity: {today.humidity}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {week.map((item) => (
              <div key={item.day} className="flex items-center justify-between py-3">
                <p className="w-1/4 font-semibold">{item.day}</p>
                <div className="w-1/4 flex justify-center">
                  <WeatherIcon condition={item.condition} className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="w-1/4 text-center">{item.condition}</p>
                <p className="w-1/4 text-right font-medium">{item.high}° / {item.low}°</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
