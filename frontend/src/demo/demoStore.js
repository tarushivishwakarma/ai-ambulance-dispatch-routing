import { create } from 'zustand';
import { generatePanIndiaData } from './demoDataGenerator';

const { 
  incidents, 
  ambulances, 
  hospitals, 
  historicalIncidents, 
  alerts, 
  roadConditions, 
  dispatches, 
  routes 
} = generatePanIndiaData();

// Zustand Centralized Demo State
const useDemoStore = create((set, get) => ({
  incidents: incidents,
  ambulances: ambulances,
  hospitals: hospitals,
  historicalIncidents: historicalIncidents,
  alerts: alerts,
  roadConditions: roadConditions,
  dispatches: dispatches,
  routes: routes,
  notifications: [],
  simulationInterval: null,
  activeCityFilter: 'All India',
  selectedIncidentId: null,

  // --- ACTIONS ---
  setCityFilter: (city) => set({ activeCityFilter: city }),
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),

  reset: () => {
    // Stop simulation if running
    get().stopSimulation();
    const newData = generatePanIndiaData();
    set({
      incidents: newData.incidents,
      ambulances: newData.ambulances,
      hospitals: newData.hospitals,
      historicalIncidents: newData.historicalIncidents,
      alerts: newData.alerts,
      roadConditions: newData.roadConditions,
      dispatches: newData.dispatches,
      routes: newData.routes,
      notifications: [],
      activeCityFilter: 'All India'
    });
    // Restart simulation
    get().startSimulation();
  },

  createIncident: (incidentData) => {
    const newIncident = {
      ...incidentData,
      _id: `INC-IND-${Math.floor(Math.random() * 10000)}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      aiConfidence: Math.random() * (0.99 - 0.85) + 0.85,
    };
    
    set((state) => ({
      incidents: [newIncident, ...state.incidents],
      notifications: [
        { id: Date.now(), title: 'New Emergency Reported', message: newIncident.category, type: 'CRITICAL', read: false },
        ...state.notifications
      ]
    }));
    return newIncident;
  },

  updateIncidentStatus: (id, status) => {
    set((state) => ({
      incidents: state.incidents.map(inc => inc._id === id ? { ...inc, status, resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : null } : inc)
    }));
  },

  assignAmbulance: (incidentId, ambulanceId) => {
    set((state) => ({
      incidents: state.incidents.map(inc => inc._id === incidentId ? { ...inc, status: 'ASSIGNED', assignedAmbulanceId: ambulanceId } : inc),
      ambulances: state.ambulances.map(amb => amb._id === ambulanceId ? { ...amb, status: 'EN_ROUTE', currentIncident: incidentId } : amb),
      notifications: [
        { id: Date.now(), title: 'Ambulance Dispatched', message: `Ambulance ${ambulanceId} assigned to incident ${incidentId}`, type: 'INFO', read: false },
        ...state.notifications
      ]
    }));
  },

  updateAmbulanceStatus: (id, status) => {
    set((state) => {
      const amb = state.ambulances.find(a => a._id === id);
      const incidentId = amb?.currentIncident;
      
      // Cascade status to incident if applicable
      let updatedIncidents = state.incidents;
      if (incidentId && status === 'ON_SCENE') {
        updatedIncidents = updatedIncidents.map(inc => inc._id === incidentId ? { ...inc, status: 'IN_PROGRESS' } : inc);
      } else if (incidentId && status === 'AVAILABLE') {
        updatedIncidents = updatedIncidents.map(inc => inc._id === incidentId ? { ...inc, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : inc);
      }

      return {
        ambulances: state.ambulances.map(a => a._id === id ? { ...a, status, currentIncident: status === 'AVAILABLE' ? null : a.currentIncident } : a),
        incidents: updatedIncidents
      };
    });
  },
  
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },

  startSimulation: () => {
    const { simulationInterval } = get();
    if (simulationInterval) return; // Already running
    
    console.log("Starting EOC Demo Simulation...");
    const interval = setInterval(() => {
      const state = get();
      
      // Simulate ambulance movement for EN_ROUTE or TRANSPORTING
      const movingAmbulances = state.ambulances.filter(a => ['EN_ROUTE', 'TRANSPORTING'].includes(a.status));
      if (movingAmbulances.length > 0) {
        set((state) => {
          let updatedAmbulances = [...state.ambulances];
          let updatedDispatches = [...state.dispatches];
          let statusChanged = false;

          movingAmbulances.forEach(amb => {
            const idx = updatedAmbulances.findIndex(a => a._id === amb._id);
            if (idx >= 0) {
              // Find related dispatch and route
              const dispatchIdx = updatedDispatches.findIndex(d => d.ambulanceId === amb._id && d.incidentId === amb.currentIncident);
              if (dispatchIdx >= 0) {
                const dispatch = updatedDispatches[dispatchIdx];
                const route = state.routes.find(r => r._id === dispatch.routeId);
                
                if (route && route.geometry && route.geometry.coordinates.length > 0) {
                  const coords = route.geometry.coordinates;
                  
                  // Initialize or increment progress
                  let progress = amb.routeProgress || 0;
                  progress += 0.05; // 5% progress per tick
                  
                  if (progress >= 1) {
                    // Reached destination
                    progress = 1;
                    const finalCoord = coords[coords.length - 1];
                    updatedAmbulances[idx] = { 
                      ...updatedAmbulances[idx], 
                      location: { type: 'Point', coordinates: finalCoord },
                      routeProgress: 0,
                      speed: 0
                    };
                    
                    // Update status lifecycle
                    if (amb.status === 'EN_ROUTE') {
                      updatedAmbulances[idx].status = 'ON_SCENE';
                    } else if (amb.status === 'TRANSPORTING') {
                      updatedAmbulances[idx].status = 'AVAILABLE';
                      updatedAmbulances[idx].currentIncident = null;
                    }
                    statusChanged = true;
                  } else {
                    // Interpolate along route
                    const totalSegments = coords.length - 1;
                    const scaledProgress = progress * totalSegments;
                    const segmentIndex = Math.floor(scaledProgress);
                    const segmentProgress = scaledProgress - segmentIndex;
                    
                    const p1 = coords[segmentIndex];
                    const p2 = coords[Math.min(segmentIndex + 1, coords.length - 1)];
                    
                    const newLng = p1[0] + (p2[0] - p1[0]) * segmentProgress;
                    const newLat = p1[1] + (p2[1] - p1[1]) * segmentProgress;
                    
                    updatedAmbulances[idx] = { 
                      ...updatedAmbulances[idx], 
                      location: { type: 'Point', coordinates: [newLng, newLat] },
                      routeProgress: progress,
                      speed: Math.floor(Math.random() * 20) + 40, // 40-60 km/h
                      lastUpdated: new Date().toISOString()
                    };

                    // Update ETA on dispatch
                    updatedDispatches[dispatchIdx] = {
                      ...dispatch,
                      eta: Math.max(1, Math.floor(dispatch.eta - (dispatch.eta * 0.05)))
                    };
                  }
                }
              }
            }
          });
          
          return { ambulances: updatedAmbulances, dispatches: updatedDispatches };
        });
      }

    }, 3000); // Fast 3-second tick for noticeable movement

    set({ simulationInterval: interval });
  },

  stopSimulation: () => {
    const { simulationInterval } = get();
    if (simulationInterval) {
      clearInterval(simulationInterval);
      set({ simulationInterval: null });
    }
  },

  // Derived Analytics Getter
  getAnalytics: () => {
    const state = get();
    let filteredInc = state.incidents;
    let filteredAmb = state.ambulances;

    if (state.activeCityFilter && state.activeCityFilter !== 'All India') {
      filteredInc = filteredInc.filter(i => i.city === state.activeCityFilter);
      filteredAmb = filteredAmb.filter(a => a.city === state.activeCityFilter);
    }

    const active = filteredInc.filter(i => i.status !== 'RESOLVED' && i.status !== 'CANCELLED');
    const resolvedToday = filteredInc.filter(i => i.status === 'RESOLVED').length;
    const critical = filteredInc.filter(i => i.severity >= 9 && i.status !== 'RESOLVED');
    const availableAmbs = filteredAmb.filter(a => a.status === 'AVAILABLE').length;
    
    return {
      activeIncidents: active.length,
      criticalIncidents: critical.length,
      resolvedToday,
      availableAmbulances: availableAmbs,
      totalAmbulances: filteredAmb.length,
      aiVerifiedRate: 94 // Fixed for demo aesthetic
    };
  }
}));

// Start the simulation immediately
useDemoStore.getState().startSimulation();

export default useDemoStore;
