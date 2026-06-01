import React, { useState } from 'react';
import { Calendar, X, QrCode, MapPin, AlertCircle, Plus, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { reservations as initialReservations, venues } from '../../data/mockData';
import ScoreBadge from '../../components/ScoreBadge';
import { useTheme } from '../../context/ThemeContext';

const statusConfig = {
  'confirmée': { bg: '#DCFCE7', color: '#16A34A', label: 'Confirmée' },
  'en attente': { bg: '#FEF9C3', color: '#CA8A04', label: 'En attente' },
  'annulée': { bg: '#FEE2E2', color: '#DC2626', label: 'Annulée' },
  'terminée': { bg: '#F3F4F6', color: '#6B7280', label: 'Terminée' },
};

export default function VisitorReservations() {
  const navigate = useNavigate();
  const { c } = useTheme();
  const [activeTab, setActiveTab] = useState<'avenir' | 'passees'>('avenir');
  const [cancelledIds, setCancelledIds] = useState<string[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [showVenueSheet, setShowVenueSheet] = useState(false);
  const [venueSearch, setVenueSearch] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const localReservations: typeof initialReservations = JSON.parse(
    localStorage.getItem('accesiste_reservations') ?? '[]'
  );

  const allReservations = [...initialReservations, ...localReservations].map((r) =>
    cancelledIds.includes(r.id) ? { ...r, status: 'annulée' as const } : r
  );

  const upcoming = allReservations.filter(
    (r) => r.visitorName === 'Marie Dupont' && r.date >= today && r.status !== 'annulée'
  );
  const past = allReservations.filter(
    (r) =>
      r.visitorName === 'Marie Dupont' &&
      (r.date < today || r.status === 'terminée' || r.status === 'annulée')
  );

  const displayed = activeTab === 'avenir' ? upcoming : past;

  const handleCancel = (id: string) => {
    setCancelledIds((prev) => [...prev, id]);
    setConfirmId(null);
  };

  const filteredVenues = venues.filter(
    (v) =>
      venueSearch === '' ||
      v.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
      v.city.toLowerCase().includes(venueSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bgPrimary }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4" style={{ background: `linear-gradient(180deg, ${c.accentBg} 0%, ${c.bgPrimary} 100%)` }}>
        <h1 className="text-2xl font-bold" style={{ color: c.textPrimary }}>Mes réservations</h1>
        <p className="text-sm mt-1" style={{ color: c.textSecondary }}>{upcoming.length} à venir · {past.length} passées</p>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex rounded-xl p-1" style={{ backgroundColor: c.bgSurface }}>
          {(['avenir', 'passees'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab ? c.bgCard : 'transparent',
                color: activeTab === tab ? '#FFA43A' : c.textSecondary,
                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {tab === 'avenir' ? `À venir (${upcoming.length})` : `Passées (${past.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-5 flex flex-col gap-3 pb-24">
        {displayed.length === 0 && (
          <div className="text-center py-16">
            <Calendar size={40} className="mx-auto mb-3" style={{ color: c.textMuted }} />
            <p className="font-medium" style={{ color: c.textSecondary }}>Aucune réservation</p>
            <p className="text-sm mt-1" style={{ color: c.textMuted }}>
              {activeTab === 'avenir' ? 'Explorez des lieux accessibles' : 'Votre historique apparaîtra ici'}
            </p>
          </div>
        )}

        {displayed.map((res) => {
          const status = statusConfig[res.status];
          const dayLabel = new Date(res.date).toLocaleDateString('fr-FR', {
            weekday: 'short', day: 'numeric', month: 'short',
          });
          const canCancel = activeTab === 'avenir' && res.status !== 'annulée';

          return (
            <div key={res.id} className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.borderLight}` }}>
              {/* Top bar */}
              <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: c.accentBg }}>
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} style={{ color: '#FFA43A' }} />
                  <span className="text-xs font-semibold" style={{ color: '#FFA43A' }}>
                    {dayLabel} · {res.time}
                  </span>
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: c.bgSurface }}>
                    {res.equipmentIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: c.textPrimary }}>{res.equipmentName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} style={{ color: c.textMuted }} />
                      <p className="text-xs truncate" style={{ color: c.textSecondary }}>{res.venueName}</p>
                    </div>
                  </div>
                </div>

                {res.status === 'confirmée' && (
                  <div className="mt-3 p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: c.bgSurface }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.textPrimary }}>
                      <QrCode size={24} color="white" />
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: c.textSecondary }}>Code de réservation</p>
                      <p className="font-mono font-bold text-sm" style={{ color: c.textPrimary }}>{res.qrCode}</p>
                    </div>
                  </div>
                )}

                {canCancel && (
                  <button
                    onClick={() => setConfirmId(res.id)}
                    className="mt-3 w-full py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
                    style={{ borderColor: '#FCA5A5', color: '#EF4444', backgroundColor: '#FEF2F2' }}
                  >
                    <X size={14} />
                    Annuler la réservation
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB nouvelle réservation */}
      <button
        onClick={() => { setShowVenueSheet(true); setVenueSearch(''); }}
        className="fixed z-40 flex items-center gap-2 px-5 py-3.5 rounded-full font-bold text-white shadow-lg active:scale-95 transition-transform"
        style={{
          bottom: 90,
          right: 20,
          backgroundColor: '#FFA43A',
          boxShadow: '0 4px 20px rgba(255,164,58,0.45)',
        }}
      >
        <Plus size={18} />
        Nouvelle réservation
      </button>

      {/* Bottom sheet — sélection de lieu */}
      {showVenueSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={() => setShowVenueSheet(false)}
        >
          <div
            className="w-full max-w-[430px] rounded-t-3xl overflow-hidden"
            style={{ maxHeight: '80vh', boxShadow: '0 -8px 32px rgba(0,0,0,0.15)', backgroundColor: c.bgCard }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ backgroundColor: c.border }} />
            </div>

            <div className="px-5 pb-3 pt-2">
              <h2 className="text-lg font-bold mb-4" style={{ color: c.textPrimary }}>Choisir un lieu</h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#FFA43A' }} />
                <input
                  type="text"
                  placeholder="Rechercher un lieu..."
                  value={venueSearch}
                  onChange={(e) => setVenueSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none"
                  style={{ backgroundColor: c.bgInput, border: `1.5px solid ${c.border}`, color: c.textPrimary }}
                  autoFocus
                />
              </div>

              {/* Venue list */}
              <div className="overflow-y-auto flex flex-col gap-2" style={{ maxHeight: '50vh' }}>
                {filteredVenues.map((venue) => (
                  <button
                    key={venue.id}
                    onClick={() => { setShowVenueSheet(false); navigate(`/visiteur/reserver/${venue.id}`); }}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98]"
                    style={{ backgroundColor: c.bgSurface, border: `1.5px solid ${c.border}` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-lg"
                      style={{ backgroundColor: venue.bgColor + '22', color: venue.bgColor }}
                    >
                      {venue.type === 'Musée' ? '🏛️' : venue.type === 'Théâtre' ? '🎭' : venue.type === 'Cinéma' ? '🎬' : venue.type === 'Piscine' ? '🏊' : venue.type === 'Médiathèque' ? '📚' : venue.type === 'Stade' ? '🏟️' : '🎨'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: c.textPrimary }}>{venue.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={10} style={{ color: c.textMuted }} />
                        <p className="text-xs truncate" style={{ color: c.textSecondary }}>{venue.city} · {venue.distance}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <ScoreBadge score={venue.score} size="sm" />
                      <ChevronRight size={14} style={{ color: c.textMuted }} />
                    </div>
                  </button>
                ))}
                {filteredVenues.length === 0 && (
                  <p className="text-center py-8 text-sm" style={{ color: c.textSecondary }}>Aucun lieu trouvé</p>
                )}
              </div>
            </div>
            <div style={{ height: 20 }} />
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div
            className="w-full max-w-[430px] rounded-t-3xl px-6 pt-6 pb-10"
            style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.12)', backgroundColor: c.bgCard }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEE2E2' }}>
                <AlertCircle size={20} color="#EF4444" />
              </div>
              <div>
                <p className="font-bold" style={{ color: c.textPrimary }}>Annuler la réservation ?</p>
                <p className="text-sm" style={{ color: c.textSecondary }}>Cette action est irréversible.</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleCancel(confirmId)}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm"
                style={{ backgroundColor: '#EF4444' }}
              >
                Confirmer l'annulation
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm"
                style={{ backgroundColor: c.bgSurface, color: c.textSecondary }}
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
