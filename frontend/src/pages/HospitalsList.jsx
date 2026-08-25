import { Hospital, BedDouble, MapPin, Filter, Search, Activity, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from '../components/MapComponent';
import useDemoStore from '../demo/demoStore';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune', 'Bhopal', 'Indore', 'Patna', 'Chandigarh', 'Bhubaneswar', 'Guwahati', 'Kochi', 'Dehradun', 'Nagpur', 'Surat'];

const HospitalsList = () => {
  const allHospitals = useDemoStore(state => state.hospitals);
  const activeCityFilter = useDemoStore(state => state.activeCityFilter);
  const setCityFilter = useDemoStore(state => state.setCityFilter);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredHospitals = allHospitals.filter(h => {
    if (activeCityFilter !== 'All India' && h.city !== activeCityFilter) return false;
    if (typeFilter !== 'ALL' && h.hospitalType !== typeFilter) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalICU = filteredHospitals.reduce((sum, h) => sum + (h.icuBeds || 0), 0);
  const trauma1 = filteredHospitals.filter(h => h.traumaLevel === 1).length;
  const totalBeds = filteredHospitals.reduce((sum, h) => sum + (h.availableBeds || 0), 0);

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      
      {/* Editorial Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight mb-2">Healthcare Network</h1>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Facilities</span>
              <span className="text-[14px] font-semibold text-text-main">{filteredHospitals.length} Units</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">ICU Capacity</span>
              <span className="text-[14px] font-semibold text-operational">{totalICU} Beds</span>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Trauma Level 1</span>
              <span className="text-[14px] font-semibold text-emergency">{trauma1} Centers</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-md px-3 py-1.5 shadow-sm transition-colors hover:border-border-subtle hover:bg-bg-surface-secondary">
            <Search size={14} className="text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search facility..."
              className="bg-transparent text-[11px] font-semibold text-text-main outline-none border-none w-32 placeholder:text-text-muted placeholder:font-medium"
            />
          </div>
          <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-md px-3 py-1.5 shadow-sm transition-colors hover:border-border-subtle hover:bg-bg-surface-secondary">
            <Filter size={14} className="text-text-muted" />
            <select value={activeCityFilter} onChange={e => setCityFilter(e.target.value)} className="bg-transparent text-[11px] font-semibold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-md px-3 py-1.5 shadow-sm transition-colors hover:border-border-subtle hover:bg-bg-surface-secondary">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-transparent text-[11px] font-semibold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              <option value="ALL">ALL TYPES</option>
              <option value="GOVERNMENT">GOVERNMENT</option>
              <option value="PRIVATE">PRIVATE</option>
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
              <span className="w-1.5 h-1.5 rounded-full bg-info" />
              Network Map
            </span>
          </div>
          <div className="flex-1 w-full h-full relative z-0">
            <MapComponent hospitals={filteredHospitals} ambulances={[]} incidents={[]} />
          </div>
        </div>

        {/* LIST PANEL */}
        <div className="lg:col-span-7 bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-border bg-bg-surface flex justify-between items-center shrink-0">
            <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest">Capacity Overview</h3>
            <span className="text-[11px] font-semibold text-text-muted">{filteredHospitals.length} Facilities</span>
          </div>
          <div className="flex-1 overflow-y-auto w-full bg-bg-page/30 p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {filteredHospitals.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-[12px] font-semibold text-text-muted">
                    No facilities match current filters.
                  </motion.div>
                ) : (
                  filteredHospitals.map((hospital) => {
                    const icuTotal = 50; // Mock total for visual bar
                    const icuFill = Math.min(100, Math.max(5, (hospital.icuBeds / icuTotal) * 100));
                    
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        key={hospital._id} 
                        className="group bg-bg-surface border border-border rounded-lg p-5 transition-all shadow-sm hover:shadow-md hover:border-border-subtle"
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          
                          {/* Info Column */}
                          <div className="flex-1 flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                                hospital.hospitalType === 'GOVERNMENT'
                                  ? 'bg-bg-page text-text-main border-border'
                                  : 'bg-info/10 text-info border-info/20'
                              }`}>
                                {hospital.hospitalType}
                              </span>
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                                hospital.traumaLevel === 1
                                  ? 'bg-emergency/10 text-emergency border-emergency/20'
                                  : hospital.traumaLevel === 2
                                  ? 'bg-warning/10 text-warning border-warning/20'
                                  : 'bg-bg-page text-text-muted border-border'
                              }`}>
                                Level {hospital.traumaLevel} Trauma
                              </span>
                            </div>
                            
                            <h4 className="text-[16px] font-bold text-text-main truncate max-w-[300px]">
                              {hospital.name}
                            </h4>
                            
                            <div className="flex items-center gap-1.5 text-[12px] text-text-secondary mt-1">
                              <MapPin size={12} className="text-text-muted" /> 
                              {hospital.city}, {hospital.state}
                            </div>
                          </div>

                          {/* Capacity Column */}
                          <div className="flex flex-col gap-4 md:w-48 shrink-0 md:border-l border-border md:pl-5">
                            
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                <span className="flex items-center gap-1.5"><Activity size={10} className="text-operational"/> ICU</span>
                                <span className="text-text-main">{hospital.icuBeds} Avail</span>
                              </div>
                              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                                <div className="bg-operational h-full rounded-full" style={{ width: `${icuFill}%` }} />
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                <span className="flex items-center gap-1.5"><BedDouble size={10} className="text-info"/> Ward</span>
                                <span className="text-text-main">{hospital.availableBeds} Avail</span>
                              </div>
                            </div>

                            <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded border text-center ${
                              hospital.status === 'AVAILABLE'
                                ? 'bg-operational/10 text-operational border-operational/20'
                                : 'bg-emergency/10 text-emergency border-emergency/20'
                            }`}>
                              {hospital.status}
                            </span>
                            
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
    </div>
  );
};

export default HospitalsList;
