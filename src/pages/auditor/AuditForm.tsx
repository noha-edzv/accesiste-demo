import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Send, ChevronRight, CheckCircle } from 'lucide-react';
import { auditMissions, venues } from '../../data/mockData';
import ScoreBadge from '../../components/ScoreBadge';
import type { Score } from '../../data/mockData';

type Response = 'O' | 'N' | 'NA' | null;

interface SectionState {
  id: string;
  name: string;
  points: {
    id: string;
    label: string;
    response: Response;
    observation: string;
  }[];
}

// ── Clés localStorage ──────────────────────────────────────────────────────
const auditKey  = (id: string) => `accesiste_audit_${id}`;
const statusKey = () => `accesiste_missions_state`;

export function getMissionsState(): Record<string, { status: string; sectionsCompleted: number }> {
  try { return JSON.parse(localStorage.getItem(statusKey()) ?? '{}'); }
  catch { return {}; }
}

function saveMissionState(missionId: string, status: string, sectionsCompleted: number) {
  const all = getMissionsState();
  all[missionId] = { status, sectionsCompleted };
  localStorage.setItem(statusKey(), JSON.stringify(all));
}

// ── Score ──────────────────────────────────────────────────────────────────
const sectionIcons = ['🚗', '🏢', '🛗', '🚿', '📢'];

function computeScore(sections: SectionState[]): { score: Score; value: number } {
  let oCount = 0, total = 0;
  sections.forEach((s) =>
    s.points.forEach((p) => {
      if (p.response === 'O') { oCount++; total++; }
      else if (p.response === 'N') { total++; }
    })
  );
  if (total === 0) return { score: 'A', value: 0 };
  const pct = (oCount / total) * 100;
  return { score: pct >= 80 ? 'A' : pct >= 50 ? 'B' : 'C', value: Math.round(pct) };
}

