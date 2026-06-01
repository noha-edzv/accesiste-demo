import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ChevronRight, FileText } from 'lucide-react';
import { auditMissions } from '../../data/mockData';
import { getMissionsState } from './AuditForm';
import ScoreBadge from '../../components/ScoreBadge';
import type { AuditMission } from '../../data/mockData';

const scoreLabels = {
  A: { label: 'Très bonne conformité', color: '#16A34A', bg: '#DCFCE7' },
  B: { label: 'Conformité partielle',  color: '#CA8A04', bg: '#FEF9C3' },
  C: { label: 'Non-conforme',          color: '#DC2626', bg: '#FEE2E2' },
};

export default function RapportsList() {
  const navigate = useNavigate();
  const liveState = getMissionsState();

  // Toutes les missions terminées (mock + localStorage)
  const terminées: AuditMission[] = auditMissions
    .map((m) => {
      const override = liveState[m.id];
      if (!override) return m;
      return { ...m, status: override.status as AuditMission['status'], sectionsCompleted: override.sectionsCompleted };
    })
    .filter((m) => m.status === 'terminée');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(180deg, #1A1640 0%, #0B0829 100%)' }}
      >
        <p className="text-xs font-medium mb-1" style={{ color: '#8FA0D8' }}>Auditeur AccesSite</p>
        <h1 className="text-xl font-bold text-white">Rapports d'audit</h1>
        <p className="text-xs mt-1" style={{ color: '#8FA0D8' }}>
          {terminées.length} audit{terminées.length > 1 ? 's' : ''} terminé{terminées.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Liste */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {terminées.length === 0 && (
          <div className="text-center py-16">
            <FileText size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-500">Aucun rapport disponible</p>
            <p className="text-sm text-gray-400 mt-1">Les rapports apparaîtront ici une fois les audits soumis</p>
          </div>
        )}

        {terminées.map((mission) => {
          const sl = scoreLabels[mission.score];
          const missionDate = new Date(mission.date).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric',
          });

          return (
            <div key={mission.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4">
                {/* Titre + score */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-base leading-tight">{mission.venueName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-500 truncate">{mission.venueAddress}, {mission.venueCity}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calendar size={11} className="text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-500">{missionDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <ScoreBadge score={mission.score} size="md" />
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: sl.bg, color: sl.color }}
                    >
                      {mission.scoreValue}%
                    </span>
                  </div>
                </div>

                {/* Résumé score */}
                <div
                  className="rounded-xl px-3 py-2 mb-3"
                  style={{ backgroundColor: sl.bg }}
                >
                  <p className="text-xs font-medium" style={{ color: sl.color }}>{sl.label}</p>
                </div>

                {/* Bouton */}
                <button
                  onClick={() => navigate(`/auditeur/rapport/${mission.id}`)}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#0B0829' }}
                >
                  <FileText size={15} />
                  Voir le rapport complet
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
