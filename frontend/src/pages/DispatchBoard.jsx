import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Radio, MapPin, ArrowRight, Activity, ShieldAlert, Truck, Crosshair, Filter } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import useDemoStore from '../demo/demoStore';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune', 'Bhopal', 'Indore', 'Patna', 'Chandigarh', 'Bhubaneswar', 'Guwahati', 'Kochi', 'Dehradun', 'Nagpur', 'Surat'];

const DispatchBoard = () => {
  const [incidents, setIncidents] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const activeCityFilter = useDemoStore(state => state.activeCityFilter);
  const setCityFilter = useDemoStore(state => state.setCityFilter);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inc, amb] = await Promise.all([
          apiService.getIncidents(),
          apiService.getAmbulances()
        ]);
        setIncidents(inc.filter(i => i.status === 'PENDING'));
        setAmbulances(amb.filter(a => a.status === 'AVAILABLE'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-text-muted">Loading dispatch coordination board...</div>;

  const filteredIncidents = incidents.filter(i => activeCityFilter === 'All India' || i.city === activeCityFilter);
  const filteredAmbulances = ambulances.filter(a => activeCityFilter === 'All India' || a.city === activeCityFilter);

  return (
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-primary-900/80 backdrop-blur-md p-3 rounded-lg border border-primary-700/50 shadow-xl gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-warning/20 text-warning p-2 rounded border border-warning/30">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-main tracking-tight uppercase">Dispatch Command</h1>
            <p className="text-xs text-text-muted font-bold tracking-wider uppercase">{filteredIncidents.length} Pending Actions | {filteredAmbulances.length} Units Available</p>
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
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-140px)]">
        
        {/* LEFT COLUMN: Pending Incidents */}
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg flex flex-col shadow-2xl overflow-hidden h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center z-10">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={14} className="text-emergency" /> Action Required Queue
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredIncidents.length === 0 ? (
              <div className="text-center text-text-muted mt-10 text-xs font-bold uppercase tracking-wider">No pending incidents in region</div>
            ) : (
              filteredIncidents.map(inc => (
                <div key={inc._id} className="bg-primary-900/80 border border-emergency/30 rounded p-3 hover:border-emergency/60 transition-colors cursor-pointer group shadow-lg shadow-black/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emergency"></div>
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border mr-2 ${inc.severity >= 9 ? 'bg-emergency/10 text-emergency border-emergency/20' : inc.severity >= 7 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-info/10 text-info border-info/20'}`}>
                        SEV {inc.severity}
                      </span>
                      <span className="text-[10px] text-info font-bold">AI MATCH: {(inc.aiConfidence * 100).toFixed(0)}%</span>
                    </div>
                    <span className="text-[10px] text-text-muted font-bold uppercase">{new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h3 className="text-sm font-bold text-text-main mb-1 pl-2 truncate">{inc.category.replace('_', ' ')}</h3>
                  <p className="text-[10px] text-text-muted flex items-center gap-1 pl-2 truncate"><MapPin size={10}/> {inc.address} ({inc.city})</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Live Map */}
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg overflow-hidden shadow-2xl relative flex flex-col h-full">
           <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center z-10">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                 <Crosshair size={14} className="text-info" /> Tactical Map
              </h3>
           </div>
          <div className="flex-1 relative z-0">
             <MapComponent incidents={filteredIncidents} ambulances={filteredAmbulances} />
          </div>
        </div>

        {/* RIGHT COLUMN: Available Units */}
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg flex flex-col shadow-2xl overflow-hidden h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center z-10">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
              <Truck size={14} className="text-operational" /> Available Resources
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredAmbulances.length === 0 ? (
              <div className="text-center text-text-muted mt-10 text-xs font-bold uppercase tracking-wider">No units currently available in region</div>
            ) : (
              filteredAmbulances.map(amb => (
                <div key={amb._id} className="bg-primary-900/80 border border-primary-600/50 rounded p-3 flex justify-between items-center hover:border-operational/50 transition-colors group">
                  <div>
                    <h3 className="text-xs font-bold text-text-main flex items-center gap-2 mb-1.5">
                       {amb._id} 
                       <span className="px-1.5 py-0.5 bg-operational/10 text-operational border border-operational/30 rounded text-[9px] uppercase tracking-wider">Available</span>
                    </h3>
                    <p className="text-[10px] text-text-muted font-medium flex items-center gap-2">
                      <span className="text-info font-bold uppercase tracking-widest">{amb.type === 'ADVANCED_LIFE_SUPPORT' ? 'ALS' : 'BLS'}</span>
                      <span className="text-primary-700">|</span>
                      <span>{amb.driver.name}</span>
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-primary-700/50 hover:bg-info/20 hover:text-info border border-primary-600 hover:border-info/50 text-text-main text-[10px] font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5">
                    Dispatch <ArrowRight size={10} />
                  </button>
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
