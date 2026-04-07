
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skeleton } from './Skeleton';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
    aspectRatio?: 'square' | 'video' | 'portrait' | 'custom' | string;
    customAspectRatio?: string;
}

export function LazyImage({ 
    src, 
    alt, 
    className = "", 
    containerClassName = "", 
    aspectRatio = "aspect-square",
    customAspectRatio 
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    // Get final aspect ratio class
    const ratioClass = aspectRatio === 'square' 
        ? 'aspect-square' 
        : aspectRatio === 'video' 
            ? 'aspect-video' 
            : aspectRatio === 'portrait'
                ? 'aspect-[4/5]'
                : aspectRatio;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' } // Pre-load when 200px from viewport
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={imgRef}
            className={`relative overflow-hidden ${ratioClass} ${containerClassName}`} 
            style={customAspectRatio ? { aspectRatio: customAspectRatio } : {}}
        >
            {/* Skeleton shown while not in view or not loaded */}
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        className="absolute inset-0 z-10"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Skeleton className="w-full h-full" borderRadius={0} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The actual image, only rendered when in view */}
            {isInView && (
                <motion.img
                    src={src}
                    alt={alt}
                    className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 ease-out`}
                    onLoad={() => setIsLoaded(true)}
                    loading="lazy"
                    decoding="async"
                />
            )}
        </div>
    );
}
