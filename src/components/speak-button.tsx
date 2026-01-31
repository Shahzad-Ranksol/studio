'use client';

import { useState, useEffect } from 'react';
import { Volume2, Loader2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SpeakButtonProps {
  textToSpeak: string;
  className?: string;
}

export function SpeakButton({ textToSpeak, className }: SpeakButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsAvailable(true);
    }
    // Cleanup function to cancel speech when component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!isAvailable || isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US'; // Or dynamically set
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleSpeak}
      className={cn(className)}
      aria-label={isSpeaking ? 'Stop speaking' : 'Read results aloud'}
    >
      {isSpeaking ? <VolumeX className="h-5 w-5 animate-pulse" /> : <Volume2 className="h-5 w-5" />}
    </Button>
  );
}
