import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackColor?: string;
  forceEager?: boolean; // If true, disables lazy loading (good for hero images above the fold)
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  fallbackColor = 'bg-[#0a0a0a]', 
  forceEager = false,
  ...props 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If the src changes, reset the loaded state so it fades in again
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${fallbackColor} ${className}`}>
      {/* 
        Skeleton/Blur Placeholder 
        This shows immediately while the image is downloading.
        We use a heavy CSS blur and pulse animation to make it look like a placeholder.
      */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full animate-pulse backdrop-blur-3xl bg-white/5"
          />
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <motion.img
        src={hasError ? '/placeholder.jpg' : src} // Fallback to a local placeholder if it completely fails
        alt={alt}
        loading={forceEager ? 'eager' : 'lazy'}
        // If lazy, we tell the browser to lower the priority of this fetch until it enters the viewport
        fetchPriority={forceEager ? 'high' : 'auto'} 
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        initial={{ filter: 'blur(20px)', opacity: 0, scale: 1.05 }}
        animate={isLoaded ? { filter: 'blur(0px)', opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full h-full object-cover transition-all ${props.className || ''}`}
        {...props}
      />
    </div>
  );
}
