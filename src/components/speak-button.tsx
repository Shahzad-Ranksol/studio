'use client';

import { useState, useEffect } from 'react';
import { Volume2, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { textToSpeechAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface SpeakButtonProps {
  textToSpeak: string;
  className?: string;
  lang?: string;
}

export function SpeakButton({ textToSpeak, className, lang = 'ur-PK' }: SpeakButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleSpeak = async () => {
    if (isLoading || isPlaying) {
      return;
    }
    if (!textToSpeak || !textToSpeak.trim()) {
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

    setIsLoading(true);
    try {
        const response = await textToSpeechAction(textToSpeak, lang);
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
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Audio Error',
            description: 'An unexpected error occurred.',
        });
    } finally {
        setIsLoading(false);
    }
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
      disabled={isLoading || isPlaying}
      aria-label={audioUrl ? 'Play audio' : 'Generate and play audio'}
    >
      {isLoading ? (
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
