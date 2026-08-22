import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CitizenReport from './pages/CitizenReport';
import DashboardLayout from './layouts/DashboardLayout';
import CommandDashboard from './pages/CommandDashboard';
import DriverDashboard from './pages/DriverDashboard';
import IncidentsList from './pages/IncidentsList';
import AmbulancesList from './pages/AmbulancesList';
import HospitalsList from './pages/HospitalsList';
import DispatchBoard from './pages/DispatchBoard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ReportsView from './pages/ReportsView';
import RoadConditions from './pages/RoadConditions';
import SettingsView from './pages/SettingsView';
import DriverRoute from './pages/DriverRoute';
import LoginPage from './pages/LoginPage';
import VideoBackground from './components/VideoBackground';
import useAuthStore from './stores/authStore';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore(state => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const location = useLocation();
  const path = location.pathname;
  
  // Determine if video background should be shown
  const showDashboardBackground = path.startsWith('/dashboard') || path.startsWith('/driver');

  // Page-specific opacity overrides for optimal contrast
  let videoOpacity = "opacity-20"; // default for dashboard
  if (path.includes('/incidents')) videoOpacity = "opacity-[0.15]";
  else if (path.includes('/ambulances')) videoOpacity = "opacity-[0.15]";
  else if (path.includes('/hospitals')) videoOpacity = "opacity-[0.12]";
  else if (path.includes('/dispatch')) videoOpacity = "opacity-[0.22]";
  else if (path.includes('/analytics')) videoOpacity = "opacity-[0.10]";
  else if (path.includes('/reports')) videoOpacity = "opacity-[0.10]";
  else if (path.includes('/roads')) videoOpacity = "opacity-[0.18]";
  else if (path.includes('/settings')) videoOpacity = "opacity-[0.08]";

  return (
    <div className="relative min-h-screen w-full bg-primary-900">
      {showDashboardBackground && <VideoBackground videoOpacity={videoOpacity} />}
      
      <div className="relative z-10 h-full w-full">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report" element={<CitizenReport />} />

          {/* Dispatcher Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout role="DISPATCHER" /></ProtectedRoute>}>
            <Route index element={<CommandDashboard />} />
            <Route path="incidents" element={<IncidentsList />} />
            <Route path="ambulances" element={<AmbulancesList />} />
            <Route path="hospitals" element={<HospitalsList />} />
            <Route path="dispatch" element={<DispatchBoard />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="reports" element={<ReportsView />} />
            <Route path="roads" element={<RoadConditions />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>

          {/* Driver Dashboard Routes */}
          <Route path="/driver" element={<ProtectedRoute><DashboardLayout role="DRIVER" /></ProtectedRoute>}>
            <Route index element={<DriverDashboard />} />
            <Route path="route" element={<DriverRoute />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
