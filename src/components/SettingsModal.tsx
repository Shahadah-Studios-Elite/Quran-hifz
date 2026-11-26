'use client';

import React, { useEffect, useState } from 'react';

const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary (Hifz)' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi' },
];

const SPEEDS = [0.75, 1, 1.25];

export default function SettingsModal() {
  const [open, setOpen] = useState(false);
  const [reciter, setReciter] = useState('ar.alafasy');
  const [speed, setSpeed] = useState(1);
  const [fontScale, setFontScale] = useState(1);
  const [nightMushaf, setNightMushaf] = useState(false);
  const [blurTest, setBlurTest] = useState(false);
  const [hasTranslationBtn, setHasTranslationBtn] = useState(false);
  const [translationHidden, setTranslationHidden] = useState(false);

  // Sync with page.tsx's Reciter <select> and saved preferences
  useEffect(() => {
    const syncState = () => {
      const reciterSelect = document.querySelector(
        'select[aria-label="Select Reciter"]'
      ) as HTMLSelectElement | null;
      if (reciterSelect && reciterSelect.value) {
        setReciter(reciterSelect.value);
      }

      const transBtn = Array.from(
        document.querySelectorAll('.controls button')
      ).find((b) =>
        b.textContent?.includes('Translation')
      ) as HTMLButtonElement | undefined;

      setHasTranslationBtn(Boolean(transBtn));
      if (transBtn) {
        setTranslationHidden(
          transBtn.textContent?.includes('Show Translation') || false
        );
      }
    };

    syncState();
    const observer = new MutationObserver(syncState);
    observer.observe(document.body, { childList: true, subtree: true });

    const savedScale = Number(localStorage.getItem('qh-font-scale'));
    if (savedScale >= 0.8 && savedScale <= 1.5) setFontScale(savedScale);

    const savedNight = localStorage.getItem('qh-night-mushaf') === 'true';
    setNightMushaf(savedNight);

    return () => observer.disconnect();
  }, []);

  // Apply Font Scale
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--qh-font-scale',
      String(fontScale)
    );
    localStorage.setItem('qh-font-scale', String(fontScale));
  }, [fontScale]);

  // Apply Night Mushaf Tint
  useEffect(() => {
    document.documentElement.classList.toggle('night-mushaf-mode', nightMushaf);
    localStorage.setItem('qh-night-mushaf', String(nightMushaf));
  }, [nightMushaf]);

  // Apply Blur Memorization Test
  useEffect(() => {
    document.documentElement.classList.toggle('hifz-blur-mode', blurTest);
  }, [blurTest]);

  // Apply Audio Playback Speed
  useEffect(() => {
    const applySpeed = () => {
      const audio = document.querySelector('audio');
      if (audio) audio.playbackRate = speed;
    };
    applySpeed();
    const interval = setInterval(applySpeed, 800);
    return () => clearInterval(interval);
  }, [speed]);

  const handleReciterChange = (newReciter: string) => {
    setReciter(newReciter);
    const reciterSelect = document.querySelector(
      'select[aria-label="Select Reciter"]'
    ) as HTMLSelectElement | null;

    if (reciterSelect) {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLSelectElement.prototype,
        'value'
      )?.set;
      nativeSetter?.call(reciterSelect, newReciter);
      reciterSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const handleToggleTranslation = () => {
    const transBtn = Array.from(
      document.querySelectorAll('.controls button')
    ).find((b) =>
      b.textContent?.includes('Translation')
    ) as HTMLButtonElement | undefined;

    if (transBtn) {
      transBtn.click();
      setTranslationHidden((prev) => !prev);
    }
  };

  return (
    <>
      {/* Gear Trigger Button (Sits right above/near Audio Controls) */}
      <button
        className="qh-gear-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open Reciter and Reading Settings"
        title="Settings & Reciter"
      >
        ⚙️ Settings
      </button>

      {/* Settings Popup Modal */}
      {open && (
        <div
          className="qh-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="qh-modal-card">
            <div className="qh-modal-header">
              <h3>⚙️ QuranHifz Settings</h3>
              <button
                className="qh-modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close Settings"
              >
                ✕
              </button>
            </div>

            {/* 1. Reciter Selector */}
            <div className="qh-setting-group">
              <label htmlFor="modal-reciter">Reciter (Qari)</label>
              <select
                id="modal-reciter"
                value={reciter}
                onChange={(e) => handleReciterChange(e.target.value)}
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Recitation Speed */}
            <div className="qh-setting-row">
              <span>Recitation Speed</span>
              <div className="qh-pill-group">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    className={speed === s ? 'repeat-active' : ''}
                    onClick={() => setSpeed(s)}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Arabic Font Size */}
            <div className="qh-setting-row">
              <span>Arabic Text Size</span>
              <div className="qh-pill-group">
                <button
                  onClick={() =>
                    setFontScale((s) => Math.max(0.8, +(s - 0.1).toFixed(1)))
                  }
                >
                  A-
                </button>
                <span className="qh-scale-val">
                  {Math.round(fontScale * 100)}%
                </span>
                <button
                  onClick={() =>
                    setFontScale((s) => Math.min(1.5, +(s + 0.1).toFixed(1)))
                  }
                >
                  A+
                </button>
              </div>
            </div>

            {/* 4. Soft Night Mushaf Paper */}
            <div className="qh-setting-row">
              <span>Soft Night Mushaf</span>
              <button
                className={nightMushaf ? 'repeat-active' : ''}
                onClick={() => setNightMushaf(!nightMushaf)}
              >
                {nightMushaf ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* 5. Hifz Blur Test */}
            <div className="qh-setting-row">
              <span>Hifz Blur Test</span>
              <button
                className={blurTest ? 'repeat-active' : ''}
                onClick={() => setBlurTest(!blurTest)}
              >
                {blurTest ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* 6. Translation Toggle (Visible in Surah Hifz View) */}
            {hasTranslationBtn && (
              <div className="qh-setting-row">
                <span>English Translation</span>
                <button
                  className={!translationHidden ? 'repeat-active' : ''}
                  onClick={handleToggleTranslation}
                >
                  {translationHidden ? 'Hidden' : 'Visible'}
                </button>
              </div>
            )}

            <button
              className="qh-primary-cta"
              style={{ width: '100%', marginTop: '0.5rem' }}
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
