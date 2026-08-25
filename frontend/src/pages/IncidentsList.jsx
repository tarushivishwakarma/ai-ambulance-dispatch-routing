import { AlertCircle, Clock, MapPin, Filter, ShieldAlert, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from '../components/MapComponent';
import IncidentDetailsPanel from '../components/IncidentDetailsPanel';
import useDemoStore from '../demo/demoStore';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune', 'Bhopal', 'Indore', 'Patna', 'Chandigarh', 'Bhubaneswar', 'Guwahati', 'Kochi', 'Dehradun', 'Nagpur', 'Surat'];

const SEV_STYLE = (sev) =>
  sev >= 9 ? 'bg-emergency/10 text-emergency border-emergency/30'
  : sev >= 7 ? 'bg-warning/10 text-warning border-warning/30'
  : 'bg-info/10 text-info border-info/30';

const STATUS_STYLE = (status) => ({
  ACTIVE:       'bg-emergency/10 text-emergency border-emergency/30 animate-pulse',
  PENDING:      'bg-emergency/10 text-emergency border-emergency/30 animate-pulse',
  ASSIGNED:     'bg-warning/10 text-warning border-warning/30',
  EN_ROUTE:     'bg-brand-primary/10 text-brand-primary border-brand-primary/30',
  ON_SCENE:     'bg-info/10 text-info border-info/30',
  TRANSPORTING: 'bg-info/10 text-info border-info/30',
  RESOLVED:     'bg-operational/10 text-operational border-operational/30',
  CANCELLED:    'bg-bg-surface-secondary text-text-muted border-border',
}[status] || 'bg-bg-surface-secondary text-text-muted border-border');

const STATUS_ICON = (status) => ({
  ACTIVE:       <Activity size={12} className="text-emergency" />,
  PENDING:      <Activity size={12} className="text-emergency" />,
  ASSIGNED:     <Clock size={12} className="text-warning" />,
  EN_ROUTE:     <Clock size={12} className="text-brand-primary" />,
  ON_SCENE:     <MapPin size={12} className="text-info" />,
  TRANSPORTING: <Activity size={12} className="text-info" />,
  RESOLVED:     <CheckCircle2 size={12} className="text-operational" />,
  CANCELLED:    <AlertCircle size={12} className="text-text-muted" />,
}[status] || <AlertCircle size={12} className="text-text-muted" />);

const IncidentsList = () => {
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
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      
      {/* Editorial Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight mb-2">Incident Operations</h1>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Tracking</span>
              <span className="text-[14px] font-semibold text-text-main">{filteredIncidents.length} Events</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active</span>
              <span className="text-[14px] font-semibold text-warning">{activeCount}</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Critical</span>
              <span className="text-[14px] font-semibold text-emergency">{criticalCount}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-md px-3 py-1.5 shadow-sm transition-colors hover:border-border-subtle hover:bg-bg-surface-secondary">
            <Filter size={14} className="text-text-muted" />
            <select value={activeCityFilter} onChange={e => setCityFilter(e.target.value)} className="bg-transparent text-[11px] font-semibold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-md px-3 py-1.5 shadow-sm transition-colors hover:border-border-subtle hover:bg-bg-surface-secondary">
            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="bg-transparent text-[11px] font-semibold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              <option value="ALL">ALL SEVERITY</option>
              <option value="CRITICAL">CRITICAL (9-10)</option>
              <option value="HIGH">HIGH (7-8)</option>
              <option value="MODERATE">MODERATE (&lt;7)</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-md px-3 py-1.5 shadow-sm transition-colors hover:border-border-subtle hover:bg-bg-surface-secondary">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-[11px] font-semibold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
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

      {/* Main Grid: Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

        {/* MAP PANEL */}
        <div className="lg:col-span-5 bg-bg-surface border border-border rounded-lg overflow-hidden shadow-sm relative flex flex-col h-[400px] lg:h-auto">
          <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded shadow border border-border/50 pointer-events-none">
            <span className="text-[10px] font-bold text-text-main uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse" />
              Live Operations Map
            </span>
          </div>
          <div className="flex-1 w-full h-full relative z-0">
            <MapComponent incidents={filteredIncidents} ambulances={[]} />
          </div>
        </div>

        {/* LIST PANEL */}
        <div className="lg:col-span-7 bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-border bg-bg-surface flex justify-between items-center shrink-0">
            <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest">Event Log</h3>
            <span className="text-[11px] font-semibold text-text-muted">{filteredIncidents.length} Records</span>
          </div>
          <div className="flex-1 overflow-y-auto w-full bg-bg-page/30 p-4">
            <div className="space-y-3">
              <AnimatePresence>
                {filteredIncidents.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-[12px] font-semibold text-text-muted">
                    No incidents match current filters.
                  </motion.div>
                ) : (
                  filteredIncidents.map((incident) => {
                    const timeStr = incident.timestamp || incident.createdAt;
                    const isCritical = incident.severity >= 9;
                    
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        key={incident._id} 
                        onClick={() => setSelectedIncident(incident)}
                        className={`group bg-bg-surface border rounded-lg p-4 cursor-pointer transition-all shadow-sm hover:shadow-md ${
                          isCritical ? 'border-l-4 border-l-emergency border-t-border border-r-border border-b-border' : 'border-border hover:border-border-subtle'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          {/* Info Block */}
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border ${SEV_STYLE(incident.severity)}`}>
                                SEV: {incident.severity}
                              </span>
                              <span className="text-[11px] text-text-muted font-medium flex items-center gap-1">
                                <Clock size={11} />
                                {timeStr ? new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                              </span>
                              <span className="text-[10px] text-text-disabled font-mono ml-2 hidden sm:block">
                                ID: {incident.incidentId || incident._id.substring(0,8)}
                              </span>
                            </div>
                            
                            <h4 className="text-[15px] font-bold text-text-main leading-tight">
                              {incident.category.replace(/_/g, ' ')}
                            </h4>
                            
                            <div className="flex items-center gap-4 text-[12px] text-text-secondary mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin size={12} className="text-text-muted" /> {incident.city}, {incident.state || 'India'}
                              </span>
                              {incident.aiConfidence && (
                                <span className="flex items-center gap-1 text-info font-medium">
                                  <Activity size={12} /> AI Match: {(incident.aiConfidence * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status Block */}
                          <div className="flex items-center justify-between md:flex-col md:items-end gap-2 md:gap-3 md:w-32 shrink-0">
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded border ${STATUS_STYLE(incident.status)}`}>
                              {STATUS_ICON(incident.status)}
                              {incident.status.replace('_', ' ')}
                            </div>
                            
                            <div className="flex items-center text-text-muted group-hover:text-brand-primary transition-colors">
                              <span className="text-[11px] font-semibold mr-1 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">Details</span>
                              <ChevronRight size={16} />
                            </div>
                          </div>

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
    </div>
  );
};

export default IncidentsList;
