"use client";

import React from "react";
import { SurahMeta } from "@/types/quran";

interface SurahSelectorProps {
  surahs: SurahMeta[];
  selectedSurah: number;
  onSelectSurah: (surahNumber: number) => void;
  reciter: string;
  onSelectReciter: (reciterId: string) => void;
}

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { id: "ar.abdurrahmaansudais", name: "Abdur-Rahman As-Sudais" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "ar.minshawi", name: "Mohamed Siddiq Al-Minshawi" },
];

export default function SurahSelector({
  surahs,
  selectedSurah,
  onSelectSurah,
  reciter,
  onSelectReciter,
}: SurahSelectorProps) {
  return (
    <div className="controls-group">
      <select
        aria-label="Select Surah"
        className="select-input"
        value={selectedSurah}
        onChange={(e) => onSelectSurah(Number(e.target.value))}
      >
        {surahs.map((s) => (
          <option key={s.number} value={s.number}>
            {s.number}. {s.englishName} ({s.name})
          </option>
        ))}
      </select>

      <select
        aria-label="Select Reciter"
        className="select-input"
        value={reciter}
        onChange={(e) => onSelectReciter(e.target.value)}
      >
        {RECITERS.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}
