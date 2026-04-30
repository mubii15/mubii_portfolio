
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

const METADATA_BY_CATEGORY = [
    {
        name: "PHOTOGRAPHY",
        items: [
            { title: "URBAN SOLITUDE", type: "SINGLE", date: "MAR 2024", desc: "A series exploring the quiet moments within bustling cityscapes, focusing on minimal human presence." },
            { title: "NEON NIGHTS", type: "PROJECT", date: "JAN 2024", desc: "Capturing the vibrant energy and cinematic lighting of night street photography." },
            { title: "ARCHITECTURAL LINES", type: "SINGLE", date: "NOV 2023", desc: "Symmetry and geometric patterns in modern metropolitan design." },
            { title: "SILENT PORTRAITS", type: "PROJECT", date: "AUG 2023", desc: "Low-light portraiture focusing on emotion through shadow and form." },
            { title: "DESERT ECHOES", type: "SINGLE", date: "MAY 2023", desc: "The intersection of vast landscapes and minimal textures." },
            { title: "GRAIN & GLORY", type: "PROJECT", date: "FEB 2023", desc: "Experimental film photography highlighting texture and imperfection." }
        ]
    },
    {
        name: "CINEMATOGRAPHY",
        items: [
            { title: "THE LAST FRAME", type: "SHORT FILM", date: "APR 2024", desc: "Directing the visual narrative for an experimental short about memory." },
            { title: "GOLDEN HOUR", type: "MUSIC VIDEO", date: "FEB 2024", desc: "Cinematic lighting setup for a high-concept production." },
            { title: "DUSK UNTIL DAWN", type: "PROJECT", date: "DEC 2023", desc: "Continuous 24-hour time-lapse capturing light transitions." },
            { title: "VELVET MOTION", type: "SINGLE", date: "OCT 2023", desc: "Slow-motion study of fluid dynamics and light." },
            { title: "URBAN PULSE", type: "PROJECT", date: "JUL 2023", desc: "A fast-paced rhythmic montage of city life." },
            { title: "NOIR TALES", type: "SHORT FILM", date: "MAR 2023", desc: "Modern black and white aesthetic for a dramatic short." }
        ]
    },
    {
        name: "VFX / COLOR",
        items: [
            { title: "COSMOS BEYOND", type: "PROJECT", date: "MAY 2024", desc: "Procedural planet generation and space simulation." },
            { title: "GLITCH REALITY", type: "SINGLE", date: "MAR 2024", desc: "Integrating digital artifacts into physical environments." },
            { title: "PASTEL SKIES", type: "COLOR GRADE", date: "JAN 2024", desc: "Custom LUT development for a dream-like cinematic palette." },
            { title: "PARTICLE FLOW", type: "PROJECT", date: "NOV 2023", desc: "Dynamic simulation of over 2 million particles." },
            { title: "CHROME DREAMS", type: "VFX", date: "SEP 2023", desc: "Photorealistic rendering of reflective surfaces." },
            { title: "RETRO FUTURE", type: "COLOR GRADE", date: "JUN 2023", desc: "Stylized aesthetic blending 80s neon with modern tech." }
        ]
    },
    {
        name: "CONTEMPORARY ART",
        items: [
            { title: "FLUID IDENTITIES", type: "INSTALLATION", date: "JUN 2024", desc: "Interactive digital canvas reacting to viewer distance." },
            { title: "ECHO CHAMBERS", type: "PROJECT", date: "APR 2024", desc: "A series of generative art pieces based on sound patterns." },
            { title: "DIGITAL NATURE", type: "SINGLE", date: "FEB 2024", desc: "algorithmic growth patterns mimicking organic life." },
            { title: "RESONANCE", type: "INSTALLATION", date: "DEC 2023", desc: "Mapping visual data onto geometric sculptural forms." },
            { title: "CYBER ORGANICS", type: "PROJECT", date: "OCT 2023", desc: "Blending biological structures with robotic aesthetics." },
            { title: "VIRTUAL HORIZONS", type: "SINGLE", date: "JUL 2023", desc: "Exploring perspective in purely digital environments." }
        ]
    }
];

