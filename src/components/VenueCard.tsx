import React, { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScoreBadge from './ScoreBadge';
import type { Venue } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface VenueCardProps {
  venue: Venue;
  compact?: boolean;
}

export default function VenueCard({ venue, compact = false }: VenueCardProps) {
  const navigate = useNavigate();
  const { c } = useTheme();
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
      style={{ backgroundColor: c.bgCard, border: `1px solid ${c.borderLight}` }}
      onClick={() => navigate(`/visiteur/lieu/${venue.id}`)}
    >
      {/* Photo / gradient header */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          height: compact ? 80 : 160,
          background: `linear-gradient(135deg, ${venue.bgColor}, ${venue.bgColor2})`,
        }}
      >
        {venue.photo && !imgError && (
          <img
            src={venue.photo}
            alt={venue.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            style={{ display: 'block' }}
          />
        )}

        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 60%)' }}
        />

        {/* Score badge top-right */}
        <div className="absolute top-2 right-2">
          <ScoreBadge score={venue.score} size="sm" />
        </div>

        {/* Type tag bottom-left */}
        <div className="absolute bottom-2 left-2">
          <span className="bg-black bg-opacity-40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {venue.type}
          </span>
        </div>
      </div>

      {/* Info section */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm leading-tight flex-1" style={{ color: c.textPrimary }}>{venue.name}</h3>
          <ScoreBadge score={venue.score} size="sm" showLabel />
        </div>

        <div className="flex items-center gap-1 mt-1">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold" style={{ color: c.textSecondary }}>{venue.rating}</span>
          <span className="text-xs" style={{ color: c.textMuted }}>({venue.reviewCount})</span>
        </div>

        <div className="flex items-center gap-1 mt-1.5">
          <MapPin size={11} style={{ color: c.textMuted }} className="flex-shrink-0" />
          <span className="text-xs truncate" style={{ color: c.textSecondary }}>{venue.address}, {venue.city}</span>
          {!compact && (
            <span className="text-xs ml-auto font-semibold flex-shrink-0" style={{ color: c.accent }}>
              {venue.distance}
            </span>
          )}
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-1 mt-2">
            {venue.accessibilityFeatures.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: c.accentBg, color: c.accent }}
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
