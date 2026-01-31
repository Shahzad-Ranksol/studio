import { CropTimingForm } from '@/components/crop-timing-form';

export default function CropTimingPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline">Crop Timing Suggestions</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your crop and location details to get AI-powered suggestions for optimal planting and harvesting times.
        </p>
      </div>
      <CropTimingForm />
    </div>
  );
}
