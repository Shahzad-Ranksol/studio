'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  className?: string;
  lang?: string;
}

export function VoiceInputButton({ onTranscript, className, lang = 'ur-PK' }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsAvailable(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = lang;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, [onTranscript, lang, isMounted]);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isMounted) {
     // Render a disabled placeholder on the server and initial client render to avoid hydration mismatch
     return (
        <Button type="button" variant="outline" size="icon" disabled className={className} title="Voice input initializing...">
            <MicOff className="h-4 w-4" />
        </Button>
    );
  }

  if (!isAvailable) {
    return (
        <Button type="button" variant="outline" size="icon" disabled className={className} title="Voice input not available in your browser">
            <MicOff className="h-4 w-4" />
        </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleToggleListening}
      className={cn(className, isListening && 'bg-destructive/20 text-destructive border-destructive')}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
    >
      <Mic className={cn('h-4 w-4', isListening && 'animate-pulse')} />
    </Button>
  );
}
