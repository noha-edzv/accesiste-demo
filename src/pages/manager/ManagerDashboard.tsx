import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Heart, Bell } from 'lucide-react';
import { managerReservations, venues } from '../../data/mockData';
import ScoreBadge from '../../components/ScoreBadge';

const venue = venues[0]; // Palais des Beaux-Arts

const todayReservations = managerReservations.filter((r) => r.status === 'confirmée' && r.date === '2026-04-19');

export default function ManagerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(180deg, #F9DFC6 0%, #f5f5f5 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Gestionnaire</p>
            <h1 className="text-xl font-bold" style={{ color: '#0B0829' }}>
              Bonjour Jean-Pierre 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Bell size={18} color="#6B7280" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
              style={{ backgroundColor: '#0B0829' }}
            >
              JP
            </div>
          </div>
        </div>

        {/* Venue info */}
        <div className="mt-4 bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm">
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${venue.bgColor}, ${venue.bgColor2})` }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{venue.name}</p>
            <div className="flex items-center gap-1">
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{venue.rating} · {venue.reviewCount} avis</span>
            </div>
          </div>
          <ScoreBadge score={venue.score} size="md" showLabel />
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Reservations today */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Réservations</h2>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
              >
                Maintenant
              </span>
              <button
                onClick={() => navigate('/gestionnaire/reservations')}
                className="text-xs font-medium"
                style={{ color: '#FF8400' }}
              >
                Voir tout
              </button>
            </div>
          </div>

          {todayReservations.map((res, idx) => (
            <div
              key={res.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: idx < todayReservations.length - 1 ? '1px solid #F3F4F6' : 'none' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                style={{ backgroundColor: '#FF8400' }}
              >
                {res.time}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{res.visitorName}</p>
                <div className="flex items-center gap-1">
                  <span className="text-base">{res.equipmentIcon}</span>
                  <p className="text-xs text-gray-500">{res.equipmentName}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}

          {todayReservations.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-400">Aucune réservation aujourd'hui</p>
            </div>
          )}
        </div>

        {/* Stock alerts */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Matériel</h2>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#FEF9C3', color: '#CA8A04' }}
              >
                Mise à jour
              </span>
              <button
                onClick={() => navigate('/gestionnaire/materiel')}
                className="text-xs font-medium"
                style={{ color: '#FF8400' }}
              >
                Voir tout
              </button>
            </div>
          </div>

          {venue.equipment.map((eq, idx) => (
            <div
              key={eq.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: idx < venue.equipment.length - 1 ? '1px solid #F3F4F6' : 'none' }}
            >
              <span className="text-xl flex-shrink-0">{eq.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{eq.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${(eq.available / eq.total) * 100}%`,
                      backgroundColor: eq.available > 2 ? '#22C55E' : eq.available > 0 ? '#EAB308' : '#EF4444',
                    }}
                  />
                </div>
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: eq.available > 2 ? '#DCFCE7' : eq.available > 0 ? '#FEF9C3' : '#FEE2E2',
                  color: eq.available > 2 ? '#16A34A' : eq.available > 0 ? '#CA8A04' : '#DC2626',
                }}
              >
                {eq.available}/{eq.total}
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}
        </div>

        {/* Score AccesSite card */}
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ backgroundColor: '#0B0829' }}
        >
          <div>
            <p className="text-white text-opacity-60 text-xs">Score AccesSite</p>
            <div className="flex items-center gap-2 mt-1">
              <ScoreBadge score={venue.score} size="lg" />
              <div>
                <p className="text-white font-bold text-lg">{venue.scoreValue}/100</p>
                <p className="text-white text-opacity-60 text-xs">Excellent</p>
              </div>
            </div>
          </div>
          <div className="flex-1" />
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={12} className={s <= Math.floor(venue.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
              ))}
            </div>
            <p className="text-white text-opacity-60 text-xs mt-1">{venue.reviewCount} avis</p>
          </div>
        </div>

        {/* All set card */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: '#F9DFC6' }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-bold text-gray-900">Tout est prêt!</p>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Votre lieu est conforme aux normes d'accessibilité PMR. Prochain audit prévu le 15 mai 2026.
              </p>
            </div>
          </div>
          <button
            className="mt-3 w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
            style={{ backgroundColor: '#FF8400' }}
          >
            <Heart size={16} />
            Ajouter à Favoris
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Ce mois', value: '24', sublabel: 'réservations' },
            { label: 'Satisfaction', value: '4.8', sublabel: '/ 5 étoiles' },
            { label: 'Disponibilité', value: '87%', sublabel: 'matériel dispo' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
              <p className="text-xl font-bold" style={{ color: '#FF8400' }}>{stat.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
