
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { GALLERY_DATA, GalleryItem } from '../../data/galleryData';
import { ChevronRight, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ["ALL", "PHOTOGRAPHY", "CINEMATOGRAPHY", "VFX / COLOR", "CONTEMPORARY ART"] as const;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CATEGORY_COLORS: Record<string, string> = {
    "PHOTOGRAPHY": "#38bdf8", // Cyan
    "CINEMATOGRAPHY": "#fbbf24", // Amber
    "VFX / COLOR": "#a855f7", // Purple
    "CONTEMPORARY ART": "#4ade80", // Green
    "ALL": "#ffffff"
};

export function CategoryGallery() {
    const navigate = useNavigate();
    const { category: initialCategory } = useParams<{ category: string }>();
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory?.toUpperCase() || "ALL");
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [selectedLightboxItem, setSelectedLightboxItem] = useState<GalleryItem | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Sync state with URL param if it changes
    useEffect(() => {
        if (initialCategory) {
            setSelectedCategory(initialCategory.toUpperCase().replace("-", " / "));
        }
    }, [initialCategory]);

    const filteredItems = GALLERY_DATA.filter((item: GalleryItem) => {
        const categoryMatch = selectedCategory === "ALL" || item.category === selectedCategory;
        const letterMatch = !selectedLetter || item.name.startsWith(selectedLetter);
        return categoryMatch && letterMatch;
    });

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            
            {/* SIDEBAR / MOBILE HEADER - Responsive */}
            <div className="w-full h-auto md:w-[30vw] md:h-screen md:sticky top-0 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 bg-black/50 backdrop-blur-3xl z-[60]">
                <div>
                    <div className="flex justify-between items-center mb-8 md:mb-24 text-center md:text-left">
                        <Link to="/" className="text-xl font-bold tracking-tighter opacity-80 hover:opacity-100 transition-opacity">
                            MUBARAK <span className="font-light italic">ISMAIL</span>
                        </Link>
                        <div className="md:hidden flex flex-col items-end gap-1">
                             <span className="text-[8px] tracking-[0.4em] opacity-40 font-bold uppercase">EST. 2026</span>
                        </div>
                    </div>

                    <h1 className="text-[8vw] md:text-[5vw] leading-[0.9] font-bold tracking-tighter mb-8 md:mb-16 max-w-[15ch] md:max-w-[10ch] text-center md:text-left">
                        TIME <span className="opacity-40 italic font-light text-[6vw] md:text-[4vw]">OBEYS</span> ME FOR A FEW FRAMES
                    </h1>

                    <nav className="flex flex-row md:flex-col gap-6 md:gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide px-2 md:px-0">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setSelectedLetter(null);
                                }}
                                className="flex items-center gap-3 md:gap-4 group text-left whitespace-nowrap min-w-fit"
                            >
                                <div 
                                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border transition-all duration-500 flex items-center justify-center
                                        ${selectedCategory === cat ? 'scale-125' : 'group-hover:border-white/50'}
                                    `}
                                    style={{ 
                                        borderColor: selectedCategory === cat ? CATEGORY_COLORS[cat] : 'rgba(255,255,255,0.2)',
                                        backgroundColor: selectedCategory === cat ? CATEGORY_COLORS[cat] : 'transparent'
                                    }}
                                >
                                    {selectedCategory === cat && <div className="w-1 h-1 bg-black rounded-full" />}
                                </div>
                                <span 
                                    className={`text-[10px] md:text-xs tracking-[0.3em] font-bold transition-all duration-300 
                                        ${selectedCategory === cat ? 'translate-x-1 md:translate-x-2' : 'opacity-30 group-hover:opacity-60'}
                                    `}
                                    style={{ 
                                        color: selectedCategory === cat ? CATEGORY_COLORS[cat] : 'white',
                                        textShadow: selectedCategory === cat ? `0 0 20px ${CATEGORY_COLORS[cat]}44` : 'none'
                                    }}
                                >
                                    {cat}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="hidden md:flex flex-col gap-2">
                    <span className="text-[10px] tracking-[0.4em] opacity-20 font-bold uppercase">EST. 2026</span>
                    <span className="text-[10px] tracking-[0.4em] opacity-40 font-bold">MUBARAK ISMAIL &copy; 2026</span>
                </div>
            </div>

            {/* CONTENT SECTION - Scrollable */}
            <div className="w-full md:w-[70vw] min-h-screen p-6 md:p-12">
                
                {/* Alphabet Filter */}
                <div className="flex flex-wrap gap-x-6 gap-y-4 mb-12 py-6 border-y border-white/5">
                    <button 
                        onClick={() => setSelectedLetter(null)}
                        className={`text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-full transition-all
                            ${selectedLetter === null ? 'bg-white text-black' : 'opacity-30 hover:opacity-100'}
                        `}
                    >
                        &bull; All
                    </button>
                    {ALPHABET.map(letter => (
                        <button
                            key={letter}
                            onClick={() => setSelectedLetter(letter)}
                            className={`text-[10px] font-bold tracking-widest transition-all
                                ${selectedLetter === letter ? 'opacity-100 scale-125' : 'opacity-20 hover:opacity-60'}
                            `}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                {/* GRID SECTION */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={selectedCategory + (selectedLetter || '')}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                            <Masonry gutter="3rem">
                                {filteredItems.map((item: GalleryItem) => (
                                    <motion.div 
                                        key={item.id} 
                                        className="group cursor-pointer relative"
                                        style={{ zIndex: hoveredId === item.id ? 100 : 1 }}
                                        onMouseEnter={() => setHoveredId(item.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        onClick={() => {
                                            if (item.type === 'project') {
                                                navigate(`/project/${item.id}`);
                                            } else {
                                                setSelectedLightboxItem(item);
                                            }
                                        }}
                                    >
                                        <div className={`relative mb-4 transition-all duration-700
                                            ${item.large ? 'aspect-[4/6]' : 'aspect-[4/5]'}
                                            ${item.type === 'project' ? 'p-10 md:p-16' : ''}
                                        `}>
                                            {/* Stack Layers (if project) - Fans out on hover */}
                                            {item.type === 'project' && (
                                                <>
                                                    {/* Layer 3 (Bottom) */}
                                                    <motion.div 
                                                        className="absolute inset-x-6 inset-y-6 md:inset-x-12 md:inset-y-12 bg-white/10 border border-white/20 origin-center shadow-[0_20px_60px_rgba(0,0,0,1)]"
                                                        initial={{ rotate: -8, x: -16, y: -10 }}
                                                        whileHover={{ rotate: -12, x: -32, y: -20 }}
                                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                                        style={{ zIndex: 1 }}
                                                    >
                                                        <img 
                                                            src={item.additionalImages?.[2] || item.additionalImages?.[1] || item.image} 
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    </motion.div>
                                                    {/* Layer 2 (Middle) */}
                                                    <motion.div 
                                                        className="absolute inset-x-6 inset-y-6 md:inset-x-12 md:inset-y-12 bg-white/10 border border-white/20 origin-center shadow-[0_15px_45px_rgba(0,0,0,0.9)]"
                                                        initial={{ rotate: -4, x: -8, y: -5 }}
                                                        whileHover={{ rotate: -6, x: -16, y: -10 }}
                                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                                        style={{ zIndex: 2 }}
                                                    >
                                                        <img 
                                                            src={item.additionalImages?.[1] || item.additionalImages?.[0] || item.image} 
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    </motion.div>
                                                    {/* Layer 1 (Top stack layer) */}
                                                    <motion.div 
                                                        className="absolute inset-x-6 inset-y-6 md:inset-x-12 md:inset-y-12 bg-white/10 border border-white/20 origin-center shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                                                        initial={{ rotate: 2, x: 6, y: -3 }}
                                                        whileHover={{ rotate: 3, x: 12, y: -6 }}
                                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                                        style={{ zIndex: 3 }}
                                                    >
                                                        <img 
                                                            src={item.additionalImages?.[0] || item.image} 
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    </motion.div>
                                                </>
                                            )}

                                            {/* Main Image Layer */}
                                            <div 
                                                className="relative w-full h-full overflow-hidden bg-white/5 border border-white/10 z-10 transition-all duration-1000 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                                                style={{ 
                                                    boxShadow: `0 0 40px ${CATEGORY_COLORS[item.category]}22`
                                                }}
                                            >
                                                <motion.img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                                />
                                                
                                                {/* Type Indicator */}
                                                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                                                    <span 
                                                        className={`text-[8px] tracking-[0.3em] font-bold px-2 py-1 backdrop-blur-md rounded-full border`}
                                                        style={{ 
                                                            backgroundColor: item.type === 'project' ? CATEGORY_COLORS[item.category] : 'rgba(0,0,0,0.5)',
                                                            color: item.type === 'project' ? '#000' : CATEGORY_COLORS[item.category],
                                                            borderColor: item.type === 'project' ? 'transparent' : `${CATEGORY_COLORS[item.category]}`
                                                        }}
                                                    >
                                                        {item.type.toUpperCase()}
                                                    </span>
                                                </div>

                                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                
                                                {/* Corner indicator */}
                                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                    <ChevronRight className="text-white w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-[10px] tracking-[0.2em] font-bold uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                                                {item.name}
                                            </h3>
                                            <p className="text-[9px] tracking-[0.2em] font-medium opacity-30 uppercase">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </Masonry>
                        </ResponsiveMasonry>

                        {filteredItems.length === 0 && (
                            <div className="h-[50vh] flex flex-col items-center justify-center gap-4 opacity-20">
                                <span className="text-xs tracking-[0.5em] font-bold uppercase">No Artists Found</span>
                                <button 
                                    onClick={() => { setSelectedCategory("ALL"); setSelectedLetter(null); }}
                                    className="text-[10px] underline underline-offset-4 tracking-widest uppercase hover:opacity-100 cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* LIGHTBOX OVERLAY */}
                <AnimatePresence>
                    {selectedLightboxItem && (
                        <motion.div 
                            className="fixed inset-0 z-[100] flex items-center justify-center p-8 md:p-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div 
                                className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                                onClick={() => setSelectedLightboxItem(null)}
                            />

                            <button 
                                onClick={() => setSelectedLightboxItem(null)}
                                className="absolute top-8 right-8 z-[110] p-4 text-white hover:rotate-90 transition-transform duration-500"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <div className="relative z-[110] flex flex-col md:flex-row gap-12 max-w-7xl w-full items-center">
                                {/* Image Section */}
                                <motion.div 
                                    className="w-full md:w-3/5 aspect-[4/5] bg-white/5 overflow-hidden border border-white/10"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <img 
                                        src={selectedLightboxItem.image} 
                                        alt={selectedLightboxItem.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>

                                {/* Text Content Section */}
                                <div className="w-full md:w-2/5 flex flex-col gap-8">
                                    <div className="flex flex-col gap-2">
                                        <motion.span 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 0.4, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-xs tracking-[0.5em] font-bold uppercase"
                                        >
                                            {selectedLightboxItem.date} &bull; {selectedLightboxItem.category}
                                        </motion.span>
                                        <motion.h2 
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4, duration: 0.8 }}
                                            className="text-4xl md:text-7xl font-bold tracking-tighter leading-none"
                                        >
                                            {selectedLightboxItem.name}
                                        </motion.h2>
                                    </div>

                                    <motion.p 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.6 }}
                                        transition={{ delay: 0.6, duration: 1 }}
                                        className="text-sm md:text-lg leading-relaxed max-w-md"
                                    >
                                        {selectedLightboxItem.description}
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="flex gap-6 mt-4"
                                    >
                                        <button className="flex items-center gap-3 px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.2em] hover:scale-105 transition-transform">
                                            SAVE WORK <ArrowRight className="w-4 h-4" />
                                        </button>
                                        <button className="text-xs font-bold tracking-[0.2em] border border-white/20 px-8 py-4 hover:bg-white/10 transition-colors">
                                            SHARE
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
