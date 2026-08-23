import axios from 'axios';
import useDemoStore from '../demo/demoStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// We determine if we are strictly in demo mode at startup based on missing critical env vars
// For simplicity in this codebase, if VITE_API_URL is missing, we assume local dev, 
// but we can look for a specific VITE_USE_DEMO_MODE flag or MONGODB presence.
// Let's use a dedicated local storage flag or env variable.
export const isSystemDemoMode = import.meta.env.VITE_FORCE_DEMO === 'true' || !import.meta.env.VITE_API_URL;

class ApiService {
  constructor() {
    this.demoStore = useDemoStore.getState();
    // Subscribe to store changes so our local reference is always fresh
    useDemoStore.subscribe((state) => {
      this.demoStore = state;
    });
  }

  // --- Helper to enforce Live vs Demo separation ---
  async execute(requestFn, demoFn) {
    if (isSystemDemoMode) {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 600));
      return demoFn();
    }

    try {
      const response = await requestFn();
      return response.data.data;
    } catch (error) {
      // If we are in Live Mode but the API fails, we DO NOT fallback to demo data.
      // We throw the error so the UI can catch it and show a Retry button.
      console.error("Live API Error:", error);
      throw new Error(error.response?.data?.message || 'Failed to connect to live operational services. Please retry.');
    }
  }

  // --- Incidents ---
  async getIncidents(token) {
    return this.execute(
      () => axios.get(`${API_URL}/incidents`, { headers: { Authorization: `Bearer ${token}` } }),
      () => {
        // Return active incidents from demo store
        return this.demoStore.incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CANCELLED');
      }
    );
  }

  async createIncident(data, token) {
    return this.execute(
      () => axios.post(`${API_URL}/incidents`, data, { headers: { Authorization: `Bearer ${token}` } }),
      () => this.demoStore.createIncident(data)
    );
  }

  // --- Ambulances ---
  async getAmbulances(token) {
    return this.execute(
      () => axios.get(`${API_URL}/ambulances`, { headers: { Authorization: `Bearer ${token}` } }),
      () => this.demoStore.ambulances
    );
  }

  // --- Hospitals ---
  async getHospitals(token) {
    return this.execute(
      () => axios.get(`${API_URL}/hospitals`, { headers: { Authorization: `Bearer ${token}` } }),
      () => this.demoStore.hospitals
    );
  }

  async assignAmbulance(incidentId, ambulanceId, token) {
    return this.execute(
      () => axios.post(`${API_URL}/dispatch/assign`, { incidentId, ambulanceId }, { headers: { Authorization: `Bearer ${token}` } }),
      () => {
        this.demoStore.assignAmbulance(incidentId, ambulanceId);
        return { success: true };
      }
    );
  }

  // --- Analytics & Historical Data ---
  async getHistoricalIncidents(filters = {}, token) {
    // Convert filters to query string
    const query = new URLSearchParams(filters).toString();
    try {
      const response = await axios.get(`${API_URL}/incidents/historical?${query}`, { headers: { Authorization: `Bearer ${token}` } });
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch backend historical data, falling back to demo", error);
      // Fallback dummy record just in case backend is completely unreachable
      return this.demoStore.historicalIncidents || [
        {
          _id: "DUMMY-123",
          incidentId: "DUMMY-123",
          city: "New Delhi",
          category: "ROAD_ACCIDENT",
          severity: 8,
          reportedAt: new Date().toISOString(),
          status: "RESOLVED",
          source: "SYNTHETIC_DEMO"
        }
      ];
    }
  }

  async getAnalytics(token) {
    try {
      const response = await axios.get(`${API_URL}/analytics/overview`, { headers: { Authorization: `Bearer ${token}` } });
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch backend analytics, falling back to demo", error);
      return this.demoStore.getAnalytics();
    }
  }

  // --- Road Conditions ---
  async getRoadConditions(token) {
    return this.execute(
      () => axios.get(`${API_URL}/roads`, { headers: { Authorization: `Bearer ${token}` } }),
      () => this.demoStore.roadConditions || []
    );
  }
}

export const apiService = new ApiService();
