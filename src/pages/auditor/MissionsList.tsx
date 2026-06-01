import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ChevronRight, ClipboardCheck } from 'lucide-react';
import { auditMissions } from '../../data/mockData';
import { getMissionsState } from './AuditForm';
import ScoreBadge from '../../components/ScoreBadge';
import type { AuditMission } from '../../data/mockData';

const statusConfig = {
  'assignée': { bg: '#F3F4F6', color: '#6B7280', label: 'Assignée' },
  'en cours': { bg: '#FEF9C3', color: '#CA8A04', label: 'En cours' },
  'terminée': { bg: '#DCFCE7', color: '#16A34A', label: 'Terminée' },
};

const tabFilters: { id: AuditMission['status'] | 'toutes'; label: string }[] = [
  { id: 'toutes' as any, label: 'Toutes' },
  { id: 'assignée', label: 'Assignées' },
  { id: 'en cours', label: 'En cours' },
  { id: 'terminée', label: 'Terminées' },
];

export default function MissionsList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('toutes');

  // Fusionner les données mock avec les statuts persistés en localStorage
  const [liveState, setLiveState] = useState(getMissionsState);

  // Rafraîchir à chaque retour sur la page
  useEffect(() => {
    const refresh = () => setLiveState(getMissionsState());
    refresh();
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  const liveMissions: AuditMission[] = auditMissions.map((m) => {
    const override = liveState[m.id];
    if (!override) return m;
    return {
      ...m,
      status: override.status as AuditMission['status'],
      sectionsCompleted: override.sectionsCompleted,
    };
  });

  const filteredMissions = liveMissions.filter((m) =>
    activeTab === 'toutes' ? true : m.status === activeTab
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(180deg, #1A1640 0%, #0B0829 100%)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium" style={{ color: '#8FA0D8' }}>Auditeur AccesSite</p>
            <h1 className="text-xl font-bold text-white">Thomas Audibert 👋</h1>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: '#FF8400' }}
          >
            TA
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3">
          {[
            { label: 'Assignées', value: liveMissions.filter(m => m.status === 'assignée').length },
            { label: 'En cours', value: liveMissions.filter(m => m.status === 'en cours').length },
            { label: 'Terminées', value: liveMissions.filter(m => m.status === 'terminée').length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex-1 rounded-2xl p-2.5 text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-xs" style={{ color: '#8FA0D8' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab filters */}
      <div className="px-5 py-3 bg-white shadow-sm">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium"
              style={{
                backgroundColor: activeTab === tab.id ? '#FF8400' : '#F3F4F6',
                color: activeTab === tab.id ? 'white' : '#6B7280',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Missions list */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {filteredMissions.map((mission) => {
          const status = statusConfig[mission.status];
          const progressPct = (mission.sectionsCompleted / mission.sectionsTotal) * 100;
          const missionDate = new Date(mission.date);
          const dateLabel = missionDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

          return (
            <div key={mission.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-base leading-tight">{mission.venueName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-500 truncate">{mission.venueAddress}, {mission.venueCity}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calendar size={11} className="text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-500">{dateLabel}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <ScoreBadge score={mission.score} size="md" />
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      {mission.sectionsCompleted}/{mission.sectionsTotal} sections
                    </span>
                    <span className="text-xs font-medium" style={{ color: '#FF8400' }}>
                      {Math.round(progressPct)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${progressPct}%`,
                        backgroundColor: progressPct === 100 ? '#22C55E' : '#FF8400',
                      }}
                    />
                  </div>
                </div>

                {/* CTA button */}
                {mission.status !== 'terminée' && (
                  <button
                    onClick={() => navigate(`/auditeur/audit/${mission.id}`)}
                    className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#FF8400' }}
                  >
                    <ClipboardCheck size={16} />
                    {mission.status === 'assignée' ? 'Commencer l\'audit' : 'Reprendre l\'audit'}
                  </button>
                )}

                {mission.status === 'terminée' && (
                  <button
                    onClick={() => navigate(`/auditeur/rapport/${mission.id}`)}
                    className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-gray-200"
                    style={{ color: '#6B7280' }}
                  >
                    <ChevronRight size={16} />
                    Voir le rapport
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredMissions.length === 0 && (
          <div className="text-center py-16">
            <ClipboardCheck size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-500">Aucune mission</p>
          </div>
        )}
      </div>
    </div>
  );
}
