'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
    }
    setAudioSrc(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textToSpeak, lang]);

  const playAudio = (src: string) => {
    if (audioRef.current) {
      stopPlayback();
    }
    
    const audio = new Audio(src);
    audioRef.current = audio;
    setIsPlaying(true);

    const onEnd = () => {
      if (audioRef.current === audio) {
        setIsPlaying(false);
        audioRef.current = null;
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
      onEnd();
    });
    
    audio.play().catch(e => {
        console.error('Audio play() failed:', e);
        toast({
            variant: 'destructive',
            title: 'Playback Error',
            description: 'Could not start audio playback.',
        });
        onEnd();
    });
  };

  const handleSpeak = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    if (!textToSpeak || !textToSpeak.trim()) {
      return;
    }
    
    if (audioSrc) {
      playAudio(audioSrc);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await textToSpeechAction(textToSpeak, lang);

      if (response.success && response.success.media) {
        setAudioSrc(response.success.media);
        playAudio(response.success.media);
      } else {
        toast({
          variant: 'destructive',
          title: 'Audio Generation Error',
          description: response.error || 'Failed to generate audio.',
        });
      }
    } catch (error: any) {
      console.error('Text-to-speech action error:', error);
       toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const isDisabled = isGenerating || (!textToSpeak || !textToSpeak.trim());

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleSpeak}
      disabled={isDisabled}
      className={cn(className)}
      aria-label={isPlaying ? 'Stop audio' : 'Play audio' }
    >
      {isGenerating ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isPlaying ? (
        <Square className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
  );
}
