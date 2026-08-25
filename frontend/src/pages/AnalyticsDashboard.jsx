import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, ShieldAlert, Truck, BarChart2, CheckCircle2 } from 'lucide-react';
import useDemoStore from '../demo/demoStore';
import { apiService } from '../services/apiService';

const AnalyticsDashboard = () => {
  const [dbHistorical, setDbHistorical] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getHistoricalIncidents().then(data => {
      setDbHistorical(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const incidents = useDemoStore(state => state.incidents);
  const ambulances = useDemoStore(state => state.ambulances);
  const hospitals = useDemoStore(state => state.hospitals);
  
  const activeIncidents = incidents.filter(i => !['RESOLVED', 'CANCELLED'].includes(i.status));
  const criticalIncidents = incidents.filter(i => i.severity >= 9 && !['RESOLVED', 'CANCELLED'].includes(i.status));
  const availableAmb = ambulances.filter(a => a.status === 'AVAILABLE');
  const fleetUtil = ambulances.length > 0 ? ((ambulances.length - availableAmb.length) / ambulances.length * 100).toFixed(1) : 0;

  // Regional incident density
  const regionalIncidents = incidents.reduce((acc, inc) => {
    acc[inc.city] = (acc[inc.city] || 0) + 1;
    return acc;
  }, {});
  const topRegions = Object.entries(regionalIncidents).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxRegionCount = topRegions.length > 0 ? topRegions[0][1] : 1;

  // Category distribution
  const categoryCounts = incidents.reduce((acc, inc) => {
    const cat = inc.category.replace(/_/g, ' ');
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCatCount = topCategories.length > 0 ? topCategories[0][1] : 1;

  // Severity distribution
  const sevCounts = { CRITICAL: 0, HIGH: 0, MODERATE: 0 };
  incidents.forEach(i => {
    if (i.severity >= 9) sevCounts.CRITICAL++;
    else if (i.severity >= 7) sevCounts.HIGH++;
    else sevCounts.MODERATE++;
  });

  // Ambulance status distribution
  const ambStatusCounts = ambulances.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  // Historical: incidents by year (FROM MONGODB)
  const byYear = dbHistorical.reduce((acc, h) => {
    const y = new Date(h.reportedAt || h.createdAt).getFullYear();
    if (!isNaN(y)) acc[y] = (acc[y] || 0) + 1;
    return acc;
  }, {});
  const years = Object.entries(byYear).sort((a, b) => a[0] - b[0]);
  const maxYear = years.length > 0 ? Math.max(...years.map(y => y[1])) : 1;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto pr-2 pb-8 scrollbar-thin">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight mb-2 flex items-center gap-2">
            <BarChart2 size={24} className="text-info" />
            System Analytics
          </h1>
          <p className="text-[13px] text-text-secondary max-w-2xl leading-relaxed">
            Live operational performance metrics and historical trend analysis across the entire network.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Incidents</span>
            <span className="text-[14px] font-semibold text-text-main">{incidents.length}</span>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Fleet</span>
            <span className="text-[14px] font-semibold text-text-main">{ambulances.length} Units</span>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Historical DB</span>
            <span className="text-[14px] font-semibold text-text-main">{dbHistorical.length} Records</span>
          </div>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Active Incidents', val: activeIncidents.length, icon: ShieldAlert, color: 'text-warning', sub: `${criticalIncidents.length} critical` },
            { label: 'Fleet Utilization', val: `${fleetUtil}%`, icon: Truck, color: 'text-info', sub: `${availableAmb.length} standby` },
            { label: 'Critical Events', val: criticalIncidents.length, icon: Activity, color: 'text-emergency', sub: 'SEV 9+ tracking' },
            { label: 'Avg Response Time', val: '8:24', icon: Clock, color: 'text-operational', sub: 'Within KPI target' },
          ].map(kpi => (
            <motion.div variants={itemVariants} key={kpi.label} className="bg-bg-surface border border-border p-5 rounded-lg shadow-sm relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-text-disabled/20 group-hover:text-text-disabled/30 transition-colors">
                <kpi.icon size={48} strokeWidth={1} />
              </div>
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-2 relative z-10">{kpi.label}</p>
              <h3 className={`text-3xl font-black mb-2 relative z-10 ${kpi.color}`}>{kpi.val}</h3>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5 relative z-10">
                <CheckCircle2 size={12} className={kpi.color} /> {kpi.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Regional Density */}
          <motion.div variants={itemVariants} className="bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest">Regional Density</h3>
            </div>
            <div className="p-5 space-y-4 flex-1">
              {topRegions.map(([city, count]) => (
                <div key={city} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-text-secondary">{city}</span>
                    <span className="text-text-main">{count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxRegionCount) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-info rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div variants={itemVariants} className="bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest">Incident Categories</h3>
            </div>
            <div className="p-5 space-y-4 flex-1">
              {topCategories.map(([cat, count]) => (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-text-secondary truncate pr-2">{cat}</span>
                    <span className="text-text-main">{count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxCatCount) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="h-full bg-warning rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Severity + Fleet Status */}
          <div className="flex flex-col gap-6">
            <motion.div variants={itemVariants} className="bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest">Severity Distribution</h3>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'Critical (9-10)', val: sevCounts.CRITICAL, color: 'bg-emergency', textColor: 'text-emergency' },
                  { label: 'High (7-8)', val: sevCounts.HIGH, color: 'bg-warning', textColor: 'text-warning' },
                  { label: 'Moderate (<7)', val: sevCounts.MODERATE, color: 'bg-info', textColor: 'text-info' },
                ].map(s => (
                  <div key={s.label} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                      <span className={s.textColor}>{s.label}</span>
                      <span className="text-text-main">{s.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.val / incidents.length) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                        className={`h-full ${s.color} rounded-full`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest">Fleet Status</h3>
              </div>
              <div className="p-4 space-y-3">
                {Object.entries(ambStatusCounts).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-text-muted uppercase tracking-wider">{status.replace('_', ' ')}</span>
                    <span className={`${
                      status === 'AVAILABLE' ? 'text-operational bg-operational/10' :
                      status === 'EN_ROUTE' ? 'text-brand-primary bg-brand-primary/10' :
                      status === 'ON_SCENE' ? 'text-warning bg-warning/10' :
                      'text-info bg-info/10'
                    } px-2 py-0.5 rounded border border-transparent`}>{count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Historical Trend */}
          <motion.div variants={itemVariants} className="bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex flex-col h-64">
            <div className="p-4 border-b border-border bg-bg-page/50">
              <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest">Historical Incident Volume (DB)</h3>
            </div>
            <div className="flex-1 p-5 flex items-end gap-3 md:gap-6 overflow-x-auto relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-text-muted text-[11px] font-bold uppercase tracking-widest animate-pulse">Loading MongoDB Analytics...</div>
                </div>
              ) : (
                years.map(([year, count], idx) => (
                  <div key={year} className="flex flex-col items-center justify-end gap-2 flex-1 h-full relative group">
                    <span className="text-[10px] font-bold text-text-muted opacity-0 group-hover:opacity-100 transition-opacity absolute -top-4">{count}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(count / maxYear) * 100}%` }}
                      transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                      className="w-full max-w-[40px] bg-info/20 hover:bg-info/40 rounded-t-sm transition-colors cursor-pointer"
                      style={{ minHeight: '4px' }}
                    />
                    <span className="text-[10px] font-bold text-text-secondary uppercase">{year}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Event Log */}
          <motion.div variants={itemVariants} className="bg-bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex flex-col h-64">
            <div className="p-4 border-b border-border bg-bg-page/50">
              <h3 className="text-[12px] font-bold text-text-main uppercase tracking-widest">Recent System Events</h3>
            </div>
            <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
              {incidents.slice(0, 15).map((inc, i) => {
                const timeStr = inc.timestamp || inc.createdAt;
                return (
                  <div key={i} className="px-4 py-3 bg-bg-surface rounded border border-transparent hover:border-border-subtle hover:bg-bg-surface-secondary transition-all flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${inc.severity >= 9 ? 'bg-emergency' : 'bg-info'}`} />
                      <div>
                        <p className="text-[12px] font-bold text-text-main">{inc.category.replace(/_/g, ' ')}</p>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5 font-medium flex items-center gap-1.5">
                          <span>{inc.city}</span>
                          <span className="w-1 h-1 bg-border rounded-full" />
                          <span>AI Conf: {(inc.aiConfidence * 100).toFixed(0)}%</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                      {timeStr ? new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
          
        </div>

      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;
