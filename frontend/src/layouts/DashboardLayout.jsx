import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Truck, Hospital, Activity, Settings, LogOut, Navigation, FileText, Database, Radio, Server, ArrowLeft, Bell } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useDemoStore from '../demo/demoStore';
import { isSystemDemoMode } from '../services/apiService';

const DashboardLayout = ({ children, role = 'DISPATCHER' }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const notifications = useDemoStore(state => state.notifications);
  const unread = notifications.filter(n => !n.read).length;

  const handleExit = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
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

  const driverNavItems = [
    { icon: Truck, label: 'Active Assignment', path: '/driver' },
    { icon: Navigation, label: 'Route', path: '/driver/route' },
  ];

  const items = role === 'DRIVER' ? driverNavItems : navItems;

  return (
    <div className="flex h-screen bg-primary-900 text-text-main overflow-hidden font-sans selection:bg-emergency/30">
      {/* Sidebar */}
      <aside className="w-60 bg-primary-900 border-r border-primary-700/60 flex flex-col z-20 shadow-2xl">

        {/* Logo + Back to Landing */}
        <div className="p-5 border-b border-primary-700/50">
          <Link to="/" className="flex items-center gap-2.5 group mb-4">
            <img src="/logo.svg" alt="AI Dispatch" className="w-8 h-8 group-hover:scale-105 transition-transform" />
            <div>
              <h2 className="text-sm font-black text-text-main leading-tight tracking-tight uppercase">AI Dispatch</h2>
              <p className="text-[9px] text-text-muted uppercase tracking-wider">Command Center</p>
            </div>
          </Link>
          {/* Back to Landing */}
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[10px] text-text-muted hover:text-white transition-colors font-bold uppercase tracking-widest group"
          >
            <ArrowLeft size={11} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Landing
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 ${
                  isActive
                    ? 'bg-emergency/15 text-white border-l-2 border-emergency pl-2.5'
                    : 'text-text-muted hover:bg-primary-700/40 hover:text-text-main border-l-2 border-transparent'
                }`}
              >
                <item.icon size={16} className={isActive ? 'text-emergency' : ''} />
                <span className={`text-[12px] font-semibold ${isActive ? 'text-white' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="px-4 py-3 bg-primary-800/40 border-t border-primary-700/50">
          <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-2">System Status</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5 text-text-muted"><Server size={10} /> AI Service</span>
              <span className={`font-bold ${isSystemDemoMode ? 'text-warning' : 'text-operational'}`}>
                {isSystemDemoMode ? 'Demo AI' : 'Gemini'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5 text-text-muted"><Database size={10} /> Database</span>
              <span className={`font-bold ${isSystemDemoMode ? 'text-warning' : 'text-operational'}`}>
                {isSystemDemoMode ? 'Demo Data' : 'MongoDB'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5 text-text-muted"><Activity size={10} /> Simulation</span>
              <span className="text-operational font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse" />Active
              </span>
            </div>
          </div>
        </div>

        {/* Exit */}
        <div className="p-3 border-t border-primary-700/50">
          <button
            onClick={handleExit}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-text-muted hover:text-emergency hover:bg-emergency/10 transition-all"
          >
            <LogOut size={16} />
            <span className="text-[12px] font-semibold">Exit Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/landing-bg.jpg" 
            alt="EOC Background" 
            className="w-full h-full object-cover opacity-15 mix-blend-luminosity grayscale"
          />
          <div className="absolute inset-0 bg-primary-900/80" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-transparent to-primary-900/60" />
        </div>

        {/* Top Header */}
        <header className="relative z-10 h-13 min-h-[52px] bg-primary-800/60 backdrop-blur-md border-b border-primary-700/50 flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-3">
            {isSystemDemoMode ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-warning/15 border border-warning/25 text-warning text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                Demo Operations
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-operational/15 border border-operational/25 text-operational text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse" />
                System Operational
              </span>
            )}
            <span className="text-[11px] text-text-muted font-medium hidden sm:block">Central Command Environment</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-text-muted hover:text-text-main transition-colors relative">
                <Bell size={16} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emergency rounded-full text-[9px] font-black text-white flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
            </div>
            {/* Role indicator */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-[12px] font-bold text-text-main leading-tight capitalize">{role.toLowerCase()}</p>
                <p className="text-[9px] text-info tracking-wider uppercase">Active Session</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-700 border border-primary-600 text-info flex items-center justify-center text-[11px] font-black">
                {role.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex-1 overflow-auto">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
