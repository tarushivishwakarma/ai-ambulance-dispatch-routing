import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, Activity, Truck, MapPin, Search } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { apiService, isSystemDemoMode } from '../services/apiService';
import useDemoStore from '../demo/demoStore';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune'];

const CommandDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Directly access demo store for the active filter to trigger re-renders
  const activeCityFilter = useDemoStore(state => state.activeCityFilter);
  const setCityFilter = useDemoStore(state => state.setCityFilter);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [inc, amb, stats] = await Promise.all([
          apiService.getIncidents(),
          apiService.getAmbulances(),
          apiService.getAnalytics()
        ]);
        setIncidents(inc);
        setAmbulances(amb);
        setAnalytics(stats);
      } catch (err) {
        console.error("Dashboard failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    // In demo mode, we want to poll/subscribe, but since we are replacing the architecture, 
    // we'll just poll every 3 seconds to keep UI in sync with the simulator
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, [activeCityFilter]); // Re-fetch when filter changes

  if (loading) return <div className="p-8 text-text-muted">Loading operational data...</div>;
  if (!analytics) return <div className="p-8 text-text-muted">Unable to load operational data. <button onClick={() => window.location.reload()} className="text-info ml-2">RETRY</button></div>;

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  return (
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4">
      {/* Header & Controls */}
      <div className="flex items-center justify-between bg-primary-900/80 backdrop-blur-md p-3 rounded-lg border border-primary-700/50 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-emergency/20 text-emergency p-2 rounded border border-emergency/30">
            <Activity size={24} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-main tracking-tight uppercase">Emergency Operations Center</h1>
            <div className="flex items-center gap-3 text-xs font-bold text-text-muted uppercase tracking-wider mt-0.5">
              <span className="flex items-center gap-1"><AlertTriangle size={12} className="text-emergency" /> {analytics.activeIncidents} Active</span>
              <span className="flex items-center gap-1"><Truck size={12} className="text-operational" /> {analytics.availableAmbulances}/{analytics.totalAmbulances} Fleet</span>
              <span className="flex items-center gap-1"><Clock size={12} className="text-info" /> ETA: 06:42</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* India-Wide Demo Selector */}
          <div className="flex items-center gap-2 bg-primary-800/80 border border-primary-700 rounded px-3 py-1.5">
            <Search size={14} className="text-text-muted" />
            <select 
              value={activeCityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-transparent text-sm font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer appearance-none"
            >
              {CITIES.map(c => <option key={c} value={c} className="bg-primary-900">{c}</option>)}
            </select>
          </div>

          <button className="flex items-center gap-2 px-6 py-2 bg-emergency text-text-main rounded text-sm font-bold uppercase tracking-wider hover:bg-emergency-hover transition-colors shadow-lg shadow-emergency/20">
            <AlertTriangle size={16} />
            Declare Emergency
          </button>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-140px)]">
        
        {/* LEFT SIDEBAR - Command Overview */}
        <div className="flex flex-col gap-4 h-full">
          <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg flex flex-col shadow-2xl overflow-hidden h-full">
            <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Command Overview</h3>
            </div>
            <div className="flex-1 p-3 flex flex-col gap-4 overflow-y-auto">
              {/* Incident Stats */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-primary-700/50 pb-1">Incidents</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-main uppercase">Active</span>
                  <span className="text-sm font-bold text-info">{analytics.activeIncidents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-main uppercase">Critical</span>
                  <span className="text-sm font-bold text-emergency">{incidents.filter(i => i.severity >= 9 && i.status !== 'RESOLVED').length}</span>
                </div>
              </div>
              
              {/* Fleet Stats */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-primary-700/50 pb-1 mt-2">Ambulance Fleet</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-main uppercase">Available</span>
                  <span className="text-sm font-bold text-operational">{analytics.availableAmbulances}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-main uppercase">En Route</span>
                  <span className="text-sm font-bold text-warning">{ambulances.filter(a => a.status === 'EN_ROUTE').length}</span>
                </div>
              </div>

              {/* System Stats */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-primary-700/50 pb-1 mt-2">Network</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-main uppercase">Hosp. Active</span>
                  <span className="text-sm font-bold text-info">{(activeCityFilter === 'All India' ? 100 : 5)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-main uppercase">Avg Response</span>
                  <span className="text-sm font-bold text-text-main">08:24</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAP PANEL - Takes majority of screen */}
        <div className="lg:col-span-3 bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg overflow-hidden shadow-2xl relative flex flex-col">
           <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center z-10">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                 Live Operations Map
                 <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse"></span>
              </h3>
              {isSystemDemoMode && (
                <span className="text-[10px] font-bold text-warning uppercase bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                  Demo Simulation Active
                </span>
              )}
           </div>
          <div className="flex-1 relative z-0">
             <MapComponent incidents={incidents} ambulances={ambulances} />
          </div>
        </div>

        {/* RIGHT SIDEBAR - Incident Queue & Dispatch Panel */}
        <div className="flex flex-col gap-4 h-full">
          
          {/* Incident Queue */}
          <div className="flex-1 bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg flex flex-col shadow-2xl overflow-hidden">
            <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={14} className="text-emergency" /> Action Queue
              </h3>
              <span className="text-[10px] font-bold bg-primary-700 text-text-main px-1.5 rounded">{activeIncidents.length}</span>
            </div>
            <div className="flex-1 p-2 overflow-y-auto space-y-2">
              {activeIncidents.length === 0 ? (
                <div className="text-center text-text-muted mt-10 text-xs font-bold uppercase tracking-wider">No active incidents</div>
              ) : (
                activeIncidents.map((incident) => (
                  <div key={incident._id} className="p-2.5 bg-primary-900/80 backdrop-blur-sm border border-primary-700/50 rounded hover:border-primary-600 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${incident.severity >= 9 ? 'bg-emergency/10 text-emergency border-emergency/20' : incident.severity >= 7 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-info/10 text-info border-info/20'}`}>
                        {incident.severity >= 9 ? 'CRITICAL' : incident.severity >= 7 ? 'HIGH' : 'MODERATE'}
                      </span>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                        {Math.floor((Date.now() - new Date(incident.createdAt).getTime()) / 60000)}m ago
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-text-main mb-1 truncate">
                      {incident.category.replace('_', ' ')}
                    </h4>
                    <div className="flex justify-between items-center text-[10px] text-text-muted font-medium">
                      <span className="flex items-center gap-1 truncate"><MapPin size={10} /> {incident.city}</span>
                      <span className={`font-bold ${incident.status === 'PENDING' ? 'text-emergency animate-pulse' : 'text-info'}`}>
                        {incident.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandDashboard;
