import React from 'react';
import { Settings, User, Shield } from 'lucide-react';
import useAuthStore from '../stores/authStore';

const SettingsView = () => {
  const user = useAuthStore(state => state.user);

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col space-y-8">
      <header>
        <h1 className="text-xl font-bold text-text-main flex items-center gap-2"><Settings size={20} className="text-info" /> System Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage session preferences and environment configuration.</p>
      </header>

      <div className="bg-primary-800 border border-primary-700 rounded-lg p-6 space-y-6 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-text-main flex items-center gap-2 mb-4"><User size={16} /> Operator Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">Operator ID</label>
              <div className="bg-primary-900 border border-primary-700 px-3 py-2 rounded text-sm text-text-main">{user?.id || 'OP-1004'}</div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">Assigned Role</label>
              <div className="bg-primary-900 border border-primary-700 px-3 py-2 rounded text-sm text-info font-bold">{user?.role || 'DISPATCHER'}</div>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-primary-700">
          <h2 className="text-sm font-bold text-text-main flex items-center gap-2 mb-4"><Shield size={16} /> Connection Security</h2>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-operational animate-pulse"></div>
             <span className="text-sm text-text-main">JWT Session Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
