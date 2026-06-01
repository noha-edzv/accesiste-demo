import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, Settings, Bell, History, HelpCircle,
  LogOut, Shield, Accessibility, Check, MapPin, X,
} from 'lucide-react';
import { reservations } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

type Panel = 'accessibilite' | 'notifications' | 'historique' | 'confidentialite' | 'aide' | 'parametres' | null;

const HANDICAP_TYPES = [
  { id: 'fauteuil',   label: 'Fauteuil roulant',     emoji: '♿', desc: 'Manuel ou électrique' },
  { id: 'moteur',     label: 'Moteur',                emoji: '🦾', desc: 'Difficultés de déplacement' },
  { id: 'motricite',  label: 'Motricité fine',        emoji: '✋', desc: 'Gestes précis difficiles' },
  { id: 'canne',      label: 'Déambulateur / Canne',  emoji: '🦯', desc: 'Aide à la marche' },
  { id: 'non_voyant', label: 'Non-voyant',            emoji: '👁️', desc: 'Cécité totale ou quasi' },
  { id: 'malvoyant',  label: 'Malvoyant',             emoji: '🔍', desc: 'Vision partielle' },
  { id: 'sourd',      label: 'Sourd / Malentendant',  emoji: '👂', desc: 'Perte auditive totale ou partielle' },
  { id: 'lsf',        label: 'LSF',                   emoji: '🤟', desc: 'Langue des Signes Française' },
  { id: 'cognitif',   label: 'Cognitif',              emoji: '🧠', desc: 'Mémoire ou compréhension' },
  { id: 'autisme',    label: 'Autisme / TSA',         emoji: '🌈', desc: 'Troubles du spectre autistique' },
  { id: 'dyslexie',   label: 'Dyslexie',              emoji: '📖', desc: 'Lecture et écriture' },
  { id: 'epilepsie',  label: 'Épilepsie',             emoji: '⚡', desc: 'Sensibilité aux flashs' },
];

const PRESETS = [
  {
    id: 'visuel',
    label: 'Mode Visuel',
    emoji: '👁️',
    color: '#1A8FAA',
    bg: '#A3DFF1',
    desc: 'Texte agrandi, espacement optimisé pour les malvoyants',
    tags: ['Texte +20%', 'Interligne large', 'Boutons grands'],
  },
  {
    id: 'cognitif',
    label: 'Mode Cognitif',
    emoji: '🧠',
    color: '#C07020',
    bg: '#FFC065',
    desc: 'Interface épurée, sans animations, mots clés mis en avant',
    tags: ['Sans animations', 'Espacement ++', 'Lecture facilitée'],
  },
  {
    id: 'moteur',
    label: 'Mode Motricité',
    emoji: '✋',
    color: '#E8891A',
    bg: '#FFA43A',
    desc: 'Zones de toucher XXL, boutons très grands, navigation simplifiée',
    tags: ['Boutons XXL', 'Zones larges', 'Espacé'],
  },
];

