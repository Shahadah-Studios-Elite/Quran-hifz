'use client';

import React from 'react';
import { Ayah } from '@/types/quran';

interface MushafReaderProps {
  pageNumber: number;
  ayahs: Ayah[];
  activeAyahIndex: number | null;
  onSelectAyah: (index: number) => void;
  onChangePage: (newPage: number) => void;
}

const toArabicDigits = (num: number) =>
  num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

export default function MushafReader({
  pageNumber,
  ayahs,
  activeAyahIndex,
  onSelectAyah,
  onChangePage,
}: MushafReaderProps) {
  const currentJuz = ayahs[0]?.juz || 1;
  const surahNamesOnPage = Array.from(
    new Set(ayahs.map((a) => a.surahEnglishName).filter(Boolean))
  ).join(' • ');

  return (
    <main className="sf-container">
      {/* Mushaf Page Controls */}
      <div className="mushaf-toolbar">
        <button
          className="sf-btn"
          onClick={() => onChangePage(Math.min(604, pageNumber + 1))}
          disabled={pageNumber >= 604}
          title="Next Page (Right-to-Left)"
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
                if (val >= 1 && val <= 604) onChangePage(val);
              }}
            />{' '}
            / 604
          </label>
        </div>

        <button
          className="sf-btn"
          onClick={() => onChangePage(Math.max(1, pageNumber - 1))}
          disabled={pageNumber <= 1}
          title="Previous Page (Right-to-Left)"
        >
          Prev Page →
        </button>
      </div>

      {/* Authentic Mushaf Page Frame */}
      <div className="mushaf-page-frame">
        <div className="mushaf-page-inner" dir="rtl" lang="ar">
          {ayahs.map((ayah, idx) => {
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
                  onClick={() => onSelectAyah(idx)}
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
  );
}
