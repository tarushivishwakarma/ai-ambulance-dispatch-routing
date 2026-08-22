import { create } from 'zustand';
import axios from 'axios';
import { socketService } from '../services/socket';
import useAuthStore from './authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useIncidentStore = create((set, get) => ({
  incidents: [],
  isLoading: false,
  error: null,
  isSocketConnected: false,

  fetchIncidents: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get(`${API_URL}/incidents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ incidents: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  initSocket: () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const socket = socketService.connect(token);
    set({ isSocketConnected: true });

    // Listen to real-time events
    socket.on('incident:created', (newIncident) => {
      set((state) => ({
        incidents: [newIncident, ...state.incidents]
      }));
    });

    socket.on('incident:status', (updatedIncident) => {
      set((state) => ({
        incidents: state.incidents.map(inc => 
          inc._id === updatedIncident._id ? updatedIncident : inc
        )
      }));
    });
  },

  cleanupSocket: () => {
    socketService.disconnect();
    set({ isSocketConnected: false });
  }
}));

export default useIncidentStore;
