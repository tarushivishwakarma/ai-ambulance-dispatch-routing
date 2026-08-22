import { X, Clock, MapPin, AlertTriangle, BrainCircuit, Activity, Truck, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TimelineStep = ({ title, time, active, isLast, icon: Icon, completed }) => (
  <div className="relative flex gap-4 pb-6">
    {!isLast && (
      <div className={`absolute left-3.5 top-8 bottom-0 w-[2px] ${completed ? 'bg-operational' : 'bg-primary-700/50'}`} />
    )}
    <div className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full border-2 ${
      completed ? 'bg-operational text-white border-operational' :
      active ? 'bg-info/20 text-info border-info animate-pulse' :
      'bg-primary-800 text-text-muted border-primary-700'
    }`}>
      <Icon size={12} />
    </div>
    <div className="pt-1">
      <h4 className={`text-xs font-bold uppercase tracking-wider ${completed ? 'text-operational' : active ? 'text-info' : 'text-text-muted'}`}>{title}</h4>
      {time ? (
        <span className="text-[10px] text-text-muted font-mono mt-0.5 block">
          {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ) : (
        <span className="text-[10px] text-primary-500 font-mono mt-0.5 block">--:--</span>
      )}
    </div>
  </div>
);

const IncidentDetailsPanel = ({ incident, onClose }) => {
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
  
  // Try to use timestamps from historical data, fallback to createdAt for reportedAt
  const reportedTime = incident.reportedAt || incident.createdAt || incident.timestamp;
  const verifiedTime = incident.aiAnalysis ? new Date(new Date(reportedTime).getTime() + 5000) : null;
  const dispatchTime = incident.dispatchTime;
  const arrivedTime = incident.arrivedOnSceneTime;
  const resolvedTime = incident.resolvedAt;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-[400px] bg-primary-800 border-l border-primary-700 shadow-2xl z-[100] flex flex-col"
      >
        {/* Header */}
        <div className="h-16 border-b border-primary-700 flex items-center justify-between px-5 bg-primary-800">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className={incident.severity >= 9 ? 'text-emergency' : 'text-warning'} />
            <span className="text-xs font-bold text-text-main uppercase tracking-widest">Incident Details</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary-600 rounded-full text-text-muted hover:text-text-main transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Main Info */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{incident.incidentId || incident._id}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border uppercase ${
                  incident.status === 'RESOLVED' ? 'bg-operational/10 text-operational border-operational/30' :
                  'bg-emergency/10 text-emergency border-emergency/30'
                }`}>
                  {incident.status.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-xl font-black text-text-main">{incident.category.replace(/_/g, ' ')}</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted mt-2">
                <MapPin size={12} /> {incident.address || `${incident.city}, ${incident.state || 'India'}`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary-800 border border-primary-700 rounded p-3">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block mb-1">Severity</span>
                <span className={`text-lg font-black ${incident.severity >= 9 ? 'text-emergency' : incident.severity >= 7 ? 'text-warning' : 'text-info'}`}>
                  {incident.severity}/10
                </span>
              </div>
              <div className="bg-primary-800 border border-primary-700 rounded p-3 shadow-sm">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest block mb-1">Affected</span>
                <span className="text-lg font-black text-text-main">{incident.affectedPeople || 'Unknown'}</span>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          {incident.aiAnalysis && (
            <div className="bg-info/10 border border-info/30 rounded-lg p-4 space-y-2">
              <h3 className="text-[10px] font-bold text-info uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <BrainCircuit size={12} /> AI Assessment
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed italic border-l-2 border-info/40 pl-3">
                "{incident.description || 'Medical emergency reported. AI has verified details and suggested dispatch.'}"
              </p>
              <div className="pt-2 flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span className="uppercase">Confidence</span>
                <span className="text-info">{incident.aiConfidence ? `${(incident.aiConfidence*100).toFixed(0)}%` : 'HIGH'}</span>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider mb-4 border-b border-primary-700/50 pb-2">Operational Timeline</h3>
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

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IncidentDetailsPanel;
