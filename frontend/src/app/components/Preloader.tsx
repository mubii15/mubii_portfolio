import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    let isLoaded = document.readyState === 'complete';
    let minTimePassed = false;

    // Listen for window load
    const handleLoad = () => { isLoaded = true; checkComplete(); };
    window.addEventListener('load', handleLoad);

    const checkComplete = () => {
      if (isLoaded && minTimePassed) {
        onComplete();
      }
    };

    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          minTimePassed = true;
          checkComplete();
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="flex items-center gap-4">
        <span className="text-8xl font-light tracking-tighter">
          {Math.floor(count)}%
        </span>
        <motion.div
          className="h-24 w-[1px] bg-white"
          initial={{ height: 0 }}
          animate={{ height: 96 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
