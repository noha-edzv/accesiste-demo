import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'gestionnaire' | 'auditeur' | null;

interface AuthUser {
  role: Role;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: Role) => boolean;
  logout: () => void;
}

const MOCK_CREDENTIALS: Record<string, { password: string; name: string; role: Role }> = {
  'jean-pierre@musee-beaux-arts.fr': {
    password: 'AccesSite2024',
    name: 'Jean-Pierre Martin',
    role: 'gestionnaire',
  },
  'directeur@cinema-lumiere.fr': {
    password: 'AccesSite2024',
    name: 'Claire Dubois',
    role: 'gestionnaire',
  },
  'sara@accessite.fr': {
    password: 'Audit2024',
    name: 'Sara Benali',
    role: 'auditeur',
  },
  'thomas@accessite.fr': {
    password: 'Audit2024',
    name: 'Thomas Leroy',
    role: 'auditeur',
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem('accessite_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string, role: Role): boolean => {
    const creds = MOCK_CREDENTIALS[email.toLowerCase().trim()];
    if (creds && creds.password === password && creds.role === role) {
      const authUser: AuthUser = { role, name: creds.name, email };
      setUser(authUser);
      sessionStorage.setItem('accessite_user', JSON.stringify(authUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('accessite_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
