import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Truck, Hospital, Activity, Settings, LogOut, Navigation, FileText, Database, Radio, Server } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import { isSystemDemoMode } from '../services/apiService';

const SystemStatusIndicator = ({ label, status, icon: Icon }) => (
  <div className="flex items-center justify-between py-1.5">
    <div className="flex items-center gap-2 text-text-muted">
      <Icon size={14} />
      <span className="text-xs">{label}</span>
    </div>
    <span className={`text-xs font-semibold ${
      status === 'Connected' || status === 'Active' ? 'text-operational' : 
      status.includes('Demo') ? 'text-warning' : 'text-emergency'
    }`}>
      {status}
    </span>
  </div>
);

const DashboardLayout = ({ children, role = 'DISPATCHER' }) => {
  const { pathname } = useLocation();
  const logout = useAuthStore(state => state.logout);

  const getNavItems = () => {
    const baseNav = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: AlertTriangle, label: 'Live Incidents', path: '/dashboard/incidents' },
      { icon: Truck, label: 'Ambulances', path: '/dashboard/ambulances' },
      { icon: Hospital, label: 'Hospitals', path: '/dashboard/hospitals' },
      { icon: Radio, label: 'Dispatch Board', path: '/dashboard/dispatch' },
      { icon: Activity, label: 'Analytics', path: '/dashboard/analytics' },
      { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
      { icon: Navigation, label: 'Road Conditions', path: '/dashboard/roads' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];
    if (role === 'DRIVER') {
      return [
        { icon: Truck, label: 'Active Assignment', path: '/driver' },
        { icon: Navigation, label: 'Route', path: '/driver/route' },
      ];
    }
    return baseNav;
  };

  return (
    <div className="flex h-screen bg-transparent text-text-main overflow-hidden font-sans selection:bg-emergency/30">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-900/90 backdrop-blur-xl border-r border-primary-700/50 flex flex-col z-20 shadow-xl shadow-primary-900/50">
        <div className="p-6 border-b border-primary-700/50">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.svg" alt="AI Dispatch" className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <div>
              <h2 className="text-lg font-bold text-text-main leading-tight tracking-tight">AI Dispatch</h2>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Command Center</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {getNavItems().map((item) => {
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-emergency/10 text-emergency border-l-2 border-emergency' 
                    : 'text-text-muted hover:bg-primary-700/30 hover:text-text-main border-l-2 border-transparent'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-emergency' : ''} />
                <span className={`text-sm font-medium ${isActive ? 'text-text-main' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* System Status Panel */}
        <div className="p-4 bg-primary-900/50 border-t border-primary-700">
          <h4 className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-3">System Status</h4>
          <div className="space-y-1">
            <SystemStatusIndicator label="AI Service" icon={Server} status={isSystemDemoMode ? "Demo AI" : "Connected"} />
            <SystemStatusIndicator label="Database" icon={Database} status={isSystemDemoMode ? "Demo Data" : "Connected"} />
            <SystemStatusIndicator label="Live Traffic" icon={Activity} status="Active" />
          </div>
        </div>

        <div className="p-4 border-t border-primary-700/50">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-text-muted hover:text-emergency hover:bg-emergency/10 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Exit Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-transparent">
        <header className="h-14 bg-primary-800/50 backdrop-blur-md border-b border-primary-700/50 flex items-center px-6 justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {isSystemDemoMode ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-warning/10 border border-warning/20 text-warning text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span>
                Demo Mode
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-operational/10 border border-operational/20 text-operational text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse"></span>
                System Operational
              </span>
            )}
            <span className="text-xs text-text-muted font-medium hidden sm:block">Central Command Environment</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-right">
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-text-main leading-tight capitalize">{role.toLowerCase()}</p>
                <p className="text-[10px] text-info tracking-wider uppercase">Active Session</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary-700 border border-primary-600 text-info flex items-center justify-center font-bold">
                {role.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto relative">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
