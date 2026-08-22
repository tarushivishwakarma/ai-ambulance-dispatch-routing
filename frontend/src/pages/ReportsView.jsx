import React, { useEffect, useState, useMemo } from 'react';
import { apiService } from '../services/apiService';
import { FileText, Download, Filter, Clock, CheckCircle, Activity, MapPin } from 'lucide-react';

const ReportsView = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: 'ALL',
    city: 'ALL',
    severity: 'ALL',
    category: 'ALL',
  });

  useEffect(() => {
    apiService.getIncidents().then(data => {
      // Show all RESOLVED, specifically SYNTHETIC_DEMO ones as historical 
      const historical = data.filter(i => i.status === 'RESOLVED' || i.source === 'SYNTHETIC_DEMO');
      setIncidents(historical);
      setLoading(false);
    });
  }, []);

  const years = useMemo(() => {
    const ys = new Set(incidents.map(i => new Date(i.reportedAt || i.createdAt).getFullYear()).filter(y => !isNaN(y)));
    return Array.from(ys).sort();
  }, [incidents]);
  
  const cities = useMemo(() => Array.from(new Set(incidents.map(i => i.city).filter(Boolean))).sort(), [incidents]);
  const categories = useMemo(() => Array.from(new Set(incidents.map(i => i.category).filter(Boolean))).sort(), [incidents]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(i => {
      const yearMatch = filters.year === 'ALL' || new Date(i.reportedAt || i.createdAt).getFullYear().toString() === filters.year;
      const cityMatch = filters.city === 'ALL' || i.city === filters.city;
      const sevMatch = filters.severity === 'ALL' 
        ? true 
        : filters.severity === 'CRITICAL' ? i.severity >= 9 
        : filters.severity === 'HIGH' ? i.severity >= 7 && i.severity < 9 
        : i.severity < 7;
      const catMatch = filters.category === 'ALL' || i.category === filters.category;
      
      return yearMatch && cityMatch && sevMatch && catMatch;
    });
  }, [incidents, filters]);

  // KPIs calculation
  const totalIncidents = filteredIncidents.length;
  
  const getMinutes = (start, end) => {
    if (!start || !end) return null;
    return (new Date(end) - new Date(start)) / 60000;
  };

  const responseTimes = filteredIncidents.map(i => getMinutes(i.dispatchTime || i.reportedAt || i.createdAt, i.arrivedOnSceneTime)).filter(t => t !== null && t > 0);
  const avgResponseTime = responseTimes.length ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1) : '--';

  const resolutionTimes = filteredIncidents.map(i => getMinutes(i.reportedAt || i.createdAt, i.resolvedAt || i.updatedAt)).filter(t => t !== null && t > 0);
  const avgResolutionTime = resolutionTimes.length ? (resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length).toFixed(1) : '--';

  const hospitalArrivalTimes = filteredIncidents.map(i => getMinutes(i.reportedAt || i.createdAt, i.hospitalArrivalTime)).filter(t => t !== null && t > 0);
  const avgHospitalArrivalTime = hospitalArrivalTimes.length ? (hospitalArrivalTimes.reduce((a, b) => a + b, 0) / hospitalArrivalTimes.length).toFixed(1) : '--';

  const handleExportCSV = () => {
    // Generate CSV string
    const headers = [
      'Incident ID', 'Date', 'Year', 'Month', 'City', 'State', 
      'Category', 'Severity', 'Affected People', 'Ambulance ID', 
      'Ambulance Type', 'Hospital', 'Dispatch Time', 'Response Time', 
      'Hospital Arrival Time', 'Resolution Time', 'Outcome', 'Status', 'Data Source'
    ];
    
    const rows = filteredIncidents.map(i => {
      const rTime = getMinutes(i.dispatchTime || i.reportedAt || i.createdAt, i.arrivedOnSceneTime);
      const resTime = getMinutes(i.reportedAt || i.createdAt, i.resolvedAt || i.updatedAt);
      const hTime = getMinutes(i.reportedAt || i.createdAt, i.hospitalArrivalTime);
      const d = new Date(i.reportedAt || i.createdAt);
      
      return [
        i.incidentId || i._id,
        d.toISOString().split('T')[0],
        d.getFullYear(),
        d.getMonth() + 1,
        i.city || '--',
        i.state || '--',
        i.category,
        i.severity,
        i.affectedPeople || 1,
        i.assignedAmbulance || '--',
        i.ambulanceType || '--',
        i.hospitalName || i.aiAnalysis?.hospitalAssigned || '--',
        i.dispatchTime ? new Date(i.dispatchTime).toISOString() : '--',
        rTime ? rTime.toFixed(1) : '--',
        hTime ? hTime.toFixed(1) : '--',
        resTime ? resTime.toFixed(1) : '--',
        i.outcome || 'TREATED_AND_DISCHARGED',
        i.status,
        i.source || 'SYSTEM'
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
    
    // Download logic
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ai_dispatch_historical_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6 max-w-7xl mx-auto w-full">
      <header className="flex justify-between items-center bg-primary-800 p-4 border border-primary-700 rounded-lg shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-text-main flex items-center gap-2"><FileText size={20} className="text-info" /> Historical Reports</h1>
          <p className="text-sm text-text-muted mt-1">Analytics and CSV export of resolved operational data.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={loading || filteredIncidents.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover border border-brand-primary rounded text-sm font-bold text-white transition-colors shadow-sm disabled:opacity-50"
        >
          <Download size={16} /> Export CSV
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary-800 border border-primary-700 rounded-lg p-4 shadow-sm">
           <div className="flex justify-between text-text-muted mb-2"><span className="text-[10px] font-bold uppercase tracking-widest">Total Resolved</span><CheckCircle size={14} className="text-operational"/></div>
           <div className="text-2xl font-black text-text-main">{totalIncidents}</div>
        </div>
        <div className="bg-primary-800 border border-primary-700 rounded-lg p-4 shadow-sm">
           <div className="flex justify-between text-text-muted mb-2"><span className="text-[10px] font-bold uppercase tracking-widest">Avg Response (mins)</span><Activity size={14} className="text-warning"/></div>
           <div className="text-2xl font-black text-warning">{avgResponseTime}</div>
        </div>
        <div className="bg-primary-800 border border-primary-700 rounded-lg p-4 shadow-sm">
           <div className="flex justify-between text-text-muted mb-2"><span className="text-[10px] font-bold uppercase tracking-widest">Avg Hosp. Arrival (mins)</span><MapPin size={14} className="text-info"/></div>
           <div className="text-2xl font-black text-info">{avgHospitalArrivalTime}</div>
        </div>
        <div className="bg-primary-800 border border-primary-700 rounded-lg p-4 shadow-sm">
           <div className="flex justify-between text-text-muted mb-2"><span className="text-[10px] font-bold uppercase tracking-widest">Avg Resolution (mins)</span><Clock size={14} className="text-brand-primary"/></div>
           <div className="text-2xl font-black text-text-main">{avgResolutionTime}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-primary-800 border border-primary-700 rounded-lg p-4 shadow-sm flex items-center gap-4 overflow-x-auto flex-shrink-0">
        <Filter size={16} className="text-text-muted flex-shrink-0" />
        
        <select 
          value={filters.year} 
          onChange={e => setFilters({...filters, year: e.target.value})}
          className="bg-primary-600 border border-primary-700 rounded px-3 py-1.5 text-xs font-bold text-text-main uppercase outline-none"
        >
          <option value="ALL">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        
        <select 
          value={filters.city} 
          onChange={e => setFilters({...filters, city: e.target.value})}
          className="bg-primary-600 border border-primary-700 rounded px-3 py-1.5 text-xs font-bold text-text-main uppercase outline-none"
        >
          <option value="ALL">All Cities</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={filters.severity} 
          onChange={e => setFilters({...filters, severity: e.target.value})}
          className="bg-primary-600 border border-primary-700 rounded px-3 py-1.5 text-xs font-bold text-text-main uppercase outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical (9-10)</option>
          <option value="HIGH">High (7-8)</option>
          <option value="MODERATE">Moderate (≤6)</option>
        </select>

        <select 
          value={filters.category} 
          onChange={e => setFilters({...filters, category: e.target.value})}
          className="bg-primary-600 border border-primary-700 rounded px-3 py-1.5 text-xs font-bold text-text-main uppercase outline-none"
        >
          <option value="ALL">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
        </select>
        
        <span className="text-[10px] font-bold text-text-muted tracking-widest ml-auto whitespace-nowrap">
          {filteredIncidents.length} RECORDS
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-primary-800 border border-primary-700 rounded-lg shadow-sm">
        {loading ? (
          <div className="p-8 text-text-muted text-center text-sm font-bold uppercase tracking-widest animate-pulse">Loading historical reports...</div>
        ) : filteredIncidents.length === 0 ? (
          <div className="p-8 text-text-muted text-center text-sm font-bold uppercase tracking-widest">No records found for current filters.</div>
        ) : (
          <table className="w-full text-left text-sm text-text-main relative">
            <thead className="bg-primary-600 border-b border-primary-700 text-[10px] uppercase tracking-widest text-text-muted sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 font-bold">Incident ID</th>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">City</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Severity</th>
                <th className="px-4 py-3 font-bold">Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-700">
              {filteredIncidents.map(inc => {
                const rTime = getMinutes(inc.dispatchTime || inc.reportedAt || inc.createdAt, inc.arrivedOnSceneTime);
                const d = new Date(inc.reportedAt || inc.createdAt);
                return (
                  <tr key={inc._id} className="hover:bg-primary-600 transition-colors">
                    <td className="px-4 py-3 font-medium text-xs">{inc.incidentId || inc._id.substring(0,8)}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">{d.toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs">{inc.city || '--'}</td>
                    <td className="px-4 py-3 text-xs font-medium">{inc.category.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 border rounded text-[9px] uppercase font-bold tracking-widest ${
                        inc.severity >= 9 ? 'bg-emergency/10 border-emergency/20 text-emergency' :
                        inc.severity >= 7 ? 'bg-warning/10 border-warning/20 text-warning' :
                        'bg-info/10 border-info/20 text-info'
                      }`}>{inc.severity}/10</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted">
                      {rTime ? `${rTime.toFixed(1)}m` : '--'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
