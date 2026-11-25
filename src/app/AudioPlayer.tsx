"use client";

import React, { useEffect, useRef } from "react";
import { Ayah } from "@/types/quran";

interface AudioPlayerProps {
  ayahs: Ayah[];
  currentIndex: number | null;
  isPlaying: boolean;
  repeatAyah: boolean;
  surahName: string;
  onTogglePlay: () => void;
  onChangeIndex: (newIndex: number) => void;
  onToggleRepeat: () => void;
  onStop: () => void;
}

export default function AudioPlayer({
  ayahs,
  currentIndex,
  isPlaying,
  repeatAyah,
  surahName,
  onTogglePlay,
  onChangeIndex,
  onToggleRepeat,
  onStop,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAyah = currentIndex !== null ? ayahs[currentIndex] : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAyah) return;

    if (audio.src !== currentAyah.audio) {
      audio.src = currentAyah.audio;
    }

    if (isPlaying) {
      audio.play().catch(() => {});
      const el = document.getElementById(`ayah-${currentAyah.numberInSurah}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      audio.pause();
    }
  }, [currentAyah, isPlaying]);

  const handleEnded = () => {
    if (currentIndex === null) return;
    if (repeatAyah && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }
    if (currentIndex + 1 < ayahs.length) {
      onChangeIndex(currentIndex + 1);
    } else {
      onStop();
    }
  };

  if (!currentAyah) return null;

  return (
    <div className="audio-bar">
      <div className="audio-container">
        <div>
          <strong>{surahName}</strong> — Ayah {currentAyah.numberInSurah} of{" "}
          {ayahs.length}
        </div>

        <div className="audio-controls">
          <button
            type="button"
            className="btn"
            disabled={currentIndex === 0}
            onClick={() =>
              currentIndex !== null &&
              currentIndex > 0 &&
              onChangeIndex(currentIndex - 1)
            }
            aria-label="Previous Ayah"
          >
            ◀ Prev
          </button>

          <button
            type="button"
            className="play-btn"
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>

          <button
            type="button"
            className="btn"
            disabled={currentIndex === ayahs.length - 1}
            onClick={() =>
              currentIndex !== null &&
              currentIndex + 1 < ayahs.length &&
              onChangeIndex(currentIndex + 1)
            }
            aria-label="Next Ayah"
          >
            Next ▶
          </button>

          <button
            type="button"
            className={`btn ${repeatAyah ? "btn-active" : ""}`}
            onClick={onToggleRepeat}
            title="Repeat current ayah for Hifz memorization"
          >
            ↻ Repeat Ayah: {repeatAyah ? "ON" : "OFF"}
          </button>
        </div>

        <audio ref={audioRef} onEnded={handleEnded} preload="auto" />
      </div>
    </div>
  );
}
