'use client';

import { useTranslations } from 'next-intl';

import { formatYear } from './timeline';

interface TimelineSliderProps {
  years: readonly number[];
  year: number;
  onYearChange: (year: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
}

/**
 * TimelineSlider — overlaid bottom control to navigate through time. Drag (or
 * keyboard arrows) to change the year; play/pause auto-advances. The map updates
 * in real time as the year changes.
 */
export function TimelineSlider({
  years,
  year,
  onYearChange,
  playing,
  onTogglePlay
}: TimelineSliderProps) {
  const t = useTranslations('TimelineSlider');
  const min = years[0];
  const max = years[years.length - 1];
  const step = years.length > 1 ? years[1] - years[0] : 1;

  return (
    <div className="flex items-center gap-3 rounded-full bg-white/85 px-4 py-2 shadow-md backdrop-blur-sm">
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={playing ? t('pause') : t('play')}
        className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-200/70"
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="1.5" y="1" width="3" height="10" rx="0.5" fill="currentColor" />
            <rect x="7.5" y="1" width="3" height="10" rx="0.5" fill="currentColor" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2.5 1.5 10.5 6 2.5 10.5z" fill="currentColor" />
          </svg>
        )}
      </button>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={year}
        onChange={(e) => onYearChange(Number(e.target.value))}
        aria-label={t('year')}
        className="h-1 w-56 cursor-pointer accent-neutral-700 sm:w-72"
      />
      <span className="w-14 text-right font-serif text-sm text-neutral-800 tabular-nums">
        {formatYear(year)}
      </span>
    </div>
  );
}
