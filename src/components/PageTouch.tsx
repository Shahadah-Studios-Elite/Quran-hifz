'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function PageTouch() {
  const [gestureToast, setGestureToast] = useState<string | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    if (!gestureToast) return;
    const timer = setTimeout(() => setGestureToast(null), 1600);
    return () => clearTimeout(timer);
  }, [gestureToast]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const target = e.target as HTMLElement | null;
      if (
        target?.closest('input, select, textarea, .qh-modal-card, .qh-landing-screen')
      ) {
        touchStartRef.current = null;
        return;
      }

      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start || e.changedTouches.length !== 1) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      const elapsed = Date.now() - start.time;

      // 1. Double-Tap on any Ayah to toggle Hifz Loop
      if (Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12 && elapsed < 260) {
        const target = e.target as HTMLElement | null;
        const onAyah = target?.closest('.mushaf-ayah-span, .ayah-card');

        if (onAyah) {
          const now = Date.now();
          if (now - lastTapRef.current < 320) {
            const loopBtn = Array.from(
              document.querySelectorAll('.audio-controls button')
            ).find((b) =>
              b.textContent?.toLowerCase().includes('loop')
            ) as HTMLButtonElement | undefined;

            if (loopBtn) {
              loopBtn.click();
              const willTurnOn = !loopBtn.classList.contains('repeat-active');
              setGestureToast(
                willTurnOn ? '🔁 Hifz Loop: ON' : '🔁 Hifz Loop: OFF'
              );
              if (navigator.vibrate) navigator.vibrate(25);
            }
            lastTapRef.current = 0;
            return;
          }
          lastTapRef.current = now;
        }
        return;
      }

      // 2. Horizontal Swipe (> 65px and clearly horizontal)
      if (
        elapsed < 550 &&
        Math.abs(deltaX) > 65 &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.6
      ) {
        const nextPageBtn = Array.from(
          document.querySelectorAll('.mushaf-toolbar button')
        ).find((b) =>
          b.textContent?.includes('Next Page')
        ) as HTMLButtonElement | undefined;

        const prevPageBtn = Array.from(
          document.querySelectorAll('.mushaf-toolbar button')
        ).find((b) =>
          b.textContent?.includes('Prev Page')
        ) as HTMLButtonElement | undefined;

        if (nextPageBtn && prevPageBtn) {
          if (deltaX > 0 && !nextPageBtn.disabled) {
            nextPageBtn.click();
            setGestureToast('← Next Page');
            if (navigator.vibrate) navigator.vibrate(18);
          } else if (deltaX < 0 && !prevPageBtn.disabled) {
            prevPageBtn.click();
            setGestureToast('Prev Page →');
            if (navigator.vibrate) navigator.vibrate(18);
          }
          return;
        }

        const findAudioBtn = (label: string) =>
          Array.from(document.querySelectorAll('.audio-controls button')).find(
            (b) => b.textContent?.trim().toLowerCase().includes(label)
          ) as HTMLButtonElement | undefined;

        if (deltaX < 0) {
          const nextAyah = findAudioBtn('next');
          if (nextAyah && !nextAyah.disabled) {
            nextAyah.click();
            setGestureToast('⏭ Next Ayah');
            if (navigator.vibrate) navigator.vibrate(18);
          }
        } else {
          const prevAyah = findAudioBtn('prev');
          if (prevAyah && !prevAyah.disabled) {
            prevAyah.click();
            setGestureToast('⏮ Previous Ayah');
            if (navigator.vibrate) navigator.vibrate(18);
          }
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  if (!gestureToast) return null;

  return <div className="qh-touch-toast">{gestureToast}</div>;
}
