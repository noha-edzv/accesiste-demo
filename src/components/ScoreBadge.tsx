import React from 'react';
import type { Score } from '../data/mockData';

interface ScoreBadgeProps {
  score: Score;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const scoreConfig = {
  A: { color: 'bg-green-500', textColor: 'text-white', label: 'Fiable', borderColor: 'border-green-500' },
  B: { color: 'bg-yellow-400', textColor: 'text-white', label: 'Partiel', borderColor: 'border-yellow-400' },
  C: { color: 'bg-red-500', textColor: 'text-white', label: 'Non-conforme', borderColor: 'border-red-500' },
};

const sizeConfig = {
  sm: { badge: 'w-6 h-6 text-xs', label: 'text-xs', gap: 'gap-1' },
  md: { badge: 'w-8 h-8 text-sm', label: 'text-sm', gap: 'gap-1.5' },
  lg: { badge: 'w-10 h-10 text-base', label: 'text-base', gap: 'gap-2' },
};

export default function ScoreBadge({ score, size = 'md', showLabel = false }: ScoreBadgeProps) {
  const config = scoreConfig[score];
  const sz = sizeConfig[size];

  return (
    <div className={`flex items-center ${sz.gap}`}>
      <div
        className={`${config.color} ${config.textColor} ${sz.badge} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      >
        {score}
      </div>
      {showLabel && (
        <span className={`${sz.label} font-semibold`} style={{ color: score === 'A' ? '#22C55E' : score === 'B' ? '#EAB308' : '#EF4444' }}>
          {config.label}
        </span>
      )}
    </div>
  );
}
