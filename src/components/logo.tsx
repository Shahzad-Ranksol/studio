import { Leaf } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 p-2"
      aria-label="KisanAI Home"
    >
      <div className="rounded-lg bg-primary/20 p-2">
        <Leaf className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold tracking-tight font-headline text-foreground">
        KisanAI
      </span>
    </Link>
  );
}
