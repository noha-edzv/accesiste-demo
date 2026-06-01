import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Role = 'gestionnaire' | 'auditeur';

export default function ProtectedRoute({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== role) {
    return <Navigate to={`/connexion?role=${role}`} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
