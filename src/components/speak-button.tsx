'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, Square } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null; // Clean up the reference
    }
    setIsPlaying(false);
  };
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpeak = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    if (!textToSpeak || !textToSpeak.trim()) {
      return;
    }

    setIsPlaying(true);
    try {
      const response = await textToSpeechAction(textToSpeak, lang);

      if (response.success && response.success.media) {
        // Create a new Audio object for each playback request
        const audio = new Audio(response.success.media);
        audioRef.current = audio;

        const onEnd = () => {
          // Check if the audio that ended is the current one before stopping
          if (audioRef.current === audio) {
            stopPlayback();
          }
        };

        audio.addEventListener('ended', onEnd);
        audio.addEventListener('error', (e) => {
          console.error('Audio playback error:', e);
          toast({
            variant: 'destructive',
            title: 'Audio Error',
            description: 'Could not play audio. The format might be unsupported.',
          });
          onEnd(); // Also stop on error
        });
        
        await audio.play();
      } else {
        toast({
          variant: 'destructive',
          title: 'Audio Error',
          description: response.error || 'Failed to generate audio.',
        });
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Text-to-speech action error:', error);
      toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: 'An unexpected error occurred while generating audio.',
      });
      setIsPlaying(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleSpeak}
      className={cn(className)}
      aria-label={isPlaying ? 'Stop audio' : 'Play audio' }
    >
      {isPlaying ? (
        <Square className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
  );
}
