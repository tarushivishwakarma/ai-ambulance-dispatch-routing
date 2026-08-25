import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import { FileText, Download, Filter, Clock, CheckCircle, Activity, MapPin, ChevronDown } from 'lucide-react';

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
    setLoading(true);
    const queryFilters = {};
    if (filters.year !== 'ALL') queryFilters.year = filters.year;
    if (filters.city !== 'ALL') queryFilters.city = filters.city;
    if (filters.severity !== 'ALL') queryFilters.severity = filters.severity;
    if (filters.category !== 'ALL') queryFilters.category = filters.category;
    if (filters.ambulanceType && filters.ambulanceType !== 'ALL') queryFilters.ambulanceType = filters.ambulanceType;
    if (filters.outcome && filters.outcome !== 'ALL') queryFilters.outcome = filters.outcome;

    apiService.getHistoricalIncidents(queryFilters).then(data => {
      setIncidents(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [filters]);

  const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
  const cities = ['All India', 'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Lucknow', 'Jaipur', 'Ahmedabad', 'Pune', 'Surat', 'Indore', 'Bhopal', 'Patna', 'Chandigarh', 'Dehradun', 'Guwahati', 'Bhubaneswar', 'Nagpur', 'Nashik', 'Agra', 'Varanasi', 'Amritsar', 'Ludhiana', 'Coimbatore', 'Visakhapatnam', 'Kochi', 'Thiruvananthapuram', 'Ranchi'].sort();
  const categories = ['ROAD_ACCIDENT', 'MEDICAL', 'CARDIAC', 'FIRE', 'TRAUMA', 'FALL', 'STROKE', 'RESPIRATORY', 'INDUSTRIAL', 'OTHER'].sort();

  const filteredIncidents = incidents;
  const totalIncidents = filteredIncidents.length;
  
  const getMinutes = (start, end) => {
    if (!start || !end) return null;
    return (new Date(end) - new Date(start)) / 60000;
  };

  const responseTimes = filteredIncidents.map(i => getMinutes(i.reportedAt, i.arrivedOnSceneTime)).filter(t => t !== null && t > 0);
  const avgResponseTime = responseTimes.length ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1) : '--';

  const resolutionTimes = filteredIncidents.map(i => getMinutes(i.reportedAt, i.resolvedAt)).filter(t => t !== null && t > 0);
  const avgResolutionTime = resolutionTimes.length ? (resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length).toFixed(1) : '--';

  const hospitalArrivalTimes = filteredIncidents.map(i => getMinutes(i.reportedAt, i.hospitalArrivalTime)).filter(t => t !== null && t > 0);
  const avgHospitalArrivalTime = hospitalArrivalTimes.length ? (hospitalArrivalTimes.reduce((a, b) => a + b, 0) / hospitalArrivalTimes.length).toFixed(1) : '--';

  const handleExportCSV = () => {
    const headers = [
      'Incident ID', 'Date', 'Year', 'Month', 'City', 'State', 
      'Category', 'Severity', 'Affected People', 'Ambulance ID', 
      'Ambulance Type', 'Hospital', 'Reported At', 'AI Verified At', 'Dispatch Time', 'Arrived On Scene', 
      'Hospital Arrival Time', 'Resolved At', 'Response Time', 'Hospital Arrival Duration', 'Resolution Time', 'Outcome', 'Status', 'Data Source'
    ];
    
    const rows = filteredIncidents.map(i => {
      const rTime = getMinutes(i.reportedAt, i.arrivedOnSceneTime);
      const resTime = getMinutes(i.reportedAt, i.resolvedAt);
      const hTime = getMinutes(i.arrivedOnSceneTime, i.hospitalArrivalTime);
      const d = new Date(i.reportedAt);
      
      return [
        i.incidentId || i._id,
        d.toISOString().split('T')[0],
        d.getFullYear(),
        d.getMonth() + 1,
        i.city || '--',
        i.state || '--',
        i.category,
        i.severityScore ? i.severityScore.toFixed(1) : i.severity,
        i.affectedPeople || 1,
        i.ambulanceId || '--',
        i.ambulanceType || '--',
        i.hospitalName || '--',
        i.reportedAt ? new Date(i.reportedAt).toISOString() : '--',
        i.aiVerifiedAt ? new Date(i.aiVerifiedAt).toISOString() : '--',
        i.dispatchTime ? new Date(i.dispatchTime).toISOString() : '--',
        i.arrivedOnSceneTime ? new Date(i.arrivedOnSceneTime).toISOString() : '--',
        i.hospitalArrivalTime ? new Date(i.hospitalArrivalTime).toISOString() : '--',
        i.resolvedAt ? new Date(i.resolvedAt).toISOString() : '--',
        rTime ? rTime.toFixed(1) : '--',
        hTime ? hTime.toFixed(1) : '--',
        resTime ? resTime.toFixed(1) : '--',
        i.outcome || '--',
        i.status,
        i.dataSource || i.source || 'SYSTEM'
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ai_dispatch_historical_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight mb-2 flex items-center gap-2">
            <FileText size={24} className="text-info" />
            Historical Reports
          </h1>
          <p className="text-[13px] text-text-secondary max-w-2xl leading-relaxed">
            Enterprise analytics and CSV data extraction for resolved operational incidents.
          </p>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={loading || filteredIncidents.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover rounded text-[12px] font-bold text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest shrink-0"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        <div className="bg-bg-surface border border-border rounded-lg p-5 shadow-sm">
           <div className="flex justify-between items-start text-text-muted mb-3"><span className="text-[10px] font-bold uppercase tracking-widest">Total Resolved</span><CheckCircle size={16} className="text-operational opacity-70"/></div>
           <div className="text-2xl font-black text-text-main">{totalIncidents}</div>
        </div>
        <div className="bg-bg-surface border border-border rounded-lg p-5 shadow-sm">
           <div className="flex justify-between items-start text-text-muted mb-3"><span className="text-[10px] font-bold uppercase tracking-widest">Avg Response (m)</span><Activity size={16} className="text-warning opacity-70"/></div>
           <div className="text-2xl font-black text-text-main">{avgResponseTime}</div>
        </div>
        <div className="bg-bg-surface border border-border rounded-lg p-5 shadow-sm">
           <div className="flex justify-between items-start text-text-muted mb-3"><span className="text-[10px] font-bold uppercase tracking-widest">Hosp. Arrival (m)</span><MapPin size={16} className="text-info opacity-70"/></div>
           <div className="text-2xl font-black text-text-main">{avgHospitalArrivalTime}</div>
        </div>
        <div className="bg-bg-surface border border-border rounded-lg p-5 shadow-sm">
           <div className="flex justify-between items-start text-text-muted mb-3"><span className="text-[10px] font-bold uppercase tracking-widest">Resolution (m)</span><Clock size={16} className="text-brand-primary opacity-70"/></div>
           <div className="text-2xl font-black text-text-main">{avgResolutionTime}</div>
        </div>
      </div>

      {/* Filters & Data Table */}
      <div className="flex-1 flex flex-col bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden mx-2 mb-2">
        
        {/* Filter Bar */}
        <div className="p-4 border-b border-border bg-bg-page/50 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-text-muted mr-2">
            <Filter size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Filters</span>
          </div>
          
          <div className="flex gap-3 flex-wrap flex-1">
            <div className="relative">
              <select value={filters.year} onChange={e => setFilters({...filters, year: e.target.value})} className="appearance-none bg-bg-surface border border-border hover:border-border-subtle transition-colors rounded pl-3 pr-8 py-1.5 text-[11px] font-bold text-text-main uppercase outline-none cursor-pointer">
                <option value="ALL">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
            
            <div className="relative">
              <select value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} className="appearance-none bg-bg-surface border border-border hover:border-border-subtle transition-colors rounded pl-3 pr-8 py-1.5 text-[11px] font-bold text-text-main uppercase outline-none cursor-pointer">
                <option value="ALL">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>

            <div className="relative">
              <select value={filters.severity} onChange={e => setFilters({...filters, severity: e.target.value})} className="appearance-none bg-bg-surface border border-border hover:border-border-subtle transition-colors rounded pl-3 pr-8 py-1.5 text-[11px] font-bold text-text-main uppercase outline-none cursor-pointer">
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical (9-10)</option>
                <option value="HIGH">High (7-8)</option>
                <option value="MODERATE">Moderate (≤6)</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>

            <div className="relative">
              <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} className="appearance-none bg-bg-surface border border-border hover:border-border-subtle transition-colors rounded pl-3 pr-8 py-1.5 text-[11px] font-bold text-text-main uppercase outline-none cursor-pointer">
                <option value="ALL">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          <div className="text-[10px] font-bold text-text-muted tracking-widest bg-bg-page px-3 py-1.5 rounded border border-border">
            {filteredIncidents.length} RECORDS
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-text-muted text-[11px] font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
                <Activity size={14} className="animate-spin" /> Fetching DB Records...
              </div>
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-text-muted text-[12px] font-semibold">No records found matching current filters.</div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-bg-page/80 backdrop-blur sticky top-0 z-10 border-b border-border">
                <tr className="text-[10px] uppercase tracking-widest text-text-muted">
                  <th className="px-6 py-4 font-bold">Incident ID</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Location</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Severity</th>
                  <th className="px-6 py-4 font-bold text-right">Response Time</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-border"
              >
                {filteredIncidents.map(inc => {
                  const rTime = getMinutes(inc.dispatchTime || inc.reportedAt || inc.createdAt, inc.arrivedOnSceneTime);
                  const d = new Date(inc.reportedAt || inc.createdAt);
                  return (
                    <motion.tr variants={rowVariants} key={inc._id} className="hover:bg-bg-surface-secondary/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-[11px] font-medium text-text-secondary group-hover:text-text-main transition-colors">{inc.incidentId || inc._id.substring(0,8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[12px] font-medium text-text-main">{d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[12px] font-medium text-text-main">{inc.city || '--'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[12px] font-semibold text-text-main">{inc.category.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 border rounded text-[9px] uppercase font-bold tracking-widest ${
                          inc.severity >= 9 ? 'bg-emergency/10 border-emergency/20 text-emergency' :
                          inc.severity >= 7 ? 'bg-warning/10 border-warning/20 text-warning' :
                          'bg-info/10 border-info/20 text-info'
                        }`}>Sev {inc.severity}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[12px] font-bold ${rTime && rTime <= 10 ? 'text-operational' : rTime && rTime <= 15 ? 'text-warning' : rTime ? 'text-emergency' : 'text-text-muted'}`}>
                          {rTime ? `${rTime.toFixed(1)}m` : '--'}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
