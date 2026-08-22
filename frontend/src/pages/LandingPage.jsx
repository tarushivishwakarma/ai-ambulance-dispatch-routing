import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, Navigation, BrainCircuit, ChevronRight, Play, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const LandingPage = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-text-main flex flex-col bg-primary-900">
      <AnimatePresence>
        {showIntro ? (
          <motion.div 
            key="intro-video"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <video
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onEnded={() => setShowIntro(false)}
            >
              <source src="/ambulance-emergency-hero.mp4" type="video/mp4" />
            </video>
            
            {/* Overlay gradient so skip button is visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            
            <button 
              onClick={() => setShowIntro(false)}
              className="absolute bottom-10 right-10 px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all z-10 shadow-xl"
            >
              Skip Intro
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="landing-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 flex flex-col h-full w-full relative z-0"
          >
            {/* Static Background Image for contrast */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/images/landing-bg.jpg" 
                alt="Emergency Operations Center" 
                className="w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale-[50%]"
              />
              <div className="absolute inset-0 bg-primary-900/80 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-b from-primary-900/60 via-transparent to-primary-900" />
            </div>

            {/* Navbar */}
            <motion.nav 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="h-16 border-b border-primary-700/50 bg-primary-900/60 backdrop-blur-md px-6 flex items-center justify-between z-50 relative shadow-xl"
            >
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="AI Dispatch Logo" className="h-7 w-7 object-contain drop-shadow-md" />
                <span className="text-white text-sm font-bold tracking-widest uppercase">AI Dispatch</span>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/report" className="text-[10px] font-bold tracking-widest uppercase text-text-muted hover:text-white transition-colors">REPORT EMERGENCY</Link>
                <Link to="/login" className="px-4 py-1.5 bg-primary-800/80 hover:bg-primary-700 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all border border-primary-600/50">
                  AUTHORITY LOGIN
                </Link>
              </div>
            </motion.nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center relative p-6 z-10 mt-[-4rem]">
              <div className="text-center max-w-3xl mx-auto space-y-6 bg-primary-900/60 backdrop-blur-md p-8 rounded-xl border border-primary-700/50 shadow-2xl">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded bg-operational/10 border border-operational/30 text-operational text-[10px] font-bold tracking-widest uppercase mb-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-operational animate-pulse"></span>
                  System Operational
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase"
                >
                  AI Dispatch <br />
                  <span className="text-text-muted text-lg font-medium tracking-widest mt-2 block">Emergency Operations Center</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed"
                >
                  Coordinating incidents, ambulances, and emergency response from a single operational view.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                  <Link to="/report" className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emergency/90 hover:bg-emergency text-white text-xs font-bold tracking-widest rounded shadow-lg transition-all w-full sm:w-auto uppercase">
                    Report Emergency <ChevronRight size={14} />
                  </Link>
                  
                  <Link to="/login" className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-800/80 hover:bg-primary-700 border border-primary-600/50 text-white text-xs font-bold tracking-widest rounded shadow-lg transition-all w-full sm:w-auto uppercase">
                    Authority Demo Login
                  </Link>
                </motion.div>
              </div>
            </main>

            {/* Feature grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-primary-900/80 backdrop-blur-md border-t border-primary-700/50 py-8 px-6 relative z-10"
            >
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded bg-primary-800/50 border border-primary-700/50 hover:border-info/50 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <BrainCircuit className="text-info" size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">AI Verification</h3>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wide">Categorizes incidents and assesses severity using AI.</p>
                </div>
                <div className="p-5 rounded bg-primary-800/50 border border-primary-700/50 hover:border-emergency/50 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="text-emergency" size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Hospital Matching</h3>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wide">Recommends facilities based on trauma level and capacity.</p>
                </div>
                <div className="p-5 rounded bg-primary-800/50 border border-primary-700/50 hover:border-operational/50 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <Map className="text-operational" size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Dynamic Routing</h3>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wide">Calculates operational routes penalizing blocked roads.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
