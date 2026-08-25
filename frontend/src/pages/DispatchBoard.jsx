import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, MapPin, ArrowRight, ShieldAlert, Truck, Crosshair, Filter, Activity, Clock } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import useDemoStore from '../demo/demoStore';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune', 'Bhopal', 'Indore', 'Patna', 'Chandigarh', 'Bhubaneswar', 'Guwahati', 'Kochi', 'Dehradun', 'Nagpur', 'Surat'];

const DispatchBoard = () => {
  const allIncidents = useDemoStore(state => state.incidents);
  const allAmbulances = useDemoStore(state => state.ambulances);
  const allDispatches = useDemoStore(state => state.dispatches);
  const allHospitals = useDemoStore(state => state.hospitals);
  const assignAmbulance = useDemoStore(state => state.assignAmbulance);

  const activeCityFilter = useDemoStore(state => state.activeCityFilter);
  const setCityFilter = useDemoStore(state => state.setCityFilter);

  // Pending = needs dispatch (ACTIVE status with no ambulance)
  const pendingIncidents = allIncidents.filter(i =>
    ['ACTIVE', 'PENDING'].includes(i.status) && !i.assignedAmbulanceId &&
    (activeCityFilter === 'All India' || i.city === activeCityFilter)
  );

  // Available ambulances
  const availableAmbulances = allAmbulances.filter(a =>
    a.status === 'AVAILABLE' &&
    (activeCityFilter === 'All India' || a.city === activeCityFilter)
  );

  // Active dispatches
  const activeDispatches = allDispatches.filter(d =>
    d.status === 'ACTIVE'
  ).map(d => {
    const inc = allIncidents.find(i => i._id === d.incidentId);
    const amb = allAmbulances.find(a => a._id === d.ambulanceId);
    const hosp = allHospitals.find(h => h._id === d.hospitalId);
    return { ...d, incident: inc, ambulance: amb, hospital: hosp };
  }).filter(d => activeCityFilter === 'All India' || d.incident?.city === activeCityFilter);

  const handleDispatch = (incidentId, ambulanceId) => {
    assignAmbulance(incidentId, ambulanceId);
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight mb-2">Dispatch Command</h1>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Pending</span>
              <span className="text-[14px] font-semibold text-emergency">{pendingIncidents.length}</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Available Units</span>
              <span className="text-[14px] font-semibold text-operational">{availableAmbulances.length}</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active Dispatches</span>
              <span className="text-[14px] font-semibold text-info">{activeDispatches.length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-md px-3 py-1.5 shadow-sm transition-colors hover:border-border-subtle hover:bg-bg-surface-secondary">
            <Filter size={14} className="text-text-muted" />
            <select value={activeCityFilter} onChange={e => setCityFilter(e.target.value)} className="bg-transparent text-[11px] font-semibold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Active Dispatches Timeline Strip */}
      <AnimatePresence>
        {activeDispatches.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-bg-surface border border-border rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <Activity size={14} className="text-info" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-main">Live Operations</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
              {activeDispatches.map(d => (
                <div key={d._id} className="flex-shrink-0 bg-bg-page border border-border rounded-lg p-3 min-w-[280px] max-w-[320px] snap-start">
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">ID: {d._id.substring(0,8)}</span>
                    <span className="text-[10px] font-bold text-warning flex items-center gap-1">
                      <Clock size={10} /> {d.eta}m ETA
                    </span>
                  </div>
                  
                  <h4 className="text-[13px] font-bold text-text-main truncate mb-3">
                    {d.incident?.category?.replace(/_/g, ' ')}
                  </h4>
                  
                  {/* Timeline Visual */}
                  <div className="flex items-center justify-between text-[10px] font-medium text-text-secondary px-1">
                    <div className="flex flex-col items-center gap-1 w-1/3">
                      <div className="w-5 h-5 rounded-full bg-emergency/10 text-emergency flex items-center justify-center">
                        <ShieldAlert size={10} />
                      </div>
                      <span className="truncate w-full text-center">{d.incident?.city}</span>
                    </div>
                    
                    <div className="flex-1 h-px bg-border relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-info bg-bg-page px-1">
                        <ArrowRight size={12} />
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1 w-1/3">
                      <div className="w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                        <Truck size={10} />
                      </div>
                      <span className="truncate w-full text-center">{d.ambulance?._id.replace('AMB-','U-')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

        {/* LEFT: Pending Incidents */}
        <div className="lg:col-span-3 flex flex-col bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden h-[400px] lg:h-auto order-2 lg:order-1">
          <div className="p-4 border-b border-border bg-bg-surface flex justify-between items-center shrink-0">
            <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert size={14} className="text-emergency" /> Action Required
            </h3>
            <span className="text-[10px] font-bold bg-emergency/10 text-emergency px-2 py-0.5 rounded-full">{pendingIncidents.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-bg-page/50">
            <AnimatePresence>
              {pendingIncidents.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-text-muted mt-8 text-[11px] font-medium">
                  {activeCityFilter === 'All India' ? 'All incidents assigned' : `No pending in ${activeCityFilter}`}
                </motion.div>
              ) : (
                pendingIncidents.map(inc => {
                  const isCritical = inc.severity >= 9;
                  const nearestAmb = allAmbulances.find(a => a.status === 'AVAILABLE' && a.city === inc.city) ||
                                     allAmbulances.find(a => a.status === 'AVAILABLE');

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={inc._id} 
                      className={`bg-bg-surface border rounded-lg p-3 shadow-sm transition-shadow ${
                        isCritical ? 'border-l-4 border-l-emergency border-t-border border-r-border border-b-border' : 'border-border'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          isCritical ? 'bg-emergency/10 text-emergency' : 'bg-warning/10 text-warning'
                        }`}>
                          SEV {inc.severity}
                        </span>
                        {inc.aiConfidence && (
                          <span className="text-[9px] text-info font-bold tracking-widest uppercase">
                            {(inc.aiConfidence * 100).toFixed(0)}% AI Match
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-[13px] font-bold text-text-main mb-1 truncate pr-2">
                        {inc.category.replace(/_/g, ' ')}
                      </h3>
                      
                      <p className="text-[11px] text-text-secondary flex items-center gap-1.5 mb-3">
                        <MapPin size={11} className="text-text-muted"/> {inc.city}
                      </p>
                      
                      {nearestAmb ? (
                        <button
                          onClick={() => handleDispatch(inc._id, nearestAmb._id)}
                          className="w-full flex items-center justify-between px-3 py-2 bg-operational text-white text-[11px] font-bold uppercase tracking-widest rounded transition-colors hover:bg-green-700 active:scale-95"
                        >
                          <span>Dispatch {nearestAmb._id.replace('AMB-','U-')}</span>
                          <ArrowRight size={12} />
                        </button>
                      ) : (
                        <div className="w-full text-center py-2 bg-bg-page border border-border text-[10px] text-text-muted font-bold uppercase tracking-widest rounded">
                          No Units Available
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CENTER: Tactical Map */}
        <div className="lg:col-span-6 bg-bg-surface border border-border rounded-lg overflow-hidden shadow-sm relative flex flex-col h-[400px] lg:h-auto order-1 lg:order-2">
          <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded shadow border border-border/50 pointer-events-none">
            <h3 className="text-[10px] font-bold text-text-main uppercase tracking-widest flex items-center gap-2">
              <Crosshair size={12} className="text-info" /> Tactical Map
            </h3>
          </div>
          <div className="flex-1 relative z-0">
            <MapComponent incidents={pendingIncidents} ambulances={availableAmbulances} />
          </div>
        </div>

        {/* RIGHT: Available Units */}
        <div className="lg:col-span-3 flex flex-col bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden h-[400px] lg:h-auto order-3">
          <div className="p-4 border-b border-border bg-bg-surface flex justify-between items-center shrink-0">
            <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest flex items-center gap-2">
              <Truck size={14} className="text-operational" /> Resources
            </h3>
            <span className="text-[10px] font-bold bg-operational/10 text-operational px-2 py-0.5 rounded-full">{availableAmbulances.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-bg-page/50">
            {availableAmbulances.length === 0 ? (
              <div className="text-center text-text-muted mt-8 text-[11px] font-medium">No units available in region</div>
            ) : (
              availableAmbulances.map(amb => (
                <div key={amb._id} className="bg-bg-surface border border-border rounded-lg p-3 transition-colors hover:border-border-subtle shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[13px] font-bold text-text-main truncate">{amb._id.replace('AMB-','Unit ')}</h3>
                    <span className="px-1.5 py-0.5 bg-operational/10 text-operational border border-operational/20 rounded text-[9px] font-bold uppercase tracking-widest">
                      Ready
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-[11px] text-text-secondary">
                    <span className="flex items-center gap-2">
                      <span className="text-info font-bold tracking-widest uppercase text-[9px] bg-info/10 px-1.5 rounded">{amb.capability || 'ALS'}</span>
                      <span className="truncate">{amb.driverName}</span>
                    </span>
                    <span className="flex items-center gap-1.5 mt-1">
                      <MapPin size={11} className="text-text-muted"/> {amb.city}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchBoard;
