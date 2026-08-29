import React, { useEffect, useState } from 'react';
import { Navigation, AlertTriangle, MapPin, Filter } from 'lucide-react';
import { apiService } from '../services/apiService';
import MapComponent from '../components/MapComponent';
import useDemoStore from '../demo/demoStore';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune', 'Bhopal', 'Indore', 'Patna', 'Chandigarh', 'Bhubaneswar', 'Guwahati', 'Kochi', 'Dehradun', 'Nagpur', 'Surat'];

const RoadConditions = () => {
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCityFilter = useDemoStore(state => state.activeCityFilter);
  const setCityFilter = useDemoStore(state => state.setCityFilter);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const data = await apiService.getRoadConditions();
        if (data && data.length > 0) {
          setConditions(data);
        } else {
          setConditions(useDemoStore.getState().roadConditions || []);
        }
      } catch (err) {
        console.error(err);
        setConditions(useDemoStore.getState().roadConditions || []);
      } finally {
        setLoading(false);
      }
    };
    fetchConditions();
  }, []);

  if (loading) return <div className="p-8 text-text-muted">Loading route network status...</div>;

  const filteredConditions = conditions.filter(c => {
    if (activeCityFilter !== 'All India' && c.city !== activeCityFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-primary-900/80 backdrop-blur-md p-3 rounded-lg border border-primary-700/50 shadow-xl gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-warning/10 text-warning p-2 rounded border border-warning/20">
            <Navigation size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-main tracking-tight uppercase">Road Conditions & Routing</h1>
            <p className="text-xs text-text-muted font-bold tracking-wider uppercase">Tracking {filteredConditions.length} Active Blockages</p>
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

      {/* Main Grid: Map + List */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-[calc(100vh-140px)] lg:overflow-hidden pb-4 lg:pb-0">
        
        {/* MAP PANEL */}
        <div className="lg:col-span-2 bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg overflow-hidden shadow-2xl relative flex flex-col h-full min-h-[350px] lg:min-h-0">
           <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center z-10">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Live Traffic & Blockage Map</h3>
           </div>
          <div className="flex-1 relative z-0">
             {/* We can pass road conditions as incidents for now since they both just need a marker, 
                 or we can map them to look like incidents to the MapComponent for red markers */}
             <MapComponent incidents={filteredConditions.map(c => ({
               ...c, 
               category: c.description,
               severity: 10,
               address: c.city
             }))} />
          </div>
        </div>

        {/* LIST PANEL */}
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Active Route Penalties</h3>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-2">
            {filteredConditions.length === 0 ? (
              <div className="text-center text-text-muted mt-10 text-xs font-bold uppercase tracking-wider">No blockages reported in region.</div>
            ) : (
              filteredConditions.map((condition) => (
                <div key={condition._id} className="bg-primary-900/80 border border-warning/20 rounded p-3 hover:border-warning/60 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border bg-warning/10 text-warning border-warning/20">
                      ACTIVE BLOCKAGE
                    </span>
                    <span className="text-[10px] text-text-muted font-bold uppercase">{condition._id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-text-main mb-1 flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-warning" /> {condition.description}
                  </h3>
                  <p className="text-[10px] text-text-muted flex items-center gap-1 mt-2">
                    <MapPin size={12}/> {condition.city}
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

export default RoadConditions;
