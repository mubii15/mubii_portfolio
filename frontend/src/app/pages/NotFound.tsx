import { motion, useMotionValue, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function NotFound() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const xOffset = useTransform(mouseX, [0, windowSize.width], [-30, 30]);
  const yOffset = useTransform(mouseY, [0, windowSize.height], [-30, 30]);
  
  const glitchX = useTransform(mouseX, [0, windowSize.width], [20, -20]);
  const glitchY = useTransform(mouseY, [0, windowSize.height], [20, -20]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center">
      {/* Dynamic Background Spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(circle 800px at ${x}px ${y}px, rgba(30, 64, 175, 0.15), transparent 80%)`
          )
        }}
      />

      <div className="z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Main Text */}
          <motion.h1 
            style={{ x: xOffset, y: yOffset }}
            className="text-[20vw] leading-none font-black tracking-tighter text-white relative z-20 mix-blend-exclusion"
          >
            404
          </motion.h1>
          
          {/* Parallax Ghost Text 1 */}
          <motion.div 
            className="absolute top-0 left-0 text-[20vw] leading-none font-black tracking-tighter text-blue-600/40 blur-[4px] z-10"
            style={{ x: glitchX, y: glitchY }}
          >
            404
          </motion.div>

          {/* Parallax Ghost Text 2 */}
          <motion.div 
            className="absolute top-0 left-0 text-[20vw] leading-none font-black tracking-tighter text-cyan-600/20 blur-[8px] z-0"
            style={{ x: useTransform(mouseX, [0, windowSize.width], [-50, 50]), y: useTransform(mouseY, [0, windowSize.height], [-50, 50]) }}
          >
            404
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-4 flex flex-col items-center z-30"
        >
          <p className="text-sm md:text-base text-white/50 mb-12 uppercase tracking-[0.3em]">
            Lost in the void
          </p>
          
          <Link 
            to="/"
            className="group relative px-8 py-4 overflow-hidden rounded-full border border-white/20 transition-colors hover:border-white/40"
            data-cursor-text="ESCAPE"
          >
            <span className="relative z-10 text-xs md:text-sm uppercase tracking-widest transition-colors duration-300 group-hover:text-black">
              Return Home
            </span>
            <div className="absolute inset-0 h-full w-full bg-white scale-y-0 origin-bottom transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-y-100" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
