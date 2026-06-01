import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Home, Calendar, Map, Heart, User } from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import type { NavItem } from '../../components/BottomNav';

const navItems: NavItem[] = [
  { label: 'Accueil', icon: Home, path: '/visiteur' },
  { label: 'Réservations', icon: Calendar, path: '/visiteur/reservations' },
  { label: 'Carte', icon: Map, path: '/visiteur/carte' },
  { label: 'Favoris', icon: Heart, path: '/visiteur/favoris' },
  { label: 'Profil', icon: User, path: '/visiteur/profil' },
];

export default function VisitorLayout() {
  const { c } = useTheme();
  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bgPrimary }}>
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNav items={navItems} />
    </div>
  );
}
