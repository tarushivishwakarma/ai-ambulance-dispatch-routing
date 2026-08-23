import { useState } from 'react';
import useDemoStore from '../demo/demoStore';
import { isSystemDemoMode } from '../services/apiService';

const DriverDashboard = () => {
  const { ambulances, updateAmbulanceStatus, incidents } = useDemoStore();
  // Simulate logged in driver viewing their specific ambulance
  const myAmbulanceId = 'AMB-DEMO-101'; 
  const ambulance = ambulances.find(a => a._id === myAmbulanceId);
  const activeIncident = incidents.find(i => i._id === ambulance?.currentIncident);

  if (!ambulance) return <div className="p-8 text-center">Ambulance profile not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="bg-primary-800 border border-primary-700 rounded-lg p-6 shadow-xl text-center">
        <h1 className="text-2xl font-bold text-text-main mb-2">Ambulance {ambulance.registrationNumber}</h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-900 border border-primary-600 rounded-full text-xs font-bold uppercase text-info">
          Status: {ambulance.status.replace('_', ' ')}
        </div>
      </div>

      {activeIncident ? (
        <div className="bg-primary-800 border border-primary-700 rounded-lg p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-primary-700 pb-4">
            <h2 className="text-xl font-bold text-emergency flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emergency animate-pulse"></span>
              Active Emergency Dispatch
            </h2>
            <span className="text-sm font-medium text-text-muted">ID: {activeIncident._id}</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Destination</p>
              <p className="text-lg font-semibold text-text-main">{activeIncident.address}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-primary-900 rounded border border-primary-700">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Category</p>
                <p className="text-sm font-bold text-text-main">{activeIncident.category}</p>
              </div>
              <div className="p-3 bg-primary-900 rounded border border-primary-700">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Severity</p>
                <p className={`text-sm font-bold ${activeIncident.severity >= 8 ? 'text-emergency' : 'text-warning'}`}>{activeIncident.severity}/10</p>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-700 pt-6">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-3 text-center">Update Dispatch Status</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                onClick={() => updateAmbulanceStatus(ambulance._id, 'EN_ROUTE')}
                className={`py-3 rounded-md font-bold text-sm uppercase transition-all ${ambulance.status === 'EN_ROUTE' ? 'bg-info text-text-main' : 'bg-primary-900 text-info border border-info hover:bg-info/10'}`}
              >
                En Route
              </button>
              <button 
                onClick={() => updateAmbulanceStatus(ambulance._id, 'ON_SCENE')}
                className={`py-3 rounded-md font-bold text-sm uppercase transition-all ${ambulance.status === 'ON_SCENE' ? 'bg-warning text-text-main' : 'bg-primary-900 text-warning border border-warning hover:bg-warning/10'}`}
              >
                On Scene
              </button>
              <button 
                onClick={() => {
                  updateAmbulanceStatus(ambulance._id, 'AVAILABLE');
                  useDemoStore.getState().updateIncidentStatus(activeIncident._id, 'RESOLVED');
                }}
                className="py-3 rounded-md font-bold text-sm uppercase bg-primary-900 text-operational border border-operational hover:bg-operational/10 transition-all"
              >
                Resolve & Clear
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-primary-800 border border-primary-700 rounded-lg p-10 text-center shadow-xl">
          <div className="w-16 h-16 mx-auto bg-primary-900 rounded-full flex items-center justify-center mb-4 border border-primary-700">
            <span className="w-3 h-3 bg-operational rounded-full animate-pulse"></span>
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2">Standing By</h2>
          <p className="text-sm text-text-muted max-w-md mx-auto">You have no active dispatch assignments. Keep your device online and wait for central command.</p>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
