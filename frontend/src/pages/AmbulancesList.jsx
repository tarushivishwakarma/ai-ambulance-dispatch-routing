import { Truck, Phone, MapPin, Activity, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import useDemoStore from '../demo/demoStore';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune', 'Bhopal', 'Indore', 'Patna', 'Chandigarh', 'Bhubaneswar', 'Guwahati', 'Kochi', 'Dehradun', 'Nagpur', 'Surat'];

const STATUS_STYLES = {
  AVAILABLE:    'bg-operational/15 text-operational border-operational/20',
  EN_ROUTE:     'bg-warning/15 text-warning border-warning/20 animate-pulse',
  ON_SCENE:     'bg-emergency/15 text-emergency border-emergency/20',
  TRANSPORTING: 'bg-info/15 text-info border-info/20',
  UNAVAILABLE:  'bg-primary-700/60 text-text-muted border-primary-600/50',
  RETURNING:    'bg-primary-700/60 text-text-muted border-primary-600/50',
};

const AmbulancesList = () => {
  // Read directly from demo store — always live
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
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-primary-800/60 backdrop-blur-md p-3 rounded-lg border border-primary-700/50 shadow-xl gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-operational/10 text-operational p-2 rounded border border-operational/20">
            <Truck size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-main tracking-tight uppercase">Fleet Tracking</h1>
            <p className="text-xs text-text-muted font-bold tracking-wider uppercase">
              Monitoring {filteredAmbulances.length} Units
            </p>
          </div>
        </div>

        {/* Fleet Distribution Metrics */}
        <div className="hidden lg:flex items-center gap-6 px-6 border-l border-primary-700/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Available</span>
            <span className="text-lg font-bold text-operational">{statusCounts['AVAILABLE'] || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">En Route</span>
            <span className="text-lg font-bold text-warning">{statusCounts['EN_ROUTE'] || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">On Scene</span>
            <span className="text-lg font-bold text-emergency">{statusCounts['ON_SCENE'] || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Transporting</span>
            <span className="text-lg font-bold text-info">{statusCounts['TRANSPORTING'] || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Unavailable</span>
            <span className="text-lg font-bold text-text-muted">{statusCounts['UNAVAILABLE'] || 0}</span>
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
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent text-[10px] font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
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

      {/* Main Grid: Map + List */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ height: 'calc(100vh - 160px)' }}>

        {/* MAP PANEL */}
        <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg overflow-hidden shadow-2xl relative flex flex-col h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center z-10">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Fleet Map</h3>
            <span className="text-[10px] font-bold text-operational flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse" />
              Live Positions
            </span>
          </div>
          <div className="flex-1 relative z-0">
            <MapComponent incidents={[]} ambulances={filteredAmbulances} />
          </div>
        </div>

        {/* LIST PANEL */}
        <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Active Fleet Log</h3>
            <span className="text-[10px] font-bold text-text-muted bg-primary-700/50 px-2 py-0.5 rounded">{filteredAmbulances.length} units</span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-primary-900/95 backdrop-blur-sm z-10 border-b border-primary-700/50">
                <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="p-3">Unit / City</th>
                  <th className="p-3">Capability</th>
                  <th className="p-3">Driver</th>
                  <th className="p-3">Assignment</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700/30">
                {filteredAmbulances.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-xs font-bold text-text-muted uppercase">No units match current filters.</td></tr>
                ) : (
                  filteredAmbulances.map((amb) => (
                    <tr key={amb._id} className="hover:bg-primary-600 transition-colors">
                      <td className="p-3">
                        <div className="text-sm font-bold text-text-main">{amb._id}</div>
                        <div className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5 font-medium">
                          <MapPin size={9} /> {amb.city}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-info bg-info/10 px-2 py-0.5 rounded border border-info/20">
                          {amb.capability || 'ALS'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="text-xs text-text-main font-medium">{amb.driverName}</div>
                        <div className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                          <Phone size={9} /> {amb.driverPhone}
                        </div>
                      </td>
                      <td className="p-3">
                        {amb.currentIncident ? (
                          <div className="text-[10px] font-bold text-emergency uppercase tracking-wider">INC: {amb.currentIncident.replace('INC-IND-', '')}</div>
                        ) : (
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Standby</div>
                        )}
                        {amb.speed > 0 && (
                          <div className="text-[9px] text-warning mt-0.5 font-bold">{amb.speed} km/h</div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${STATUS_STYLES[amb.status] || STATUS_STYLES.UNAVAILABLE}`}>
                          {amb.status.replace('_', ' ')}
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

export default AmbulancesList;
