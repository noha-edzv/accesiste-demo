import React from 'react';
import { Outlet } from 'react-router-dom';
import { ClipboardList, BarChart2, Settings, User } from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import type { NavItem } from '../../components/BottomNav';

const navItems: NavItem[] = [
  { label: 'Missions', icon: ClipboardList, path: '/auditeur' },
  { label: 'Rapports', icon: BarChart2, path: '/auditeur/rapports' },
  { label: 'Profil', icon: User, path: '/auditeur/profil' },
  { label: 'Paramètres', icon: Settings, path: '/auditeur/parametres' },
];

export default function AuditorLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNav items={navItems} />
    </div>
  );
}
