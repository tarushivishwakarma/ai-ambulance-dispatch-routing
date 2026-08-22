import { apiService } from '../services/apiService';
import { AlertCircle, Clock, MapPin, Search, Filter, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import useDemoStore from '../demo/demoStore';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune', 'Bhopal', 'Indore', 'Patna', 'Chandigarh', 'Bhubaneswar', 'Guwahati', 'Kochi', 'Dehradun', 'Nagpur', 'Surat'];

const IncidentsList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const activeCityFilter = useDemoStore(state => state.activeCityFilter);
  const setCityFilter = useDemoStore(state => state.setCityFilter);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await apiService.getIncidents();
        setIncidents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-text-muted">Loading live incidents...</div>;

  const filteredIncidents = incidents.filter(i => {
    if (activeCityFilter !== 'All India' && i.city !== activeCityFilter) return false;
    if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
    if (severityFilter === 'CRITICAL' && i.severity < 9) return false;
    if (severityFilter === 'HIGH' && (i.severity < 7 || i.severity >= 9)) return false;
    if (severityFilter === 'MODERATE' && i.severity >= 7) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-primary-900/80 backdrop-blur-md p-3 rounded-lg border border-primary-700/50 shadow-xl gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emergency/20 text-emergency p-2 rounded border border-emergency/30">
            <ShieldAlert size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-main tracking-tight uppercase">Incident Operations</h1>
            <p className="text-xs text-text-muted font-bold tracking-wider uppercase">Tracking {filteredIncidents.length} Events</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filters */}
          <div className="flex items-center gap-2 bg-primary-800/80 border border-primary-700 rounded px-3 py-1.5">
            <Filter size={14} className="text-text-muted" />
            <select value={activeCityFilter} onChange={(e) => setCityFilter(e.target.value)} className="bg-transparent text-[10px] font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              {CITIES.map(c => <option key={c} value={c} className="bg-primary-900">{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-primary-800/80 border border-primary-700 rounded px-3 py-1.5">
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="bg-transparent text-[10px] font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              <option value="ALL" className="bg-primary-900">ALL SEVERITY</option>
              <option value="CRITICAL" className="bg-primary-900">CRITICAL</option>
              <option value="HIGH" className="bg-primary-900">HIGH</option>
              <option value="MODERATE" className="bg-primary-900">MODERATE</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-primary-800/80 border border-primary-700 rounded px-3 py-1.5">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-[10px] font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              <option value="ALL" className="bg-primary-900">ALL STATUSES</option>
              <option value="PENDING" className="bg-primary-900">PENDING</option>
              <option value="ASSIGNED" className="bg-primary-900">ASSIGNED</option>
              <option value="EN_ROUTE" className="bg-primary-900">EN ROUTE</option>
              <option value="ON_SCENE" className="bg-primary-900">ON SCENE</option>
              <option value="RESOLVED" className="bg-primary-900">RESOLVED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Map + List */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-140px)]">
        
        {/* MAP PANEL */}
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg overflow-hidden shadow-2xl relative flex flex-col h-full">
           <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center z-10">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Incident Map</h3>
           </div>
          <div className="flex-1 relative z-0">
             <MapComponent incidents={filteredIncidents} ambulances={[]} />
          </div>
        </div>

        {/* LIST PANEL */}
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Event Log</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-primary-900/90 backdrop-blur-sm z-10 border-b border-primary-700/50">
                <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="p-3">ID / Time</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">AI Assess</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700/50">
                {filteredIncidents.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-xs font-bold text-text-muted uppercase">No incidents match current filters.</td></tr>
                ) : (
                  filteredIncidents.map((incident) => (
                    <tr key={incident._id} className="hover:bg-primary-900/80 transition-colors">
                      <td className="p-3">
                        <div className="text-sm font-bold text-text-main">{incident._id}</div>
                        <div className="text-[10px] text-text-muted flex items-center gap-1 mt-1">
                          <Clock size={10} /> {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-xs font-bold text-text-main flex items-center gap-1.5 mb-1">
                          <AlertCircle size={12} className={incident.severity >= 9 ? 'text-emergency' : 'text-warning'} />
                          {incident.category.replace('_', ' ')}
                        </div>
                        <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-widest border ${incident.severity >= 9 ? 'bg-emergency/10 text-emergency border-emergency/20' : incident.severity >= 7 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-info/10 text-info border-info/20'}`}>
                          SEV: {incident.severity}/10
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="text-xs text-text-main font-medium">{incident.city}</div>
                        <div className="text-[10px] text-text-muted flex items-center gap-1 mt-1 truncate max-w-[120px]">
                          <MapPin size={10} /> {incident.address}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-[10px] font-bold text-info">CONF: {(incident.aiConfidence * 100).toFixed(0)}%</div>
                        {incident.assignedAmbulance && (
                          <div className="text-[9px] font-bold text-operational mt-1 uppercase tracking-wider">UNIT: {incident.assignedAmbulance}</div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${incident.status === 'PENDING' ? 'bg-emergency/10 text-emergency border-emergency/30 animate-pulse' : 'bg-primary-700/60 text-text-main border-primary-600/50'}`}>
                          {incident.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentsList;
