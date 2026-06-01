import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import VisitorLayout from './pages/visitor/VisitorLayout';
import VisitorHome from './pages/visitor/VisitorHome';
import VenueDetail from './pages/visitor/VenueDetail';
import BookingFlow from './pages/visitor/BookingFlow';
import VisitorReservations from './pages/visitor/VisitorReservations';
import VisitorMap from './pages/visitor/VisitorMap';
import VisitorFavorites from './pages/visitor/VisitorFavorites';
import VisitorProfile from './pages/visitor/VisitorProfile';
import ManagerLayout from './pages/manager/ManagerLayout';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerReservations from './pages/manager/ManagerReservations';
import ManagerStock from './pages/manager/ManagerStock';
import ManagerRapports from './pages/manager/ManagerRapports';
import ManagerReglages from './pages/manager/ManagerReglages';
import AuditorLayout from './pages/auditor/AuditorLayout';
import MissionsList from './pages/auditor/MissionsList';
import AuditForm from './pages/auditor/AuditForm';
import AuditReport from './pages/auditor/AuditReport';
import RapportsList from './pages/auditor/RapportsList';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/connexion" element={<LoginPage />} />

      <Route path="/visiteur" element={<VisitorLayout />}>
        <Route index element={<VisitorHome />} />
        <Route path="reservations" element={<VisitorReservations />} />
        <Route path="carte" element={<VisitorMap />} />
        <Route path="favoris" element={<VisitorFavorites />} />
        <Route path="profil" element={<VisitorProfile />} />
        <Route path="lieu/:id" element={<VenueDetail />} />
        <Route path="reserver/:venueId" element={<BookingFlow />} />
      </Route>

      <Route path="/gestionnaire" element={<ManagerLayout />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="reservations" element={<ManagerReservations />} />
        <Route path="materiel" element={<ManagerStock />} />
        <Route path="rapports" element={<ManagerRapports />} />
        <Route path="reglages" element={<ManagerReglages />} />
      </Route>

      <Route path="/auditeur" element={<AuditorLayout />}>
        <Route index element={<MissionsList />} />
        <Route path="missions" element={<MissionsList />} />
        <Route path="rapports" element={<RapportsList />} />
        <Route path="audit/:missionId" element={<AuditForm />} />
        <Route path="rapport/:missionId" element={<AuditReport />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
