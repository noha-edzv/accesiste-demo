import React from 'react';
import { Outlet } from 'react-router-dom';
import { Calendar, Package, LayoutDashboard, BarChart2, Settings } from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import type { NavItem } from '../../components/BottomNav';

const navItems: NavItem[] = [
  { label: 'Réservations', icon: Calendar, path: '/gestionnaire/reservations' },
  { label: 'Matériel', icon: Package, path: '/gestionnaire/materiel' },
  { label: 'Tableau', icon: LayoutDashboard, path: '/gestionnaire', isCenter: true },
  { label: 'Rapports', icon: BarChart2, path: '/gestionnaire/rapports' },
  { label: 'Réglages', icon: Settings, path: '/gestionnaire/reglages' },
];

export default function ManagerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNav items={navItems} />
    </div>
  );
}
