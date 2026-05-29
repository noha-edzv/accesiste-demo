import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, User, CheckCircle,
  XCircle, MinusCircle, ChevronDown, ChevronUp, AlertTriangle, ClipboardCheck,
} from 'lucide-react';
import { auditMissions, venues } from '../../data/mockData';
import { getMissionsState } from './AuditForm';
import ScoreBadge from '../../components/ScoreBadge';
import type { Score } from '../../data/mockData';

// ── Types ──────────────────────────────────────────────────────────────────
type Response = 'O' | 'N' | 'NA' | null;

interface PointState {
  id: string;
  label: string;
  response: Response;
  observation: string;
}

interface SectionState {
  id: string;
  name: string;
  points: PointState[];
}

// ── Helpers ────────────────────────────────────────────────────────────────
const auditKey = (id: string) => `accesiste_audit_${id}`;
const sectionIcons = ['🚗', '🏢', '🛗', '🚿', '📢'];

function computeScore(sections: SectionState[]): { score: Score; value: number; oCount: number; nCount: number; total: number } {
  let oCount = 0, nCount = 0;
  sections.forEach((s) =>
    s.points.forEach((p) => {
      if (p.response === 'O') oCount++;
      else if (p.response === 'N') nCount++;
    })
  );
  const total = oCount + nCount;
  if (total === 0) return { score: 'A', value: 0, oCount: 0, nCount: 0, total: 0 };
  const pct = (oCount / total) * 100;
  return {
    score: pct >= 80 ? 'A' : pct >= 50 ? 'B' : 'C',
    value: Math.round(pct),
    oCount, nCount, total,
  };
}

function sectionStats(s: SectionState) {
  const o = s.points.filter(p => p.response === 'O').length;
  const n = s.points.filter(p => p.response === 'N').length;
  const na = s.points.filter(p => p.response === 'NA').length;
  const total = o + n;
  const pct = total > 0 ? Math.round((o / total) * 100) : null;
  return { o, n, na, total, pct };
}

const scoreLabels: Record<Score, { label: string; color: string; bg: string }> = {
  A: { label: 'Très bonne conformité', color: '#16A34A', bg: '#DCFCE7' },
  B: { label: 'Conformité partielle', color: '#CA8A04', bg: '#FEF9C3' },
  C: { label: 'Non-conforme', color: '#DC2626', bg: '#FEE2E2' },
};

