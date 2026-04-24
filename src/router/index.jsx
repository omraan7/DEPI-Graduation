/**
 * Router — All app routes
 *
 * PUBLIC  /           → Landing (PhysioHome landing page)
 *         /auth       → Role selector (patient vs doctor)
 *
 * PATIENT /patient/*  (PatientLayout — bottom navbar)
 *   /chat             → AI chat onboarding
 *   /pain-map         → Interactive body pain map
 *   /doctors          → Doctor recommendations
 *   /doctor/:id       → Doctor profile + booking
 *   /home             → Patient dashboard
 *   /profile          → Patient profile + history
 *   /messages         → Chat with doctor
 *   /alerts           → Notifications
 *   /tracker          → Full-screen exercise tracker (no navbar)
 *
 * DOCTOR  /doctor/*   (DoctorLayout — sidebar)
 *   /dashboard        → Overview + patient table
 *   /patients         → Full patient list
 *   /patient/:id      → Patient detail + notes
 *   /messages         → Doctor ↔ patient chat
 *   /analytics        → Charts + stats
 *   /settings         → Profile settings
 */

import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout  from '../layouts/PublicLayout';
import PatientLayout from '../layouts/PatientLayout';
import DoctorLayout  from '../layouts/DoctorLayout';

// Public
import Landing    from '../pages/Landing';
import AuthSelect from '../pages/AuthSelect';

// Patient
import ChatOnboarding   from '../pages/patient/ChatOnboarding';
import PainMap          from '../pages/patient/PainMap';
import DoctorRecommend  from '../pages/patient/DoctorRecommend';
import DoctorProfilePage from '../pages/patient/DoctorProfilePage';
import PatientHome      from '../pages/patient/PatientHome';
import PatientProfile   from '../pages/patient/PatientProfile';
import MessagesPage     from '../pages/patient/MessagesPage';
import AlertsPage       from '../pages/patient/AlertsPage';
import TrackerPage      from '../pages/patient/TrackerPage';

// Doctor
import DoctorDashboard  from '../pages/doctor/DoctorDashboard';
import PatientsList     from '../pages/doctor/PatientsList';
import PatientDetail    from '../pages/doctor/PatientDetail';
import DoctorMessages   from '../pages/doctor/DoctorMessages';
import DoctorAnalytics  from '../pages/doctor/DoctorAnalytics';
import DoctorSettings   from '../pages/doctor/DoctorSettings';

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route element={<PublicLayout />}>
        <Route index element={<Landing />} />
      </Route>
      <Route path="/auth" element={<AuthSelect />} />

      {/* ── Patient ── */}
      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<Navigate to="/patient/chat" replace />} />
        <Route path="chat"       element={<ChatOnboarding />} />
        <Route path="pain-map"   element={<PainMap />} />
        <Route path="doctors"    element={<DoctorRecommend />} />
        <Route path="doctor/:id" element={<DoctorProfilePage />} />
        <Route path="home"       element={<PatientHome />} />
        <Route path="profile"    element={<PatientProfile />} />
        <Route path="messages"   element={<MessagesPage />} />
        <Route path="alerts"     element={<AlertsPage />} />
        <Route path="tracker"    element={<TrackerPage />} />
      </Route>

      {/* ── Doctor ── */}
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="dashboard"   element={<DoctorDashboard />} />
        <Route path="patients"    element={<PatientsList />} />
        <Route path="patient/:id" element={<PatientDetail />} />
        <Route path="messages"    element={<DoctorMessages />} />
        <Route path="analytics"   element={<DoctorAnalytics />} />
        <Route path="settings"    element={<DoctorSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
