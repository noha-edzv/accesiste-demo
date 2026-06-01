import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Star, ChevronRight, Calendar } from 'lucide-react';
import { venues, reviews } from '../../data/mockData';
import ScoreBadge from '../../components/ScoreBadge';
import { useFavorites } from '../../hooks/useFavorites';
import { useTheme } from '../../context/ThemeContext';

const scoreLabels = { A: 'Fiable', B: 'Partiel', C: 'Non-conforme' };

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { c } = useTheme();
  const [activeTab, setActiveTab] = useState<'info' | 'materiel' | 'avis'>('info');

  const { isFavorite, toggle: toggleFavorite } = useFavorites();

  const venue = venues.find((v) => v.id === id);
  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-400">Lieu introuvable</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-orange font-medium" style={{ color: '#FF8400' }}>
          Retour
        </button>
      </div>
    );
  }

  const venueReviews = reviews.filter((r) => r.venueId === id);
  const totalScore = venue.sections.reduce((sum, s) => sum + s.score, 0);
  const maxScore = venue.sections.reduce((sum, s) => sum + s.maxScore, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bgPrimary }}>
      {/* Hero image */}
      <div
        className="relative w-full h-52 flex items-end overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${venue.bgColor}, ${venue.bgColor2})` }}
      >
        {venue.photo && (
          <img
            src={venue.photo}
            alt={venue.name}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow"
          >
            <ArrowLeft size={18} color="#0B0829" />
          </button>
          <button
            onClick={() => toggleFavorite(venue.id)}
            className="w-9 h-9 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow active:scale-90 transition-transform"
          >
            <Heart
              size={18}
              color={isFavorite(venue.id) ? '#EF4444' : '#0B0829'}
              fill={isFavorite(venue.id) ? '#EF4444' : 'none'}
            />
          </button>
        </div>

        {/* Hero text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-end justify-between">
            <h1 className="text-white font-bold text-xl leading-tight flex-1 pr-3">{venue.name}</h1>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: venue.score === 'A' ? '#22C55E' : venue.score === 'B' ? '#EAB308' : '#EF4444' }}
            >
              <span className="text-white font-bold text-sm">{venue.score}</span>
              <span className="text-white text-xs">{scoreLabels[venue.score]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {/* Rating row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={star <= Math.floor(venue.rating) ? 'fill-yellow-400 text-yellow-400' : ''}
                style={star > Math.floor(venue.rating) ? { color: c.border } : {}}
              />
            ))}
          </div>
          <span className="text-sm font-semibold" style={{ color: c.textPrimary }}>{venue.rating}</span>
          <span className="text-sm" style={{ color: c.textMuted }}>({venue.reviewCount} avis)</span>
          <span className="ml-auto text-xs" style={{ color: c.textMuted }}>{venue.type}</span>
        </div>

        {/* Accessibility chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {venue.accessibilityFeatures.map((feature) => (
            <span
              key={feature}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: c.accentBg, color: c.accent }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Address */}
        <div
          className="flex items-center gap-2 p-3 rounded-xl mb-4"
          style={{ backgroundColor: c.bgSurface }}
        >
          <MapPin size={16} style={{ color: c.accent }} className="flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: c.textPrimary }}>{venue.address}</p>
            <p className="text-xs" style={{ color: c.textSecondary }}>{venue.postalCode} {venue.city} · {venue.distance}</p>
          </div>
          <ChevronRight size={16} style={{ color: c.textMuted }} />
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-4 rounded-xl p-1" style={{ backgroundColor: c.bgSurface }}>
          {(['info', 'materiel', 'avis'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab ? c.bgCard : 'transparent',
                color: activeTab === tab ? '#FFA43A' : c.textSecondary,
                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {tab === 'info' ? 'Info' : tab === 'materiel' ? 'Matériel' : 'Avis'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'info' && (
          <div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: c.textSecondary }}>{venue.description}</p>

            {/* Score gauge */}
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: c.bgSurface }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm" style={{ color: c.textPrimary }}>Score AccesSite</h3>
                <div className="flex items-center gap-1">
                  <ScoreBadge score={venue.score} size="md" showLabel />
                </div>
              </div>
              <div className="w-full rounded-full h-2.5 mb-3" style={{ backgroundColor: c.border }}>
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${(totalScore / maxScore) * 100}%`,
                    backgroundColor: venue.score === 'A' ? '#22C55E' : venue.score === 'B' ? '#EAB308' : '#EF4444',
                  }}
                />
              </div>
              <p className="text-xs text-right" style={{ color: c.textSecondary }}>{totalScore}/{maxScore} points</p>

              {venue.sections.map((section) => (
                <div key={section.id} className="flex items-center gap-2 mt-2">
                  <span className="text-xs w-32 truncate" style={{ color: c.textSecondary }}>{section.name}</span>
                  <div className="flex-1 rounded-full h-1.5" style={{ backgroundColor: c.border }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${(section.score / section.maxScore) * 100}%`,
                        backgroundColor: (section.score / section.maxScore) >= 0.8 ? '#22C55E' : (section.score / section.maxScore) >= 0.6 ? '#EAB308' : '#EF4444',
                      }}
                    />
                  </div>
                  <span className="text-xs w-10 text-right" style={{ color: c.textMuted }}>{section.score}/{section.maxScore}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'materiel' && (
          <div className="flex flex-col gap-3">
            {venue.equipment.map((eq) => (
              <div
                key={eq.id}
                className="flex items-center gap-3 p-3 rounded-2xl shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                style={{ backgroundColor: c.bgCard, border: `1px solid ${c.borderLight}` }}
                onClick={() => navigate(`/visiteur/reserver/${venue.id}`)}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: c.accentBg }}
                >
                  {eq.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: c.textPrimary }}>{eq.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: c.textSecondary }}>
                    {eq.available} disponible{eq.available > 1 ? 's' : ''} / {eq.total} au total
                  </p>
                  <div className="w-full rounded-full h-1 mt-1.5" style={{ backgroundColor: c.border }}>
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${(eq.available / eq.total) * 100}%`,
                        backgroundColor: eq.available > 2 ? '#22C55E' : eq.available > 0 ? '#EAB308' : '#EF4444',
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: eq.available > 0 ? '#DCFCE7' : '#FEE2E2',
                      color: eq.available > 0 ? '#16A34A' : '#DC2626',
                    }}
                  >
                    {eq.available > 0 ? 'Disponible' : 'Épuisé'}
                  </span>
                  <ChevronRight size={14} style={{ color: c.textMuted }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="flex flex-col gap-3">
            {venueReviews.length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: c.textMuted }}>Aucun avis pour le moment.</p>
            )}
            {venueReviews.map((review) => (
              <div key={review.id} className="rounded-2xl p-4" style={{ backgroundColor: c.bgSurface }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#8FA0D8' }}>
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: c.textPrimary }}>{review.author}</p>
                      <p className="text-xs" style={{ color: c.textMuted }}>{review.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={12} className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : ''} style={star > review.rating ? { color: c.border } : {}} />
                    ))}
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: c.textSecondary }}>{review.comment}</p>
                <span
                  className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: c.accentBg, color: c.accent }}
                >
                  {review.accessibilityType}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 px-5 py-4 pb-6" style={{ backgroundColor: c.bgCard, borderTop: `1px solid ${c.borderLight}` }}>
        <button
          onClick={() => navigate(`/visiteur/reserver/${venue.id}`)}
          className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: '#FFA43A', boxShadow: '0 8px 24px rgba(255,164,58,0.35)' }}
        >
          <Calendar size={20} />
          Réserver du matériel
        </button>
      </div>
    </div>
  );
}
