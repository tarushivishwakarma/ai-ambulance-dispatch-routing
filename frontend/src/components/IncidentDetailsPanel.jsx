import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, AlertTriangle, BrainCircuit, Activity, Truck, CheckCircle, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService, BASE_URL } from '../services/apiService';
import useAuthStore from '../stores/authStore';

const TimelineStep = ({ title, time, active, isLast, icon: Icon, completed }) => (
  <div className="relative flex gap-4 pb-6">
    {!isLast && (
      <div className={`absolute left-[13px] top-8 bottom-0 w-[1px] ${completed ? 'bg-operational' : 'bg-border'}`} />
    )}
    <div className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full border bg-bg-surface ${
      completed ? 'text-operational border-operational' :
      active ? 'text-info border-info animate-pulse' :
      'text-text-disabled border-border'
    }`}>
      <Icon size={12} />
    </div>
    <div className="pt-1">
      <h4 className={`text-[11px] font-bold uppercase tracking-widest ${completed ? 'text-text-main' : active ? 'text-info' : 'text-text-muted'}`}>{title}</h4>
      {time ? (
        <span className="text-[10px] text-text-muted font-mono mt-1 block tracking-wider">
          {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ) : (
        <span className="text-[10px] text-text-disabled font-mono mt-1 block tracking-wider">--:--</span>
      )}
    </div>
  </div>
);

const IncidentDetailsPanel = ({ incident, onClose }) => {
  const token = useAuthStore(state => state.token);
  const [assignMode, setAssignMode] = useState(false);
  const [ambulances, setAmbulances] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState('');
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (assignMode && ambulances.length === 0) {
      apiService.getAmbulances(token).then(data => setAmbulances(data || []));
    }
  }, [assignMode, token, ambulances.length]);

  const handleAssign = async () => {
    if (!selectedAmbulance) return;
    setLoading(true);
    try {
      const incidentId = incident._id || incident.id;
      if (!incidentId) throw new Error("Incident ID missing");
      await apiService.assignAmbulance(incidentId, selectedAmbulance, token);
      alert("Ambulance assigned successfully.");
      setAssignMode(false);
      // Wait a moment before UI re-syncs
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('authorized')) {
        alert("Session authentication failed. Please sign in again.");
      } else {
        alert("Unable to assign ambulance. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    setResolving(true);
    try {
      const incidentId = incident._id || incident.id;
      if (!incidentId) throw new Error("Incident ID missing");
      await apiService.updateIncidentStatus(incidentId, 'RESOLVED', token);
      alert("Incident resolved successfully.");
      onClose(); // Close on success
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('authorized')) {
        alert("Session authentication failed. Please sign in again.");
      } else {
        alert("Unable to resolve incident. Please try again.");
      }
    } finally {
      setResolving(false);
    }
  };

  if (!incident) return null;

  const getStatusIndex = () => {
    switch(incident.status) {
      case 'PENDING': return 0;
      case 'ACTIVE': return 1;
      case 'ASSIGNED': return 2;
      case 'EN_ROUTE': return 2;
      case 'ON_SCENE': return 3;
      case 'TRANSPORTING': return 3;
      case 'RESOLVED': return 4;
      default: return 0;
    }
  };

  const statusIdx = getStatusIndex();
  
  const reportedTime = incident.reportedAt || incident.createdAt || incident.timestamp;
  const verifiedTime = incident.aiAnalysis ? new Date(new Date(reportedTime).getTime() + 5000) : null;
  const dispatchTime = incident.dispatchTime;
  const arrivedTime = incident.arrivedOnSceneTime;
  const resolvedTime = incident.resolvedAt;

  return (
    <AnimatePresence>
      {/* Backdrop overlay - click to close */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[99]"
        onClick={onClose}
      />
      <motion.div 
        key="panel"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 right-0 w-[420px] max-w-[100vw] bg-bg-surface border-l border-border shadow-[0_0_40px_rgba(0,0,0,0.05)] z-[100] flex flex-col"
      >
        {/* Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-bg-page/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded ${incident.severity >= 9 ? 'bg-emergency/10 text-emergency' : 'bg-warning/10 text-warning'}`}>
              <ShieldAlert size={14} />
            </div>
            <span className="text-[11px] font-bold text-text-main uppercase tracking-widest">Incident Record</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-surface-secondary rounded-full text-text-muted hover:text-text-main transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Main Info */}
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-text-disabled uppercase tracking-widest font-mono">ID: {incident.incidentId || incident._id}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border ${
                incident.status === 'RESOLVED' ? 'bg-operational/10 text-operational border-operational/30' :
                'bg-emergency/10 text-emergency border-emergency/30'
              }`}>
                {incident.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-[22px] font-black text-text-main leading-tight mb-2 tracking-tight">{incident.category.replace(/_/g, ' ')}</h2>
            <div className="flex items-center gap-1.5 text-[12px] text-text-secondary mt-3">
              <MapPin size={14} className="text-text-muted" /> 
              {incident.address || `${incident.city}, ${incident.state || 'India'}`}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-page border border-border rounded p-4">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Severity</span>
              <span className={`text-2xl font-black ${incident.severity >= 9 ? 'text-emergency' : incident.severity >= 7 ? 'text-warning' : 'text-info'}`}>
                {incident.severity}<span className="text-sm text-text-disabled">/10</span>
              </span>
            </div>
            <div className="bg-bg-page border border-border rounded p-4">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Affected</span>
              <span className="text-2xl font-black text-text-main">{incident.affectedPeople || 'Unk'}</span>
            </div>
          </div>

          {/* AI Analysis */}
          {incident.aiAnalysis && (
            <div className="bg-info/5 border border-info/20 rounded p-4 space-y-3">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-[10px] font-bold text-info uppercase tracking-widest flex items-center gap-1.5">
                  <BrainCircuit size={12} /> AI Assessment
                </h3>
                <span className="text-[10px] font-bold text-info border border-info/20 px-1.5 py-0.5 rounded uppercase">
                  {(incident.aiConfidence * 100).toFixed(0)}% Conf
                </span>
              </div>
              <p className="text-[12px] text-text-main leading-relaxed italic font-medium">
                "{incident.description || 'Medical emergency reported. AI has verified details and suggested dispatch.'}"
              </p>
            </div>
          )}

          {/* Evidence */}
          {incident.media && incident.media.length > 0 && (
            <div className="bg-bg-page border border-border rounded p-4 space-y-3">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                <ImageIcon size={12} /> Reported Evidence
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {incident.media.map((img, idx) => (
                  <a 
                    key={idx} 
                    href={`${BASE_URL}${img}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block shrink-0 w-24 h-24 rounded border border-border overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src={`${BASE_URL}${img}`} 
                      alt={`Evidence ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-6 pb-2 border-b border-border">Operational Timeline</h3>
            <div className="px-2">
              <TimelineStep 
                title="Emergency Reported" 
                time={reportedTime} 
                completed={statusIdx >= 0} 
                active={statusIdx === 0}
                icon={AlertTriangle} 
              />
              <TimelineStep 
                title="AI Verified" 
                time={verifiedTime || (statusIdx >= 1 ? reportedTime : null)} 
                completed={statusIdx >= 1} 
                active={statusIdx === 1}
                icon={BrainCircuit} 
              />
              <TimelineStep 
                title="Dispatch Assigned" 
                time={dispatchTime || (statusIdx >= 2 ? reportedTime : null)} 
                completed={statusIdx >= 2} 
                active={statusIdx === 2}
                icon={Activity} 
              />
              <TimelineStep 
                title="Arrived On Scene" 
                time={arrivedTime || (statusIdx >= 3 ? reportedTime : null)} 
                completed={statusIdx >= 3} 
                active={statusIdx === 3}
                icon={Truck} 
              />
              <TimelineStep 
                title="Incident Resolved" 
                time={resolvedTime || (statusIdx >= 4 ? reportedTime : null)} 
                completed={statusIdx >= 4} 
                active={statusIdx === 4}
                icon={CheckCircle} 
                isLast={true} 
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            {assignMode ? (
              <div className="flex flex-col gap-2 p-3 bg-bg-surface-secondary border border-border rounded">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Select Available Unit</span>
                <select 
                  className="bg-bg-page border border-border text-text-main text-xs p-2 rounded outline-none focus:border-info"
                  value={selectedAmbulance}
                  onChange={(e) => setSelectedAmbulance(e.target.value)}
                >
                  <option value="">-- Choose Unit --</option>
                  {ambulances.filter(a => a.status === 'AVAILABLE').map(a => (
                    <option key={a._id || a.id} value={a._id || a.id}>{a.ambulanceId} — {a.status} — {a.capability || a.type}</option>
                  ))}
                </select>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => setAssignMode(false)}
                    className="flex-1 py-1.5 bg-bg-page hover:bg-border transition-colors border border-border rounded text-[10px] font-bold text-text-main uppercase"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAssign}
                    disabled={!selectedAmbulance || loading}
                    className="flex-1 py-1.5 bg-info hover:bg-info/80 transition-colors text-black rounded text-[10px] font-bold uppercase disabled:opacity-50"
                  >
                    {loading ? 'Assigning...' : 'Confirm'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setAssignMode(true)}
                  disabled={statusIdx >= 2} // Disabled if already assigned or further
                  className="flex-1 py-2.5 bg-bg-surface-secondary hover:bg-border transition-colors border border-border rounded text-[11px] font-bold text-text-main uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {statusIdx >= 2 ? 'Dispatched' : 'Assign Manual'}
                </button>
                <button 
                  onClick={handleResolve}
                  disabled={statusIdx >= 4 || resolving}
                  className="flex-1 py-2.5 bg-text-main hover:bg-black transition-colors text-white rounded text-[11px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {resolving ? 'Resolving...' : (statusIdx >= 4 ? 'Resolved' : 'Resolve')}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IncidentDetailsPanel;
