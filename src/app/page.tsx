"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  audio: string;
}

interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
}

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { id: "ar.abdurrahmaansudais", name: "Abdur-Rahman As-Sudais" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
  { id: "ar.minshawi", name: "Mohamed Siddiq Al-Minshawi" },
];

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
  const [revealedAyahs, setRevealedAyahs] = useState<Record<number, boolean>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
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
    setRevealedAyahs({});

    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${selectedSurah}/editions/${reciter},en.sahih`
      );
      const json = await response.json();

      if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
        const arabicEdition = json.data[0];
        const englishEdition = json.data[1];

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

  const currentAyah =
    surahData && currentAyahIndex !== null
      ? surahData.ayahs[currentAyahIndex]
      : null;

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

  const handlePlayAyah = (index: number) => {
    if (currentAyahIndex === index) {
      setIsPlaying((prev) => !prev);
    } else {
      setCurrentAyahIndex(index);
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    if (!surahData || currentAyahIndex === null) return;
    if (repeatAyah && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }
    if (currentAyahIndex + 1 < surahData.ayahs.length) {
      setCurrentAyahIndex(currentAyahIndex + 1);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setCurrentAyahIndex(null);
    }
  };

  const toggleHifzMode = () => {
    setHifzMode((prev) => !prev);
    setRevealedAyahs({});
  };

  const toggleRevealAyah = (ayahNumber: number) => {
    setRevealedAyahs((prev) => ({
      ...prev,
      [ayahNumber]: !prev[ayahNumber],
    }));
  };

  return (
    <>
      <header className="navbar">
        <div className="nav-container">
          <div className="brand">
            <span>📖 QuranHifz</span>
          </div>

          <div className="controls-group">
            <select
              aria-label="Select Surah"
              className="select-input"
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(Number(e.target.value))}
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
              onChange={(e) => setReciter(e.target.value)}
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className={`btn ${hifzMode ? "btn-active" : ""}`}
            onClick={toggleHifzMode}
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
              {surahData.ayahs.map((ayah, idx) => {
                const ayahPlaying = currentAyahIndex === idx && isPlaying;
                const isRevealed = !hifzMode || Boolean(revealedAyahs[ayah.number]);
                const isHidden = hifzMode && !isRevealed;

                return (
                  <article
                    key={ayah.number}
                    id={`ayah-${ayah.numberInSurah}`}
                    className={`verse-card ${ayahPlaying ? "playing" : ""}`}
                  >
                    <div className="verse-header">
                      <span className="verse-badge">
                        {surahData.number}:{ayah.numberInSurah}
                      </span>

                      <div className="controls-group">
                        {hifzMode && (
                          <button
                            type="button"
                            className="btn"
                            onClick={() => toggleRevealAyah(ayah.number)}
                          >
                            <span>{isRevealed ? "Hide" : "Reveal"}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className={`btn ${ayahPlaying ? "btn-active" : ""}`}
                          onClick={() => handlePlayAyah(idx)}
                        >
                          <span>{ayahPlaying ? "❚❚ Pause" : "▶ Listen"}</span>
                        </button>
                      </div>
                    </div>

                    <p
                      className={`arabic-text ${isHidden ? "hifz-blurred" : ""}`}
                      onClick={() => isHidden && toggleRevealAyah(ayah.number)}
                    >
                      {ayah.text}
                    </p>

                    <p
                      className={`translation-text ${isHidden ? "hifz-blurred" : ""}`}
                      onClick={() => isHidden && toggleRevealAyah(ayah.number)}
                    >
                      {ayah.translation}
                    </p>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>

      {surahData && currentAyah && (
        <div className="audio-bar">
          <div className="audio-container">
            <div>
              <strong>{surahData.englishName}</strong> — Ayah{" "}
              {currentAyah.numberInSurah} of {surahData.ayahs.length}
            </div>

            <div className="audio-controls">
              <button
                type="button"
                className="btn"
                disabled={currentAyahIndex === 0}
                onClick={() => {
                  if (currentAyahIndex !== null && currentAyahIndex > 0) {
                    setCurrentAyahIndex(currentAyahIndex - 1);
                    setIsPlaying(true);
                  }
                }}
              >
                ◀ Prev
              </button>

              <button
                type="button"
                className="play-btn"
                onClick={() => setIsPlaying((prev) => !prev)}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>

              <button
                type="button"
                className="btn"
                disabled={currentAyahIndex === surahData.ayahs.length - 1}
                onClick={() => {
                  if (
                    currentAyahIndex !== null &&
                    currentAyahIndex + 1 < surahData.ayahs.length
                  ) {
                    setCurrentAyahIndex(currentAyahIndex + 1);
                    setIsPlaying(true);
                  }
                }}
              >
                Next ▶
              </button>

              <button
                type="button"
                className={`btn ${repeatAyah ? "btn-active" : ""}`}
                onClick={() => setRepeatAyah((prev) => !prev)}
              >
                ↻ Repeat Ayah: {repeatAyah ? "ON" : "OFF"}
              </button>
            </div>

            <audio ref={audioRef} onEnded={handleAudioEnded} preload="auto" />
          </div>
        </div>
      )}
    </>
  );
}
