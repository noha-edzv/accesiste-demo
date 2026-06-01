import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { venues } from '../../data/mockData';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

const availableDays = [19, 20, 21, 22, 24, 25, 26, 27, 28, 30];

export default function BookingFlow() {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();
  const venue = venues.find((v) => v.id === venueId);

  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const today = new Date();
  const [viewYear] = useState(today.getFullYear());
  const [viewMonth] = useState(today.getMonth());

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Lieu introuvable</p>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const selectedEquipment = venue.equipment.find((e) => e.id === selectedEquipmentId);

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  if (confirmed) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: '#DCFCE7' }}
        >
          <Check size={40} color="#22C55E" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Réservation confirmée !</h2>
        <p className="text-gray-500 mb-1">{venue.name}</p>
        <p className="text-gray-500 mb-1">
          {selectedDay && `${selectedDay} ${MONTHS[viewMonth]} ${viewYear}`} à {selectedTime}
        </p>
        <p className="font-semibold mt-1" style={{ color: '#FF8400' }}>{selectedEquipment?.name}</p>
        <div
          className="mt-6 p-4 rounded-2xl"
          style={{ backgroundColor: '#F9DFC6' }}
        >
          <p className="text-xs text-gray-500 mb-1">Code de réservation</p>
          <p className="font-mono font-bold text-lg" style={{ color: '#0B0829' }}>
            QR-{viewYear}-{Math.random().toString(36).substring(2, 7).toUpperCase()}
          </p>
        </div>
        <button
          onClick={() => navigate('/visiteur/reservations')}
          className="mt-8 w-full py-4 rounded-2xl font-bold text-white text-base"
          style={{ backgroundColor: '#FF8400' }}
        >
          Voir mes réservations
        </button>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 text-sm text-gray-400"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3 border-b border-gray-100">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <ArrowLeft size={18} color="#0B0829" />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-base text-gray-900">Réserver du matériel</h1>
          <p className="text-xs text-gray-500 truncate">{venue.name}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-3">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="flex-1 h-1.5 rounded-full transition-all"
              style={{ backgroundColor: s <= step ? '#FF8400' : '#E5E7EB' }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">Date</span>
          <span className="text-xs text-gray-400">Matériel</span>
          <span className="text-xs text-gray-400">Confirmation</span>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-5 py-4 overflow-y-auto">
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Choisissez une date</h2>

            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <ChevronLeft size={16} />
                </button>
                <span className="font-semibold text-gray-900">
                  {MONTHS[viewMonth]} {viewYear}
                </span>
                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isAvailable = availableDays.includes(day);
                  const isSelected = selectedDay === day;
                  const isPast = day < today.getDate();
                  return (
                    <button
                      key={day}
                      disabled={!isAvailable || isPast}
                      onClick={() => setSelectedDay(day)}
                      className="aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all"
                      style={{
                        backgroundColor: isSelected ? '#FF8400' : isAvailable && !isPast ? '#F9DFC6' : 'transparent',
                        color: isSelected ? 'white' : isPast ? '#D1D5DB' : isAvailable ? '#FF8400' : '#9CA3AF',
                        cursor: isAvailable && !isPast ? 'pointer' : 'default',
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDay && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Choisissez un horaire</h3>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className="py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        backgroundColor: selectedTime === time ? '#FF8400' : '#F3F4F6',
                        color: selectedTime === time ? 'white' : '#374151',
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Choisissez votre matériel</h2>
            <div className="flex flex-col gap-3">
              {venue.equipment.map((eq) => {
                const isSelected = selectedEquipmentId === eq.id;
                return (
                  <button
                    key={eq.id}
                    onClick={() => setSelectedEquipmentId(isSelected ? null : eq.id)}
                    disabled={eq.available === 0}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left"
                    style={{
                      borderColor: isSelected ? '#FF8400' : '#F3F4F6',
                      backgroundColor: isSelected ? '#FFF7EE' : 'white',
                      opacity: eq.available === 0 ? 0.5 : 1,
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: isSelected ? '#F9DFC6' : '#F3F4F6' }}
                    >
                      {eq.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{eq.name}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {eq.available > 0 ? `${eq.available} disponible${eq.available > 1 ? 's' : ''}` : 'Non disponible'}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF8400' }}>
                        <Check size={14} color="white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h2>
            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3 mb-6">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${venue.bgColor}, ${venue.bgColor2})` }}
                />
                <div>
                  <p className="font-semibold text-gray-900">{venue.name}</p>
                  <p className="text-xs text-gray-500">{venue.address}, {venue.city}</p>
                </div>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm font-semibold text-gray-900">
                  {selectedDay} {MONTHS[viewMonth]} {viewYear}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Heure</span>
                <span className="text-sm font-semibold text-gray-900">{selectedTime}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Matériel</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{selectedEquipment?.icon}</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedEquipment?.name}</span>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-4 flex items-start gap-3 mb-4"
              style={{ backgroundColor: '#F9DFC6' }}
            >
              <span className="text-xl">ℹ️</span>
              <p className="text-xs text-gray-700 leading-relaxed">
                Présentez votre code QR à l'accueil du lieu lors de votre visite. La réservation est valable 30 minutes après l'horaire choisi.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="px-5 py-4 pb-8 border-t border-gray-100">
        <button
          onClick={() => {
            if (step < 3) {
              setStep(step + 1);
            } else {
              const qrCode = `QR-${viewYear}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
              const newRes = {
                id: `r-${Date.now()}`,
                visitorName: 'Marie Dupont',
                visitorEmail: 'marie.dupont@email.fr',
                venueId: venue.id,
                venueName: venue.name,
                equipmentId: selectedEquipmentId,
                equipmentName: selectedEquipment?.name ?? '',
                equipmentIcon: selectedEquipment?.icon ?? '♿',
                date: `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`,
                time: selectedTime ?? '',
                status: 'confirmée' as const,
                qrCode,
              };
              const existing = JSON.parse(localStorage.getItem('accesiste_reservations') ?? '[]');
              localStorage.setItem('accesiste_reservations', JSON.stringify([...existing, newRes]));
              setConfirmed(true);
            }
          }}
          disabled={
            (step === 1 && (!selectedDay || !selectedTime)) ||
            (step === 2 && !selectedEquipmentId)
          }
          className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95 disabled:opacity-40"
          style={{ backgroundColor: '#FF8400', boxShadow: '0 8px 24px rgba(255,132,0,0.3)' }}
        >
          {step < 3 ? 'Continuer' : 'Confirmer la réservation'}
        </button>
      </div>
    </div>
  );
}
