import React from 'react';
import { Truck, Navigation } from 'lucide-react';

const DriverRoute = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-text-main flex items-center gap-2"><Navigation size={20} className="text-info" /> Active Navigation</h1>
        <p className="text-sm text-text-muted mt-1">Live routing to incident scene.</p>
      </header>

      <div className="flex-1 bg-primary-800/30 border border-primary-700/50 rounded-lg flex items-center justify-center flex-col text-center p-8">
        <Truck size={48} className="text-primary-600 mb-4" />
        <h2 className="text-lg font-bold text-text-main mb-2">No Active Assignment</h2>
        <p className="text-sm text-text-muted max-w-md">You are currently on standby. Navigation will activate automatically when Dispatch assigns you an incident.</p>
      </div>
    </div>
  );
};

export default DriverRoute;
