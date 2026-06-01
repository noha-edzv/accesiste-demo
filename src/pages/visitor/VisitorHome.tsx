import React, { useState } from 'react';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { venues } from '../../data/mockData';
import VenueCard from '../../components/VenueCard';
import MapView from '../../components/MapView';
import AccessibilityBar from '../../components/AccessibilityBar';

const venueTypes = [
  { id: 'tous',          label: 'Tous',           emoji: '🗺️', color: '#FFA43A', bg: '#FFF0DE' },
  { id: 'Musée',         label: 'Musées',          emoji: '🏛️', color: '#E8891A', bg: '#FFA43A' },
  { id: 'Théâtre',       label: 'Théâtres',        emoji: '🎭', color: '#5C4B8A', bg: '#9B8BC4' },
  { id: 'Cinéma',        label: 'Cinémas',         emoji: '🎬', color: '#C07020', bg: '#FFC065' },
  { id: 'Piscine',       label: 'Piscines',        emoji: '🏊', color: '#1A8FAA', bg: '#A3DFF1' },
  { id: 'Médiathèque',   label: 'Médiathèques',    emoji: '📚', color: '#4A7A4A', bg: '#8FBF8F' },
  { id: 'Stade',         label: 'Stades',          emoji: '🏟️', color: '#1A1640', bg: '#4A4270' },
  { id: 'Centre culturel', label: 'Centres',       emoji: '🎨', color: '#A02020', bg: '#E08080' },
];

export default function VisitorHome() {
  const navigate = useNavigate();
  const { c } = useTheme();
  const [activeType, setActiveType] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccessibility, setShowAccessibility] = useState(false);

  const filteredVenues = venues.filter((v) => {
    const matchesSearch =
      searchQuery === '' ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeType === 'tous') return true;
    return v.type === activeType;
  });

  const typeCount = (type: string) =>
    type === 'tous' ? venues.length : venues.filter((v) => v.type === type).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bgPrimary }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ backgroundColor: c.bgPrimary }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-medium" style={{ color: c.textMuted }}>Bonjour,</p>
            <h1 className="text-2xl font-bold" style={{ color: c.textPrimary }}>Marie 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: c.accentBg }}>
              <Bell size={18} color="#E8891A" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <button
              onClick={() => setShowAccessibility(!showAccessibility)}
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md"
              style={{ backgroundColor: showAccessibility ? c.textPrimary : '#FFA43A' }}
            >
              A
            </button>
          </div>
        </div>

        {showAccessibility && (
          <div className="mb-4 p-4 rounded-2xl border" style={{ backgroundColor: c.bgCard, borderColor: c.border }}>
            <p className="text-xs font-semibold mb-3" style={{ color: c.textMuted }}>Modes d'accessibilité</p>
            <AccessibilityBar />
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: c.textMuted }} />
          <input
            type="text"
            placeholder="Chercher un lieu, une ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none"
            style={{
              backgroundColor: c.bgInput,
              color: c.textPrimary,
              border: `1.5px solid ${c.border}`,
              boxShadow: '0 2px 8px rgba(255,164,58,0.08)',
            }}
          />
        </div>
      </div>

      {/* Category cards */}
      <div className="mb-5">
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold" style={{ color: c.textPrimary }}>Filtrer par type</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-hide">
          {venueTypes.map((t) => {
            const count = typeCount(t.id);
            if (t.id !== 'tous' && count === 0) return null;
            const isActive = activeType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className="flex-shrink-0 flex flex-col justify-end rounded-2xl p-3 transition-all active:scale-95"
                style={{
                  width: 100,
                  height: 90,
                  backgroundColor: isActive ? t.color : t.bg,
                  boxShadow: isActive ? `0 6px 18px ${t.color}55` : '0 2px 8px rgba(0,0,0,0.06)',
                  border: isActive ? `2px solid ${t.color}` : '2px solid transparent',
                }}
              >
                <span className="text-2xl mb-1 block">{t.emoji}</span>
                <span className="text-xs font-bold leading-tight block text-left" style={{ color: isActive ? 'white' : 'white' }}>
                  {t.label}
                </span>
                <span className="text-[10px] mt-0.5 block text-left" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.75)' }}>
                  {count} lieu{count > 1 ? 'x' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map section */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold" style={{ color: c.textPrimary }}>À proximité</h2>
          <button
            className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: '#FFA43A' }}
            onClick={() => navigate('/visiteur/carte')}
          >
            Carte complète <ChevronRight size={13} />
          </button>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <MapView venues={filteredVenues} height={180} />
        </div>
      </div>

      {/* Venue list */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold" style={{ color: c.textPrimary }}>
            {filteredVenues.length} lieu{filteredVenues.length > 1 ? 'x' : ''} trouvé{filteredVenues.length > 1 ? 's' : ''}
          </h2>
          <button className="text-xs font-semibold" style={{ color: '#FFA43A' }}>
            Trier par score
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
          {filteredVenues.length === 0 && (
            <div className="text-center py-14" style={{ color: c.textMuted }}>
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-sm" style={{ color: c.textPrimary }}>Aucun lieu trouvé</p>
              <p className="text-xs mt-1" style={{ color: c.textSecondary }}>Essayez d'autres critères</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
