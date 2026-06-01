import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { venues } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import ScoreBadge from '../../components/ScoreBadge';
import { MapPin, Star } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useTheme } from '../../context/ThemeContext';

export default function VisitorFavorites() {
  const { favorites, toggle } = useFavorites();
  const navigate = useNavigate();
  const { c } = useTheme();

  const favoriteVenues = venues.filter((v) => favorites.includes(v.id));

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bgPrimary }}>
      <div className="px-5 pt-12 pb-4" style={{ background: `linear-gradient(180deg, ${c.accentBg} 0%, ${c.bgPrimary} 100%)` }}>
        <h1 className="text-2xl font-bold" style={{ color: c.textPrimary }}>Mes favoris</h1>
        <p className="text-sm mt-1" style={{ color: c.textSecondary }}>
          {favoriteVenues.length} lieu{favoriteVenues.length !== 1 ? 'x' : ''} sauvegardé{favoriteVenues.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="px-5 flex flex-col gap-3 pb-24">
        {favoriteVenues.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={44} className="mx-auto mb-3" style={{ color: c.accentBg }} />
            <p className="font-semibold" style={{ color: c.textSecondary }}>Aucun favori pour l'instant</p>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: c.textMuted }}>
              Appuyez sur le ♡ depuis la fiche d'un lieu<br />pour l'ajouter ici
            </p>
            <button
              onClick={() => navigate('/visiteur')}
              className="mt-5 px-6 py-3 rounded-2xl font-semibold text-white text-sm"
              style={{ backgroundColor: '#FFA43A' }}
            >
              Explorer les lieux
            </button>
          </div>
        ) : (
          favoriteVenues.map((venue) => (
            <div
              key={venue.id}
              className="rounded-2xl shadow-sm overflow-hidden"
              style={{ backgroundColor: c.bgCard, border: `1px solid ${c.borderLight}` }}
            >
              {/* Photo */}
              <div
                className="w-full relative overflow-hidden"
                style={{
                  height: 130,
                  background: `linear-gradient(135deg, ${venue.bgColor}, ${venue.bgColor2})`,
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/visiteur/lieu/${venue.id}`)}
              >
                {venue.photo && (
                  <img
                    src={venue.photo}
                    alt={venue.name}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                <div className="absolute top-2 right-2">
                  <ScoreBadge score={venue.score} size="sm" />
                </div>
                <span className="absolute bottom-2 left-2 bg-black bg-opacity-40 text-white text-xs px-2 py-0.5 rounded-full">
                  {venue.type}
                </span>
              </div>

              {/* Info + remove */}
              <div className="p-3 flex items-start gap-2">
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/visiteur/lieu/${venue.id}`)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm truncate" style={{ color: c.textPrimary }}>{venue.name}</h3>
                    <ScoreBadge score={venue.score} size="sm" showLabel />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold" style={{ color: c.textSecondary }}>{venue.rating}</span>
                    <span className="text-xs" style={{ color: c.textMuted }}>({venue.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={11} style={{ color: c.textMuted }} className="flex-shrink-0" />
                    <span className="text-xs truncate" style={{ color: c.textSecondary }}>{venue.address}, {venue.city}</span>
                    <span className="text-xs ml-auto font-semibold flex-shrink-0" style={{ color: c.accent }}>
                      {venue.distance}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => toggle(venue.id)}
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform ml-1"
                  style={{ backgroundColor: '#FEE2E2' }}
                  title="Retirer des favoris"
                >
                  <Trash2 size={16} color="#EF4444" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