// ── Composant ─────────────────────────────────────────────────────────────
export default function AuditForm() {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();

  const mission = auditMissions.find((m) => m.id === missionId);
  const venue   = mission ? venues.find((v) => v.id === mission.venueId) : null;

  // Statut live (peut être overridé depuis localStorage)
  const liveStatus = missionId
    ? (getMissionsState()[missionId]?.status ?? mission?.status ?? 'assignée')
    : 'assignée';

  const [activeSection, setActiveSection] = useState(0);
  const [saved,     setSaved]     = useState(false);
  const [submitted, setSubmitted] = useState(liveStatus === 'terminée');

  // ── Initialisation sections : localStorage > mockData ─────────────────
  const [sections, setSections] = useState<SectionState[]>(() => {
    if (!venue) return [];

    // 1. Tenter de charger la progression sauvegardée
    if (missionId) {
      try {
        const saved = localStorage.getItem(auditKey(missionId));
        if (saved) return JSON.parse(saved) as SectionState[];
      } catch { /* ignore */ }
    }

    // 2. Sinon : mission assignée → formulaire vierge, sinon données mock
    const isNew = liveStatus === 'assignée';
    return venue.sections.map((s) => ({
      id: s.id,
      name: s.name,
      points: s.points.map((p) => ({
        id: p.id,
        label: p.label,
        response: isNew ? null : (p.response as Response),
        observation: isNew ? '' : p.observation,
      })),
    }));
  });

  // ── Auto-sauvegarde dans localStorage à chaque changement ─────────────
  useEffect(() => {
    if (!missionId) return;
    localStorage.setItem(auditKey(missionId), JSON.stringify(sections));

    // Mettre à jour le compteur de sections complètes + passer "en cours"
    const completed = sections.filter((s) => s.points.every((p) => p.response !== null)).length;
    const currentState = getMissionsState()[missionId];
    const currentStatus = currentState?.status ?? mission?.status ?? 'assignée';
    if (currentStatus !== 'terminée') {
      const newStatus = completed > 0 ? 'en cours' : 'assignée';
      saveMissionState(missionId, newStatus, completed);
    }
  }, [sections, missionId, mission]);

  // ── Setters ───────────────────────────────────────────────────────────
  const setPointResponse = useCallback((sectionIdx: number, pointIdx: number, response: Response) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si !== sectionIdx ? s : {
          ...s,
          points: s.points.map((p, pi) => pi !== pointIdx ? p : { ...p, response }),
        }
      )
    );
  }, []);

  const setPointObservation = useCallback((sectionIdx: number, pointIdx: number, obs: string) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si !== sectionIdx ? s : {
          ...s,
          points: s.points.map((p, pi) => pi !== pointIdx ? p : { ...p, observation: obs }),
        }
      )
    );
  }, []);

  // ── Save / Submit ──────────────────────────────────────────────────────
  const handleSave = () => {
    if (missionId) {
      localStorage.setItem(auditKey(missionId), JSON.stringify(sections));
      const completed = sections.filter((s) => s.points.every((p) => p.response !== null)).length;
      saveMissionState(missionId, completed > 0 ? 'en cours' : 'assignée', completed);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSubmit = () => {
    if (missionId) {
      localStorage.setItem(auditKey(missionId), JSON.stringify(sections));
      saveMissionState(missionId, 'terminée', sections.length);
    }
    setSubmitted(true);
  };

  // ── Dérivés ───────────────────────────────────────────────────────────
  const allSectionsDone = sections.every((s) => s.points.every((p) => p.response !== null));
  const { score, value } = computeScore(sections);

  if (!mission || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Mission introuvable</p>
      </div>
    );
  }

  // ── Écran de confirmation ─────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: '#DCFCE7' }}
        >
          <CheckCircle size={40} color="#22C55E" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit soumis !</h2>
        <p className="text-gray-500 mb-4">{venue.name}</p>
        <div className="flex items-center gap-3 mb-8">
          <ScoreBadge score={score} size="lg" showLabel />
          <span className="text-2xl font-bold text-gray-900">{value}%</span>
        </div>
        <button
          onClick={() => navigate(`/auditeur/rapport/${missionId}`)}
          className="w-full py-4 rounded-2xl font-bold text-white mb-3"
          style={{ backgroundColor: '#0B0829' }}
        >
          Voir le rapport
        </button>
        <button
          onClick={() => navigate('/auditeur')}
          className="w-full py-4 rounded-2xl font-bold text-white"
          style={{ backgroundColor: '#FF8400' }}
        >
          Retour aux missions
        </button>
      </div>
    );
  }

  const currentSection = sections[activeSection];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div style={{ backgroundColor: '#0B0829' }} className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <div className="flex items-center gap-2">
            <ScoreBadge score={score} size="md" showLabel />
            <span className="text-white font-bold text-lg">{value}%</span>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
            style={{ backgroundColor: saved ? '#22C55E' : '#FF8400', color: 'white' }}
          >
            <Save size={13} />
            {saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
          </button>
        </div>
        <h1 className="text-white font-bold text-base">{venue.name}</h1>
        <p className="text-xs mt-0.5" style={{ color: '#8FA0D8' }}>
          {mission.venueAddress}, {mission.venueCity}
        </p>
      </div>

      {/* Onglets sections */}
      <div
        className="flex gap-1 px-3 py-2 overflow-x-auto scrollbar-hide"
        style={{ backgroundColor: '#1A1640' }}
      >
        {sections.map((section, idx) => {
          const sectionDone = section.points.every((p) => p.response !== null);
          const isActive = activeSection === idx;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(idx)}
              className="flex-shrink-0 flex flex-col items-center px-3 py-1.5 rounded-xl min-w-[64px] transition-all"
              style={{ backgroundColor: isActive ? '#FF8400' : 'rgba(255,255,255,0.08)' }}
            >
              <span className="text-base">{sectionIcons[idx] || '📋'}</span>
              <span
                className="text-[9px] mt-0.5 font-medium text-center leading-tight"
                style={{ color: isActive ? 'white' : '#8FA0D8' }}
              >
                {section.name.split(' ').slice(0, 2).join(' ')}
              </span>
              {sectionDone && (
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Contenu section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-base">
              {sectionIcons[activeSection]} {currentSection.name}
            </h2>
            <span className="text-xs text-gray-400">
              {currentSection.points.filter((p) => p.response !== null).length}/
              {currentSection.points.length} points
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {currentSection.points.map((point, pi) => (
              <div key={point.id} className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-start gap-2 mb-3">
                  <span
                    className="text-xs font-bold rounded-full px-1.5 py-0.5 flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: '#F3F4F6', color: '#9CA3AF' }}
                  >
                    {pi + 1}
                  </span>
                  <p className="text-sm font-medium text-gray-900">{point.label}</p>
                </div>

                {/* Boutons O / N / NA */}
                <div className="flex gap-2 mb-3">
                  {([
                    { value: 'O',  label: 'Oui', color: '#22C55E', bg: '#DCFCE7' },
                    { value: 'N',  label: 'Non', color: '#EF4444', bg: '#FEE2E2' },
                    { value: 'NA', label: 'N/A', color: '#6B7280', bg: '#F3F4F6' },
                  ] as { value: Response; label: string; color: string; bg: string }[]).map((opt) => {
                    const isSelected = point.response === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setPointResponse(activeSection, pi, opt.value)}
                        className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                        style={{
                          backgroundColor: isSelected ? opt.color : opt.bg,
                          color: isSelected ? 'white' : opt.color,
                          transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Observation */}
                <div className="flex items-start gap-2">
                  <textarea
                    placeholder="Observation (optionnel)..."
                    value={point.observation}
                    onChange={(e) => setPointObservation(activeSection, pi, e.target.value)}
                    className="flex-1 text-xs text-gray-700 bg-white border border-gray-200 rounded-xl p-2.5 resize-none focus:outline-none focus:border-orange-400"
                    rows={2}
                  />
                  <button
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F3F4F6' }}
                  >
                    <Camera size={16} color="#6B7280" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation sections */}
          <div className="flex gap-3 mt-4">
            {activeSection > 0 && (
              <button
                onClick={() => setActiveSection(activeSection - 1)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600"
              >
                Section précédente
              </button>
            )}
            {activeSection < sections.length - 1 && (
              <button
                onClick={() => setActiveSection(activeSection + 1)}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-1.5"
                style={{ backgroundColor: '#FF8400' }}
              >
                Section suivante <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bouton de soumission finale */}
      {allSectionsDone && (
        <div className="px-5 py-4 pb-8 border-t border-gray-100">
          <div
            className="flex items-center gap-2 p-3 rounded-xl mb-3"
            style={{ backgroundColor: '#DCFCE7' }}
          >
            <CheckCircle size={16} color="#22C55E" />
            <p className="text-xs font-medium text-green-800">
              Toutes les sections sont complètes — Score : {score} ({value}%)
            </p>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2"
            style={{ backgroundColor: '#0B0829', boxShadow: '0 8px 24px rgba(11,8,41,0.3)' }}
          >
            <Send size={18} />
            Soumettre l'audit
          </button>
        </div>
      )}
    </div>
  );
}
