import React, { useEffect, useState, useMemo } from 'react';
import { Activity, Clock, ShieldAlert, Truck, BarChart2, TrendingUp, CheckCircle2 } from 'lucide-react';
import useDemoStore from '../demo/demoStore';
import { apiService } from '../services/apiService';

const AnalyticsDashboard = () => {
  const [dbHistorical, setDbHistorical] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getIncidents().then(data => {
      const historical = data.filter(i => i.status === 'RESOLVED' || i.source === 'SYNTHETIC_DEMO');
      setDbHistorical(historical);
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
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
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

  return (
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-primary-800/60 backdrop-blur-md p-3 rounded-lg border border-primary-700/50 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-info/20 text-info p-2 rounded border border-info/30">
            <BarChart2 size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-main tracking-tight uppercase">System Analytics</h1>
            <p className="text-xs text-text-muted font-bold tracking-wider uppercase">Live Operational Performance Metrics</p>
          </div>
        </div>
        <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
          {incidents.length} incidents · {ambulances.length} units · {hospitals.length} hospitals · {dbHistorical.length} historical
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Incidents', val: activeIncidents.length, icon: ShieldAlert, color: 'text-warning', sub: `${criticalIncidents.length} critical` },
          { label: 'Fleet Utilization', val: `${fleetUtil}%`, icon: Truck, color: 'text-info', sub: `${availableAmb.length} standby` },
          { label: 'Critical Events', val: criticalIncidents.length, icon: Activity, color: 'text-emergency', sub: 'SEV 9+ tracking' },
          { label: 'Avg Response Time', val: '8:24', icon: Clock, color: 'text-operational', sub: 'Within KPI target' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-primary-800/60 border border-primary-700/50 p-4 rounded-lg shadow-xl relative overflow-hidden">
            <div className="absolute top-3 right-3 opacity-10">
              <kpi.icon size={44} />
            </div>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">{kpi.label}</p>
            <h3 className={`text-3xl font-black mb-1.5 ${kpi.color}`}>{kpi.val}</h3>
            <div className={`text-[10px] font-bold uppercase tracking-wider ${kpi.color} flex items-center gap-1`}>
              <CheckCircle2 size={10} /> {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Regional Density */}
        <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg shadow-xl overflow-hidden">
          <div className="p-3 border-b border-primary-700/50 bg-primary-900/80">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Regional Incident Density</h3>
          </div>
          <div className="p-4 space-y-3">
            {topRegions.map(([city, count]) => (
              <div key={city} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-text-muted truncate max-w-[100px]">{city}</span>
                  <span className="text-text-main">{count}</span>
                </div>
                <div className="h-2 w-full bg-primary-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-info rounded-full transition-all duration-1000"
                    style={{ width: `${(count / maxRegionCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg shadow-xl overflow-hidden">
          <div className="p-3 border-b border-primary-700/50 bg-primary-900/80">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Incident Categories</h3>
          </div>
          <div className="p-4 space-y-3">
            {topCategories.map(([cat, count]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-text-muted truncate max-w-[120px]">{cat}</span>
                  <span className="text-text-main">{count}</span>
                </div>
                <div className="h-2 w-full bg-primary-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emergency rounded-full transition-all duration-1000"
                    style={{ width: `${(count / maxCatCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity + Fleet Status */}
        <div className="flex flex-col gap-4">
          <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg shadow-xl overflow-hidden">
            <div className="p-3 border-b border-primary-700/50 bg-primary-900/80">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Severity Distribution</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Critical (9-10)', val: sevCounts.CRITICAL, color: 'bg-emergency', textColor: 'text-emergency' },
                { label: 'High (7-8)', val: sevCounts.HIGH, color: 'bg-warning', textColor: 'text-warning' },
                { label: 'Moderate (<7)', val: sevCounts.MODERATE, color: 'bg-info', textColor: 'text-info' },
              ].map(s => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className={s.textColor}>{s.label}</span>
                    <span className="text-text-main">{s.val}</span>
                  </div>
                  <div className="h-2 w-full bg-primary-900 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all duration-1000`} style={{ width: `${(s.val / incidents.length) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg shadow-xl overflow-hidden">
            <div className="p-3 border-b border-primary-700/50 bg-primary-900/80">
              <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Fleet Status</h3>
            </div>
            <div className="p-4 space-y-2">
              {Object.entries(ambStatusCounts).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-text-muted uppercase tracking-wider">{status.replace('_', ' ')}</span>
                  <span className={`${
                    status === 'AVAILABLE' ? 'text-operational' :
                    status === 'EN_ROUTE' ? 'text-warning' :
                    status === 'ON_SCENE' ? 'text-emergency' :
                    'text-info'
                  }`}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trend */}
      <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg shadow-xl overflow-hidden">
        <div className="p-3 border-b border-primary-700/50 bg-primary-900/80">
          <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Historical Incidents by Year ({dbHistorical.length} records)</h3>
        </div>
        <div className="p-4 flex items-end gap-4 h-32">
          {loading ? (
            <div className="w-full text-center text-text-muted text-xs font-bold uppercase tracking-widest animate-pulse">Loading MongoDB Analytics...</div>
          ) : (
            years.map(([year, count]) => (
              <div key={year} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[10px] font-bold text-text-muted">{count}</span>
                <div
                  className="w-full bg-info/60 rounded-t transition-all duration-1000"
                  style={{ height: `${(count / maxYear) * 64}px`, minHeight: '4px' }}
                />
                <span className="text-[9px] font-bold text-text-muted uppercase">{year}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Event Log */}
      <div className="bg-primary-800/60 border border-primary-700/50 rounded-lg shadow-xl overflow-hidden">
        <div className="p-3 border-b border-primary-700/50 bg-primary-900/80">
          <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Recent System Events</h3>
        </div>
        <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
          {incidents.slice(0, 20).map((inc, i) => {
            const timeStr = inc.timestamp || inc.createdAt;
            return (
              <div key={i} className="px-3 py-2 bg-primary-900/40 rounded border border-primary-700/30 flex justify-between items-center hover:bg-primary-900/60 transition-colors">
                <div className="flex items-center gap-3">
                  <Activity size={11} className={inc.severity >= 9 ? 'text-emergency' : 'text-info'} />
                  <div>
                    <p className="text-xs font-bold text-text-main">{inc.category.replace(/_/g, ' ')} in {inc.city}</p>
                    <p className="text-[9px] text-text-muted uppercase tracking-widest mt-0.5">AI Confidence: {(inc.aiConfidence * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">
                  {timeStr ? new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
