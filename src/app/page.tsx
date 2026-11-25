"use client";

import React, { useEffect, useState, useCallback } from "react";
import { SurahMeta, SurahDetail, Ayah } from "../types/quran";
import SurahSelector from "../components/SurahSelector";
import VerseCard from "../components/VerseCard";
import AudioPlayer from "../components/AudioPlayer";

export default function QuranHifzPage() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [reciter, setReciter] = useState<string>("ar.alafasy");
  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentAyahIndex, setCurrentAyahIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [repeatAyah, setRepeatAyah] = useState<boolean>(false);
  const [hifzMode, setHifzMode] = useState<boolean>(false);

  useEffect(() => {
    fetch("https://alquran.cloud")
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          setSurahs(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const loadSurah = useCallback(async () => {
    setLoading(true);
    setIsPlaying(false);
    setCurrentAyahIndex(null);

    try {
      const response = await fetch(
        `https://alquran.cloud/${selectedSurah}/editions/${reciter},en.sahih`
      );
      const json = await response.json();

      if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
        const arabicEdition = json.data;
        const englishEdition = json.data;

        const mergedAyahs: Ayah[] = arabicEdition.ayahs.map(
          (
            item: {
              number: number;
              numberInSurah: number;
              text: string;
              audio: string;
            },
            idx: number
          ) => ({
            number: item.number,
            numberInSurah: item.numberInSurah,
            text: item.text,
            audio: item.audio,
            translation: englishEdition.ayahs[idx]?.text ?? "",
          })
        );

        setSurahData({
          number: arabicEdition.number,
          name: arabicEdition.name,
          englishName: arabicEdition.englishName,
          englishNameTranslation: arabicEdition.englishNameTranslation,
          numberOfAyahs: arabicEdition.numberOfAyahs,
          revelationType: arabicEdition.revelationType,
          ayahs: mergedAyahs,
        });
      }
    } catch (error) {
      console.error("Failed to fetch Surah:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedSurah, reciter]);

  useEffect(() => {
    loadSurah();
  }, [loadSurah]);

  const handlePlayAyah = (index: number) => {
    if (currentAyahIndex === index) {
      setIsPlaying((prev) => !prev);
    } else {
      setCurrentAyahIndex(index);
      setIsPlaying(true);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="nav-container">
          <div className="brand">
            <span>📖 QuranHifz</span>
          </div>

          <SurahSelector
            surahs={surahs}
            selectedSurah={selectedSurah}
            onSelectSurah={setSelectedSurah}
            reciter={reciter}
            onSelectReciter={setReciter}
          />

          <button
            type="button"
            className={`btn ${hifzMode ? "btn-active" : ""}`}
            onClick={() => setHifzMode((prev) => !prev)}
            title="Blur verses to test your memorization"
          >
            <span>Hifz Mode: {hifzMode ? "ON" : "OFF"}</span>
          </button>
        </div>
      </header>

      <main className="container">
        {loading || !surahData ? (
          <div className="loader">Loading Surah...</div>
        ) : (
          <>
            <section className="surah-banner">
              <div className="arabic-title">{surahData.name}</div>
              <h1>
                {surahData.number}. {surahData.englishName}
              </h1>
              <p>
                {surahData.englishNameTranslation} • {surahData.revelationType} •{" "}
                {surahData.numberOfAyahs} Ayahs
              </p>
              <div style={{ marginTop: "1rem" }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => handlePlayAyah(0)}
                >
                  <span>▶ Play Full Surah</span>
                </button>
              </div>
            </section>

            {surahData.number !== 1 && surahData.number !== 9 && (
              <div className="bismillah">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>
            )}

            <div>
              {surahData.ayahs.map((ayah, idx) => (
                <VerseCard
                  key={ayah.number}
                  ayah={ayah}
                  surahNumber={surahData.number}
                  index={idx}
                  isPlaying={currentAyahIndex === idx && isPlaying}
                  hifzMode={hifzMode}
                  onPlayAyah={handlePlayAyah}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {surahData && (
        <AudioPlayer
          ayahs={surahData.ayahs}
          currentIndex={currentAyahIndex}
          isPlaying={isPlaying}
          repeatAyah={repeatAyah}
          surahName={surahData.englishName}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
          onChangeIndex={(newIdx) => {
            setCurrentAyahIndex(newIdx);
            setIsPlaying(true);
          }}
          onToggleRepeat={() => setRepeatAyah((prev) => !prev)}
          onStop={() => {
            setIsPlaying(false);
            setCurrentAyahIndex(null);
          }}
        />
      )}
    </>
  );
}
