import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Activity, Clock, ShieldAlert, Truck, BarChart2, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import useDemoStore from '../demo/demoStore';

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Directly access demo store for chart data
  const incidents = useDemoStore(state => state.incidents);
  const ambulances = useDemoStore(state => state.ambulances);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiService.getAnalytics();
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-text-muted">Loading analytics data...</div>;
  if (!data) return <div className="p-8 text-text-muted">No operational data yet.</div>;

  // Calculate distributions for charts
  const regionalIncidents = incidents.reduce((acc, inc) => {
    acc[inc.city] = (acc[inc.city] || 0) + 1;
    return acc;
  }, {});
  
  const topRegions = Object.entries(regionalIncidents)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const categoryCounts = incidents.reduce((acc, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + 1;
    return acc;
  }, {});

  const maxRegionCount = topRegions.length > 0 ? topRegions[0][1] : 1;

  return (
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-primary-900/80 backdrop-blur-md p-3 rounded-lg border border-primary-700/50 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-info/20 text-info p-2 rounded border border-info/30">
            <BarChart2 size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-main tracking-tight uppercase">System Analytics</h1>
            <p className="text-xs text-text-muted font-bold tracking-wider uppercase">Live Operational Performance Metrics</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 p-4 rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20"><ShieldAlert size={48} /></div>
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Active Incidents</p>
          <h3 className="text-3xl font-bold text-text-main mb-2">{data.activeIncidents}</h3>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emergency uppercase tracking-wider bg-emergency/10 px-2 py-0.5 rounded border border-emergency/20 w-max">
            <TrendingUp size={10} /> +12% vs last hour
          </div>
        </div>
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 p-4 rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20"><Truck size={48} /></div>
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Fleet Utilization</p>
          <h3 className="text-3xl font-bold text-text-main mb-2">{(100 - (data.availableAmbulances / data.totalAmbulances) * 100).toFixed(1)}%</h3>
          <div className="flex items-center gap-1 text-[10px] font-bold text-operational uppercase tracking-wider bg-operational/10 px-2 py-0.5 rounded border border-operational/20 w-max">
            {data.availableAmbulances} Units Standby
          </div>
        </div>
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 p-4 rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20"><Activity size={48} /></div>
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Critical Events</p>
          <h3 className="text-3xl font-bold text-text-main mb-2">{data.criticalIncidents}</h3>
          <div className="flex items-center gap-1 text-[10px] font-bold text-warning uppercase tracking-wider bg-warning/10 px-2 py-0.5 rounded border border-warning/20 w-max">
            SEV 9+ Tracking
          </div>
        </div>
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 p-4 rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20"><Clock size={48} /></div>
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Avg Response Time</p>
          <h3 className="text-3xl font-bold text-text-main mb-2">08:24</h3>
          <div className="flex items-center gap-1 text-[10px] font-bold text-info uppercase tracking-wider bg-info/10 px-2 py-0.5 rounded border border-info/20 w-max">
            <CheckCircle2 size={10} /> Within KPI target
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* CHARTS */}
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg shadow-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-primary-700/50 bg-primary-900/80">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">Regional Incident Density</h3>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {topRegions.map(([city, count]) => (
              <div key={city} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-text-muted">{city}</span>
                  <span className="text-text-main">{count} Events</span>
                </div>
                <div className="h-2 w-full bg-primary-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-info rounded-full transition-all duration-1000"
                    style={{ width: `${(count / maxRegionCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGS */}
        <div className="bg-primary-800/60 backdrop-blur-md border border-primary-700/50 rounded-lg shadow-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-primary-700/50 bg-primary-900/80">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">System Event Log</h3>
          </div>
          <div className="flex-1 p-2 overflow-y-auto space-y-1">
            {incidents.slice(0, 15).map((inc, i) => (
              <div key={i} className="px-3 py-2 bg-primary-900/40 rounded border border-primary-700/30 flex justify-between items-center hover:bg-primary-900/60 transition-colors">
                <div className="flex items-center gap-3">
                  <Activity size={12} className={inc.severity >= 9 ? 'text-emergency' : 'text-info'} />
                  <div>
                    <p className="text-xs font-bold text-text-main">{inc.category.replace('_', ' ')} detected in {inc.city}</p>
                    <p className="text-[9px] text-text-muted uppercase tracking-widest mt-0.5">AI Confidence: {(inc.aiConfidence * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
