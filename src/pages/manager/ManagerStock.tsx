import React, { useState } from 'react';
import { AlertTriangle, Plus, Minus, Wrench, RotateCcw, X } from 'lucide-react';
import { venues } from '../../data/mockData';
import { getStockOverrides, saveStockOverride, type EquipState } from '../../utils/managerState';

const venue = venues[0];

// Nouveau matériel — formulaire simplifié
const EQUIPMENT_ICONS = ['♿', '🦽', '🎧', '🔊', '🦯', '👓', '📱', '🪑'];

export default function ManagerStock() {
  const [toast, setToast] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('♿');
  const [newQty, setNewQty] = useState('1');

  // État stock vif : mock + overrides localStorage
  const [equipmentState, setEquipmentState] = useState<Record<string, EquipState>>(() => {
    const overrides = getStockOverrides();
    const initial: Record<string, EquipState> = {};
    venue.equipment.forEach(eq => {
      initial[eq.id] = overrides[eq.id] ?? {
        available: eq.available,
        reserved: eq.reserved,
        maintenance: eq.maintenance,
        total: eq.total,
      };
    });
    return initial;
  });

  // Matériel ajouté par l'utilisateur
  const [customEquipment, setCustomEquipment] = useState<{
    id: string; name: string; icon: string; total: number;
  }[]>(() => {
    try { return JSON.parse(localStorage.getItem('accessite_custom_equipment') ?? '[]'); }
    catch { return []; }
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const update = (id: string, patch: Partial<EquipState>) => {
    setEquipmentState(prev => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } };
      saveStockOverride(id, next[id]);
      return next;
    });
  };

  const handleAddStock = (id: string) => {
    const s = equipmentState[id];
    update(id, { available: s.available + 1, total: s.total + 1 });
    showToast('➕ Unité ajoutée');
  };

  const handleRemoveStock = (id: string) => {
    const s = equipmentState[id];
    if (s.available <= 0) return;
    update(id, { available: s.available - 1, total: s.total - 1 });
    showToast('➖ Unité retirée');
  };

  const handleMaintenance = (id: string) => {
    const s = equipmentState[id];
    if (s.available <= 0) { showToast('⚠️ Aucune unité disponible'); return; }
    update(id, { available: s.available - 1, maintenance: s.maintenance + 1 });
    showToast('🔧 Unité mise en maintenance');
  };

  const handleRestore = (id: string) => {
    const s = equipmentState[id];
    if (s.maintenance <= 0) return;
    update(id, { available: s.available + 1, maintenance: s.maintenance - 1 });
    showToast('✅ Unité remise en service');
  };

  const handleAddEquipment = () => {
    if (!newName.trim()) return;
    const qty = Math.max(1, parseInt(newQty) || 1);
    const newEq = { id: `custom_${Date.now()}`, name: newName.trim(), icon: newIcon, total: qty };
    const updated = [...customEquipment, newEq];
    setCustomEquipment(updated);
    localStorage.setItem('accessite_custom_equipment', JSON.stringify(updated));
    // Init state for new equipment
    const initState = { available: qty, reserved: 0, maintenance: 0, total: qty };
    setEquipmentState(prev => ({ ...prev, [newEq.id]: initState }));
    saveStockOverride(newEq.id, initState);
    setNewName(''); setNewIcon('♿'); setNewQty('1');
    setShowAddForm(false);
    showToast(`✅ ${newEq.name} ajouté`);
  };

  const allEquipment = [
    ...venue.equipment.map(eq => ({ id: eq.id, name: eq.name, icon: eq.icon })),
    ...customEquipment,
  ];

  const totals = allEquipment.reduce((acc, eq) => {
    const s = equipmentState[eq.id] ?? { available: 0, reserved: 0, maintenance: 0, total: 0 };
    return {
      total: acc.total + s.total,
      available: acc.available + s.available,
      reserved: acc.reserved + s.reserved,
      maintenance: acc.maintenance + s.maintenance,
    };
  }, { total: 0, available: 0, reserved: 0, maintenance: 0 });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold text-white"
          style={{ backgroundColor: '#0B0829' }}
        >
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: '#0B0829' }}>Inventaire matériel</h1>
        <p className="text-sm text-gray-500 mt-1">{venue.name}</p>
      </div>

      {/* Summary */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Total',  value: totals.total,       color: '#0B0829', bg: '#F3F4F6' },
            { label: 'Dispo',  value: totals.available,   color: '#16A34A', bg: '#DCFCE7' },
            { label: 'Réservé',value: totals.reserved,    color: '#FF8400', bg: '#FFF7EE' },
            { label: 'Maint.', value: totals.maintenance, color: '#DC2626', bg: '#FEE2E2' },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: stat.bg }}>
              <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: stat.color }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Equipment cards */}
        <div className="flex flex-col gap-3">
          {allEquipment.map(eq => {
            const s = equipmentState[eq.id] ?? { available: 0, reserved: 0, maintenance: 0, total: 0 };
            const availPct   = s.total > 0 ? (s.available   / s.total) * 100 : 0;
            const reservPct  = s.total > 0 ? (s.reserved    / s.total) * 100 : 0;
            const maintPct   = s.total > 0 ? (s.maintenance / s.total) * 100 : 0;
            const isLow = s.available <= 1;

            return (
              <div key={eq.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {isLow && (
                  <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium" style={{ backgroundColor: '#FEF9C3', color: '#CA8A04' }}>
                    <AlertTriangle size={12} />
                    {s.available === 0 ? 'Stock épuisé' : `Seulement ${s.available} disponible`}
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: '#F9DFC6' }}>
                      {eq.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{eq.name}</p>
                      <p className="text-xs text-gray-500">{s.total} unités au total</p>
                    </div>
                  </div>

                  {/* Barre de stock */}
                  <div className="w-full h-2.5 rounded-full overflow-hidden bg-gray-200 flex mb-2">
                    <div className="h-full" style={{ width: `${availPct}%`,  backgroundColor: '#22C55E' }} />
                    <div className="h-full" style={{ width: `${reservPct}%`, backgroundColor: '#FF8400' }} />
                    <div className="h-full" style={{ width: `${maintPct}%`,  backgroundColor: '#EF4444' }} />
                  </div>
                  <div className="flex gap-3 text-xs mb-4">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{s.available} dispo</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#FF8400' }} />{s.reserved} réservé</span>
                    {s.maintenance > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />{s.maintenance} maint.</span>}
                  </div>

                  {/* Contrôles stock */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantité totale</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemoveStock(eq.id)}
                        disabled={s.available <= 0}
                        className="w-8 h-8 rounded-xl flex items-center justify-center border border-gray-200 disabled:opacity-30"
                      >
                        <Minus size={14} color="#6B7280" />
                      </button>
                      <span className="text-base font-bold w-6 text-center text-gray-900">{s.total}</span>
                      <button
                        onClick={() => handleAddStock(eq.id)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#FF8400' }}
                      >
                        <Plus size={14} color="white" />
                      </button>
                    </div>
                  </div>

                  {/* Actions maintenance */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMaintenance(eq.id)}
                      disabled={s.available <= 0}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-gray-200 disabled:opacity-40"
                      style={{ color: '#6B7280' }}
                    >
                      <Wrench size={12} />
                      Déclarer en maint.
                    </button>
                    {s.maintenance > 0 && (
                      <button
                        onClick={() => handleRestore(eq.id)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                        style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
                      >
                        <RotateCcw size={12} />
                        Remettre en service ({s.maintenance})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ajouter matériel */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 w-full py-4 rounded-2xl border-2 border-dashed text-sm font-medium flex items-center justify-center gap-2 mb-4"
            style={{ borderColor: '#FF8400', color: '#FF8400' }}
          >
            <Plus size={18} />
            Ajouter un nouveau type de matériel
          </button>
        ) : (
          <div className="mt-4 bg-white rounded-2xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-gray-900">Nouveau matériel</p>
              <button onClick={() => setShowAddForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>

            {/* Nom */}
            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Nom</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Ex : Loupe électronique"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900 border border-gray-200 focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* Icône */}
            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Icône</label>
              <div className="flex gap-2 flex-wrap">
                {EQUIPMENT_ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewIcon(icon)}
                    className="w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2"
                    style={{ borderColor: newIcon === icon ? '#FF8400' : '#E5E7EB', backgroundColor: newIcon === icon ? '#FFF7EE' : 'white' }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantité */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Quantité initiale</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNewQty(v => String(Math.max(1, parseInt(v) - 1)))}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center"
                >
                  <Minus size={16} className="text-gray-500" />
                </button>
                <span className="text-xl font-bold w-8 text-center">{newQty}</span>
                <button
                  onClick={() => setNewQty(v => String(parseInt(v) + 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#FF8400' }}
                >
                  <Plus size={16} color="white" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddEquipment}
              disabled={!newName.trim()}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-40"
              style={{ backgroundColor: '#FF8400' }}
            >
              Ajouter {newIcon} {newName || '…'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
