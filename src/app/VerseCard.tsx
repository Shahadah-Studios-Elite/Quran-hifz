"use client";

import React, { useState, useEffect } from "react";
import { Ayah } from "@/types/quran";

interface VerseCardProps {
  ayah: Ayah;
  surahNumber: number;
  isPlaying: boolean;
  hifzMode: boolean;
  onPlayAyah: (index: number) => void;
  index: number;
}

export default function VerseCard({
  ayah,
  surahNumber,
  isPlaying,
  hifzMode,
  onPlayAyah,
  index,
}: VerseCardProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(!hifzMode);
  }, [hifzMode, ayah.number]);

  const isHidden = hifzMode && !revealed;

  return (
    <article
      id={`ayah-${ayah.numberInSurah}`}
      className={`verse-card ${isPlaying ? "playing" : ""}`}
    >
      <div className="verse-header">
        <span className="verse-badge">
          {surahNumber}:{ayah.numberInSurah}
        </span>

        <div className="controls-group">
          {hifzMode && (
            <button
              type="button"
              className="btn"
              onClick={() => setRevealed((prev) => !prev)}
              title={revealed ? "Hide verse" : "Reveal verse"}
            >
              <span>{revealed ? "Hide" : "Reveal"}</span>
            </button>
          )}

          <button
            type="button"
            className={`btn ${isPlaying ? "btn-active" : ""}`}
            onClick={() => onPlayAyah(index)}
          >
            <span>{isPlaying ? "❚❚ Pause" : "▶ Listen"}</span>
          </button>
        </div>
      </div>

      <p
        className={`arabic-text ${isHidden ? "hifz-blurred" : ""}`}
        onClick={() => isHidden && setRevealed(true)}
      >
        {ayah.text}
      </p>

      <p
        className={`translation-text ${isHidden ? "hifz-blurred" : ""}`}
        onClick={() => isHidden && setRevealed(true)}
      >
        {ayah.translation}
      </p>
    </article>
  );
}
