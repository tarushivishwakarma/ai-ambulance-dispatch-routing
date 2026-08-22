import { apiService } from '../services/apiService';
import { Hospital, BedDouble, Activity, MapPin, Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import useDemoStore from '../demo/demoStore';

const CITIES = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune', 'Bhopal', 'Indore', 'Patna', 'Chandigarh', 'Bhubaneswar', 'Guwahati', 'Kochi', 'Dehradun', 'Nagpur', 'Surat'];

const HospitalsList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const activeCityFilter = useDemoStore(state => state.activeCityFilter);
  const setCityFilter = useDemoStore(state => state.setCityFilter);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await apiService.getHospitals();
        setHospitals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
    const interval = setInterval(fetchHospitals, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-text-muted">Loading hospital network status...</div>;

  const filteredHospitals = hospitals.filter(h => {
    if (activeCityFilter !== 'All India' && h.city !== activeCityFilter) return false;
    return true;
  });

  const totalBeds = filteredHospitals.reduce((sum, h) => sum + h.bedsAvailable, 0);
  const traumaCenters = filteredHospitals.filter(h => h.traumaCenter).length;

  return (
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-primary-900/80 backdrop-blur-md p-3 rounded-lg border border-primary-700/50 shadow-xl gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-info/20 text-info p-2 rounded border border-info/30">
            <Hospital size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-main tracking-tight uppercase">Healthcare Network</h1>
            <p className="text-xs text-text-muted font-bold tracking-wider uppercase">Monitoring {filteredHospitals.length} Facilities</p>
          </div>
        </div>

        {/* Network Metrics */}
        <div className="hidden lg:flex items-center gap-6 px-6 border-l border-primary-700/50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Network Capacity</span>
            <span className="text-sm font-bold text-operational">{totalBeds} ICU Beds</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Trauma Centers</span>
            <span className="text-sm font-bold text-info">{traumaCenters} Active</span>
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-140px)]">
        
        {/* MAP PANEL */}
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg overflow-hidden shadow-2xl relative flex flex-col h-full">
           <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center z-10">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Facility Map</h3>
           </div>
          <div className="flex-1 relative z-0">
             <MapComponent hospitals={filteredHospitals} />
          </div>
        </div>

        {/* LIST PANEL */}
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Network Capacity Log</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-primary-900/90 backdrop-blur-sm z-10 border-b border-primary-700/50">
                <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="p-3">Facility ID / Region</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">Available Beds</th>
                  <th className="p-3">Network Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700/50">
                {filteredHospitals.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-xs font-bold text-text-muted uppercase">No facilities match current filters.</td></tr>
                ) : (
                  filteredHospitals.map((hospital) => (
                    <tr key={hospital._id} className="hover:bg-primary-900/80 transition-colors">
                      <td className="p-3">
                        <div className="text-sm font-bold text-text-main truncate max-w-[200px]">{hospital.name}</div>
                        <div className="text-[10px] text-text-muted flex items-center gap-1 mt-1 font-medium truncate max-w-[200px]">
                          <MapPin size={10} /> {hospital.address}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border inline-block w-max ${hospital.type === 'GOVERNMENT' ? 'bg-primary-700/50 text-text-main border-primary-600/50' : 'bg-info/10 text-info border-info/20'}`}>
                            {hospital.type}
                          </span>
                          {hospital.traumaCenter && (
                            <span className="text-[9px] font-bold uppercase tracking-widest text-emergency bg-emergency/10 px-2 py-0.5 rounded border border-emergency/20 inline-block w-max">
                              TRAUMA LEVEL 1
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm font-bold text-operational flex items-center gap-1.5">
                          <BedDouble size={14} /> {hospital.bedsAvailable}
                        </div>
                        <div className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-wider">ICU READY</div>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                          hospital.status === 'AVAILABLE' ? 'bg-operational/10 text-operational border-operational/30' : 
                          'bg-emergency/10 text-emergency border-emergency/30'
                        }`}>
                          {hospital.status}
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

export default HospitalsList;
