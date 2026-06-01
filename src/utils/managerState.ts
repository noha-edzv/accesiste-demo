// ── Clés localStorage ─────────────────────────────────────────────────────
const RES_KEY     = 'accessite_reservations';
const STOCK_KEY   = 'accessite_stock';
const PROFILE_KEY = 'accessite_manager_profile';
const HORAIRES_KEY = 'accessite_manager_horaires';

// ── Réservations ──────────────────────────────────────────────────────────
export type ResStatus = 'confirmée' | 'en attente' | 'annulée' | 'terminée';

export function getResOverrides(): Record<string, ResStatus> {
  try { return JSON.parse(localStorage.getItem(RES_KEY) ?? '{}'); } catch { return {}; }
}
export function saveResOverride(id: string, status: ResStatus) {
  const all = getResOverrides();
  all[id] = status;
  localStorage.setItem(RES_KEY, JSON.stringify(all));
}

// ── Stock ─────────────────────────────────────────────────────────────────
export interface EquipState { available: number; reserved: number; maintenance: number; total: number }

export function getStockOverrides(): Record<string, EquipState> {
  try { return JSON.parse(localStorage.getItem(STOCK_KEY) ?? '{}'); } catch { return {}; }
}
export function saveStockOverride(id: string, data: EquipState) {
  const all = getStockOverrides();
  all[id] = data;
  localStorage.setItem(STOCK_KEY, JSON.stringify(all));
}

// ── Profil ─────────────────────────────────────────────────────────────────
export interface ManagerProfile {
  name: string; email: string; phone: string;
  venueName: string; venueAddress: string; venuePhone: string; venueEmail: string;
}
const DEFAULT_PROFILE: ManagerProfile = {
  name: 'Jean-Pierre Martin',
  email: 'jean-pierre@musee-beaux-arts.fr',
  phone: '+33 6 12 34 56 78',
  venueName: 'Palais des Beaux-Arts de Lille',
  venueAddress: '18 Pl. de la République, 59000 Lille',
  venuePhone: '+33 3 20 06 78 00',
  venueEmail: 'contact@pba-lille.fr',
};
export function getProfile(): ManagerProfile {
  try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{}') }; }
  catch { return DEFAULT_PROFILE; }
}
export function saveProfile(p: Partial<ManagerProfile>) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...getProfile(), ...p }));
}

// ── Horaires ──────────────────────────────────────────────────────────────
export interface Horaire { day: string; hours: string }
export const DEFAULT_HORAIRES: Horaire[] = [
  { day: 'Lundi',           hours: 'Fermé' },
  { day: 'Mardi – Dimanche', hours: '10h00 – 18h00' },
  { day: 'Nocturne vendredi', hours: '10h00 – 20h00' },
];
export function getHoraires(): Horaire[] {
  try { return JSON.parse(localStorage.getItem(HORAIRES_KEY) ?? 'null') ?? DEFAULT_HORAIRES; }
  catch { return DEFAULT_HORAIRES; }
}
export function saveHoraires(h: Horaire[]) {
  localStorage.setItem(HORAIRES_KEY, JSON.stringify(h));
}
