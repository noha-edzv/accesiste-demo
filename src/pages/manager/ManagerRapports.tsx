import React, { useState } from 'react';
import {
  CheckCircle, XCircle, AlertTriangle, Calendar,
  TrendingUp, ChevronDown, ChevronUp, Clock,
} from 'lucide-react';
import { venues } from '../../data/mockData';
import ScoreBadge from '../../components/ScoreBadge';

const venue = venues[0]; // Palais des Beaux-Arts — venue du gestionnaire

const sectionIcons = ['🚗', '🏢', '🛗', '🚿', '📢'];

// Non-conformités extraites de l'audit mock du venue
const nonConformities = [
  {
    id: 'nc1',
    section: 'Arrivée et stationnement',
    icon: '🚗',
    label: "Dévers du sol > 2 % sur le cheminement d'accès",
    observation: 'Dévers mesuré à 2,3 % sur le passage principal',
    priority: 'moyenne' as const,
    action: 'Travaux de nivellement du passage côté parking',
  },
  {
    id: 'nc2',
    section: 'Accueil et billetterie',
    icon: '🏢',
    label: 'Documentation en braille ou relief non disponible',
    observation: 'Plan en braille non disponible — à commander',
    priority: 'faible' as const,
    action: 'Commander une signalétique en braille auprès de votre imprimeur',
  },
  {
    id: 'nc3',
    section: 'Circulation intérieure',
    icon: '🛗',
    label: 'Bandes de guidage podotactiles incomplètes',
    observation: 'Bandes podotactiles présentes au RDC uniquement',
    priority: 'moyenne' as const,
    action: 'Étendre les bandes podotactiles aux étages 1 et 2',
  },
];

const priorityConfig = {
  haute:   { bg: '#FEE2E2', color: '#DC2626', label: 'Priorité haute' },
  moyenne: { bg: '#FEF9C3', color: '#CA8A04', label: 'Priorité moyenne' },
  faible:  { bg: '#F3F4F6', color: '#6B7280', label: 'Priorité faible' },
};

const auditHistory = [
  { date: '10 mars 2026',     score: 'A' as const, value: 92, status: 'Terminé' },
  { date: '8 oct. 2025',      score: 'A' as const, value: 89, status: 'Terminé' },
  { date: '15 avril 2025',    score: 'B' as const, value: 74, status: 'Terminé' },
];

export default function ManagerRapports() {
  const [openHistory, setOpenHistory] = useState(false);

  // Scores par section depuis les données du venue
  const sectionScores = venue.sections.map((s, idx) => {
    const o = s.points.filter(p => p.response === 'O').length;
    const n = s.points.filter(p => p.response === 'N').length;
    const total = o + n;
    const pct = total > 0 ? Math.round((o / total) * 100) : 100;
    return { name: s.name, icon: sectionIcons[idx], pct, o, n };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(180deg, #F9DFC6 0%, #f5f5f5 100%)' }}
      >
        <p className="text-sm text-gray-500 mb-0.5">Rapports AccesSite</p>
        <h1 className="text-xl font-bold" style={{ color: '#0B0829' }}>{venue.name}</h1>

        {/* Score card */}
        <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Dernier audit · 10 mars 2026</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: '#DCFCE7' }}
                >
                  <span className="text-2xl font-black" style={{ color: '#16A34A' }}>A</span>
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">92%</p>
                  <p className="text-sm font-medium" style={{ color: '#16A34A' }}>Très bonne conformité</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end mb-1">
                <TrendingUp size={14} color="#16A34A" />
                <span className="text-sm font-bold" style={{ color: '#16A34A' }}>+3%</span>
              </div>
              <p className="text-xs text-gray-400">vs. audit précédent</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Prochain audit */}
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Calendar size={18} color="#2563EB" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900">Prochain audit prévu</p>
            <p className="text-xs text-blue-700 mt-0.5">15 septembre 2026 · Thomas Audibert</p>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={13} color="#2563EB" />
            <p className="text-xs font-medium text-blue-700">107 j.</p>
          </div>
        </div>

        {/* Conformité par section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Conformité par domaine
          </p>
          <div className="flex flex-col gap-3">
            {sectionScores.map((s) => {
              const barColor = s.pct >= 80 ? '#22C55E' : s.pct >= 50 ? '#EAB308' : '#EF4444';
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{s.icon} {s.name}</span>
                    <span className="text-xs font-bold" style={{ color: barColor }}>{s.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${s.pct}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan d'actions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} color="#CA8A04" />
            <p className="text-sm font-bold text-gray-900">
              {nonConformities.length} point{nonConformities.length > 1 ? 's' : ''} à corriger
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {nonConformities.map((nc) => {
              const pc = priorityConfig[nc.priority];
              return (
                <div
                  key={nc.id}
                  className="rounded-xl p-3.5"
                  style={{ backgroundColor: '#FAFAFA', border: '1px solid #F3F4F6' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-800 flex-1">{nc.label}</p>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: pc.bg, color: pc.color }}
                    >
                      {pc.label}
                    </span>
                  </div>
                  {nc.observation && (
                    <p className="text-xs text-gray-500 italic mb-2">📝 {nc.observation}</p>
                  )}
                  <div className="flex items-start gap-2 rounded-lg p-2.5" style={{ backgroundColor: '#F0FDF4' }}>
                    <CheckCircle size={13} color="#16A34A" className="flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-medium" style={{ color: '#15803D' }}>{nc.action}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Points conformes */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} color="#16A34A" />
            <p className="text-sm font-bold text-gray-900">38 critères conformes sur 41</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Places PMR conformes',
              'Entrée de plain-pied',
              'Accueil adapté',
              'Ascenseur disponible',
              'Sanitaires PMR complets',
              'Boucle magnétique',
              'Signalétique visible',
              'Assises disponibles',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                style={{ backgroundColor: '#F0FDF4' }}
              >
                <CheckCircle size={11} color="#16A34A" className="flex-shrink-0" />
                <p className="text-xs text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setOpenHistory(!openHistory)}
            className="w-full flex items-center justify-between px-5 py-4"
          >
            <p className="text-sm font-bold text-gray-900">Historique des audits</p>
            {openHistory ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {openHistory && (
            <div className="px-5 pb-4 flex flex-col gap-2">
              {auditHistory.map((a, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3"
                  style={{ borderTop: '1px solid #F3F4F6' }}
                >
                  <div className="flex items-center gap-3">
                    <ScoreBadge score={a.score} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{a.date}</p>
                      <p className="text-xs text-gray-400">{a.status}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{a.value}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
