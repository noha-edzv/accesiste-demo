import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeColors {
  bgPrimary: string;
  bgCard: string;
  bgSurface: string;
  bgInput: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  accent: string;
  accentBg: string;
  navBg: string;
  navBorder: string;
  chipBg: string;
  chipText: string;
}

const light: ThemeColors = {
  bgPrimary:    '#FFF8EE',
  bgCard:       '#FFFFFF',
  bgSurface:    '#F9F3EA',
  bgInput:      '#FFFFFF',
  textPrimary:  '#0B0829',
  textSecondary:'#A07040',
  textMuted:    '#C07020',
  border:       '#FEE4B8',
  borderLight:  '#F3F4F6',
  accent:       '#FFA43A',
  accentBg:     '#FEE4B8',
  navBg:        '#FFFFFF',
  navBorder:    '#F3F4F6',
  chipBg:       '#FEE4B8',
  chipText:     '#E8891A',
};

const dark: ThemeColors = {
  bgPrimary:    '#0D0B1F',
  bgCard:       '#1A1640',
  bgSurface:    '#231E55',
  bgInput:      '#231E55',
  textPrimary:  '#F0EEFF',
  textSecondary:'#9B8FC4',
  textMuted:    '#7B6FBE',
  border:       '#2D2860',
  borderLight:  '#2D2860',
  accent:       '#FFA43A',
  accentBg:     '#3D2415',
  navBg:        '#12103A',
  navBorder:    '#2D2860',
  chipBg:       '#3D2415',
  chipText:     '#FFA43A',
};

interface ThemeContextType {
  isDark: boolean;
  theme: string;
  setTheme: (t: string) => void;
  c: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  theme: 'Clair',
  setTheme: () => {},
  c: light,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('accesiste_theme') ?? 'Clair'
  );
  const isDark = theme === 'Sombre';

  const setTheme = (t: string) => {
    setThemeState(t);
    localStorage.setItem('accesiste_theme', t);
    document.documentElement.setAttribute('data-theme', t === 'Sombre' ? 'sombre' : '');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'sombre' : '');
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, theme, setTheme, c: isDark ? dark : light }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
