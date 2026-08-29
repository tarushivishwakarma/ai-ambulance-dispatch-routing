import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, AlertTriangle, Truck, Hospital, Activity, Settings, LogOut, Navigation, FileText, Database, Radio, Server, ArrowLeft, Bell, Menu, X, ShieldAlert } from 'lucide-react';
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
  const [showNotifications, setShowNotifications] = useState(false);

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
      <div className="p-6 pb-4 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
          <Link to="/" className="flex flex-col gap-1 group">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-brand-primary rounded shadow-sm flex items-center justify-center group-hover:bg-brand-primary-hover transition-colors">
                 <ShieldAlert className="text-white w-4 h-4" />
              </div>
              <h2 className="text-[13px] font-black text-text-main tracking-tight uppercase">AI Dispatch</h2>
            </div>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-semibold ml-10">Command Center</p>
          </Link>
          <button 
            className="md:hidden text-text-muted hover:text-text-main"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[10px] text-text-muted hover:text-brand-primary transition-colors font-bold uppercase tracking-widest group"
        >
          <ArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" />
          Back to Landing
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group text-[13px] font-medium"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-brand-primary/5 rounded-md border border-brand-primary/10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={16} className={`relative z-10 transition-colors ${isActive ? 'text-brand-primary' : 'text-text-muted group-hover:text-text-main'}`} />
              <span className={`relative z-10 transition-colors ${isActive ? 'text-brand-primary font-semibold' : 'text-text-secondary group-hover:text-text-main'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-border-subtle bg-bg-surface-secondary/50">
        <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-3">System Status</p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="flex items-center gap-2 text-text-secondary"><Server size={12} className="text-text-muted"/> AI Service</span>
            <span className={`font-semibold ${isSystemDemoMode ? 'text-warning' : 'text-operational'}`}>
              {isSystemDemoMode ? 'Demo AI' : 'Gemini'}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="flex items-center gap-2 text-text-secondary"><Database size={12} className="text-text-muted"/> Database</span>
            <span className={`font-semibold ${isSystemDemoMode ? 'text-warning' : 'text-operational'}`}>
              {isSystemDemoMode ? 'Demo Data' : 'MongoDB'}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="flex items-center gap-2 text-text-secondary"><Activity size={12} className="text-text-muted"/> Simulation</span>
            <span className="text-operational font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse" />Active
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border-subtle">
        <button
          onClick={handleExit}
          className="flex items-center justify-center gap-2 px-3 py-2.5 w-full rounded-md text-text-secondary hover:text-emergency hover:bg-emergency/5 transition-all border border-transparent hover:border-emergency/10"
        >
          <LogOut size={14} />
          <span className="text-[12px] font-semibold">Exit Session</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-bg-page text-text-main overflow-hidden font-sans selection:bg-brand-primary/10 selection:text-brand-primary">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-bg-surface border-r border-border flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex md:hidden bg-text-main/20 backdrop-blur-sm"
          >
            <div className="fixed inset-0" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[280px] bg-bg-surface border-r border-border flex flex-col z-50 h-full shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full max-w-full bg-bg-page">
        {/* Very subtle background overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-border) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

        {/* Top Header */}
        <header className="relative z-[9999] h-16 min-h-[64px] bg-bg-surface border-b border-border flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-1.5 -ml-2 text-text-secondary hover:text-text-main transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>

            {isSystemDemoMode ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-warning/10 border border-warning/20 text-warning text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse shrink-0" />
                <span className="hidden sm:inline">Demo Operations</span>
                <span className="sm:hidden">Demo</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-operational/10 border border-operational/20 text-operational text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse shrink-0" />
                <span className="hidden sm:inline">System Operational</span>
                <span className="sm:hidden">Live</span>
              </span>
            )}
            
            <div className="hidden lg:flex h-4 w-px bg-border mx-2"></div>
            <span className="text-[12px] text-text-muted font-medium hidden lg:block tracking-wide">Central Command Environment</span>
          </div>

          <div className="flex items-center gap-4 md:gap-5 shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button 
                className="relative p-2 text-text-secondary hover:text-text-main transition-colors rounded-full hover:bg-bg-surface-secondary"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emergency rounded-full text-[9px] font-black text-white flex items-center justify-center ring-2 ring-bg-surface">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-bg-surface/80 backdrop-blur-md border border-border rounded-lg shadow-xl overflow-hidden z-[9999] flex flex-col"
                  >
                    <div className="p-3 border-b border-border bg-bg-page flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-text-main">System Alerts</span>
                      <span className="text-[10px] text-text-muted">{notifications.length} Total</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-text-muted text-xs">No active alerts</div>
                      ) : (
                        notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            onClick={() => {
                              useDemoStore.getState().markNotificationRead(notif.id);
                              if (notif.incidentId) {
                                useDemoStore.getState().setSelectedIncidentId(notif.incidentId);
                              }
                              setShowNotifications(false);
                            }}
                            className={`p-3 border-b border-border last:border-0 cursor-pointer hover:bg-bg-surface-secondary transition-colors ${!notif.read ? 'bg-info/5' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${!notif.read ? 'text-info' : 'text-text-muted'}`}>{notif.title}</span>
                              <span className="text-[9px] text-text-disabled">
                                {notif.timestamp && !isNaN(new Date(notif.timestamp).getTime())
                                  ? new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : 'Just now'}
                              </span>
                            </div>
                            <p className={`text-xs ${!notif.read ? 'text-text-main font-medium' : 'text-text-secondary'}`}>{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-6 w-px bg-border hidden sm:block"></div>

            {/* Role indicator */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden sm:flex flex-col items-end justify-center">
                <p className="text-[12px] font-bold text-text-main leading-tight capitalize">{role.toLowerCase()}</p>
                <p className="text-[9px] text-text-muted tracking-widest uppercase font-semibold mt-0.5 group-hover:text-brand-primary transition-colors">Active Session</p>
              </div>
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center text-[12px] font-black shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                {role.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden w-full p-4 md:p-6 lg:p-8">
          <div className="min-h-full w-full max-w-[1920px] mx-auto">
            {children || <Outlet />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
