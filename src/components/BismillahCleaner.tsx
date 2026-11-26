'use client';

import { useEffect } from 'react';

function removeLeadingBismillah(raw: string): string {
  // Strip tashkeel/diacritics and normalize Alif Wasla (ٱ -> ا) for reliable checking
  const stripMarks = (s: string) =>
    s
      .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
      .replace(/ٱ/g, 'ا')
      .trim();

  const words = raw.trim().split(/\s+/);
  if (words.length <= 4) return raw;

  const firstFourBase = words.slice(0, 4).map(stripMarks).join(' ');

  if (firstFourBase === 'بسم الله الرحمن الرحيم') {
    return words.slice(4).join(' ');
  }

  return raw;
}

function stripDuplicateBismillah() {
  // 1. Clean Surah Hifz View (Ayah 1 cards where badge is NOT "1:1")
  document.querySelectorAll('.ayah-card').forEach((card) => {
    const badge = card.querySelector('.ayah-badge')?.textContent?.trim();
    if (!badge || !badge.endsWith(':1') || badge === '1:1') return;

    const arabicEl = card.querySelector('.arabic-text');
    if (!arabicEl || !arabicEl.textContent) return;

    const cleaned = removeLeadingBismillah(arabicEl.textContent);
    if (cleaned !== arabicEl.textContent) {
      arabicEl.textContent = cleaned;
    }
  });

  // 2. Clean 604-Page Mushaf View (when a Surah header with Bismillah sits right above Ayah 1)
  document.querySelectorAll('.mushaf-surah-header').forEach((header) => {
    if (!header.querySelector('.mushaf-bismillah')) return;
    const firstAyah = header.nextElementSibling;
    if (!firstAyah || !firstAyah.classList.contains('mushaf-ayah-span')) return;

    const textNode = firstAyah.firstChild;
    if (textNode && textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
      const cleaned = removeLeadingBismillah(textNode.textContent);
      if (cleaned !== textNode.textContent) {
        textNode.textContent = cleaned + ' ';
      }
    }
  });
}

export default function BismillahCleaner() {
  useEffect(() => {
    stripDuplicateBismillah();

    const observer = new MutationObserver(() => {
      stripDuplicateBismillah();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
