'use client';

import { useEffect } from 'react';

const BISMILLAH_PREFIXES = [
  'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ',
  'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ',
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ',
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ',
];

function stripDuplicateBismillah() {
  // 1. Clean Surah Hifz View (Ayah 1 cards where badge is NOT "1:1")
  document.querySelectorAll('.ayah-card').forEach((card) => {
    const badge = card.querySelector('.ayah-badge')?.textContent?.trim();
    if (!badge || !badge.endsWith(':1') || badge === '1:1') return;

    const arabicEl = card.querySelector('.arabic-text');
    if (!arabicEl || !arabicEl.textContent) return;

    for (const prefix of BISMILLAH_PREFIXES) {
      if (arabicEl.textContent.startsWith(prefix)) {
        arabicEl.textContent = arabicEl.textContent.slice(prefix.length).trim();
        break;
      }
    }
  });

  // 2. Clean 604-Page Mushaf View (when a Surah header with Bismillah sits right above Ayah 1)
  document.querySelectorAll('.mushaf-surah-header').forEach((header) => {
    if (!header.querySelector('.mushaf-bismillah')) return;
    const firstAyah = header.nextElementSibling;
    if (!firstAyah || !firstAyah.classList.contains('mushaf-ayah-span')) return;

    const textNode = firstAyah.firstChild;
    if (textNode && textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
      for (const prefix of BISMILLAH_PREFIXES) {
        if (textNode.textContent.startsWith(prefix)) {
          textNode.textContent = textNode.textContent.slice(prefix.length).trim();
          break;
        }
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
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