export default function VisitorProfile() {
  const navigate = useNavigate();
  const { c, setTheme: setContextTheme } = useTheme();
  const [panel, setPanel] = useState<Panel>(null);
  const [selectedHandicaps, setSelectedHandicaps] = useState<string[]>(['fauteuil', 'malvoyant']);
  const [activePreset, setActivePreset] = useState<string | null>(
    localStorage.getItem('accesiste_preset')
  );
  const [notifReservation, setNotifReservation] = useState(true);
  const [notifRappel, setNotifRappel] = useState(true);
  const [notifNouveaux, setNotifNouveaux] = useState(false);

  // Paramètres — persistés dans localStorage
  const [langue, setLangue] = useState(() => localStorage.getItem('accesiste_langue') ?? 'Français');
  const [theme, setTheme] = useState(() => localStorage.getItem('accesiste_theme') ?? 'Clair');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('accesiste_fontSize') ?? 'Normal');
  const [picker, setPicker] = useState<string | null>(null);

  const saveLangue = (v: string) => { setLangue(v); localStorage.setItem('accesiste_langue', v); };
  const saveTheme = (v: string) => { setTheme(v); setContextTheme(v); localStorage.setItem('accesiste_theme', v); };
  const saveFontSize = (v: string) => { setFontSize(v); localStorage.setItem('accesiste_fontSize', v); };

  const history = reservations.filter(
    (r) => r.visitorName === 'Marie Dupont' && r.status === 'terminée'
  );

  const toggleHandicap = (id: string) =>
    setSelectedHandicaps((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const applyPreset = (id: string) => {
    const next = activePreset === id ? null : id;
    setActivePreset(next);
    document.documentElement.setAttribute('data-preset', next ?? '');
    if (next) {
      localStorage.setItem('accesiste_preset', next);
    } else {
      localStorage.removeItem('accesiste_preset');
    }
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className="w-12 h-6 rounded-full transition-colors relative flex-shrink-0"
      style={{ backgroundColor: value ? '#FF8400' : '#D1D5DB' }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
        style={{ left: value ? '26px' : '2px' }}
      />
    </button>
  );

  const menuGroups = [
    [
      { icon: <Accessibility size={20} />, label: 'Préférences d\'accessibilité', sublabel: selectedHandicaps.length ? `${selectedHandicaps.length} type${selectedHandicaps.length > 1 ? 's' : ''} déclaré${selectedHandicaps.length > 1 ? 's' : ''}` : 'Non renseigné', color: '#FF8400', panel: 'accessibilite' as Panel },
      { icon: <Bell size={20} />, label: 'Notifications', sublabel: [notifReservation, notifRappel, notifNouveaux].filter(Boolean).length + ' activées', color: '#8FA0D8', panel: 'notifications' as Panel },
    ],
    [
      { icon: <History size={20} />, label: 'Historique', sublabel: `${history.length} visite${history.length !== 1 ? 's' : ''}`, color: '#22C55E', panel: 'historique' as Panel },
      { icon: <Shield size={20} />, label: 'Confidentialité', color: '#6B7280', panel: 'confidentialite' as Panel },
    ],
    [
      { icon: <HelpCircle size={20} />, label: 'Aide et support', color: '#EAB308', panel: 'aide' as Panel },
      { icon: <Settings size={20} />, label: 'Paramètres', color: '#6B7280', panel: 'parametres' as Panel },
    ],
    [
      { icon: <LogOut size={20} />, label: 'Déconnexion', color: '#EF4444', panel: null, action: () => navigate('/') },
    ],
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bgPrimary }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-8 flex flex-col items-center" style={{ background: `linear-gradient(180deg, ${c.accentBg} 0%, ${c.bgPrimary} 100%)` }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg" style={{ backgroundColor: '#FFA43A' }}>
          MD
        </div>
        <h2 className="text-xl font-bold" style={{ color: c.textPrimary }}>Marie Dupont</h2>
        <p className="text-sm mt-0.5" style={{ color: c.textSecondary }}>marie.dupont@email.fr</p>
        <div className="flex gap-6 mt-4">
          {[['5', 'Visites'], ['3', 'Favoris'], ['2', 'Avis']].map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="text-lg font-bold" style={{ color: '#FFA43A' }}>{n}</p>
              <p className="text-xs" style={{ color: c.textSecondary }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 -mt-4 mb-4">
        <div className="rounded-2xl shadow-sm p-3" style={{ backgroundColor: c.bgCard }}>
          <p className="text-xs font-semibold mb-2" style={{ color: c.textSecondary }}>Mes handicaps déclarés</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedHandicaps.length === 0 ? (
              <span className="text-xs" style={{ color: c.textMuted }}>Non renseigné</span>
            ) : selectedHandicaps.map((id) => {
              const h = HANDICAP_TYPES.find(x => x.id === id);
              return h ? (
                <span key={id} className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: c.accentBg, color: '#E8891A' }}>
                  {h.emoji} {h.label}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3 pb-24">
        {menuGroups.map((group, gi) => (
          <div key={gi} className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: c.bgCard }}>
            {group.map((item, ii) => (
              <button
                key={ii}
                onClick={() => item.action ? item.action() : setPanel(item.panel)}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors"
                style={{ borderBottom: ii < group.length - 1 ? `1px solid ${c.borderLight}` : 'none' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                  {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium" style={{ color: item.label === 'Déconnexion' ? '#EF4444' : c.textPrimary }}>
                    {item.label}
                  </p>
                  {'sublabel' in item && item.sublabel && (
                    <p className="text-xs" style={{ color: c.textMuted }}>{item.sublabel}</p>
                  )}
                </div>
                <ChevronRight size={16} style={{ color: c.textMuted }} />
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Slide-in panels */}
      {panel && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: c.bgCard, maxWidth: 430, margin: '0 auto' }}>
          {/* Panel header */}
          <div className="flex items-center gap-3 px-4 pt-12 pb-4" style={{ borderBottom: `1px solid ${c.borderLight}` }}>
            <button onClick={() => setPanel(null)} className="p-2 rounded-full" style={{ backgroundColor: c.bgSurface }}>
              <ChevronLeft size={22} color={c.textPrimary} />
            </button>
            <h2 className="text-lg font-bold" style={{ color: c.textPrimary }}>
              {panel === 'accessibilite' && 'Préférences d\'accessibilité'}
              {panel === 'notifications' && 'Notifications'}
              {panel === 'historique' && 'Historique des visites'}
              {panel === 'confidentialite' && 'Confidentialité'}
              {panel === 'aide' && 'Aide et support'}
              {panel === 'parametres' && 'Paramètres'}
            </h2>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto px-5 py-5">

            {/* Accessibilité */}
            {panel === 'accessibilite' && (
              <div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: c.textSecondary }}>
                  Sélectionnez vos situations pour personnaliser les résultats et les informations affichées.
                </p>
                <div className="flex flex-col gap-2">
                  {HANDICAP_TYPES.map((h) => {
                    const active = selectedHandicaps.includes(h.id);
                    return (
                      <button
                        key={h.id}
                        onClick={() => toggleHandicap(h.id)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all active:scale-[0.98] text-left"
                        style={{
                          borderColor: active ? '#FFA43A' : c.border,
                          backgroundColor: active ? c.bgSurface : c.bgCard,
                        }}
                      >
                        <span className="text-xl w-8 text-center flex-shrink-0">{h.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm" style={{ color: active ? '#E8891A' : c.textPrimary }}>{h.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: c.textMuted }}>{h.desc}</p>
                        </div>
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: active ? '#FFA43A' : c.border }}
                        >
                          {active && <Check size={13} color="white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPanel(null)}
                  className="mt-6 w-full py-4 rounded-2xl font-bold text-white text-base"
                  style={{ backgroundColor: '#FFA43A' }}
                >
                  Enregistrer ({selectedHandicaps.length} sélectionné{selectedHandicaps.length > 1 ? 's' : ''})
                </button>
              </div>
            )}

            {/* Notifications */}
            {panel === 'notifications' && (
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Confirmations de réservation', sub: 'Recevez un email quand votre réservation est confirmée', val: notifReservation, set: () => setNotifReservation(v => !v) },
                  { label: 'Rappels J-1', sub: 'Un rappel la veille de chaque réservation', val: notifRappel, set: () => setNotifRappel(v => !v) },
                  { label: 'Nouveaux lieux', sub: 'Découvrez les nouveaux partenaires AccesSite', val: notifNouveaux, set: () => setNotifNouveaux(v => !v) },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3" style={{ backgroundColor: c.bgSurface }}>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: c.textPrimary }}>{item.label}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: c.textSecondary }}>{item.sub}</p>
                    </div>
                    <Toggle value={item.val} onChange={item.set} />
                  </div>
                ))}
              </div>
            )}

            {/* Historique */}
            {panel === 'historique' && (
              <div>
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <History size={40} className="mx-auto mb-3" style={{ color: c.textMuted }} />
                    <p style={{ color: c.textSecondary }}>Aucune visite passée</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {history.map((r) => (
                      <div key={r.id} className="rounded-2xl p-3 flex items-center gap-3" style={{ backgroundColor: c.bgSurface }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: c.bgCard }}>
                          {r.equipmentIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: c.textPrimary }}>{r.venueName}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin size={10} style={{ color: c.textMuted }} />
                            <p className="text-xs" style={{ color: c.textSecondary }}>{r.equipmentName}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-semibold" style={{ color: c.textSecondary }}>
                            {new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </p>
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: c.borderLight, color: c.textMuted }}>
                            Terminée
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Confidentialité */}
            {panel === 'confidentialite' && (
              <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: c.textSecondary }}>
                <div className="rounded-2xl p-4" style={{ backgroundColor: '#1A3A5C' }}>
                  <p className="font-bold mb-1" style={{ color: c.textPrimary }}>Vos données sont protégées</p>
                  <p style={{ color: '#7EC8E3' }}>AccesSite respecte le RGPD. Vos données personnelles ne sont jamais vendues à des tiers.</p>
                </div>
                {[
                  { title: 'Données collectées', text: 'Nom, email, préférences d\'accessibilité et historique de réservations.' },
                  { title: 'Droit à l\'oubli', text: 'Vous pouvez demander la suppression complète de votre compte à contact@accessite.fr.' },
                  { title: 'Portabilité', text: 'Demandez une copie de vos données à tout moment.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl p-4" style={{ backgroundColor: c.bgSurface }}>
                    <p className="font-semibold mb-1" style={{ color: c.textPrimary }}>{item.title}</p>
                    <p>{item.text}</p>
                  </div>
                ))}
                <button className="w-full py-3.5 rounded-2xl border-2 font-semibold text-sm" style={{ borderColor: '#EF4444', color: '#EF4444' }}>
                  Supprimer mon compte
                </button>
              </div>
            )}

            {/* Aide */}
            {panel === 'aide' && (
              <div className="flex flex-col gap-3">
                {[
                  { q: 'Comment réserver du matériel ?', a: 'Trouvez un lieu sur la carte, ouvrez sa fiche et appuyez sur "Réserver du matériel". Choisissez la date et l\'équipement.' },
                  { q: 'Comment annuler une réservation ?', a: 'Rendez-vous dans "Mes réservations", trouvez la réservation et appuyez sur "Annuler". Possible jusqu\'à 24h avant.' },
                  { q: 'Le matériel est-il gratuit ?', a: 'Oui, la réservation de matériel est entièrement gratuite pour les visiteurs. AccesSite facture uniquement les lieux partenaires.' },
                  { q: 'Que signifient les scores A, B, C ?', a: 'A (Fiable) ≥ 80 pts · B (Partiel) ≥ 50 pts · C (Non-conforme) < 50 pts. Basé sur un audit de 41 points réalisé par l\'équipe AccesSite.' },
                ].map((item) => {
                  const [open, setOpen] = useState(false);
                  return (
                    <button
                      key={item.q}
                      onClick={() => setOpen(v => !v)}
                      className="rounded-2xl p-4 text-left w-full"
                      style={{ backgroundColor: c.bgSurface }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm" style={{ color: c.textPrimary }}>{item.q}</p>
                        <ChevronRight size={16} style={{ color: c.textMuted, flexShrink: 0, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                      {open && <p className="text-sm mt-2 leading-relaxed" style={{ color: c.textSecondary }}>{item.a}</p>}
                    </button>
                  );
                })}
                <div className="mt-2 rounded-2xl p-4 text-center" style={{ backgroundColor: c.accentBg }}>
                  <p className="text-sm mb-2" style={{ color: c.textSecondary }}>Vous n'avez pas trouvé votre réponse ?</p>
                  <p className="font-semibold text-sm" style={{ color: '#FFA43A' }}>contact@accessite.fr</p>
                </div>
              </div>
            )}

            {/* Paramètres */}
            {panel === 'parametres' && (
              <div className="flex flex-col gap-3">

                {/* Presets d'accessibilité */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.textSecondary }}>Préréglages d'accessibilité</p>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: c.textMuted }}>
                    Activez un mode pour adapter toute l'application à votre situation. Un seul mode actif à la fois.
                  </p>
                  <div className="flex flex-col gap-2">
                    {PRESETS.map((preset) => {
                      const isOn = activePreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => applyPreset(preset.id)}
                          className="flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98]"
                          style={{
                            borderColor: isOn ? preset.color : c.border,
                            backgroundColor: isOn ? `${preset.bg}22` : c.bgCard,
                          }}
                        >
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ backgroundColor: isOn ? preset.bg : c.bgSurface }}
                          >
                            {preset.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-sm" style={{ color: isOn ? preset.color : c.textPrimary }}>{preset.label}</p>
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: isOn ? preset.color : c.border }}
                              >
                                {isOn && <Check size={12} color="white" />}
                              </div>
                            </div>
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: c.textMuted }}>{preset.desc}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {preset.tags.map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                  style={{ backgroundColor: isOn ? `${preset.bg}55` : c.bgSurface, color: isOn ? preset.color : c.textMuted }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {activePreset && (
                    <button
                      onClick={() => applyPreset(activePreset)}
                      className="mt-2 w-full py-2.5 rounded-xl text-xs font-semibold border"
                      style={{ borderColor: c.border, color: c.textMuted }}
                    >
                      Désactiver le mode accessibilité
                    </button>
                  )}
                </div>

                <div className="h-px" style={{ backgroundColor: c.borderLight }} />

                {/* Langue */}
                <div>
                  <button
                    onClick={() => setPicker(picker === 'langue' ? null : 'langue')}
                    className="w-full rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-colors"
                    style={{ backgroundColor: c.bgSurface }}
                  >
                    <span className="text-xl w-8 text-center">🌍</span>
                    <span className="flex-1 text-sm font-medium text-left" style={{ color: c.textPrimary }}>Langue</span>
                    <span className="text-sm mr-1" style={{ color: c.textSecondary }}>{langue}</span>
                    <ChevronRight size={14} style={{ color: c.textMuted, flexShrink: 0, transform: picker === 'langue' ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {picker === 'langue' && (
                    <div className="mt-1 rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.borderLight}` }}>
                      {['Français', 'English'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { saveLangue(opt); setPicker(null); }}
                          className="w-full px-5 py-3 flex items-center justify-between text-sm transition-colors"
                          style={{ borderBottom: opt !== 'English' ? `1px solid ${c.borderLight}` : 'none' }}
                        >
                          <span style={{ color: langue === opt ? '#FFA43A' : c.textPrimary, fontWeight: langue === opt ? 600 : 400 }}>{opt}</span>
                          {langue === opt && <Check size={16} color="#FFA43A" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thème */}
                <div>
                  <button
                    onClick={() => setPicker(picker === 'theme' ? null : 'theme')}
                    className="w-full rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-colors"
                    style={{ backgroundColor: c.bgSurface }}
                  >
                    <span className="text-xl w-8 text-center">{theme === 'Clair' ? '☀️' : '🌙'}</span>
                    <span className="flex-1 text-sm font-medium text-left" style={{ color: c.textPrimary }}>Thème</span>
                    <span className="text-sm mr-1" style={{ color: c.textSecondary }}>{theme}</span>
                    <ChevronRight size={14} style={{ color: c.textMuted, flexShrink: 0, transform: picker === 'theme' ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {picker === 'theme' && (
                    <div className="mt-1 rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.borderLight}` }}>
                      {['Clair', 'Sombre'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { saveTheme(opt); setPicker(null); }}
                          className="w-full px-5 py-3 flex items-center justify-between text-sm transition-colors"
                          style={{ borderBottom: opt !== 'Sombre' ? `1px solid ${c.borderLight}` : 'none' }}
                        >
                          <span style={{ color: theme === opt ? '#FFA43A' : c.textPrimary, fontWeight: theme === opt ? 600 : 400 }}>
                            {opt === 'Clair' ? '☀️ Clair' : '🌙 Sombre'}
                          </span>
                          {theme === opt && <Check size={16} color="#FFA43A" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Taille du texte */}
                <div>
                  <button
                    onClick={() => setPicker(picker === 'fontSize' ? null : 'fontSize')}
                    className="w-full rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-colors"
                    style={{ backgroundColor: c.bgSurface }}
                  >
                    <span className="text-xl w-8 text-center">🔡</span>
                    <span className="flex-1 text-sm font-medium text-left" style={{ color: c.textPrimary }}>Taille du texte</span>
                    <span className="text-sm mr-1" style={{ color: c.textSecondary }}>{fontSize}</span>
                    <ChevronRight size={14} style={{ color: c.textMuted, flexShrink: 0, transform: picker === 'fontSize' ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {picker === 'fontSize' && (
                    <div className="mt-1 rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.borderLight}` }}>
                      {['Petit', 'Normal', 'Grand'].map((opt, i, arr) => (
                        <button
                          key={opt}
                          onClick={() => { saveFontSize(opt); setPicker(null); }}
                          className="w-full px-5 py-3 flex items-center justify-between transition-colors"
                          style={{ borderBottom: i < arr.length - 1 ? `1px solid ${c.borderLight}` : 'none' }}
                        >
                          <span style={{ color: fontSize === opt ? '#FFA43A' : c.textPrimary, fontWeight: fontSize === opt ? 600 : 400, fontSize: opt === 'Petit' ? 12 : opt === 'Grand' ? 16 : 14 }}>{opt}</span>
                          {fontSize === opt && <Check size={16} color="#FFA43A" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Version */}
                <div className="rounded-2xl px-4 py-3.5 flex items-center gap-3" style={{ backgroundColor: c.bgSurface }}>
                  <span className="text-xl w-8 text-center">ℹ️</span>
                  <span className="flex-1 text-sm font-medium" style={{ color: c.textPrimary }}>Version</span>
                  <span className="text-sm" style={{ color: c.textMuted }}>1.0.0 (MVP)</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
