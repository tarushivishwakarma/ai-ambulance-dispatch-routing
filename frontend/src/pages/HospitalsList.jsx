import { Hospital, BedDouble, MapPin, Filter, Search } from 'lucide-react';
import { useState } from 'react';
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
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-primary-800/60 backdrop-blur-md p-3 rounded-lg border border-primary-700/50 shadow-xl gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-info/10 text-info p-2 rounded border border-info/20">
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
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">ICU Beds</span>
            <span className="text-lg font-bold text-operational">{totalICU}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Avail. Beds</span>
            <span className="text-lg font-bold text-info">{totalBeds}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Trauma L1</span>
            <span className="text-lg font-bold text-emergency">{trauma1}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-primary-700/60 border border-primary-600/50 rounded px-3 py-1.5">
            <Search size={12} className="text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hospital..."
              className="bg-transparent text-[10px] font-bold text-text-main outline-none border-none w-28 placeholder:text-text-muted"
            />
          </div>
          <div className="flex items-center gap-2 bg-primary-700/60 border border-primary-600/50 rounded px-3 py-1.5">
            <Filter size={12} className="text-text-muted" />
            <select value={activeCityFilter} onChange={e => setCityFilter(e.target.value)} className="bg-transparent text-[10px] font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-primary-700/60 border border-primary-600/50 rounded px-3 py-1.5">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-transparent text-[10px] font-bold text-text-main uppercase tracking-wider outline-none border-none cursor-pointer">
              <option value="ALL">ALL TYPES</option>
              <option value="GOVERNMENT">GOVERNMENT</option>
              <option value="PRIVATE">PRIVATE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:h-[calc(100vh-160px)] lg:overflow-hidden pb-4 lg:pb-0">

        {/* MAP PANEL */}
        <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg overflow-hidden shadow-2xl relative flex flex-col h-full min-h-[350px] lg:min-h-0">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 z-10">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Facility Map</h3>
          </div>
          <div className="flex-1 relative z-0">
            <MapComponent hospitals={filteredHospitals} />
          </div>
        </div>

        {/* LIST PANEL */}
        <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
          <div className="p-2.5 border-b border-primary-700/50 bg-primary-900/80 flex justify-between items-center">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Network Capacity Log</h3>
            <span className="text-[10px] font-bold text-text-muted bg-primary-700/50 px-2 py-0.5 rounded">{filteredHospitals.length} facilities</span>
          </div>
          <div className="flex-1 overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="sticky top-0 bg-primary-900/95 backdrop-blur-sm z-10 border-b border-primary-700/50">
                <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="p-3">Facility / Region</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Trauma</th>
                  <th className="p-3">ICU / Beds</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700/30">
                {filteredHospitals.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-xs font-bold text-text-muted uppercase">No facilities match current filters.</td></tr>
                ) : (
                  filteredHospitals.map((hospital) => (
                    <tr key={hospital._id} className="hover:bg-primary-600 transition-colors">
                      <td className="p-3">
                        <div className="text-sm font-bold text-text-main truncate max-w-[180px]">{hospital.name}</div>
                        <div className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5 font-medium">
                          <MapPin size={9} /> {hospital.city}, {hospital.state}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                          hospital.hospitalType === 'GOVERNMENT'
                            ? 'bg-primary-700/50 text-text-main border-primary-600/50'
                            : 'bg-info/10 text-info border-info/20'
                        }`}>
                          {hospital.hospitalType}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                          hospital.traumaLevel === 1
                            ? 'bg-emergency/10 text-emergency border-emergency/20'
                            : hospital.traumaLevel === 2
                            ? 'bg-warning/10 text-warning border-warning/20'
                            : 'bg-primary-700/50 text-text-muted border-primary-600/50'
                        }`}>
                          L{hospital.traumaLevel}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="text-sm font-bold text-operational flex items-center gap-1">
                          <BedDouble size={12} /> {hospital.icuBeds}
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">{hospital.availableBeds} avail.</div>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                          hospital.status === 'AVAILABLE'
                            ? 'bg-operational/10 text-operational border-operational/20'
                            : 'bg-emergency/10 text-emergency border-emergency/20'
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
