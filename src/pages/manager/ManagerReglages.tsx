import React, { useState } from 'react';
import {
  ChevronRight, Bell, Mail, Phone, MapPin,
  Lock, LogOut, HelpCircle, User, Building2,
  Pencil, Check, X, Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getProfile, saveProfile, getHoraires, saveHoraires,
  type ManagerProfile, type Horaire,
} from '../../utils/managerState';

/* ── Toggle ────────────────────────────────────────────────────────────── */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ backgroundColor: value ? '#FF8400' : '#D1D5DB' }}
    >
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
        style={{ transform: value ? 'translateX(20px)' : 'translateX(2px)' }} />
    </button>
  );
}

/* ── EditableField ─────────────────────────────────────────────────────── */
function EditableField({ label, value, icon, onSave }: {
  label: string; value: string; icon: React.ReactNode; onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => { onSave(draft); setEditing(false); };
  const handleCancel = () => { setDraft(value); setEditing(false); };

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
            className="w-full text-sm font-medium text-gray-800 bg-transparent border-b-2 border-orange-400 outline-none py-0.5 mt-0.5"
          />
        ) : (
          <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
        )}
      </div>
      {editing ? (
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={handleSave} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
            <Check size={13} color="#16A34A" />
          </button>
          <button onClick={handleCancel} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
            <X size={13} color="#DC2626" />
          </button>
        </div>
      ) : (
        <button onClick={() => { setDraft(value); setEditing(true); }} className="flex-shrink-0">
          <Pencil size={14} className="text-gray-300" />
        </button>
      )}
    </div>
  );
}

