'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SurahSummary {
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
  arabicText: string;
  translationText: string;
  audioUrl: string;
  page?: number;
  juz?: number;
  surahNumber?: number;
  surahName?: string;
  surahEnglishName?: string;
}

interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  ayahs: Ayah[];
}

const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary (Hifz)' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi' },
];

const toArabicDigits = (num: number) =>
  num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

export default function QuranHifzPage() {
  const [viewMode, setViewMode] = useState<'mushaf' | 'surah'>('mushaf');
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [reciter, setReciter] = useState<string>('ar.alafasy');

  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [pageAyahs, setPageAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeAyahIndex, setActiveAyahIndex] = useState<number | null>(null);
  const [isRepeatAyah, setIsRepeatAyah] = useState<boolean>(false);
  const [hideTranslation, setHideTranslation] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeCardRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch Surah Index
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) setSurahs(data.data);
      });
  }, []);

  // 2. Fetch Surah Hifz View Data
  useEffect(() => {
    if (viewMode !== 'surah') return;
    setLoading(true);
    setActiveAyahIndex(null);

    fetch(
      `https://api.alquran.cloud/v1/surah/${selectedSurahNum}/editions/quran-uthmani,en.sahih,${reciter}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200 && Array.isArray(data.data)) {
          const [arabicEdition, englishEdition, audioEdition] = data.data;
          const combinedAyahs: Ayah[] = arabicEdition.ayahs.map(
            (ayah: any, index: number) => ({
              number: ayah.number,
              numberInSurah: ayah.numberInSurah,
              arabicText: ayah.text,
              translationText: englishEdition.ayahs[index]?.text || '',
              audioUrl: audioEdition.ayahs[index]?.audio || '',
            })
          );

          setSurahDetail({
            number: arabicEdition.number,
            name: arabicEdition.name,
            englishName: arabicEdition.englishName,
            englishNameTranslation: arabicEdition.englishNameTranslation,
            ayahs: combinedAyahs,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedSurahNum, reciter, viewMode]);

  // 3. Fetch Real 604-Page Mushaf Data
  useEffect(() => {
    if (viewMode !== 'mushaf') return;
    setLoading(true);
    setActiveAyahIndex(null);

    Promise.all([
      fetch(`https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`).then(
        (r) => r.json()
      ),
      fetch(`https://api.alquran.cloud/v1/page/${pageNumber}/${reciter}`).then(
        (r) => r.json()
      ),
    ])
      .then(([arabicRes, audioRes]) => {
        if (arabicRes.code === 200 && audioRes.code === 200) {
          const combined: Ayah[] = arabicRes.data.ayahs.map(
            (ayah: any, idx: number) => ({
              number: ayah.number,
              numberInSurah: ayah.numberInSurah,
              arabicText: ayah.text,
              translationText: '',
              audioUrl: audioRes.data.ayahs[idx]?.audio || '',
              page: ayah.page,
              juz: ayah.juz,
              surahNumber: ayah.surah?.number,
              surahName: ayah.surah?.name,
              surahEnglishName: ayah.surah?.englishName,
            })
          );
          setPageAyahs(combined);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pageNumber, reciter, viewMode]);

  const activeAyahList =
    viewMode === 'mushaf' ? pageAyahs : surahDetail?.ayahs || [];

  const currentAyah =
    activeAyahIndex !== null && activeAyahList[activeAyahIndex]
      ? activeAyahList[activeAyahIndex]
      : null;

  // 4. Play Audio & Scroll Active Ayah Into View
  useEffect(() => {
    if (currentAyah && audioRef.current) {
      audioRef.current.src = currentAyah.audioUrl;
      audioRef.current.play().catch(() => {});
    }
    if (activeCardRef.current) {
      activeCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentAyah]);

  const handleAudioEnded = () => {
    if (activeAyahIndex === null) return;

    if (isRepeatAyah && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    if (activeAyahIndex + 1 < activeAyahList.length) {
      setActiveAyahIndex(activeAyahIndex + 1);
    } else {
      setActiveAyahIndex(null);
    }
  };

  const currentJuz = pageAyahs[0]?.juz || 1;
  const surahNamesOnPage = Array.from(
    new Set(pageAyahs.map((a) => a.surahEnglishName).filter(Boolean))
  ).join(' • ');

  const activeLabel =
    viewMode === 'mushaf'
      ? `Page ${pageNumber}`
      : surahDetail?.englishName || '';

  return (
    <>
      {/* TOP NAVIGATION BAR */}
      <header className="app-header">
        <div className="brand">
          <h1>QuranHifz</h1>
          <span className="brand-tag">Shahadah Studios</span>
        </div>

        <div className="controls">
          <div className="mode-tabs">
            <button
              className={`mode-tab ${viewMode === 'mushaf' ? 'active' : ''}`}
              onClick={() => setViewMode('mushaf')}
            >
              Mushaf (604 Pages)
            </button>
            <button
              className={`mode-tab ${viewMode === 'surah' ? 'active' : ''}`}
              onClick={() => setViewMode('surah')}
            >
              Surah Hifz View
            </button>
          </div>

          {viewMode === 'surah' && (
            <select
              aria-label="Select Surah"
              value={selectedSurahNum}
              onChange={(e) => setSelectedSurahNum(Number(e.target.value))}
            >
              {surahs.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.englishName} ({s.name})
                </option>
              ))}
            </select>
          )}

          <select
            aria-label="Select Reciter"
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {viewMode === 'surah' && (
            <button onClick={() => setHideTranslation(!hideTranslation)}>
              {hideTranslation ? 'Show Translation' : 'Hide Translation'}
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      {loading ? (
        <div className="loader">Loading Mushaf...</div>
      ) : viewMode === 'mushaf' ? (
        /* REAL 604-PAGE MUSHAF VIEW */
        <main className="sf-container">
          <div className="mushaf-toolbar">
            <button
              className="sf-btn"
              onClick={() => setPageNumber(Math.min(604, pageNumber + 1))}
              disabled={pageNumber >= 604}
            >
              ← Next Page
            </button>

            <div className="mushaf-meta">
              <span className="sf-badge">Juz {currentJuz}</span>
              <span className="mushaf-surah-title">{surahNamesOnPage}</span>
              <label className="page-jump">
                Page{' '}
                <input
                  type="number"
                  min={1}
                  max={604}
                  value={pageNumber}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= 604) setPageNumber(val);
                  }}
                />{' '}
                / 604
              </label>
            </div>

            <button
              className="sf-btn"
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
            >
              Prev Page →
            </button>
          </div>

          <div className="mushaf-page-frame">
            <div className="mushaf-page-inner" dir="rtl" lang="ar">
              {pageAyahs.map((ayah, idx) => {
                const isActive = idx === activeAyahIndex;
                const isNewSurah = ayah.numberInSurah === 1;

                return (
                  <React.Fragment key={ayah.number}>
                    {isNewSurah && (
                      <div className="mushaf-surah-header">
                        <span>{ayah.surahName}</span>
                        {ayah.surahNumber !== 1 && ayah.surahNumber !== 9 && (
                          <div className="mushaf-bismillah">
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                          </div>
                        )}
                      </div>
                    )}

                    <span
                      onClick={() => setActiveAyahIndex(idx)}
                      className={`mushaf-ayah-span ${isActive ? 'active' : ''}`}
                      title={`Click to listen (${ayah.surahEnglishName} ${ayah.numberInSurah})`}
                    >
                      {ayah.arabicText}{' '}
                      <span className="ayah-end-symbol">
                        ﴿{toArabicDigits(ayah.numberInSurah)}﴾
                      </span>{' '}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>

            <div className="mushaf-page-footer">
              <span>{toArabicDigits(pageNumber)}</span>
            </div>
          </div>
        </main>
      ) : (
        /* VERSE-BY-VERSE SURAH HIFZ VIEW */
        surahDetail && (
          <main className="container">
            <div className="surah-banner">
              <h2>{surahDetail.name}</h2>
              <p>
                {surahDetail.englishName} ({surahDetail.englishNameTranslation}) •{' '}
                {surahDetail.ayahs.length} Ayahs
              </p>
              <button
                className="play-btn"
                style={{ marginTop: '1rem' }}
                onClick={() => setActiveAyahIndex(0)}
              >
                ▶ Play Full Surah
              </button>
            </div>

            {surahDetail.ayahs.map((ayah, idx) => {
              const isActive = idx === activeAyahIndex;
              return (
                <div
                  key={ayah.number}
                  ref={isActive ? activeCardRef : null}
                  className={`ayah-card ${isActive ? 'active' : ''}`}
                >
                  <div className="ayah-top-bar">
                    <span className="ayah-badge">
                      {surahDetail.number}:{ayah.numberInSurah}
                    </span>
                    <button
                      className="play-btn"
                      onClick={() => setActiveAyahIndex(idx)}
                    >
                      {isActive ? 'Playing...' : '▶ Listen'}
                    </button>
                  </div>

                  <p className="arabic-text">{ayah.arabicText}</p>

                  {!hideTranslation && (
                    <p className="translation-text">{ayah.translationText}</p>
                  )}
                </div>
              );
            })}
          </main>
        )
      )}

      {/* STICKY AUDIO PLAYER */}
      {currentAyah && activeAyahIndex !== null && (
        <div className="audio-bar">
          <div className="audio-inner">
            <div className="audio-info">
              Playing: {activeLabel} — Ayah {currentAyah.numberInSurah}
            </div>

            <audio
              ref={audioRef}
              controls
              onEnded={handleAudioEnded}
              style={{ height: '36px', maxWidth: '300px' }}
            />

            <div className="audio-controls">
              <button
                onClick={() =>
                  setActiveAyahIndex(Math.max(0, activeAyahIndex - 1))
                }
                disabled={activeAyahIndex === 0}
              >
                Prev
              </button>

              <button
                onClick={() =>
                  setActiveAyahIndex(
                    Math.min(activeAyahList.length - 1, activeAyahIndex + 1)
                  )
                }
                disabled={activeAyahIndex === activeAyahList.length - 1}
              >
                Next
              </button>

              <button
                onClick={() => setIsRepeatAyah(!isRepeatAyah)}
                className={isRepeatAyah ? 'repeat-active' : ''}
                title="Repeat current verse for Hifz memorization"
              >
                {isRepeatAyah ? 'Hifz Loop: ON' : 'Hifz Loop: OFF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
