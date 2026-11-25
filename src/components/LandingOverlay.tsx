'use client';

import React, { useEffect, useState } from 'react';

const QUICK_LINKS = [
  { label: 'Mushaf Page 1', href: '/?page=1#read' },
  { label: 'Al-Kahf', href: '/?surah=Al-Kahf#read' },
  { label: 'Yaseen', href: '/?surah=Yaseen#read' },
  { label: 'Al-Mulk', href: '/?surah=Al-Mulk#read' },
  { label: 'Juz Amma (Page 582)', href: '/?page=582#read' },
];

export default function LandingOverlay() {
  const [showLanding, setShowLanding] = useState(false);
  const [streak, setStreak] = useState(1);
  const [pagesToday, setPagesToday] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(5);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [lastLabel, setLastLabel] = useState<string>('Continue Reading');

  useEffect(() => {
    // 1. Update Daily Streak & Pages Tracked
    const today = new Date().toISOString().slice(0, 10);
    const savedDate = localStorage.getItem('qh-last-visit-date');
    let currentStreak = Number(localStorage.getItem('qh-streak')) || 0;

    if (savedDate !== today) {
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .slice(0, 10);
      currentStreak = savedDate === yesterday ? currentStreak + 1 : 1;
      localStorage.setItem('qh-streak', String(currentStreak));
      localStorage.setItem('qh-last-visit-date', today);
      localStorage.setItem('qh-pages-today', '0');
    }
    setStreak(Math.max(1, currentStreak));

    const savedPagesToday = Number(localStorage.getItem('qh-pages-today')) || 0;
    setPagesToday(savedPagesToday);

    const savedGoal = Number(localStorage.getItem('qh-daily-goal')) || 5;
    setDailyGoal(savedGoal);

    // 2. Check Last Read Bookmark
    const savedMode = localStorage.getItem('qh-mode');
    const savedPage = localStorage.getItem('qh-page');
    const savedSurah = localStorage.getItem('qh-surah');
    if (savedMode === 'surah' && savedSurah) {
      setLastUrl(`/?surah=${savedSurah}#read`);
      setLastLabel(`Resume Surah #${savedSurah}`);
    } else if (savedPage) {
      setLastUrl(`/?page=${savedPage}#read`);
      setLastLabel(`Resume Mushaf Page ${savedPage}`);
    }

    // 3. Decide Whether to Show Landing Page or Reader (#read / ?surah / ?page)
    const checkRoute = () => {
      const params = new URLSearchParams(window.location.search);
      const hasQuery = params.has('surah') || params.has('page');
      const isReadHash = window.location.hash === '#read';

      if (hasQuery || isReadHash) {
        setShowLanding(false);
        // Count unique pages/surahs visited today toward daily goal
        const visitKey = window.location.search || 'page=1';
        const visitedList: string[] = JSON.parse(
          localStorage.getItem(`qh-visited-${today}`) || '[]'
        );
        if (!visitedList.includes(visitKey)) {
          visitedList.push(visitKey);
          localStorage.setItem(
            `qh-visited-${today}`,
            JSON.stringify(visitedList)
          );
          localStorage.setItem('qh-pages-today', String(visitedList.length));
          setPagesToday(visitedList.length);
        }
      } else {
        setShowLanding(true);
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  const enterReader = () => {
    window.location.hash = 'read';
    setShowLanding(false);
  };

  if (!showLanding) return null;

  const progressPct = Math.min(100, Math.round((pagesToday / dailyGoal) * 100));

  return (
    <div className="qh-landing-screen">
      <div className="qh-landing-card">
        <div className="qh-landing-top">
          <span className="brand-tag">SahihFinder Imprint</span>
          <a href="https://sahihfinder.com" className="qh-back-link">
            ← Back to SahihFinder
          </a>
        </div>

        <h1 className="qh-landing-title">QuranHifz</h1>
        <p className="qh-landing-subtitle">
          Read the 604-page Uthmani Mushaf, listen verse-by-verse, and track your
          daily memorization streak.
        </p>

        {/* Daily Streak & Goal Tracker */}
        <div className="qh-stats-grid">
          <div className="qh-stat-box">
            <span className="qh-stat-value">🔥 {streak} Day{streak > 1 ? 's' : ''}</span>
            <span className="qh-stat-label">Hifz Streak</span>
          </div>

          <div className="qh-stat-box">
            <span className="qh-stat-value">
              📖 {pagesToday} / {dailyGoal}
            </span>
            <span className="qh-stat-label">Daily Target</span>
          </div>
        </div>

        <div className="qh-progress-wrap">
          <div className="qh-progress-bar">
            <div
              className="qh-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="qh-goal-adjust">
            <span>Goal:</span>
            {[3, 5, 10, 20].map((g) => (
              <button
                key={g}
                className={dailyGoal === g ? 'repeat-active' : ''}
                onClick={() => {
                  setDailyGoal(g);
                  localStorage.setItem('qh-daily-goal', String(g));
                }}
              >
                {g}p
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="qh-cta-group">
          <button className="qh-primary-cta" onClick={enterReader}>
            Start Reading!
          </button>

          {lastUrl && (
            <a href={lastUrl} className="qh-secondary-cta">
              {lastLabel}
            </a>
          )}
        </div>

        {/* Quick Shortcuts */}
        <div className="qh-quick-section">
          <span className="qh-quick-label">Quick Jump:</span>
          <div className="qh-quick-links">
            {QUICK_LINKS.map((item) => (
              <a key={item.label} href={item.href} className="qh-chip">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