// ── Composant ─────────────────────────────────────────────────────────────
export default function AuditReport() {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();

  // Données mission + venue (déclarées avant les hooks qui les utilisent)
  const mission = auditMissions.find((m) => m.id === missionId);
  const venue = mission ? venues.find((v) => v.id === mission.venueId) : null;

  // Toutes les sections ouvertes par défaut
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries((venue?.sections ?? []).map((s) => [s.id, true]))
  );

  // Charger les réponses sauvegardées
  const sections = useMemo<SectionState[]>(() => {
    if (!venue) return [];

    // 1. Essayer localStorage
    if (missionId) {
      try {
        const raw = localStorage.getItem(auditKey(missionId));
        if (raw) return JSON.parse(raw) as SectionState[];
      } catch { /* ignore */ }
    }

    // 2. Fallback : données mock du venue
    return venue.sections.map((s) => ({
      id: s.id,
      name: s.name,
      points: s.points.map((p) => ({
        id: p.id,
        label: p.label,
        response: p.response as Response,
        observation: p.observation,
      })),
    }));
  }, [venue, missionId]);

  if (!mission || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Mission introuvable</p>
      </div>
    );
  }

  const { score, value, oCount, nCount, total } = computeScore(sections);
  const naCount = sections.flatMap(s => s.points).filter(p => p.response === 'NA').length;
  const sl = scoreLabels[score];

  const missionDate = new Date(mission.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // Non-conformités (réponse N)
  const nonConformities = sections.flatMap((s, si) =>
    s.points
      .filter((p) => p.response === 'N')
      .map((p) => ({ ...p, sectionName: s.name, sectionIcon: sectionIcons[si] || '📋' }))
  );

  // Observations non-vides
  const observations = sections.flatMap((s, si) =>
    s.points
      .filter((p) => p.observation.trim() !== '')
      .map((p) => ({ ...p, sectionName: s.name, sectionIcon: sectionIcons[si] || '📋' }))
  );

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(180deg, #1A1640 0%, #0B0829 100%)' }} className="px-5 pt-12 pb-6">
        <button
          onClick={() => navigate('/auditeur')}
          className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <ArrowLeft size={18} color="white" />
        </button>

        <p className="text-xs font-medium mb-1" style={{ color: '#8FA0D8' }}>Rapport d'audit</p>
        <h1 className="text-xl font-bold text-white mb-3">{venue.name}</h1>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <MapPin size={13} style={{ color: '#8FA0D8' }} />
            <p className="text-xs" style={{ color: '#8FA0D8' }}>
              {mission.venueAddress}, {mission.venueCity}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={13} style={{ color: '#8FA0D8' }} />
            <p className="text-xs" style={{ color: '#8FA0D8' }}>{missionDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <User size={13} style={{ color: '#8FA0D8' }} />
            <p className="text-xs" style={{ color: '#8FA0D8' }}>{mission.auditorName}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">
        {/* ── Score global ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Score global</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: sl.bg }}
              >
                <span className="text-3xl font-black" style={{ color: sl.color }}>{score}</span>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">{value}%</p>
                <p className="text-sm font-medium" style={{ color: sl.color }}>{sl.label}</p>
              </div>
            </div>
          </div>

          {/* Compteurs */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 rounded-xl p-3 text-center" style={{ backgroundColor: '#DCFCE7' }}>
              <p className="text-lg font-bold" style={{ color: '#16A34A' }}>{oCount}</p>
              <p className="text-xs text-gray-500">Conformes</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{ backgroundColor: '#FEE2E2' }}>
              <p className="text-lg font-bold" style={{ color: '#DC2626' }}>{nCount}</p>
              <p className="text-xs text-gray-500">Non-conf.</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{ backgroundColor: '#F3F4F6' }}>
              <p className="text-lg font-bold text-gray-500">{naCount}</p>
              <p className="text-xs text-gray-500">N/A</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{ backgroundColor: '#F3F4F6' }}>
              <p className="text-lg font-bold text-gray-500">{sections.flatMap(s => s.points).length}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>

        {/* ── Scores par section ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Par section</p>
          <div className="flex flex-col gap-3">
            {sections.map((s, idx) => {
              const st = sectionStats(s);
              const barColor = st.pct === null ? '#D1D5DB' : st.pct >= 80 ? '#22C55E' : st.pct >= 50 ? '#EAB308' : '#EF4444';
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {sectionIcons[idx] || '📋'} {s.name}
                    </span>
                    <span className="text-xs font-bold" style={{ color: barColor }}>
                      {st.pct !== null ? `${st.pct}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${st.pct ?? 0}%`, backgroundColor: barColor }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {st.o} conf. · {st.n} non-conf. · {st.na} N/A
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Non-conformités ──────────────────────────────────────────── */}
        {nonConformities.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} color="#DC2626" />
              <p className="text-sm font-bold text-gray-900">
                {nonConformities.length} point{nonConformities.length > 1 ? 's' : ''} non-conforme{nonConformities.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {nonConformities.map((p) => (
                <div key={p.id} className="rounded-xl p-3" style={{ backgroundColor: '#FEF2F2', borderLeft: '3px solid #EF4444' }}>
                  <p className="text-xs text-gray-400 mb-0.5">{p.sectionIcon} {p.sectionName}</p>
                  <p className="text-sm font-medium text-gray-800">{p.label}</p>
                  {p.observation && (
                    <p className="text-xs text-gray-500 mt-1 italic">📝 {p.observation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Observations ─────────────────────────────────────────────── */}
        {observations.filter(p => p.response !== 'N').length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Observations</p>
            <div className="flex flex-col gap-3">
              {observations
                .filter((p) => p.response !== 'N')
                .map((p) => (
                  <div key={p.id} className="rounded-xl p-3 bg-gray-50">
                    <p className="text-xs text-gray-400 mb-0.5">{p.sectionIcon} {p.sectionName}</p>
                    <p className="text-sm font-medium text-gray-800">{p.label}</p>
                    <p className="text-xs text-gray-500 mt-1 italic">📝 {p.observation}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Détail complet ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Détail complet</p>
          </div>
          {sections.map((s, idx) => {
            const isOpen = openSections[s.id] ?? false;
            const st = sectionStats(s);
            return (
              <div key={s.id} className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => toggleSection(s.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{sectionIcons[idx] || '📋'}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">
                        {st.o}/{st.o + st.n} conf. {st.pct !== null ? `· ${st.pct}%` : ''}
                      </p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 flex flex-col gap-2">
                    {s.points.map((p, pi) => {
                      const resp = p.response;
                      const icon =
                        resp === 'O' ? <CheckCircle size={16} color="#22C55E" />
                        : resp === 'N' ? <XCircle size={16} color="#EF4444" />
                        : resp === 'NA' ? <MinusCircle size={16} color="#9CA3AF" />
                        : <MinusCircle size={16} color="#D1D5DB" />;
                      const bg =
                        resp === 'O' ? '#F0FDF4'
                        : resp === 'N' ? '#FEF2F2'
                        : '#F9FAFB';
                      return (
                        <div
                          key={p.id}
                          className="rounded-xl p-3 flex items-start gap-3"
                          style={{ backgroundColor: bg }}
                        >
                          <div className="flex-shrink-0 mt-0.5">{icon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-0.5">#{pi + 1}</p>
                            <p className="text-sm text-gray-800">{p.label}</p>
                            {p.observation && (
                              <p className="text-xs text-gray-500 mt-1 italic">📝 {p.observation}</p>
                            )}
                          </div>
                          <span
                            className="text-xs font-bold flex-shrink-0 px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: resp === 'O' ? '#DCFCE7' : resp === 'N' ? '#FEE2E2' : '#F3F4F6',
                              color: resp === 'O' ? '#16A34A' : resp === 'N' ? '#DC2626' : '#6B7280',
                            }}
                          >
                            {resp ?? '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── CTA retour ───────────────────────────────────────────────── */}
        <button
          onClick={() => navigate('/auditeur')}
          className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2"
          style={{ backgroundColor: '#FF8400' }}
        >
          <ClipboardCheck size={18} />
          Retour aux missions
        </button>
      </div>
    </div>
  );
}
