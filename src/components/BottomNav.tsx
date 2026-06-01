import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  isCenter?: boolean;
}

interface BottomNavProps {
  items: NavItem[];
}

export default function BottomNav({ items }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { c } = useTheme();

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] shadow-lg z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', backgroundColor: c.navBg, borderTop: `1px solid ${c.navBorder}` }}
    >
      <div className="flex items-stretch h-16">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center flex-1 -mt-4"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: isActive ? '#E67600' : '#FF8400' }}
                >
                  <Icon size={24} color="white" />
                </div>
                <span className="text-[10px] mt-1 font-medium leading-none" style={{ color: '#FF8400' }}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 py-2 overflow-hidden"
            >
              <Icon
                size={22}
                color={isActive ? '#FFA43A' : c.textMuted}
                strokeWidth={isActive ? 2.5 : 2}
                style={{ flexShrink: 0 }}
              />
              <span
                className="leading-none font-medium mt-1 w-full text-center truncate px-1"
                style={{
                  fontSize: '10px',
                  color: isActive ? '#FFA43A' : c.textMuted,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
