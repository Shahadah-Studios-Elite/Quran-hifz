'use client';

import React, { useEffect, useRef, useState } from 'react';

const MicIcon = ({ muted }: { muted: boolean }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }}
    aria-hidden="true"
  >
    {muted ? (
      <>
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </>
    ) : (
      <>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </>
    )}
  </svg>
);

export default function VoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef(false);

  const executeVoiceAction = (transcript: string) => {
    const cmd = transcript.toLowerCase().trim();
    const audio = document.querySelector('audio');

    const findAudioBtn = (label: string) =>
      Array.from(document.querySelectorAll('.audio-controls button')).find(
        (b) => b.textContent?.trim().toLowerCase().includes(label)
      ) as HTMLButtonElement | undefined;

    if (cmd.includes('play') || cmd.includes('resume') || cmd.includes('start')) {
      setLastCommand('▶ Play');
      if (audio) {
        audio.play().catch(() => {});
      } else {
        // Click first verse in Mushaf or Surah view if player isn't open yet
        const firstMushafAyah = document.querySelector(
          '.mushaf-ayah-span'
        ) as HTMLElement | null;
        const firstSurahBtn = document.querySelector(
          '.ayah-card .play-btn'
        ) as HTMLButtonElement | null;
        if (firstMushafAyah) firstMushafAyah.click();
        else if (firstSurahBtn) firstSurahBtn.click();
      }
    } else if (cmd.includes('pause') || cmd.includes('stop')) {
      setLastCommand('❚❚ Pause');
      if (audio && !audio.paused) {
        audio.pause();
      }
    } else if (cmd.includes('next')) {
      setLastCommand('⏭ Next');
      const nextBtn = findAudioBtn('next');
      if (nextBtn && !nextBtn.disabled) {
        nextBtn.click();
      } else {
        const nextPageBtn = Array.from(
          document.querySelectorAll('.mushaf-toolbar button')
        ).find((b) =>
          b.textContent?.includes('Next Page')
        ) as HTMLButtonElement | undefined;
        nextPageBtn?.click();
      }
    } else if (cmd.includes('previous') || cmd.includes('prev') || cmd.includes('back')) {
      setLastCommand('⏮ Previous');
      const prevBtn = findAudioBtn('prev');
      if (prevBtn && !prevBtn.disabled) {
        prevBtn.click();
      } else {
        const prevPageBtn = Array.from(
          document.querySelectorAll('.mushaf-toolbar button')
        ).find((b) =>
          b.textContent?.includes('Prev Page')
        ) as HTMLButtonElement | undefined;
        prevPageBtn?.click();
      }
    } else if (cmd.includes('loop') || cmd.includes('repeat')) {
      setLastCommand('🔁 Toggle Loop');
      const loopBtn = findAudioBtn('loop');
      loopBtn?.click();
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const latest = event.results[event.results.length - 1];
      if (latest && latest.isFinal) {
        const spokenText = latest[0].transcript;
        executeVoiceAction(spokenText);
      }
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        try {
          recognition.start();
        } catch {
          // Ignore rapid restart errors
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error === 'not-allowed') {
        shouldListenRef.current = false;
        setIsListening(false);
        setLastCommand('Mic blocked');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldListenRef.current = false;
      try {
        recognition.stop();
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!lastCommand) return;
    const t = setTimeout(() => setLastCommand(null), 2200);
    return () => clearTimeout(t);
  }, [lastCommand]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      shouldListenRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      shouldListenRef.current = true;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(true);
      }
    }
  };

  if (!supported) return null;

  return (
    <div className="qh-voice-wrap">
      {lastCommand && <span className="qh-voice-toast">{lastCommand}</span>}

      <button
        onClick={toggleMic}
        className={`qh-voice-btn ${isListening ? 'listening' : ''}`}
        aria-label={isListening ? 'Mute Voice Commands' : 'Unmute Voice Commands'}
        title="Voice Commands: Say Play, Pause, Next, Previous, or Loop"
      >
        <MicIcon muted={!isListening} />
        <span>{isListening ? 'Listening' : 'Voice'}</span>
      </button>
    </div>
  );
}
