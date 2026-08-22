import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { FileText, Download } from 'lucide-react';

const ReportsView = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getIncidents().then(data => {
      setIncidents(data.filter(i => i.status === 'RESOLVED' || i.status === 'CANCELLED'));
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 h-full flex flex-col">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-text-main flex items-center gap-2"><FileText size={20} className="text-info" /> Operational Reports</h1>
          <p className="text-sm text-text-muted mt-1">Historical log of resolved and cancelled emergencies.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-800 border border-primary-700 hover:border-info rounded text-sm font-bold text-text-main transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </header>

      <div className="flex-1 overflow-auto bg-primary-800/30 border border-primary-700/50 rounded-lg">
        {loading ? (
          <div className="p-8 text-text-muted">Loading historical reports...</div>
        ) : incidents.length === 0 ? (
          <div className="p-8 text-text-muted">No resolved incidents available for reporting.</div>
        ) : (
          <table className="w-full text-left text-sm text-text-main">
            <thead className="bg-primary-800/80 border-b border-primary-700 text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-4 py-3 font-bold">Time</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Location</th>
                <th className="px-4 py-3 font-bold">Severity</th>
                <th className="px-4 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-700/50">
              {incidents.map(inc => (
                <tr key={inc._id} className="hover:bg-primary-800/50 transition-colors">
                  <td className="px-4 py-3 text-text-muted">{new Date(inc.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">{inc.category}</td>
                  <td className="px-4 py-3 truncate max-w-xs">{inc.address}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-primary-700 border border-primary-600 rounded text-[10px] uppercase font-bold">{inc.severity}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{inc.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
