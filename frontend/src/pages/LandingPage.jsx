import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, Navigation, BrainCircuit, ChevronRight, Map, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const introPlayed = sessionStorage.getItem('introPlayed');
    if (!introPlayed) {
      setShowIntro(true);
    }
  }, []);

  const handleSkipIntro = () => {
    sessionStorage.setItem('introPlayed', 'true');
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-text-main flex flex-col bg-primary-900">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div 
            key="intro-video"
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <video 
              autoPlay 
              muted 
              playsInline 
              onEnded={handleSkipIntro}
              className="w-full h-full object-cover"
            >
              <source src="/ambulance-emergency-hero.mp4" type="video/mp4" />
            </video>
            
            {/* Overlay gradient so skip button is visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            
            <button 
              onClick={handleSkipIntro}
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

      {/* Background static image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/landing-bg.jpg"
          alt="Emergency Operations"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.35) saturate(0.7)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-primary-900/70" />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-16 border-b border-primary-700 bg-primary-800 px-8 flex items-center justify-between z-50 relative shadow-sm"
      >
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="AI Dispatch Logo" className="h-8 w-8 object-contain drop-shadow-md" />
          <span className="text-text-main text-sm font-bold tracking-widest uppercase">AI Dispatch</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-[11px] font-bold tracking-widest uppercase text-text-muted hover:text-text-main transition-colors">
            Home
          </Link>
          <Link to="/report" className="text-[11px] font-bold tracking-widest uppercase text-text-muted hover:text-text-main transition-colors">
            Report Emergency
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 bg-emergency/90 hover:bg-emergency text-white text-[11px] font-bold uppercase tracking-widest rounded transition-all shadow-lg shadow-emergency/20"
          >
            Authority Access
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center relative z-10 px-8 lg:px-16 py-12 gap-12">

        {/* LEFT: Text */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emergency/15 border border-emergency/30 text-emergency text-[10px] font-bold tracking-widest uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emergency animate-pulse" />
            Emergency Operations Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-5xl lg:text-7xl font-black tracking-tight text-text-main uppercase leading-none mb-4"
          >
            AI<br />
            <span className="text-emergency">Dispatch</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-base text-text-secondary max-w-xl leading-relaxed mb-8"
          >
            Emergency coordination, ambulance dispatch and hospital routing — powered by Gemini AI.
            Real-time situational awareness across India.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/report"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-emergency hover:bg-emergency-hover text-white text-sm font-bold tracking-widest rounded shadow-lg shadow-emergency/30 transition-all uppercase"
            >
              <ShieldAlert size={16} />
              Report Emergency
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-700 hover:bg-primary-600 border border-primary-500 text-white text-sm font-bold tracking-widest rounded transition-all uppercase shadow-lg"
            >
              Authority Demo Login
              <ChevronRight size={14} />
            </Link>
          </motion.div>

          {/* Live Stats Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-12 flex items-center gap-8"
          >
            {[
              { label: 'Ambulances', value: '150+', color: 'text-operational' },
              { label: 'Hospitals', value: '150+', color: 'text-info' },
              { label: 'Cities Covered', value: '40+', color: 'text-warning' },
            ].map(stat => (
              <div key={stat.label}>
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: Static ambulance image */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="hidden lg:flex flex-1 max-w-xl relative"
        >
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
            <img
              src="/images/login-emergency.jpg"
              alt="Emergency Ambulance"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.8) saturate(1.2)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 to-transparent" />
            {/* Live overlay badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary-800/90 border border-primary-700 rounded px-3 py-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emergency animate-pulse" />
              <span className="text-text-main text-[10px] font-bold uppercase tracking-widest">Live Operations</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-primary-800/90 border border-primary-700 rounded-lg p-3 text-text-main shadow-sm">
                <p className="text-[9px] uppercase tracking-widest text-text-muted mb-1">AI Dispatch System</p>
                <p className="text-xs font-bold">Coordinating emergency response across India</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Feature Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="relative z-10 border-t border-primary-700 bg-primary-800 py-10 px-8"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BrainCircuit,
              color: 'text-info',
              borderHover: 'hover:border-info/50',
              title: 'Gemini AI Verification',
              desc: 'Categorizes incidents, assesses severity and recommends ambulance capability using Google Gemini.'
            },
            {
              icon: Activity,
              color: 'text-emergency',
              borderHover: 'hover:border-emergency/50',
              title: 'Hospital Matching',
              desc: 'Recommends facilities based on trauma level, ICU availability and capacity in real time.'
            },
            {
              icon: Map,
              color: 'text-operational',
              borderHover: 'hover:border-operational/50',
              title: 'Dynamic Routing',
              desc: 'Calculates optimal routes penalizing road blockages, flooding and construction zones.'
            }
          ].map(item => (
            <div
              key={item.title}
              className={`p-5 rounded-lg bg-primary-800 border border-primary-700 ${item.borderHover} transition-all cursor-default shadow-sm`}
            >
              <div className="flex items-center gap-3 mb-3">
                <item.icon className={item.color} size={20} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-main">{item.title}</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
