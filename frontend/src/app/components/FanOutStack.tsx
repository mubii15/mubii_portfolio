
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface FanOutStackProps {
    images: string[];
    variant?: 'fan' | 'collapsed' | 'grid';
    onIndexSelect?: (index: number | null) => void;
    selectedIndex?: number | null;
}

export function FanOutStack({ images, variant = 'fan', onIndexSelect, selectedIndex: controlledIndex }: FanOutStackProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [localSelectedIndex, setLocalSelectedIndex] = useState<number | null>(null);

    // Use controlled index if provided, otherwise local
    const selectedIndex = controlledIndex !== undefined ? controlledIndex : localSelectedIndex;

    // Body Scroll Lock Effect
    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedIndex]);

    // Calculate positions based on variant for DESKTOP/FAN/COLLAPSED
    const getStyles = (index: number) => {
        const total = images.length;
        const center = (total - 1) / 2;
        const offset = index - center;

        // Base initial state
        const initial = { x: 0, y: 0, rotate: 0, scale: 0.8, opacity: 0 };
        let animate: any = {};

        switch (variant) {
            case 'collapsed':
                animate = {
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 0.9,
                    opacity: 1,
                    zIndex: index + 1,
                };
                break;
            case 'grid':
                // Desktop Grid Animation
                const vwSpacing = 24.5;

                // Focus Mode Logic
                if (selectedIndex !== null) {
                    if (selectedIndex === index) {
                        // Selected Item stays active/visible behind overlay
                        animate = {
                            x: `${offset * vwSpacing}vw`,
                            y: 0,
                            scale: 1,
                            opacity: 1,
                            zIndex: 10
                        };
                    } else {
                        // Not selected: Dim and Shrink
                        animate = {
                            x: `${offset * vwSpacing}vw`,
                            y: 0,
                            rotate: 0,
                            scale: 0.9, // Shrink
                            opacity: 0.3, // Dim
                            zIndex: 0,
                        };
                    }
                } else {
                    // Normal Grid
                    animate = {
                        x: `${offset * vwSpacing}vw`,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                        opacity: 1,
                        zIndex: 1,
                    };
                }
                break;
            case 'fan':
            default:
                animate = {
                    x: offset * 40,
                    y: Math.abs(offset) * 10,
                    rotate: offset * 5,
                    scale: 1,
                    opacity: 1,
                    // Z-Index handled in style
                };
                break;
        }

        return { initial, animate };
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isMobileGrid = isMobile && variant === 'grid';
    const total = images.length;
    const center = (total - 1) / 2;

    // Handler for clicking a thumbnail
    const handleItemClick = (index: number) => {
        if (variant === 'grid') {
            if (onIndexSelect) {
                onIndexSelect(index);
            } else {
                setLocalSelectedIndex(index);
            }
        }
    };

    // Close detail view
    const closeDetail = () => {
        if (onIndexSelect) {
            onIndexSelect(null);
        } else {
            setLocalSelectedIndex(null);
        }
    };

    return (
        <>
            {/* Overlay / Detail View */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        className="fixed inset-0 z-50 overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop (Click to close) */}
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={closeDetail}
                        />

                        {/* REMOVED: Large Title at Bottom (User requested removal as it is in footer) */}

                        {/* Scrollable Content Reel - Aligned to Selected Item */}
                        <motion.div
                            className="absolute top-0 h-full overflow-y-auto scrollbar-hide py-10"
                            style={{
                                width: isMobile ? '80vw' : '24vw',
                                left: isMobile
                                    ? '10vw'
                                    : `calc(50% + ${(selectedIndex - center) * 24.5}vw - 12vw)`
                            }}
                            initial={{ y: 0, opacity: 0 }} // Start in place
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 0, opacity: 0 }} // Fade out in place
                        >
                            {/* Vertical Column of Images */}
                            <div className="flex flex-col gap-8 w-full">
                                {/* The "Header" item (same as the thumbnail) */}
                                <div className="w-full aspect-[400/650] bg-gray-900 shadow-2xl border border-white/10 shrink-0">
                                    <img
                                        src={images[selectedIndex]}
                                        className="w-full h-full object-cover"
                                        alt="Current"
                                    />
                                </div>

                                {/* Additional Items in the Reel */}
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="w-full aspect-[400/650] bg-gray-900 shadow-2xl border border-white/10 shrink-0">
                                        <img
                                            // Using same images for demo, cycled
                                            src={images[(selectedIndex + item) % images.length]}
                                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                                            alt="Detail"
                                        />

                                    </div>
                                ))}

                                {/* Spacer at bottom */}
                                <div className="h-[20vh] shrink-0"></div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN RENDER LOGIC */}
            {isMobileGrid ? (
                // RENDER: MOBILE GRID (Native Scroll)
                <div
                    className={`w-full h-[600px] flex items-center overflow-x-auto snap-x snap-mandatory scrollbar-hide px-[10vw] transition-all duration-500`}
                    style={{
                        opacity: selectedIndex !== null ? 0.3 : 1,
                        pointerEvents: selectedIndex !== null ? 'none' : 'auto'
                    }}
                >
                    <div className="flex gap-4">
                        {images.map((src, index) => (
                            <div
                                key={index}
                                className="relative flex-shrink-0 w-[80vw] h-[60vh] snap-center flex flex-col items-center justify-center transition-transform duration-500"
                                onClick={() => handleItemClick(index)}
                                style={{ transform: selectedIndex === index ? 'scale(1)' : (selectedIndex !== null ? 'scale(0.95)' : 'scale(1)') }}
                            >
                                <div className="relative w-full h-full overflow-hidden rounded-xl shadow-2xl bg-gray-900 border border-white/10">
                                    <img
                                        src={src}
                                        alt={`Portfolio item ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Plus Icon Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-16 h-16 rounded-full border border-white/80 flex items-center justify-center backdrop-blur-sm bg-black/10">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Title Check */}
                                <div className="mt-4 text-center">
                                    <h3 className="text-white text-sm tracking-[0.2em] font-bold uppercase mb-1">
                                        {["PHOTOGRAPHY", "CINEMATOGRAPHY", "VFX / COLOR", "CONTEMPORARY ART"][index]}
                                    </h3>
                                    <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase">
                                        {Math.floor(Math.random() * 15) + 8} IMAGES
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // RENDER: DESKTOP / FAN / COLLAPSED (Framer Motion)
                <div className={`relative flex items-center justify-center transition-all duration-700
                    ${variant === 'grid' ? 'w-full h-[650px]' : 'w-[400px] h-[500px]'}
                `}>
                    {images.map((src, index) => {
                        const { initial, animate } = getStyles(index);
                        const isGrid = variant === 'grid';

                        // Calculate z-index logic
                        let zIndexStyle: number | undefined;
                        if (variant === 'fan') {
                            zIndexStyle = hoveredIndex === index ? 100 : index + 10;
                        } else if (variant === 'collapsed') {
                            zIndexStyle = index + 1;
                        } else {
                            zIndexStyle = 1;
                        }

                        return (
                            <motion.div
                                key={index}
                                // FIX: Constrain width in 'grid' mode to avoid overlapping click targets
                                // Use margin-left to center the constrained width relative to left-1/2
                                className={`absolute top-0 h-full origin-bottom flex items-center justify-center p-4 cursor-pointer
                                    ${isGrid ? 'w-[24vw] left-1/2 -ml-[12vw]' : 'w-full left-0'}
                                `}
                                initial={initial}
                                animate={animate}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                style={{ zIndex: zIndexStyle }}
                                whileHover={variant === 'fan' ? { scale: 1.1, y: -30, transition: { duration: 0.3 } } : undefined}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                onClick={() => handleItemClick(index)}
                            >
                                <div className={`flex flex-col items-center transition-all duration-700
                                     ${isGrid ? 'w-[24vw]' : 'w-full h-full'}
                                `}>
                                    <div className={`relative overflow-hidden shadow-2xl bg-gray-900 border border-white/10 transition-all duration-700 flex-shrink-0
                                        ${isGrid ? 'rounded-none w-full h-[650px] mb-6' : 'rounded-lg w-full h-full'}
                                    `}>
                                        <img
                                            src={src}
                                            alt={`Portfolio item ${index + 1}`}
                                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                                        />
                                        {isGrid && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-16 h-16 rounded-full border border-white/80 flex items-center justify-center backdrop-blur-sm bg-black/10">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {isGrid && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-center"
                                        >
                                            <h3 className="text-white text-sm md:text-sm tracking-[0.2em] font-bold uppercase mb-1">
                                                {["PHOTOGRAPHY", "CINEMATOGRAPHY", "VFX / COLOR", "CONTEMPORARY ART"][index]}
                                            </h3>
                                            <p className="text-gray-500 text-[10px] md:text-[11px] tracking-[0.2em] uppercase">
                                                {Math.floor(Math.random() * 15) + 8} IMAGES
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
