import { create } from 'zustand';
import axios from 'axios';
import { socketService } from '../services/socket';
import useDemoStore from '../demo/demoStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    // Always bypass for the demo login email, or if forced by env vars
    const isSystemDemoMode = email === 'dispatcher@operations.local' || import.meta.env.VITE_FORCE_DEMO === 'true' || !import.meta.env.VITE_API_URL;
    
    if (isSystemDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUser = {
        id: 'OP-1004',
        name: 'Demo Operator',
        email: email || 'dispatcher@operations.local',
        role: email.toLowerCase().includes('driver') ? 'DRIVER' : 'DISPATCHER',
        token: 'demo-jwt-token-xyz'
      };
      localStorage.setItem('token', mockUser.token);
      set({ user: mockUser, token: mockUser.token, isLoading: false });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { data } = response.data;
      localStorage.setItem('token', data.token);
      set({ user: data, token: data.token, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { data } = response.data;
      localStorage.setItem('token', data.token);
      set({ user: data, token: data.token, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    set({ user: null, token: null, error: null });
    
    // Reset demo store if it exists
    if (useDemoStore.getState && useDemoStore.getState().reset) {
      useDemoStore.getState().reset();
    }
    
    socketService.disconnect();
  },

  fetchCurrentUser: async () => {
    const { token } = get();
    if (!token) return;
    
    const isSystemDemoMode = import.meta.env.VITE_FORCE_DEMO === 'true' || !import.meta.env.VITE_API_URL;
    if (isSystemDemoMode && token === 'demo-jwt-token-xyz') {
      set({ user: { id: 'OP-1004', name: 'Demo Operator', email: 'dispatcher@operations.local', role: 'DISPATCHER' } });
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch user', error);
      if (error.response?.status === 401) {
        get().logout();
      }
      set({ isLoading: false, error: 'Failed to authenticate session' });
    }
  }
}));

export default useAuthStore;
