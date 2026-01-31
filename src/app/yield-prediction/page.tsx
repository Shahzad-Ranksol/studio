import { YieldPredictionForm } from '@/components/yield-prediction-form';

export default function YieldPredictionPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline">Yield Prediction & Insights</h1>
        <p className="mt-2 text-muted-foreground">
          Provide farm data to get an AI-driven yield prediction and actionable insights for improvement.
        </p>
      </div>
      <YieldPredictionForm />
    </div>
  );
}
