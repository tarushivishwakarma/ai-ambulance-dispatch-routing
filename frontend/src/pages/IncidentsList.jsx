import { AlertCircle, Clock, MapPin, Filter, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import MapComponent from '../components/MapComponent';
import IncidentDetailsPanel from '../components/IncidentDetailsPanel';
import useDemoStore from '../demo/demoStore';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune', 'Bhopal', 'Indore', 'Patna', 'Chandigarh', 'Bhubaneswar', 'Guwahati', 'Kochi', 'Dehradun', 'Nagpur', 'Surat'];

const SEV_STYLE = (sev) =>
  sev >= 9 ? 'bg-emergency/10 text-emergency border-emergency/20'
  : sev >= 7 ? 'bg-warning/10 text-warning border-warning/20'
  : 'bg-info/10 text-info border-info/20';

const STATUS_STYLE = (status) => ({
  ACTIVE:       'bg-emergency/10 text-emergency border-emergency/20 animate-pulse',
  PENDING:      'bg-emergency/10 text-emergency border-emergency/20 animate-pulse',
  ASSIGNED:     'bg-warning/10 text-warning border-warning/20',
  EN_ROUTE:     'bg-warning/10 text-warning border-warning/20',
  ON_SCENE:     'bg-info/10 text-info border-info/20',
  TRANSPORTING: 'bg-info/10 text-info border-info/20',
  RESOLVED:     'bg-operational/10 text-operational border-operational/20',
  CANCELLED:    'bg-primary-700/50 text-text-muted border-primary-600/50',
}[status] || 'bg-primary-700/50 text-text-muted border-primary-600/50');

const IncidentsList = () => {
  // Read directly from demo store
  const allIncidents = useDemoStore(state => state.incidents);
  const activeCityFilter = useDemoStore(state => state.activeCityFilter);
  const setCityFilter = useDemoStore(state => state.setCityFilter);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedIncident, setSelectedIncident] = useState(null);

  const filteredIncidents = allIncidents.filter(i => {
    if (activeCityFilter !== 'All India' && i.city !== activeCityFilter) return false;
    if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
    if (severityFilter === 'CRITICAL' && i.severity < 9) return false;
    if (severityFilter === 'HIGH' && (i.severity < 7 || i.severity >= 9)) return false;
    if (severityFilter === 'MODERATE' && i.severity >= 7) return false;
    return true;
  });

  const criticalCount = filteredIncidents.filter(i => i.severity >= 9).length;
  const activeCount = filteredIncidents.filter(i => !['RESOLVED', 'CANCELLED'].includes(i.status)).length;

  return (
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-primary-800/60 backdrop-blur-md p-3 rounded-lg border border-primary-700/50 shadow-xl gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emergency/10 text-emergency p-2 rounded border border-emergency/20">
            <ShieldAlert size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-main tracking-tight uppercase">Incident Operations</h1>
            <p className="text-xs text-text-muted font-bold tracking-wider uppercase">Tracking {filteredIncidents.length} Events</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="hidden lg:flex items-center gap-6 px-6 border-l border-primary-700/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active</span>
            <span className="text-lg font-bold text-warning">{activeCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Critical</span>
            <span className="text-lg font-bold text-emergency">{criticalCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total</span>
            <span className="text-lg font-bold text-text-main">{filteredIncidents.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-primary-700/60 border border-primary-600/50 rounded px-3 py-1.5">
            <Filter size={12} className="text-text-muted" />
            <select value={activeCityFilter} onChange={e => setCityFilter(e.target.value)} className="bg-transparent text-[10px] font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-primary-700/60 border border-primary-600/50 rounded px-3 py-1.5">
            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="bg-transparent text-[10px] font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              <option value="ALL">ALL SEVERITY</option>
              <option value="CRITICAL">CRITICAL (9-10)</option>
              <option value="HIGH">HIGH (7-8)</option>
              <option value="MODERATE">MODERATE (&lt;7)</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-primary-700/60 border border-primary-600/50 rounded px-3 py-1.5">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-[10px] font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              <option value="ALL">ALL STATUSES</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PENDING">PENDING</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="EN_ROUTE">EN ROUTE</option>
              <option value="ON_SCENE">ON SCENE</option>
              <option value="TRANSPORTING">TRANSPORTING</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:h-[calc(100vh-160px)] lg:overflow-hidden pb-4 lg:pb-0">

        {/* MAP PANEL */}
        <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg overflow-hidden shadow-2xl relative flex flex-col h-full min-h-[350px] lg:min-h-0">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 z-10">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Incident Map</h3>
          </div>
          <div className="flex-1 relative z-0">
            <MapComponent incidents={filteredIncidents} ambulances={[]} />
          </div>
        </div>

        {/* LIST PANEL */}
        <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Event Log</h3>
            <span className="text-[10px] font-bold text-text-muted bg-primary-700/50 px-2 py-0.5 rounded">{filteredIncidents.length} events</span>
          </div>
          <div className="flex-1 overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="sticky top-0 bg-primary-900/95 backdrop-blur-sm z-10 border-b border-primary-700/50">
                <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="p-3">ID / Time</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">AI</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700/30">
                {filteredIncidents.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-xs font-bold text-text-muted uppercase">No incidents match current filters.</td></tr>
                ) : (
                  filteredIncidents.map((incident) => {
                    // Demo data uses `timestamp` field
                    const timeStr = incident.timestamp || incident.createdAt;
                    return (
                      <tr 
                        key={incident._id} 
                        onClick={() => setSelectedIncident(incident)}
                        className="hover:bg-primary-600 transition-colors cursor-pointer"
                      >
                        <td className="p-3">
                          <div className="text-xs font-bold text-text-main">{incident.incidentId || incident._id.substring(0,8)}</div>
                          <div className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                            <Clock size={9} />
                            {timeStr ? new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-xs font-bold text-text-main flex items-center gap-1 mb-1">
                            <AlertCircle size={11} className={incident.severity >= 9 ? 'text-emergency' : 'text-warning'} />
                            {incident.category.replace(/_/g, ' ')}
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest border ${SEV_STYLE(incident.severity)}`}>
                            SEV: {incident.severity}/10
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="text-xs text-text-main font-medium">{incident.city}</div>
                          <div className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                            <MapPin size={9} /> {incident.state || 'India'}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-[10px] font-bold text-info">
                            {incident.aiConfidence ? `${(incident.aiConfidence * 100).toFixed(0)}%` : 'N/A'}
                          </div>
                          {incident.assignedAmbulanceId && (
                            <div className="text-[9px] font-bold text-operational mt-0.5 uppercase">Amb: Assigned</div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${STATUS_STYLE(incident.status)}`}>
                            {incident.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <IncidentDetailsPanel incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
    </div>
  );
};

export default IncidentsList;
