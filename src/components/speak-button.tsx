'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, Loader2, Play, Square } from 'lucide-react';
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Effect to manage the audio element lifecycle
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleEnd = () => setIsPlaying(false);
    const handleError = () => {
      setIsPlaying(false);
      toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: 'Could not play audio.',
      });
    };

    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [toast]);

  // Effect to reset when text changes
  useEffect(() => {
    setAudioUrl(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [textToSpeak]);

  const handleSpeak = async () => {
    if (isLoading) return;

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }
    
    if (!textToSpeak || !textToSpeak.trim()) {
        return;
    }

    const play = (url: string) => {
        if (audioRef.current) {
            if (audioRef.current.src !== url) {
              audioRef.current.src = url;
            }
            audioRef.current.play().catch(() => {
                setIsPlaying(false);
            });
            setIsPlaying(true);
        }
    };

    if (audioUrl) {
      play(audioUrl);
      return;
    }

    setIsLoading(true);
    try {
        const response = await textToSpeechAction(textToSpeak, lang);
        if (response.success && response.success.media) {
            setAudioUrl(response.success.media);
            play(response.success.media);
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

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleSpeak}
      className={cn(className)}
      disabled={isLoading}
      aria-label={isPlaying ? 'Stop audio' : 'Play audio' }
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isPlaying ? (
        <Square className="h-5 w-5" />
      ) : audioUrl ? (
        <Play className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
  );
}
