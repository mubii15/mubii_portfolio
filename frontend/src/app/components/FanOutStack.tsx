
import { motion, AnimatePresence } from 'motion/react';
import { OptimizedImage } from './OptimizedImage';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface CategoryItem {
    id: number;
    title: string;
    item_type: string;
    description: string;
    cover_asset: string;
    created_at: string;
    date?: string;
}

export interface CategoryData {
    name: string;
    items: CategoryItem[];
}

interface FanOutStackProps {
    images: string[];
    variant?: 'fan' | 'collapsed' | 'grid';
    onIndexSelect?: (index: number | null) => void;
    selectedIndex?: number | null;
    categoryData?: CategoryData[];
}



export function FanOutStack({ images, variant = 'fan', onIndexSelect, selectedIndex: controlledIndex, categoryData = [] }: FanOutStackProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [localSelectedIndex, setLocalSelectedIndex] = useState<number | null>(null);
    const [activeDetailIndex, setActiveDetailIndex] = useState(0);
    const [descExpanded, setDescExpanded] = useState(false);
    const reelRef = useRef<HTMLDivElement>(null);

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
                        };
                    } else {
                        // Not selected: Dim and Shrink
                        animate = {
                            x: `${offset * vwSpacing}vw`,
                            y: 0,
                            rotate: 0,
                            scale: 0.9, // Shrink
                            opacity: 0.3, // Dim
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
        setActiveDetailIndex(0);
        setDescExpanded(false);
    };

    // Handle reel scroll to update active metadata
    const handleReelScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        const catCount = selectedIndex !== null ? Math.max(1, (categoryData[selectedIndex]?.items?.length ?? 1)) : 1;
        const itemHeight = e.currentTarget.scrollHeight / (catCount + 0.2);
        const newIndex = Math.min(Math.round(scrollTop / itemHeight), catCount - 1);
        if (newIndex !== activeDetailIndex) {
            setActiveDetailIndex(newIndex);
            setDescExpanded(false);
        }
    };

    return (
        <>
            {/* Overlay / Detail View */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        className="fixed inset-0 overflow-hidden"
                        style={{ zIndex: 999 }}
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
                        
                        {/* IMAGE METADATA - Transitions on Scroll */}
                        {selectedIndex !== null && (
                            <div 
                                className="absolute pointer-events-none z-20 overflow-hidden"
                                style={{
                                top: isMobile ? 'auto' : '50%',
                                bottom: isMobile ? '120px' : 'auto',
                                transform: isMobile ? 'none' : 'translateY(-50%)',
                                left: isMobile 
                                    ? '5vw' 
                                    : (selectedIndex ?? 0) < images.length / 2 
                                        ? `calc(50% + ${((selectedIndex ?? 0) - (images.length - 1) / 2) * 24.5}vw + 16vw)`
                                        : `calc(50% + ${((selectedIndex ?? 0) - (images.length - 1) / 2) * 24.5}vw - 52vw)`,
                                width: isMobile ? '90vw' : '36vw',
                                height: 'auto',
                                paddingLeft: isMobile ? '0' : ((selectedIndex ?? 0) < images.length / 2 ? '0' : '4vw'),
                                paddingRight: isMobile ? '0' : ((selectedIndex ?? 0) < images.length / 2 ? '4vw' : '0'),
                                textAlign: isMobile 
                                    ? 'center' 
                                    : (selectedIndex ?? 0) < images.length / 2 ? 'left' : 'right',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isMobile 
                                    ? 'center' 
                                    : (selectedIndex ?? 0) < images.length / 2 ? 'flex-start' : 'flex-end'
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {(() => {
                                        const catData = categoryData[selectedIndex];
                                        const item = catData?.items[activeDetailIndex];
                                        if (!item) return null;
                                        const formattedDate = item.date
                                            ? new Date(item.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase()
                                            : item.created_at
                                                ? new Date(item.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase()
                                                : '';
                                        return (
                                            <motion.div
                                                key={`${selectedIndex}-${activeDetailIndex}`}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -30 }}
                                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                                className={`flex flex-col gap-4 md:gap-6 w-full ${isMobile ? 'bg-black/40 backdrop-blur-md p-6 rounded-2xl' : ''}`}
                                                style={{ 
                                                    alignItems: isMobile 
                                                        ? 'center' 
                                                        : (selectedIndex ?? 0) < images.length / 2 ? 'flex-start' : 'flex-end'
                                                }}
                                            >
                                                <div className="flex flex-col gap-1 md:gap-2">
                                                    <motion.div 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0.5 }}
                                                        className="text-[10px] md:text-xs tracking-[0.4em] font-bold capitalize"
                                                    >
                                                        {item.item_type} • {formattedDate}
                                                    </motion.div>
                                                    <motion.h2 className="text-2xl md:text-5xl font-bold tracking-tighter leading-none">
                                                        {item.title.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ').split('').map((char: string, i: number) => (
                                                            <motion.span
                                                                key={i}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: i * 0.02 + 0.1, duration: 0.5 }}
                                                            >
                                                                {char}
                                                            </motion.span>
                                                        ))}
                                                    </motion.h2>
                                                </div>
                                                {item.description && (
                                                    <div>
                                                        <motion.p 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 0.6 }}
                                                            transition={{ delay: 0.4 }}
                                                            className={`text-xs md:text-sm tracking-wide leading-relaxed max-w-[400px] transition-all ${
                                                                descExpanded ? '' : 'line-clamp-3'
                                                            }`}
                                                        >
                                                            {item.description}
                                                        </motion.p>
                                                        {item.description.length > 120 && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setDescExpanded(v => !v); }}
                                                                className="mt-1 text-[9px] font-bold tracking-[0.3em] uppercase opacity-30 hover:opacity-80 transition-opacity pointer-events-auto"
                                                            >
                                                                {descExpanded ? 'See Less ↑' : 'See More ↓'}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                                {isMobile && (
                                                    <div className="mt-4 pointer-events-auto w-full flex justify-center z-30">
                                                        <Link 
                                                            to="/gallery" 
                                                            className="inline-flex items-center gap-4 px-6 py-3 border border-white/20 text-white text-[10px] font-bold tracking-[0.3em] uppercase rounded-full bg-white/10 backdrop-blur-sm"
                                                        >
                                                            See All Works
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })()}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Scrollable Content Reel - Aligned to Selected Item */}
                        <motion.div
                            ref={reelRef}
                            onScroll={handleReelScroll}
                            className="absolute inset-0 w-full h-full overflow-y-auto scrollbar-hide py-10 pointer-events-auto cursor-pointer"
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 0, opacity: 0 }}
                            onClick={(e) => {
                                if (e.target === e.currentTarget) closeDetail();
                            }}
                        >
                            <div 
                                className="flex flex-col gap-8 w-full cursor-default"
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) closeDetail();
                                }}
                                style={{
                                    width: isMobile ? '80vw' : '24vw',
                                    marginLeft: isMobile
                                        ? '10vw'
                                        : `calc(50% + ${(selectedIndex - center) * 24.5}vw - 12vw)`
                                }}
                            >
                                {/* Show the 3 most recent items in this category */}
                                {(() => {
                                    const catItems = categoryData[selectedIndex]?.items ?? [];
                                    const reelImages = catItems.length > 0
                                        ? catItems.map(it => it.cover_asset)
                                        : [images[selectedIndex]];
                                    return reelImages.map((src, item) => (
                                        <div key={item} className="w-full aspect-[400/650] bg-gray-900 shadow-2xl border border-white/10 shrink-0">
                                            <OptimizedImage
                                                src={src}
                                                alt="Reel Image"
                                                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    ));
                                })()}
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
                    className={`w-full h-[60vh] max-h-[500px] flex items-center overflow-x-auto snap-x snap-mandatory scrollbar-hide px-[10vw] transition-all duration-500`}
                    style={{
                        opacity: selectedIndex !== null ? 0.3 : 1,
                        pointerEvents: selectedIndex !== null ? 'none' : 'auto',
                        WebkitOverflowScrolling: 'touch'
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
                                    <OptimizedImage
                                        src={src}
                                        alt={`Portfolio item ${index + 1}`}
                                        className="w-full h-full object-cover pointer-events-none select-none"
                                        draggable={false}
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
                                    <h3 className="text-white text-sm tracking-[0.2em] font-bold capitalize mb-1">
                                        {["Photography", "Cinematography", "VFX / Color", "Contemporary Art"][index]}
                                    </h3>
                                    <p className="text-gray-500 text-[10px] tracking-[0.2em] capitalize">
                                        {categoryData[index]?.items?.length ?? 0} Images
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // RENDER: DESKTOP / FAN / COLLAPSED (Framer Motion)
                <div 
                    className={`relative flex items-center justify-center transition-all duration-700
                        ${variant === 'grid' ? 'w-full h-[650px]' : (isMobile ? 'w-[70vw] h-[50vh]' : 'w-[400px] h-[500px]')}
                    `}
                >
                    {images.map((src, index) => {
                        const { initial, animate } = getStyles(index);
                        const isGrid = variant === 'grid';

                        // Calculate z-index logic
                        let zIndexStyle: number;
                        if (variant === 'grid') {
                            zIndexStyle = selectedIndex === index ? 10 : 50 - index;
                        } else {
                            zIndexStyle = hoveredIndex === index && variant === 'fan' ? 100 : 50 - index;
                        }

                        return (
                            <motion.div
                                key={index}
                                className={`absolute top-0 origin-bottom flex items-center justify-center p-2 md:p-4 cursor-pointer transition-all duration-700
                                    ${isGrid ? 'w-[24vw] left-1/2 -ml-[12vw] h-full' : (isMobile ? 'w-[70vw] left-1/2 -ml-[35vw] h-full' : 'w-[400px] left-1/2 -ml-[200px] h-full')}
                                `}
                                initial={initial}
                                animate={{ ...animate, zIndex: zIndexStyle }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], zIndex: { duration: 0 } }}
                                style={{ zIndex: zIndexStyle }}
                                whileHover={variant === 'fan' ? { scale: 1.1, y: -30, transition: { duration: 0.3 } } : undefined}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                onClick={() => handleItemClick(index)}
                            >
                                <div 
                                    className={`flex flex-col items-center transition-all duration-700
                                        ${isGrid ? 'w-[24vw] h-full' : 'w-full h-full'}
                                    `}
                                >
                                    <div 
                                        className={`relative overflow-hidden shadow-2xl bg-gray-900 border border-white/10 flex-shrink-0 w-full transition-all duration-700
                                            ${isGrid ? 'h-[650px] rounded-none mb-6' : 'h-full rounded-xl mb-0'}
                                        `}
                                    >
                                        <OptimizedImage
                                            src={src}
                                            forceEager={index === 0}
                                            alt={['Photography', 'Cinematography', 'VFX / Color', 'Contemporary Art'][index] || `Portfolio item ${index + 1}`}
                                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                                        />
                                        <AnimatePresence>
                                            {isGrid && (
                                                <motion.div 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                                >
                                                    <div className="w-16 h-16 rounded-full border border-white/80 flex items-center justify-center backdrop-blur-sm bg-black/10">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <AnimatePresence>
                                        {isGrid && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-center"
                                            >
                                                <h3 className="text-white text-sm md:text-sm tracking-[0.2em] font-bold capitalize mb-1">
                                                    {["Photography", "Cinematography", "VFX / Color", "Contemporary Art"][index]}
                                                </h3>
                                                <p className="text-gray-500 text-[10px] md:text-[11px] tracking-[0.2em] capitalize">
                                                    {categoryData[index]?.items?.length ?? 0} Images
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
