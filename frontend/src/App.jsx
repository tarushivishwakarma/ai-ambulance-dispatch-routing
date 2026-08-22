import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
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
import useAuthStore from './stores/authStore';
import useDemoStore from './demo/demoStore';
import { apiService, isSystemDemoMode } from './services/apiService';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore(state => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  useEffect(() => {
    if (!isSystemDemoMode) {
      console.log('Fetching live data from MongoDB...');
      const fetchLiveData = async () => {
        try {
          const [incidents, ambulances, hospitals, dispatches, alerts, roads, historical] = await Promise.all([
            apiService.getIncidents(),
            apiService.getAmbulances(),
            apiService.getHospitals(),
            apiService.execute(() => import('axios').then(a => a.default.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/dispatch/active`)), () => []),
            apiService.execute(() => import('axios').then(a => a.default.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/alerts`)), () => []),
            apiService.execute(() => import('axios').then(a => a.default.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/roads`)), () => []),
            apiService.execute(() => import('axios').then(a => a.default.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/historical`)), () => [])
          ]);
          
          // Map historical data to expected shape if needed
          const mappedHistorical = (historical || []).map(h => ({
            _id: h._id,
            year: new Date(h.createdAt).getFullYear(),
            date: h.createdAt,
            category: h.category || 'MEDICAL_EMERGENCY',
            severity: h.severity || 5,
            city: h.city || (h.address ? h.address.split(',').pop().trim() : 'Unknown')
          }));

          useDemoStore.setState({
            incidents: incidents || [],
            ambulances: ambulances || [],
            hospitals: hospitals || [],
            dispatches: dispatches || [],
            alerts: alerts || [],
            roadConditions: roads || [],
            historicalIncidents: mappedHistorical
          });
        } catch (error) {
          console.error('Failed to fetch live data:', error);
        }
      };
      fetchLiveData();
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-primary-900">
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
  );
}

export default App;
