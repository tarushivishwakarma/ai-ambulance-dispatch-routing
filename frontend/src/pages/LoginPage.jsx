import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Pass the hardcoded demo credentials directly
      await login('dispatcher@operations.local', 'password');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo access failed. Verify configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-primary-900 font-sans selection:bg-operational/30 overflow-hidden relative z-20">
      {/* Left side: Atmospheric Image */}
      <div className="hidden lg:flex w-7/12 relative bg-primary-900 border-r border-primary-700 shadow-2xl">
        <img 
          src="/images/login-emergency.jpg" 
          alt="Emergency Operations Center" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 via-transparent to-primary-900"></div>
        <div className="absolute bottom-8 left-8 flex items-center gap-3">
          <img src="/logo.svg" alt="AI Dispatch" className="h-10 w-10 opacity-70" />
          <div>
            <h2 className="text-white font-bold tracking-widest text-sm uppercase">AI Dispatch</h2>
            <p className="text-text-muted text-[10px] tracking-widest uppercase">Emergency Operations Network</p>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-12 md:px-24 bg-primary-900 relative">
        <div className="max-w-sm w-full mx-auto space-y-8">
          
          <div className="space-y-2 mb-10">
            <h1 className="text-2xl font-bold text-text-main tracking-tight">Authorized Demo Access</h1>
            <p className="text-sm text-text-muted">Direct entry into the operational dispatch dashboard.</p>
          </div>

          {error && (
            <div className="p-4 bg-emergency/10 border border-emergency/30 text-emergency text-sm rounded flex flex-col">
              <span className="font-bold mb-1 uppercase text-[10px] tracking-widest">Authentication Failed</span>
              {error}
            </div>
          )}

          <div className="space-y-5">
            <button 
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full py-4 bg-operational hover:bg-operational-hover text-primary-900 font-bold uppercase tracking-widest rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Enter Authority Dashboard'}
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-primary-800 flex items-center justify-between text-[10px] text-text-muted uppercase tracking-wider font-bold">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse"></span>
              Secure Connection
            </span>
            <span>Version 2.4.0</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