export function FanOutStack({ images, variant = 'fan', onIndexSelect, selectedIndex: controlledIndex, categoryData = [] }: FanOutStackProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [localSelectedIndex, setLocalSelectedIndex] = useState<number | null>(null);
    const [activeDetailIndex, setActiveDetailIndex] = useState(0);
    const reelRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

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
        setActiveDetailIndex(0);
    };

    // Handle reel scroll to update active metadata
    const handleReelScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        const catCount = selectedIndex !== null ? Math.max(1, (categoryData[selectedIndex]?.items?.length ?? 1)) : 1;
        const itemHeight = e.currentTarget.scrollHeight / (catCount + 0.2);
        const newIndex = Math.min(Math.round(scrollTop / itemHeight), catCount - 1);
        if (newIndex !== activeDetailIndex) {
            setActiveDetailIndex(newIndex);
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

                        {/* SEE MORE Action - Pinned to Bottom Right */}
                        <motion.div
                            className="absolute bottom-10 right-10 md:bottom-16 md:right-16 z-[60] flex flex-col items-end cursor-pointer"
                            initial="initial"
                            whileHover="hover"
                            animate="visible"
                            onClick={() => {
                                const category = METADATA_BY_CATEGORY[selectedIndex]?.name.toLowerCase().replace(" / ", "-");
                                navigate(`/gallery/${category}`);
                            }}
                        >
                            <motion.span
                                variants={{
                                    initial: { opacity: 0, y: 10 },
                                    visible: { opacity: 0.6, y: 0 },
                                    hover: { opacity: 1, y: 0 }
                                }}
                                transition={{ duration: 0.5 }}
                                className="text-white text-[10px] md:text-xs tracking-[0.4em] font-bold uppercase transition-all"
                            >
                                SEE MORE
                            </motion.span>
                            <motion.div
                                variants={{
                                    initial: { scaleX: 0 },
                                    visible: { scaleX: 0 },
                                    hover: { scaleX: 1 }
                                }}
                                className="h-[1px] bg-white w-full mt-1.5 origin-right"
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </motion.div>

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
                                                        className="text-[10px] md:text-xs tracking-[0.4em] font-bold uppercase"
                                                    >
                                                        {item.item_type.toUpperCase()} • {formattedDate}
                                                    </motion.div>
                                                    <motion.h2 className="text-2xl md:text-5xl font-bold tracking-tighter leading-none">
                                                        {item.title.split('').map((char, i) => (
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
                                                    <motion.p 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0.6 }}
                                                        transition={{ delay: 0.4 }}
                                                        className="text-xs md:text-sm tracking-wide leading-relaxed max-w-[400px]"
                                                    >
                                                        {item.description}
                                                    </motion.p>
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
                            className="absolute top-0 h-full overflow-y-auto scrollbar-hide py-10"
                            style={{
                                width: isMobile ? '80vw' : '24vw',
                                left: isMobile
                                    ? '10vw'
                                    : `calc(50% + ${(selectedIndex - center) * 24.5}vw - 12vw)`
                            }}
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 0, opacity: 0 }}
                        >
                            <div className="flex flex-col gap-8 w-full">
                                {/* Show the 3 most recent items in this category */}
                                {(() => {
                                    const catItems = categoryData[selectedIndex]?.items ?? [];
                                    const reelImages = catItems.length > 0
                                        ? catItems.slice(0, 3).map(it => it.cover_asset)
                                        : [images[selectedIndex]];
                                    return reelImages.map((src, item) => (
                                        <div key={item} className="w-full aspect-[400/650] bg-gray-900 shadow-2xl border border-white/10 shrink-0">
                                            <img
                                                src={src}
                                                loading="lazy"
                                                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                                                alt=""
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
                                        loading="lazy"
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
                                            loading="lazy"
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
