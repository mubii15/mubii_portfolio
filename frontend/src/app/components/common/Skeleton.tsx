
import { motion } from 'motion/react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
}

export function Skeleton({ className = "", width, height, borderRadius }: SkeletonProps) {
    return (
        <motion.div
            className={`bg-white/[0.03] overflow-hidden relative ${className}`}
            style={{
                width,
                height,
                borderRadius: borderRadius || '8px',
            }}
            initial={{ opacity: 0.5 }}
            animate={{ 
                opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
            }}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </motion.div>
    );
}

export function SkeletonCircle({ size = 48, className = "" }: { size?: number, className?: string }) {
    return <Skeleton width={size} height={size} borderRadius="50%" className={className} />;
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number, className?: string }) {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {[...Array(lines)].map((_, i) => (
                <Skeleton 
                    key={i} 
                    height={10} 
                    width={i === lines - 1 ? '60%' : '100%'} 
                    className="opacity-40"
                />
            ))}
        </div>
    );
}
