import React, { useState } from 'react';
import { Search, Filter, Check, X, Calendar, ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react';
import { managerReservations } from '../../data/mockData';
import { getResOverrides, saveResOverride, type ResStatus } from '../../utils/managerState';

const statusConfig: Record<ResStatus, { bg: string; color: string; label: string }> = {
  'confirmée':  { bg: '#DCFCE7', color: '#16A34A', label: 'Confirmée' },
  'en attente': { bg: '#FEF9C3', color: '#CA8A04', label: 'En attente' },
  'annulée':    { bg: '#FEE2E2', color: '#DC2626', label: 'Annulée' },
  'terminée':   { bg: '#F3F4F6', color: '#6B7280', label: 'Terminée' },
};

export default function ManagerReservations() {
  const [search,       setSearch]       = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('toutes');
  const [expanded,     setExpanded]     = useState<string | null>(null);
  const [toast,        setToast]        = useState<string | null>(null);

  // État vif : mock + overrides localStorage
  const [overrides, setOverrides] = useState<Record<string, ResStatus>>(getResOverrides);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleConfirm = (id: string) => {
    setOverrides(prev => ({ ...prev, [id]: 'confirmée' }));
    saveResOverride(id, 'confirmée');
    showToast('✅ Réservation confirmée');
  };

  const handleRefuse = (id: string) => {
    setOverrides(prev => ({ ...prev, [id]: 'annulée' }));
    saveResOverride(id, 'annulée');
    showToast('❌ Réservation refusée');
  };

  const handleFinish = (id: string) => {
    setOverrides(prev => ({ ...prev, [id]: 'terminée' }));
    saveResOverride(id, 'terminée');
    showToast('🏁 Réservation marquée terminée');
  };

  const reservations = managerReservations.map(r => ({
    ...r,
    status: (overrides[r.id] ?? r.status) as ResStatus,
  }));

  const filters = ['toutes', 'confirmée', 'en attente', 'annulée', 'terminée'];

  const filtered = reservations.filter(r => {
    const matchSearch = search === '' || r.visitorName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'toutes' || r.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const counts = {
    'en attente': reservations.filter(r => r.status === 'en attente').length,
    'confirmée':  reservations.filter(r => r.status === 'confirmée').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: '#0B0829' }}
        >
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold" style={{ color: '#0B0829' }}>Réservations</h1>
          {counts['en attente'] > 0 && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#FEF9C3', color: '#CA8A04' }}
            >
              {counts['en attente']} en attente
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-2 mb-3">
          {[
            { label: 'En attente', value: counts['en attente'], bg: '#FEF9C3', color: '#CA8A04' },
            { label: 'Confirmées', value: counts['confirmée'],  bg: '#DCFCE7', color: '#16A34A' },
          ].map(s => (
            <div key={s.label} className="flex-1 rounded-xl px-3 py-2 text-center" style={{ backgroundColor: s.bg }}>
              <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs" style={{ color: s.color }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un visiteur..."
            value={search}
            onChange={e => { setSearch(e.target.value); }}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl border-0 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          {search && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearch('')}>
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize"
              style={{
                backgroundColor: activeFilter === f ? '#FF8400' : '#F3F4F6',
                color: activeFilter === f ? 'white' : '#6B7280',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <p className="text-xs text-gray-400">{filtered.length} réservation{filtered.length > 1 ? 's' : ''}</p>

        {filtered.map(res => {
          const status = statusConfig[res.status];
          const resDate = new Date(res.date);
          const dayLabel = resDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
          const isExpanded = expanded === res.id;

          return (
            <div key={res.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Date + status */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} style={{ color: '#FF8400' }} />
                  <span className="text-xs font-semibold" style={{ color: '#FF8400' }}>
                    {dayLabel} · {res.time}
                  </span>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
              </div>

              {/* Main row — cliquable pour expand */}
              <button
                onClick={() => setExpanded(isExpanded ? null : res.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: '#8FA0D8' }}
                  >
                    {res.visitorName.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{res.visitorName}</p>
                    <p className="text-xs text-gray-500">{res.visitorEmail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{res.equipmentIcon}</span>
                    {isExpanded ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                  </div>
                </div>

                {/* Equipment summary */}
                <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-xl" style={{ backgroundColor: '#F9FAFB' }}>
                  <span className="text-base">{res.equipmentIcon}</span>
                  <p className="text-xs font-medium text-gray-700">{res.equipmentName}</p>
                </div>
              </button>

              {/* Détails expandables */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-50">
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail size={13} className="flex-shrink-0" />
                      <span>{res.visitorEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone size={13} className="flex-shrink-0" />
                      <span>+33 6 {Math.floor(Math.random() * 90 + 10)} {Math.floor(Math.random() * 90 + 10)} {Math.floor(Math.random() * 90 + 10)} {Math.floor(Math.random() * 90 + 10)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={13} className="flex-shrink-0" />
                      <span>Réservation effectuée le {new Date(res.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {res.status === 'en attente' && (
                <div className="flex gap-2 px-4 pb-4">
                  <button
                    onClick={() => handleConfirm(res.id)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: '#16A34A', color: 'white' }}
                  >
                    <Check size={15} />
                    Confirmer
                  </button>
                  <button
                    onClick={() => handleRefuse(res.id)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                  >
                    <X size={15} />
                    Refuser
                  </button>
                </div>
              )}

              {res.status === 'confirmée' && (
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleFinish(res.id)}
                    className="w-full py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500"
                  >
                    Marquer comme terminée
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-500">Aucune réservation</p>
          </div>
        )}
      </div>
    </div>
  );
}
