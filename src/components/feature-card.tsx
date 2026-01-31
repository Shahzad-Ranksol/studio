import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export function FeatureCard({
  title,
  description,
  href,
  icon,
  disabled = false,
}: FeatureCardProps) {
  const cardContent = (
    <Card
      className={cn(
        'h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        disabled && 'bg-muted/50 cursor-not-allowed hover:shadow-none hover:-translate-y-0'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium font-headline">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        {!disabled && (
          <div className="mt-4 flex items-center text-sm font-semibold text-primary">
            Go to {title} <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (disabled) {
    return <div aria-disabled="true">{cardContent}</div>;
  }

  return (
    <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
      {cardContent}
    </Link>
  );
}
