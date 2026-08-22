import { AlertTriangle, Clock, Activity, Truck, MapPin, Search, ShieldAlert, Hospital, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import MapComponent from '../components/MapComponent';
import IncidentDetailsPanel from '../components/IncidentDetailsPanel';
import useDemoStore from '../demo/demoStore';
import { isSystemDemoMode } from '../services/apiService';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune'];

const KpiCard = ({ label, value, color, icon: Icon, sub }) => (
  <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg p-4 flex flex-col gap-1">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</span>
      <Icon size={14} className={color} />
    </div>
    <span className={`text-2xl font-black ${color}`}>{value}</span>
    {sub && <span className="text-[10px] text-text-muted font-bold">{sub}</span>}
  </div>
);

const CommandDashboard = () => {
  const incidents = useDemoStore(state => state.incidents);
  const ambulances = useDemoStore(state => state.ambulances);
  const hospitals = useDemoStore(state => state.hospitals);
  const alerts = useDemoStore(state => state.alerts);
  const dispatches = useDemoStore(state => state.dispatches);
  const activeCityFilter = useDemoStore(state => state.activeCityFilter);
  const setCityFilter = useDemoStore(state => state.setCityFilter);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Filter by city
  const filteredInc = activeCityFilter === 'All India'
    ? incidents
    : incidents.filter(i => i.city === activeCityFilter);
  const filteredAmb = activeCityFilter === 'All India'
    ? ambulances
    : ambulances.filter(a => a.city === activeCityFilter);
  const filteredHosp = activeCityFilter === 'All India'
    ? hospitals
    : hospitals.filter(h => h.city === activeCityFilter);

  const activeIncidents = filteredInc.filter(i => !['RESOLVED', 'CANCELLED'].includes(i.status));
  const criticalIncidents = filteredInc.filter(i => i.severity >= 9 && !['RESOLVED', 'CANCELLED'].includes(i.status));
  const availableAmb = filteredAmb.filter(a => a.status === 'AVAILABLE');
  const enRouteAmb = filteredAmb.filter(a => a.status === 'EN_ROUTE');
  const activeAlerts = alerts.filter(a => activeCityFilter === 'All India' || a.city === activeCityFilter);
  const activeDispatches = dispatches.filter(d => d.status === 'ACTIVE');

  return (
    <>
      <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between bg-primary-800 p-3 rounded-lg border border-primary-700 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-emergency/20 text-emergency p-2.5 rounded border border-emergency/30">
            <Activity size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black text-text-main tracking-tight uppercase">Emergency Operations Center</h1>
            <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted uppercase tracking-wider mt-0.5">
              <span className="flex items-center gap-1"><AlertTriangle size={10} className="text-emergency" /> {activeIncidents.length} Active</span>
              <span className="flex items-center gap-1"><Truck size={10} className="text-operational" /> {availableAmb.length}/{filteredAmb.length} Fleet</span>
              <span className="flex items-center gap-1"><Hospital size={10} className="text-info" /> {filteredHosp.length} Hospitals</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSystemDemoMode && (
            <span className="text-[10px] font-bold text-warning uppercase bg-warning/10 px-2.5 py-1 rounded border border-warning/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
              Demo Operations Active
            </span>
          )}
          <div className="flex items-center gap-2 bg-primary-700/60 border border-primary-600/50 rounded px-3 py-1.5">
            <Search size={12} className="text-text-muted" />
            <select
              value={activeCityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="bg-transparent text-[10px] font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer"
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button className="flex items-center gap-2 px-5 py-2 bg-emergency text-white rounded text-[11px] font-bold uppercase tracking-wider hover:bg-emergency-hover transition-colors shadow-lg shadow-emergency/20">
            <AlertTriangle size={14} /> Declare Emergency
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard label="Active Incidents" value={activeIncidents.length} color="text-warning" icon={AlertTriangle} />
        <KpiCard label="Critical" value={criticalIncidents.length} color="text-emergency" icon={ShieldAlert} />
        <KpiCard label="Available Amb." value={availableAmb.length} color="text-operational" icon={Truck} sub={`of ${filteredAmb.length} total`} />
        <KpiCard label="En Route" value={enRouteAmb.length} color="text-warning" icon={TrendingUp} />
        <KpiCard label="Hospitals" value={filteredHosp.length} color="text-info" icon={Hospital} />
        <KpiCard label="Active Alerts" value={activeAlerts.length} color="text-emergency" icon={AlertTriangle} />
        <KpiCard label="Active Dispatches" value={activeDispatches.length} color="text-info" icon={Activity} />
        <KpiCard label="Avg Response" value="8:24" color="text-text-main" icon={Clock} sub="minutes" />
      </div>

      {/* Main Operations Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4" style={{ height: 'calc(100vh - 260px)' }}>

        {/* LEFT SIDEBAR */}
        <div className="flex flex-col gap-4 h-full">
          <div className="bg-primary-800 border border-primary-700 rounded-lg flex flex-col shadow-sm overflow-hidden h-1/2">
            <div className="p-2.5 border-b border-primary-700 bg-primary-600">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Command Overview</h3>
            </div>
            <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-primary-700 pb-1">Fleet Status</h4>
                {[
                  { label: 'Available', val: availableAmb.length, color: 'text-operational' },
                  { label: 'En Route', val: enRouteAmb.length, color: 'text-warning' },
                  { label: 'On Scene', val: filteredAmb.filter(a => a.status === 'ON_SCENE').length, color: 'text-emergency' },
                  { label: 'Transporting', val: filteredAmb.filter(a => a.status === 'TRANSPORTING').length, color: 'text-info' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-muted uppercase">{s.label}</span>
                    <span className={`text-sm font-black ${s.color}`}>{s.val}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-primary-700 pb-1">Incidents</h4>
                {[
                  { label: 'Total', val: filteredInc.length, color: 'text-text-main' },
                  { label: 'Active', val: activeIncidents.length, color: 'text-warning' },
                  { label: 'Critical', val: criticalIncidents.length, color: 'text-emergency' },
                  { label: 'Resolved', val: filteredInc.filter(i => i.status === 'RESOLVED').length, color: 'text-operational' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-muted uppercase">{s.label}</span>
                    <span className={`text-sm font-black ${s.color}`}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-primary-800 border border-primary-700 rounded-lg flex flex-col shadow-sm overflow-hidden h-1/2">
            <div className="p-2.5 border-b border-primary-700 bg-primary-600">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                Recently Resolved
              </h3>
            </div>
            <div className="flex-1 p-2 overflow-y-auto space-y-2">
              {filteredInc.filter(i => i.status === 'RESOLVED').length === 0 ? (
                <div className="text-center text-text-muted mt-10 text-[10px] font-bold uppercase tracking-wider">No resolved incidents</div>
              ) : (
                filteredInc.filter(i => i.status === 'RESOLVED').slice(0, 10).map((incident) => (
                  <div key={incident._id} className="p-2 bg-primary-800 border border-primary-700 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-text-main truncate">{incident.incidentId || incident._id.substring(0,8)}</span>
                      <span className="text-[9px] font-bold text-operational uppercase">Resolved</span>
                    </div>
                    <div className="text-[9px] text-text-muted uppercase tracking-widest truncate">{incident.category.replace(/_/g, ' ')}</div>
                    <div className="text-[9px] text-text-secondary truncate">{incident.city}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MAP PANEL */}
        <div className="lg:col-span-3 bg-primary-800 border border-primary-700 rounded-lg overflow-hidden shadow-sm relative flex flex-col">
          <div className="p-2.5 border-b border-primary-700 bg-primary-600 flex justify-between items-center z-10">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
              Live Operations Map
              <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse" />
            </h3>
          </div>
          <div className="flex-1 relative z-0">
            <MapComponent incidents={activeIncidents.slice(0, 50)} ambulances={filteredAmb.slice(0, 50)} hospitals={filteredHosp.slice(0, 30)} />
          </div>
        </div>

        {/* RIGHT SIDEBAR: Action Queue */}
        <div className="flex flex-col gap-4 h-full">
          <div className="flex-1 bg-primary-800 border border-primary-700 rounded-lg flex flex-col shadow-sm overflow-hidden">
            <div className="p-2.5 border-b border-primary-700 bg-primary-600 flex justify-between items-center">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={12} className="text-emergency" /> Action Queue
              </h3>
              <span className="text-[10px] font-bold bg-emergency/10 text-emergency border border-emergency/20 px-1.5 py-0.5 rounded">{activeIncidents.length}</span>
            </div>
            <div className="flex-1 p-2 overflow-y-auto space-y-2">
              {activeIncidents.length === 0 ? (
                <div className="text-center text-text-muted mt-10 text-xs font-bold uppercase tracking-wider">No active incidents</div>
              ) : (
                activeIncidents.slice(0, 20).map((incident) => {
                  const timeStr = incident.timestamp || incident.createdAt;
                  const minsAgo = timeStr ? Math.floor((Date.now() - new Date(timeStr).getTime()) / 60000) : 0;
                      return (
                        <div 
                          key={incident._id} 
                          onClick={() => setSelectedIncident(incident)}
                          className="p-2.5 bg-primary-800 border border-primary-700 rounded hover:border-primary-600 transition-colors cursor-pointer shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                              incident.severity >= 9 ? 'bg-emergency/10 text-emergency border-emergency/20'
                              : incident.severity >= 7 ? 'bg-warning/10 text-warning border-warning/20'
                              : 'bg-info/10 text-info border-info/20'
                            }`}>
                              {incident.severity >= 9 ? 'CRITICAL' : incident.severity >= 7 ? 'HIGH' : 'MOD'}
                            </span>
                            <span className="text-[9px] font-bold text-text-muted uppercase">{minsAgo}m ago</span>
                          </div>
                          <h4 className="text-xs font-bold text-text-main mb-0.5 truncate">{incident.category.replace(/_/g, ' ')}</h4>
                          <div className="flex justify-between items-center text-[10px] text-text-muted">
                            <span className="flex items-center gap-1 truncate"><MapPin size={9}/> {incident.city}</span>
                            <span className={`font-bold ${['ACTIVE', 'PENDING'].includes(incident.status) ? 'text-emergency' : 'text-info'}`}>
                              {incident.status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <IncidentDetailsPanel incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
      </>
    );
  };
  
  export default CommandDashboard;
