import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      await login('dispatcher@operations.local', 'password');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo access failed. Verify configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-primary-900 font-sans overflow-hidden relative">

      {/* LEFT: Static ambulance/emergency image */}
      <div className="hidden lg:flex w-7/12 relative bg-primary-900 border-r border-primary-700/50 overflow-hidden">
        <img
          src="/images/login-emergency.jpg"
          alt="Emergency Operations Center"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.6) saturate(1.1)' }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-900/20 to-primary-900/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent" />

        {/* Branding overlay */}
        <div className="absolute bottom-10 left-10 right-10">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.svg" alt="AI Dispatch" className="h-10 w-10" />
            <div>
              <h2 className="text-white font-black tracking-widest text-lg uppercase">AI Dispatch</h2>
              <p className="text-slate-400 text-[11px] tracking-widest uppercase">Emergency Operations Network</p>
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">System Status</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'AI Service', status: 'Demo AI Active', color: 'text-warning' },
                { label: 'Fleet Tracking', status: 'Online', color: 'text-operational' },
                { label: 'Hospital Network', status: 'Connected', color: 'text-operational' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-medium">{item.label}</span>
                  <span className={`font-bold ${item.color} flex items-center gap-1`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-10 md:px-16 bg-primary-900 relative">

        {/* Back to Landing */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-text-muted hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Landing
        </Link>

        <div className="max-w-sm w-full mx-auto space-y-8">

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-emergency" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-emergency">Authority Access</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Authorized<br />Dashboard Access</h1>
            <p className="text-sm text-text-muted leading-relaxed">
              Enter the AI Dispatch Emergency Operations Center demo environment.
            </p>
          </div>

          {/* Demo mode notice */}
          <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-warning uppercase tracking-wider mb-1">Demo Mode Active</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Running with synthetic Pan-India data. No real credentials required.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-emergency/10 border border-emergency/30 text-emergency text-sm rounded-lg">
              <span className="font-bold block mb-1 uppercase text-[10px] tracking-widest">Authentication Failed</span>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Email / ID</label>
                <input 
                  type="text" 
                  defaultValue="dispatcher@operations.local"
                  className="w-full bg-primary-800/80 border border-primary-600 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-operational transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Password</label>
                <input 
                  type="password" 
                  defaultValue="password"
                  className="w-full bg-primary-800/80 border border-primary-600 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-operational transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full py-3 mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold uppercase tracking-widest rounded transition-all disabled:opacity-50 text-xs"
            >
              Sign In
            </button>

            <div className="relative py-3 flex items-center">
              <div className="flex-grow border-t border-primary-700"></div>
              <span className="flex-shrink-0 mx-4 text-text-muted text-[10px] uppercase font-bold tracking-widest">OR</span>
              <div className="flex-grow border-t border-primary-700"></div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full py-3 bg-operational hover:bg-operational-hover text-white font-bold uppercase tracking-widest rounded transition-all disabled:opacity-50 shadow-lg text-xs"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : 'Demo Authority Access'}
            </button>
          </div>

          <div className="pt-6 border-t border-primary-700/50 flex items-center justify-between text-[10px] text-text-muted uppercase tracking-wider font-bold">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse" />
              Secure Demo Session
            </span>
            <span>Version 2.4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