/* ── Composant ─────────────────────────────────────────────────────────── */
export default function ManagerReglages() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  // Profil
  const [profile, setProfile] = useState<ManagerProfile>(getProfile);
  const updateProfile = (key: keyof ManagerProfile, val: string) => {
    const next = { ...profile, [key]: val };
    setProfile(next);
    saveProfile(next);
    showToast('✅ Sauvegardé');
  };

  // Horaires
  const [horaires, setHoraires] = useState<Horaire[]>(getHoraires);
  const [editingHoraires, setEditingHoraires] = useState(false);
  const [horairesDraft, setHorairesDraft] = useState<Horaire[]>(horaires);

  const saveHorairesChanges = () => {
    setHoraires(horairesDraft);
    saveHoraires(horairesDraft);
    setEditingHoraires(false);
    showToast('✅ Horaires sauvegardés');
  };

  // Notifications
  const [notifResa,  setNotifResa]  = useState(true);
  const [notifAudit, setNotifAudit] = useState(true);
  const [notifStock, setNotifStock] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold text-white" style={{ backgroundColor: '#0B0829' }}>
          {toast}
        </div>
      )}

      {/* Header — avatar cliquable */}
      <div className="px-5 pt-12 pb-5" style={{ background: 'linear-gradient(180deg, #F9DFC6 0%, #f5f5f5 100%)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow" style={{ backgroundColor: '#0B0829' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold truncate" style={{ color: '#0B0829' }}>{profile.name}</p>
            <p className="text-sm text-gray-500 truncate">{profile.email}</p>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: '#F9DFC6', color: '#FF8400' }}>
              Gestionnaire
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* ── Informations du lieu ─────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Building2 size={15} color="#FF8400" />
            <p className="text-sm font-bold text-gray-900">Informations du lieu</p>
          </div>
          <EditableField label="Nom du lieu"  value={profile.venueName}    icon={<Building2 size={15} className="text-gray-400" />} onSave={v => updateProfile('venueName',    v)} />
          <EditableField label="Adresse"      value={profile.venueAddress} icon={<MapPin    size={15} className="text-gray-400" />} onSave={v => updateProfile('venueAddress', v)} />
          <EditableField label="Téléphone"    value={profile.venuePhone}   icon={<Phone     size={15} className="text-gray-400" />} onSave={v => updateProfile('venuePhone',   v)} />
          <EditableField label="Email public" value={profile.venueEmail}   icon={<Mail      size={15} className="text-gray-400" />} onSave={v => updateProfile('venueEmail',   v)} />
        </div>

        {/* ── Horaires ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={15} color="#FF8400" />
              <p className="text-sm font-bold text-gray-900">Horaires d'ouverture</p>
            </div>
            {!editingHoraires ? (
              <button onClick={() => { setHorairesDraft([...horaires]); setEditingHoraires(true); }}
                className="flex items-center gap-1 text-xs font-medium" style={{ color: '#FF8400' }}>
                <Pencil size={12} /> Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={saveHorairesChanges} className="text-xs font-bold px-3 py-1 rounded-lg" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>Enregistrer</button>
                <button onClick={() => setEditingHoraires(false)} className="text-xs font-medium px-3 py-1 rounded-lg bg-gray-100 text-gray-500">Annuler</button>
              </div>
            )}
          </div>
          {(editingHoraires ? horairesDraft : horaires).map((h, idx) => (
            <div key={idx} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
              {editingHoraires ? (
                <>
                  <input
                    value={horairesDraft[idx].day}
                    onChange={e => setHorairesDraft(d => d.map((x, i) => i === idx ? { ...x, day: e.target.value } : x))}
                    className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 w-40 focus:outline-none focus:border-orange-400"
                  />
                  <input
                    value={horairesDraft[idx].hours}
                    onChange={e => setHorairesDraft(d => d.map((x, i) => i === idx ? { ...x, hours: e.target.value } : x))}
                    className="text-sm font-medium bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 w-36 text-right focus:outline-none focus:border-orange-400"
                    style={{ color: '#0B0829' }}
                  />
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-700">{h.day}</p>
                  <p className="text-sm font-medium" style={{ color: h.hours === 'Fermé' ? '#EF4444' : '#0B0829' }}>{h.hours}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* ── Notifications ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Bell size={15} color="#FF8400" />
            <p className="text-sm font-bold text-gray-900">Notifications</p>
          </div>
          {[
            { label: 'Nouvelles réservations', sub: 'Alertes en temps réel',           v: notifResa,  set: setNotifResa  },
            { label: 'Prochains audits',        sub: 'Rappel 7 jours avant',            v: notifAudit, set: setNotifAudit },
            { label: 'Stock bas',               sub: 'Quand une référence < 2 unités', v: notifStock, set: setNotifStock },
            { label: 'Récapitulatif email',     sub: 'Bilan hebdomadaire',             v: notifEmail, set: setNotifEmail },
          ].map(n => (
            <div key={n.label} className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{n.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.sub}</p>
              </div>
              <Toggle value={n.v} onChange={v => { n.set(v); showToast(v ? '🔔 Activé' : '🔕 Désactivé'); }} />
            </div>
          ))}
        </div>

        {/* ── Mon compte ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <User size={15} color="#FF8400" />
            <p className="text-sm font-bold text-gray-900">Mon compte</p>
          </div>
          <EditableField label="Nom complet" value={profile.name}  icon={<User size={15} className="text-gray-400" />} onSave={v => updateProfile('name',  v)} />
          <EditableField label="Email"       value={profile.email} icon={<Mail size={15} className="text-gray-400" />} onSave={v => updateProfile('email', v)} />
          <EditableField label="Téléphone"   value={profile.phone} icon={<Phone size={15} className="text-gray-400" />} onSave={v => updateProfile('phone', v)} />
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Lock size={15} className="text-gray-400" />
            <p className="text-sm font-medium text-gray-800 flex-1">Changer le mot de passe</p>
            <ChevronRight size={15} className="text-gray-300" />
          </div>
        </div>

        {/* ── Aide ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[
            { icon: <HelpCircle size={15} className="text-gray-400" />, label: 'Aide & Documentation', sub: '' },
            { icon: <Mail size={15} className="text-gray-400" />, label: 'Contacter AccesSite', sub: 'contact@accessite.fr' },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0">
              {row.icon}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{row.label}</p>
                {row.sub && <p className="text-xs text-gray-400">{row.sub}</p>}
              </div>
              <ChevronRight size={15} className="text-gray-300" />
            </div>
          ))}
        </div>

        {/* ── Déconnexion ──────────────────────────────────────── */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-gray-200"
          style={{ color: '#EF4444' }}
        >
          <LogOut size={16} />
          Se déconnecter
        </button>

        <p className="text-center text-xs text-gray-300 pb-2">AccesSite v1.0 · contact@accessite.fr</p>
      </div>
    </div>
  );
}
