import Image from 'next/image';
import {
  CalendarClock,
  CloudSun,
  LineChart,
  MapPin,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeatureCard } from '@/components/feature-card';
import { WeatherCard } from '@/components/weather-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function DashboardPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-1");

  return (
    <div className="flex flex-col gap-8">
      <div className="relative h-64 w-full overflow-hidden rounded-lg">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-bold text-white font-headline">
            Welcome to KisanAI
          </h1>
          <p className="mt-2 text-lg text-white/90">
            Your AI-powered farming companion.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          title="Crop Timing"
          description="Get AI suggestions for planting and harvesting."
          href="/crop-timing"
          icon={<CalendarClock className="h-8 w-8 text-primary" />}
        />
        <FeatureCard
          title="Yield Prediction"
          description="Forecast yield and get improvement insights."
          href="/yield-prediction"
          icon={<LineChart className="h-8 w-8 text-primary" />}
        />
        <FeatureCard
          title="Weather"
          description="Check real-time weather and forecasts."
          href="/weather"
          icon={<CloudSun className="h-8 w-8 text-primary" />}
        />
        <FeatureCard
          title="Geospatial Support"
          description="Location-based soil and resource data."
          href="#"
          icon={<MapPin className="h-8 w-8 text-primary" />}
          disabled
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 font-headline">At a Glance</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <WeatherCard />
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No new announcements at this time. Check back later for updates on market prices, government schemes, and more.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
