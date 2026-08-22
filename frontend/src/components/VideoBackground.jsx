import { useState, useEffect } from 'react';

/**
 * Reusable Video Background Component
 * 
 * Automatically falls back to a cinematic CSS grid effect if the MP4 video asset
 * is missing or fails to load. Respects prefers-reduced-motion.
 * 
 * Place your local MP4 files in `frontend/public/` and reference them with `/filename.mp4`
 */
const VideoBackground = ({ 
  src = '/ambulance-emergency-hero.mp4', 
  poster = '',
  className = '',
  videoOpacity = 'opacity-25'
}) => {
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleVideoError = () => {
    console.error("VideoBackground: Failed to load", src);
    setVideoError(true);
  };

  return (
    <div className={`fixed inset-0 overflow-hidden z-0 pointer-events-none ${className}`}>
      {/* Real HTML5 Video - Tries to load first */}
      {!videoError && !prefersReducedMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover z-0 ${videoOpacity}`}
          poster={poster}
          onError={handleVideoError}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Cinematic CSS Fallback - Shows if video fails, is missing, or reduced motion is preferred */}
      {(videoError || prefersReducedMotion) && (
        <div className="absolute inset-0 bg-primary-900 overflow-hidden z-0">
          {/* Subtle Grid Pattern for EOC feel */}
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
      )}

      {/* Layered Gradient Overlays for Cinematic Feel and Readability */}
      <div className="absolute inset-0 bg-primary-900/50 mix-blend-multiply z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/80 to-transparent z-0"></div>
    </div>
  );
};

export default VideoBackground;
