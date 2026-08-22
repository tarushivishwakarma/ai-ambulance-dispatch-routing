import React from 'react';
import { Radio, MapPin, ArrowRight, ShieldAlert, Truck, Crosshair, Filter } from 'lucide-react';
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
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-primary-800/60 backdrop-blur-md p-3 rounded-lg border border-primary-700/50 shadow-xl gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-warning/20 text-warning p-2 rounded border border-warning/30">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-main tracking-tight uppercase">Dispatch Command</h1>
            <p className="text-xs text-text-muted font-bold tracking-wider uppercase">
              {pendingIncidents.length} Pending | {availableAmbulances.length} Available | {activeDispatches.length} Active Dispatches
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-primary-700/60 border border-primary-600/50 rounded px-3 py-1.5">
          <Filter size={12} className="text-text-muted" />
          <select value={activeCityFilter} onChange={e => setCityFilter(e.target.value)} className="bg-transparent text-[10px] font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Active Dispatches Summary Strip */}
      {activeDispatches.length > 0 && (
        <div className="bg-info/5 border border-info/20 rounded-lg p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-info mb-2">{activeDispatches.length} Active Dispatches</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {activeDispatches.slice(0, 8).map(d => (
              <div key={d._id} className="flex-shrink-0 bg-primary-800/80 border border-primary-700/50 rounded p-2.5 min-w-[200px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-bold text-info uppercase">{d._id}</span>
                  <span className="text-[9px] font-bold text-warning">{d.eta}m ETA</span>
                </div>
                <div className="text-[10px] text-text-main font-bold truncate">{d.incident?.category?.replace(/_/g, ' ')}</div>
                <div className="text-[9px] text-text-muted mt-0.5">{d.incident?.city} → {d.ambulance?._id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: 'calc(100vh - 220px)' }}>

        {/* LEFT: Pending Incidents */}
        <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg flex flex-col shadow-2xl overflow-hidden h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={14} className="text-emergency" /> Action Required
            </h3>
            <span className="text-[10px] font-bold bg-emergency/10 text-emergency border border-emergency/20 px-1.5 py-0.5 rounded">{pendingIncidents.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {pendingIncidents.length === 0 ? (
              <div className="text-center text-text-muted mt-10 text-xs font-bold uppercase tracking-wider">
                {activeCityFilter === 'All India' ? 'All incidents assigned' : `No pending in ${activeCityFilter}`}
              </div>
            ) : (
              pendingIncidents.map(inc => (
                <div key={inc._id} className="bg-primary-900/80 border border-emergency/20 rounded p-3 hover:border-emergency/40 transition-colors shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emergency" />
                  <div className="pl-2">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${inc.severity >= 9 ? 'bg-emergency/10 text-emergency border-emergency/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                        SEV {inc.severity}
                      </span>
                      <span className="text-[9px] text-info font-bold">{(inc.aiConfidence * 100).toFixed(0)}% AI</span>
                    </div>
                    <h3 className="text-xs font-bold text-text-main mb-1 truncate">{inc.category.replace(/_/g, ' ')}</h3>
                    <p className="text-[10px] text-text-muted flex items-center gap-1 mb-2"><MapPin size={9}/> {inc.city}</p>
                    {/* Quick dispatch: find nearest available amb in same city */}
                    {(() => {
                      const nearestAmb = allAmbulances.find(a => a.status === 'AVAILABLE' && a.city === inc.city) ||
                                        allAmbulances.find(a => a.status === 'AVAILABLE');
                      if (nearestAmb) {
                        return (
                          <button
                            onClick={() => handleDispatch(inc._id, nearestAmb._id)}
                            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-operational/20 hover:bg-operational/30 border border-operational/30 text-operational text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
                          >
                            Dispatch {nearestAmb._id.substring(0, 10)} <ArrowRight size={10} />
                          </button>
                        );
                      }
                      return <p className="text-[9px] text-text-muted font-bold">No units available</p>;
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CENTER: Tactical Map */}
        <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg overflow-hidden shadow-2xl relative flex flex-col h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center z-10">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
              <Crosshair size={14} className="text-info" /> Tactical Map
            </h3>
          </div>
          <div className="flex-1 relative z-0">
            <MapComponent incidents={pendingIncidents} ambulances={availableAmbulances} />
          </div>
        </div>

        {/* RIGHT: Available Units */}
        <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg flex flex-col shadow-2xl overflow-hidden h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
              <Truck size={14} className="text-operational" /> Available Resources
            </h3>
            <span className="text-[10px] font-bold bg-operational/10 text-operational border border-operational/20 px-1.5 py-0.5 rounded">{availableAmbulances.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {availableAmbulances.length === 0 ? (
              <div className="text-center text-text-muted mt-10 text-xs font-bold uppercase tracking-wider">No units available in region</div>
            ) : (
              availableAmbulances.map(amb => (
                <div key={amb._id} className="bg-primary-900/80 border border-primary-600/40 rounded p-3 hover:border-operational/40 transition-colors">
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="text-xs font-bold text-text-main truncate max-w-[140px]">{amb._id}</h3>
                    <span className="px-1.5 py-0.5 bg-operational/10 text-operational border border-operational/30 rounded text-[9px] font-bold uppercase">Ready</span>
                  </div>
                  <p className="text-[10px] text-text-muted flex items-center gap-2 mb-1">
                    <span className="text-info font-bold uppercase tracking-widest">{amb.capability || 'ALS'}</span>
                    <span className="text-primary-600">|</span>
                    <span className="truncate">{amb.driverName}</span>
                  </p>
                  <p className="text-[10px] text-text-muted flex items-center gap-1">
                    <MapPin size={9}/> {amb.city}
                  </p>
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
