import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Activity, Truck, MapPin, Search, ShieldAlert, Hospital, TrendingUp, ChevronRight } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import IncidentDetailsPanel from '../components/IncidentDetailsPanel';
import useDemoStore from '../demo/demoStore';
import { isSystemDemoMode } from '../services/apiService';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune'];

const KpiBlock = ({ label, value, color, sub, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-1 py-1 px-4 border-l border-border first:border-l-0"
  >
    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</span>
    <div className="flex items-baseline gap-2">
      <motion.span 
        key={value}
        initial={{ opacity: 0.5, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-2xl font-bold ${color}`}
      >
        {value}
      </motion.span>
      {trend && <span className="text-[10px] font-semibold text-text-muted">{trend}</span>}
    </div>
    {sub && <span className="text-[10px] text-text-muted font-medium">{sub}</span>}
  </motion.div>
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

  const filteredInc = activeCityFilter === 'All India' ? incidents : incidents.filter(i => i.city === activeCityFilter);
  const filteredAmb = activeCityFilter === 'All India' ? ambulances : ambulances.filter(a => a.city === activeCityFilter);
  const filteredHosp = activeCityFilter === 'All India' ? hospitals : hospitals.filter(h => h.city === activeCityFilter);

  const activeIncidents = filteredInc.filter(i => !['RESOLVED', 'CANCELLED'].includes(i.status));
  const criticalIncidents = filteredInc.filter(i => i.severity >= 9 && !['RESOLVED', 'CANCELLED'].includes(i.status));
  const availableAmb = filteredAmb.filter(a => a.status === 'AVAILABLE');
  const enRouteAmb = filteredAmb.filter(a => a.status === 'EN_ROUTE');
  const activeAlerts = alerts.filter(a => activeCityFilter === 'All India' || a.city === activeCityFilter);
  const activeDispatches = dispatches.filter(d => d.status === 'ACTIVE');

  return (
    <>
      <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main tracking-tight mb-1">Operations Overview</h1>
            <p className="text-[13px] text-text-secondary max-w-xl leading-relaxed">
              Real-time dispatch control and fleet management for {activeCityFilter}. Monitoring {activeIncidents.length} active emergency situations across the network.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-md px-3 py-1.5 shadow-sm">
              <Search size={14} className="text-text-muted" />
              <select
                value={activeCityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="bg-transparent text-[12px] font-semibold text-text-main outline-none cursor-pointer border-none"
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-text-main text-white rounded-md text-[12px] font-bold transition-all hover:bg-black shadow-sm active:scale-95">
              Declare Emergency
            </button>
          </div>
        </div>

        {/* Inline KPI Strip */}
        <div className="bg-bg-surface border border-border rounded-lg p-4 flex flex-wrap shadow-sm">
          <KpiBlock label="Active Incidents" value={activeIncidents.length} color="text-warning" trend={activeIncidents.length > 50 ? '↑ High' : 'Stable'} />
          <KpiBlock label="Critical Priority" value={criticalIncidents.length} color="text-emergency" />
          <KpiBlock label="Fleet Available" value={availableAmb.length} color="text-operational" sub={`of ${filteredAmb.length} total units`} />
          <KpiBlock label="Units En Route" value={enRouteAmb.length} color="text-brand-primary" />
          <KpiBlock label="Network Hospitals" value={filteredHosp.length} color="text-text-main" />
          <KpiBlock label="Avg Response" value="8:24" color="text-text-main" sub="minutes" />
        </div>

        {/* Main Grid: Asymmetrical Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
          {/* Left Column: Context & Stats */}
          <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 pb-4 scrollbar-thin">
            
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest border-b border-border pb-2">Fleet Disposition</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Available', val: availableAmb.length, color: 'text-operational' },
                  { label: 'En Route', val: enRouteAmb.length, color: 'text-brand-primary' },
                  { label: 'On Scene', val: filteredAmb.filter(a => a.status === 'ON_SCENE').length, color: 'text-warning' },
                  { label: 'Transporting', val: filteredAmb.filter(a => a.status === 'TRANSPORTING').length, color: 'text-info' },
                ].map(s => (
                  <div key={s.label} className="bg-bg-surface p-3 rounded border border-border shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase mb-1">{s.label}</span>
                    <span className={`text-xl font-bold ${s.color}`}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest border-b border-border pb-2">Recently Resolved</h3>
              <div className="space-y-2">
                {filteredInc.filter(i => i.status === 'RESOLVED').length === 0 ? (
                  <div className="text-[11px] text-text-muted italic">No recent resolutions</div>
                ) : (
                  filteredInc.filter(i => i.status === 'RESOLVED').slice(0, 5).map((incident) => (
                    <motion.div 
                      key={incident._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex flex-col gap-1 p-2.5 bg-bg-surface hover:bg-bg-surface-secondary border border-border rounded cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-text-main truncate max-w-[150px]">{incident.category.replace(/_/g, ' ')}</span>
                        <span className="text-[9px] font-bold text-operational uppercase">Resolved</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <MapPin size={10} />
                        <span className="truncate">{incident.city}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
            
          </div>

          {/* Center Column: Map */}
          <div className="lg:col-span-6 bg-bg-surface border border-border rounded-lg shadow-sm flex flex-col relative overflow-hidden min-h-[400px]">
            <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded shadow border border-border/50 pointer-events-none">
              <span className="text-[10px] font-bold text-text-main uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse" />
                Live Map
              </span>
            </div>
            <div className="flex-1 w-full h-full relative z-0">
              <MapComponent incidents={activeIncidents.slice(0, 50)} ambulances={filteredAmb.slice(0, 50)} hospitals={filteredHosp.slice(0, 30)} />
            </div>
          </div>

          {/* Right Column: Action Queue */}
          <div className="lg:col-span-3 flex flex-col bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden h-[500px] lg:h-auto">
            <div className="p-4 border-b border-border bg-bg-surface flex justify-between items-center shrink-0">
              <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest flex items-center gap-2">
                Action Queue
              </h3>
              <span className="text-[10px] font-bold bg-warning/10 text-warning px-2 py-0.5 rounded-full">{activeIncidents.length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-bg-page/50">
              <AnimatePresence>
                {activeIncidents.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-text-muted mt-8 text-[11px]">
                    No active incidents in queue.
                  </motion.div>
                ) : (
                  activeIncidents.slice(0, 20).map((incident) => {
                    const timeStr = incident.timestamp || incident.createdAt;
                    const minsAgo = timeStr ? Math.floor((Date.now() - new Date(timeStr).getTime()) / 60000) : 0;
                    const isCritical = incident.severity >= 9;
                    const isHigh = incident.severity >= 7;

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={incident._id}
                        onClick={() => setSelectedIncident(incident)}
                        className={`group relative p-3 bg-bg-surface border rounded cursor-pointer transition-shadow shadow-sm hover:shadow-md ${
                          isCritical ? 'border-emergency/30 border-l-2 border-l-emergency' : 
                          isHigh ? 'border-warning/30 border-l-2 border-l-warning' : 
                          'border-border border-l-2 border-l-info'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            isCritical ? 'bg-emergency/10 text-emergency' : 
                            isHigh ? 'bg-warning/10 text-warning' : 
                            'bg-info/10 text-info'
                          }`}>
                            {isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'MODERATE'}
                          </span>
                          <span className="text-[10px] text-text-muted font-medium">{minsAgo}m ago</span>
                        </div>
                        
                        <h4 className="text-[13px] font-semibold text-text-main mb-1 truncate pr-4">
                          {incident.category.replace(/_/g, ' ')}
                        </h4>
                        
                        <div className="flex justify-between items-end mt-2">
                          <div className="flex flex-col gap-1 text-[11px] text-text-secondary">
                            <span className="flex items-center gap-1.5 truncate max-w-[140px]"><MapPin size={12}/> {incident.city}</span>
                          </div>
                          <ChevronRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-200" />
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
      <IncidentDetailsPanel incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
    </>
  );
};

export default CommandDashboard;
