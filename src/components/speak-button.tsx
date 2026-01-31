'use client';

import { useState, useTransition, useEffect } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleSpeak = () => {
    if (isPending || isPlaying) {
      return;
    }

    const playAudio = (url: string) => {
      const audio = new Audio(url);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        toast({
          variant: 'destructive',
          title: 'Audio Error',
          description: 'Could not play audio.',
        });
      };
    };

    if (audioUrl) {
      playAudio(audioUrl);
      return;
    }

    startTransition(async () => {
      const response = await textToSpeechAction(textToSpeak);
      if (response.success && response.success.media) {
        setAudioUrl(response.success.media);
        playAudio(response.success.media);
      } else {
        toast({
          variant: 'destructive',
          title: 'Audio Error',
          description: response.error || 'Failed to generate audio.',
        });
      }
    });
  };

  useEffect(() => {
    // When textToSpeak changes, we should invalidate the old audio.
    setAudioUrl(null);
  }, [textToSpeak]);


  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleSpeak}
      className={cn(className)}
      disabled={isPending || isPlaying}
      aria-label={audioUrl ? 'Play audio' : 'Generate and play audio'}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isPlaying ? (
        <Volume2 className="h-5 w-5 animate-pulse" />
      ) : audioUrl ? (
        <Play className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
  );
}
