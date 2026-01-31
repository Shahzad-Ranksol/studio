'use client';

import { useState, useRef } from 'react';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      // Clean up listeners to prevent memory leaks from old audio objects
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    setIsProcessing(false);
  };
  
  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const handleSpeak = async () => {
    // If we are currently playing/loading, stop.
    if (isProcessing) {
      stopPlayback();
      return;
    }

    if (!textToSpeak || !textToSpeak.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await textToSpeechAction(textToSpeak, lang);

      if (response.success && response.success.media) {
        const audio = new Audio(response.success.media);
        audioRef.current = audio;

        audio.onended = () => {
          stopPlayback();
        };
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          stopPlayback();
          toast({
            variant: 'destructive',
            title: 'Audio Error',
            description: 'Could not play audio. The format might be unsupported.',
          });
        };
        
        await audio.play();
      } else {
        setIsProcessing(false);
        toast({
          variant: 'destructive',
          title: 'Audio Error',
          description: response.error || 'Failed to generate audio.',
        });
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('Text-to-speech action error:', error);
      toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: 'An unexpected error occurred while generating audio.',
      });
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleSpeak}
      className={cn(className)}
      aria-label={isProcessing ? 'Stop audio' : 'Play audio' }
    >
      {isProcessing ? (
        <Square className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
  );
}
