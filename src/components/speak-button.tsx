'use client';

import { useState, useTransition } from 'react';
import { Volume2, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { textToSpeechAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface SpeakButtonProps {
  textToSpeak: string;
  className?: string;
}

export function SpeakButton({ textToSpeak, className }: SpeakButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSpeak = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      return;
    }

    startTransition(async () => {
      const response = await textToSpeechAction(textToSpeak);
      if (response.success && response.success.media) {
        setAudioUrl(response.success.media);
        const audio = new Audio(response.success.media);
        audio.play();
      } else {
        toast({
            variant: "destructive",
            title: "Audio Error",
            description: response.error || 'Failed to generate audio.',
        })
      }
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleSpeak}
      className={cn(className)}
      disabled={isPending}
      aria-label={audioUrl ? 'Play audio' : 'Generate and play audio'}
    >
      {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
      ) : audioUrl ? (
          <Play className="h-5 w-5" />
      ) : (
          <Volume2 className="h-5 w-5" />
      )}
    </Button>
  );
}
