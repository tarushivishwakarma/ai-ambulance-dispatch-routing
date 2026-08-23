import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Truck, Hospital, Activity, Settings, LogOut, Navigation, FileText, Database, Radio, Server, ArrowLeft, Bell, Menu, X } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useDemoStore from '../demo/demoStore';
import { isSystemDemoMode } from '../services/apiService';

const DashboardLayout = ({ children, role = 'DISPATCHER' }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const notifications = useDemoStore(state => state.notifications);
  const unread = notifications.filter(n => !n.read).length;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-primary-700/50 flex justify-between items-center">
        <div>
          <Link to="/" className="flex items-center gap-2.5 group mb-4">
            <img src="/logo.svg" alt="AI Dispatch" className="w-8 h-8 group-hover:scale-105 transition-transform" />
            <div>
              <h2 className="text-sm font-black text-text-main leading-tight tracking-tight uppercase">AI Dispatch</h2>
              <p className="text-[9px] text-text-muted uppercase tracking-wider">Command Center</p>
            </div>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[10px] text-text-muted hover:text-text-main transition-colors font-bold uppercase tracking-widest group"
          >
            <ArrowLeft size={11} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Landing
          </Link>
        </div>
        {/* Mobile close button */}
        <button 
          className="md:hidden text-text-muted hover:text-text-main"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 ${
                isActive
                  ? 'bg-primary-600 text-brand-primary border-l-2 border-brand-primary pl-2.5'
                  : 'text-text-muted hover:bg-primary-600 hover:text-text-main border-l-2 border-transparent'
              }`}
            >
              <item.icon size={16} className={isActive ? 'text-brand-primary' : ''} />
              <span className={`text-[12px] font-semibold ${isActive ? 'text-brand-primary' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 bg-primary-600 border-t border-primary-700">
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

      <div className="p-3 border-t border-primary-700">
        <button
          onClick={handleExit}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-text-muted hover:text-emergency hover:bg-primary-600 transition-all"
        >
          <LogOut size={16} />
          <span className="text-[12px] font-semibold">Exit Session</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-primary-900 text-text-main overflow-hidden font-sans selection:bg-info/10 selection:text-info">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 bg-primary-800 border-r border-primary-700 flex-col z-20 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="w-64 max-w-[80vw] bg-primary-800 border-r border-primary-700 flex flex-col z-50 shadow-2xl h-full">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full max-w-full">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 bg-primary-900">
          <img 
            src="/images/landing-bg.jpg" 
            alt="EOC Background" 
            className="w-full h-full object-cover opacity-[0.03] grayscale mix-blend-multiply"
          />
        </div>

        {/* Top Header */}
        <header className="relative z-10 h-14 min-h-[56px] bg-primary-800 border-b border-primary-700 flex items-center px-4 md:px-6 justify-between shrink-0 shadow-sm w-full">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu (Mobile Only) */}
            <button 
              className="md:hidden p-1.5 -ml-1.5 text-text-muted hover:text-text-main transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>

            {isSystemDemoMode ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-warning/15 border border-warning/25 text-warning text-[9px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse shrink-0" />
                <span className="hidden sm:inline">Demo Operations</span>
                <span className="sm:hidden">Demo</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-operational/15 border border-operational/25 text-operational text-[9px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse shrink-0" />
                <span className="hidden sm:inline">System Operational</span>
                <span className="sm:hidden">Live</span>
              </span>
            )}
            <span className="text-[11px] text-text-muted font-medium hidden lg:block truncate">Central Command Environment</span>
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button className="p-1.5 md:p-2 text-text-muted hover:text-text-main transition-colors relative">
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emergency rounded-full text-[9px] font-black text-white flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
            </div>
            {/* Role indicator */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-[11px] md:text-[12px] font-bold text-text-main leading-tight capitalize">{role.toLowerCase()}</p>
                <p className="text-[8px] md:text-[9px] text-info tracking-wider uppercase">Active Session</p>
              </div>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary-700 border border-primary-600 text-info flex items-center justify-center text-[10px] md:text-[11px] font-black shrink-0">
                {role.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex-1 overflow-auto w-full">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
