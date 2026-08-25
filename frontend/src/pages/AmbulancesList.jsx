import { Truck, Phone, MapPin, Activity, Filter, Clock, Map, Navigation } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from '../components/MapComponent';
import useDemoStore from '../demo/demoStore';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune', 'Bhopal', 'Indore', 'Patna', 'Chandigarh', 'Bhubaneswar', 'Guwahati', 'Kochi', 'Dehradun', 'Nagpur', 'Surat'];

const STATUS_STYLES = {
  AVAILABLE:    'bg-operational/10 text-operational border-operational/30',
  EN_ROUTE:     'bg-brand-primary/10 text-brand-primary border-brand-primary/30',
  ON_SCENE:     'bg-warning/10 text-warning border-warning/30',
  TRANSPORTING: 'bg-info/10 text-info border-info/30',
  UNAVAILABLE:  'bg-bg-surface-secondary text-text-muted border-border',
  RETURNING:    'bg-bg-surface-secondary text-text-muted border-border',
};

const AmbulancesList = () => {
  const allAmbulances = useDemoStore(state => state.ambulances);
  const activeCityFilter = useDemoStore(state => state.activeCityFilter);
  const setCityFilter = useDemoStore(state => state.setCityFilter);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredAmbulances = allAmbulances.filter(a => {
    if (activeCityFilter !== 'All India' && a.city !== activeCityFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return true;
  });

  const statusCounts = allAmbulances.reduce((acc, amb) => {
    acc[amb.status] = (acc[amb.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      
      {/* Editorial Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight mb-2">Fleet Management</h1>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total Fleet</span>
              <span className="text-[14px] font-semibold text-text-main">{filteredAmbulances.length} Units</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Available</span>
              <span className="text-[14px] font-semibold text-operational">{statusCounts['AVAILABLE'] || 0}</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">En Route</span>
              <span className="text-[14px] font-semibold text-brand-primary">{statusCounts['EN_ROUTE'] || 0}</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">On Scene</span>
              <span className="text-[14px] font-semibold text-warning">{statusCounts['ON_SCENE'] || 0}</span>
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
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-[11px] font-semibold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              <option value="ALL">ALL STATUSES</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="EN_ROUTE">EN ROUTE</option>
              <option value="ON_SCENE">ON SCENE</option>
              <option value="TRANSPORTING">TRANSPORTING</option>
              <option value="UNAVAILABLE">UNAVAILABLE</option>
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
              Live Positions
            </span>
          </div>
          <div className="flex-1 w-full h-full relative z-0">
            <MapComponent incidents={[]} ambulances={filteredAmbulances} />
          </div>
        </div>

        {/* LIST PANEL */}
        <div className="lg:col-span-7 bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-border bg-bg-surface flex justify-between items-center shrink-0">
            <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest">Active Fleet Log</h3>
            <span className="text-[11px] font-semibold text-text-muted">{filteredAmbulances.length} Units</span>
          </div>
          <div className="flex-1 overflow-y-auto w-full bg-bg-page/30 p-4">
            <div className="space-y-3">
              <AnimatePresence>
                {filteredAmbulances.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-[12px] font-semibold text-text-muted">
                    No units match current filters.
                  </motion.div>
                ) : (
                  filteredAmbulances.map((amb) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      key={amb._id} 
                      className="group bg-bg-surface border border-border rounded-lg p-4 transition-all shadow-sm hover:shadow-md hover:border-border-subtle"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        <div className="flex-1 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-info bg-info/10 px-2 py-0.5 rounded border border-info/20">
                              {amb.capability || 'ALS'}
                            </span>
                            <span className="text-[14px] font-bold text-text-main">
                              Unit {amb._id.replace('AMB-', '')}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-[12px] text-text-secondary mt-1">
                            <span className="flex items-center gap-1 font-medium">
                              <Phone size={12} className="text-text-muted" /> {amb.driverName} ({amb.driverPhone})
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[11px] text-text-muted mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin size={11} /> {amb.city}
                            </span>
                            {amb.speed > 0 && (
                              <span className="flex items-center gap-1 text-warning font-semibold">
                                <Activity size={11} /> {amb.speed} km/h
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:flex-col md:items-end gap-2 md:w-32 shrink-0 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded border text-center w-full md:w-auto ${STATUS_STYLES[amb.status] || STATUS_STYLES.UNAVAILABLE}`}>
                            {amb.status.replace('_', ' ')}
                          </span>
                          
                          {amb.currentIncident ? (
                            <div className="text-[9px] font-bold text-emergency uppercase tracking-widest mt-1 text-right">
                              Assigned: {amb.currentIncident.substring(0,8)}
                            </div>
                          ) : (
                            <div className="text-[9px] font-bold text-text-disabled uppercase tracking-widest mt-1 text-right">
                              Standby
                            </div>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulancesList;
