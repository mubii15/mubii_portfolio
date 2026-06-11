
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ChevronRight, X, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Logo } from '../components/Logo';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const CATEGORIES = ["ALL", "PHOTOGRAPHY", "CINEMATOGRAPHY", "VFX", "COLOR GRADING", "CONTEMPORARY ART"] as const;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CATEGORY_COLORS: Record<string, string> = {
    "PHOTOGRAPHY": "#38bdf8",
    "CINEMATOGRAPHY": "#fbbf24",
    "VFX": "#a855f7",
    "COLOR GRADING": "#ec4899",
    "CONTEMPORARY ART": "#4ade80",
    "ALL": "#ffffff"
};

interface GalleryItem {
    id: number;
    title: string;
    description: string;
    category: string;
    item_type: 'single' | 'project';
    cover_asset: string;
    created_at: string;
    blocks?: any[] | string;
}

export function CategoryGallery() {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    useDocumentTitle(category && category !== 'all' ? category.toUpperCase() : 'Portfolio');
    const [selectedCategory, setSelectedCategory] = useState<string>(category?.toUpperCase() || "ALL");
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [selectedLightboxItem, setSelectedLightboxItem] = useState<GalleryItem | null>(null);
    const [descExpanded, setDescExpanded] = useState(false);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [allItems, setAllItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (category) {
            setSelectedCategory(category.toUpperCase().replace("-", " "));
        }
    }, [category]);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${API_URL}/api/projects`)
            .then(({ data }) => {
                if (Array.isArray(data)) {
                    const published = data.filter((p: any) => p.status === 'published');
                    // Randomize the order
                    const shuffled = published.sort(() => Math.random() - 0.5);
                    setAllItems(shuffled);
                } else {
                    setAllItems([]);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredItems = allItems.filter((item) => {
        const categoryMatch = selectedCategory === "ALL" || item.category === selectedCategory;
        const letterMatch = !selectedLetter || item.title.toUpperCase().startsWith(selectedLetter);
        return categoryMatch && letterMatch;
    });

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            
            {/* SIDEBAR */}
            <div className="w-full h-auto md:w-[30vw] md:h-screen md:sticky top-0 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 bg-black/50 backdrop-blur-3xl z-[60]">
                <div>
                    <div className="flex justify-between items-center mb-8 md:mb-24">
                        <Link to="/" className="opacity-80 hover:opacity-100 transition-opacity">
                            <Logo className="w-8 md:w-10 h-auto" />
                        </Link>
                    </div>

                    <h1 className="text-[8vw] md:text-[5vw] leading-[0.9] font-bold tracking-tighter mb-8 md:mb-16 max-w-[15ch] md:max-w-[10ch]">
                        TIME <span className="opacity-40 italic font-light text-[6vw] md:text-[4vw]">OBEYS</span> ME FOR A FEW FRAMES
                    </h1>

                    <nav className="flex flex-row md:flex-col gap-6 overflow-x-auto pb-4 pt-2 md:pb-0 scrollbar-hide px-4 md:px-0">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => { setSelectedCategory(cat); setSelectedLetter(null); }}
                                className="flex items-center gap-3 md:gap-4 group text-left whitespace-nowrap min-w-fit"
                            >
                                <div 
                                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border transition-all duration-500 flex items-center justify-center shrink-0
                                        ${selectedCategory === cat ? 'scale-125 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'}
                                    `}
                                    style={{ 
                                        borderColor: CATEGORY_COLORS[cat],
                                        backgroundColor: selectedCategory === cat ? CATEGORY_COLORS[cat] : `${CATEGORY_COLORS[cat]}22`
                                    }}
                                >
                                    {selectedCategory === cat && <div className="w-1 h-1 bg-black rounded-full shadow-inner" />}
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

            {/* CONTENT */}
            <div className="w-full md:w-[70vw] min-h-screen p-6 md:p-16 lg:p-24">
                
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

                {/* GRID */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={selectedCategory + (selectedLetter || '')}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {isLoading ? (
                            <div className="h-[50vh] flex items-center justify-center gap-4 opacity-40">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="text-xs tracking-[0.4em] font-bold uppercase">Loading Archive...</span>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="h-[50vh] flex flex-col items-center justify-center gap-4 opacity-20">
                                <span className="text-xs tracking-[0.5em] font-bold uppercase">
                                    {selectedCategory === 'ALL' ? 'Archive is empty — upload works to get started' : `No ${selectedCategory} works yet`}
                                </span>
                                {selectedLetter && (
                                    <button onClick={() => setSelectedLetter(null)} className="text-[10px] underline underline-offset-4 tracking-widest uppercase">
                                        Reset Letter Filter
                                    </button>
                                )}
                            </div>
                        ) : (
                            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3 }}>
                                <Masonry gutter="3rem">
                                    {filteredItems.map((item) => {
                                        const blocks = typeof item.blocks === 'string' ? JSON.parse(item.blocks) : (item.blocks || []);
                                        const subImages = blocks
                                            .filter((b: any) => b.type === 'image' && b.data?.url && b.data.url !== item.cover_asset)
                                            .map((b: any) => b.data.url)
                                            .slice(0, 2);

                                        return (
                                            <motion.div 
                                                key={item.id} 
                                                className="group cursor-pointer relative p-4 md:p-8"
                                                style={{ zIndex: hoveredId === item.id ? 100 : 1 }}
                                                onMouseEnter={() => setHoveredId(item.id)}
                                                onMouseLeave={() => setHoveredId(null)}
                                                onClick={() => {
                                                    if (item.item_type === 'project') {
                                                        navigate(`/project/${item.id}`);
                                                    } else {
                                                        setSelectedLightboxItem(item);
                                                        setDescExpanded(false);
                                                    }
                                                }}
                                            >
                                                <div className="relative mb-4 aspect-[4/5]">
                                                {/* Stack Layers (Only for Projects) */}
                                                {item.item_type === 'project' && (
                                                    <div className="absolute inset-0 -z-10">
                                                        {/* Third Layer (Optional, furthest back) */}
                                                        {subImages.length > 1 && (
                                                            <div className="absolute inset-0 bg-black overflow-hidden border border-white/10 rounded-sm translate-x-3 translate-y-3 -rotate-3 group-hover:translate-x-6 group-hover:translate-y-4 group-hover:-rotate-6 transition-all duration-1000 delay-75 shadow-2xl">
                                                                <motion.img 
                                                                    src={`${API_URL}/api/thumb?path=${encodeURIComponent(subImages[1])}`} 
                                                                    loading="lazy"
                                                                    initial={{ opacity: 0 }}
                                                                    whileInView={{ opacity: 0.6 }}
                                                                    viewport={{ once: true }}
                                                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" 
                                                                />
                                                            </div>
                                                        )}
                                                        {/* Second Layer */}
                                                        {subImages.length > 0 ? (
                                                            <div className="absolute inset-0 bg-black overflow-hidden border border-white/10 rounded-sm translate-x-1.5 translate-y-1.5 rotate-2 group-hover:-translate-x-4 group-hover:translate-y-2 group-hover:rotate-3 transition-all duration-1000 shadow-2xl">
                                                                <motion.img 
                                                                    src={`${API_URL}/api/thumb?path=${encodeURIComponent(subImages[0])}`} 
                                                                    loading="lazy"
                                                                    initial={{ opacity: 0 }}
                                                                    whileInView={{ opacity: 0.6 }}
                                                                    viewport={{ once: true }}
                                                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" 
                                                                />
                                                            </div>
                                                        ) : (
                                                            // Fallback if no sub-images
                                                            <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-sm translate-x-1.5 translate-y-1.5 rotate-2 group-hover:-translate-x-4 group-hover:translate-y-3 group-hover:rotate-6 transition-all duration-700" />
                                                        )}
                                                    </div>
                                                )}
                                                <div 
                                                    className="relative w-full h-full overflow-hidden bg-white/5 border border-white/10 transition-all duration-1000 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10"
                                                    style={{ boxShadow: `0 0 40px ${CATEGORY_COLORS[item.category] ?? '#fff'}22` }}
                                                >
                                                    <motion.img
                                                        src={`${API_URL}/api/thumb?path=${encodeURIComponent(item.cover_asset)}`}
                                                        alt={item.title}
                                                        loading="lazy"
                                                        initial={{ opacity: 0 }}
                                                        whileInView={{ opacity: 1 }}
                                                        viewport={{ once: true }}
                                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-4 left-4 z-10">
                                                        <span 
                                                            className="text-[8px] tracking-[0.3em] font-bold px-2 py-1 backdrop-blur-md rounded-full border"
                                                            style={{ 
                                                                backgroundColor: item.item_type === 'project' ? (CATEGORY_COLORS[item.category] ?? '#fff') : 'rgba(0,0,0,0.5)',
                                                                color: item.item_type === 'project' ? '#000' : (CATEGORY_COLORS[item.category] ?? '#fff'),
                                                                borderColor: item.item_type === 'project' ? 'transparent' : (CATEGORY_COLORS[item.category] ?? '#fff')
                                                            }}
                                                        >
                                                            {item.item_type.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                        <ChevronRight className="text-white w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-[10px] tracking-[0.2em] font-bold uppercase opacity-80 group-hover:opacity-100 transition-opacity">{item.title}</h3>
                                                <p className="text-[9px] tracking-[0.2em] font-medium opacity-30 uppercase">{item.category}</p>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </Masonry>
                        </ResponsiveMasonry>
                    )}
                </motion.div>
            </AnimatePresence>

                {/* LIGHTBOX */}
                <AnimatePresence>
                    {selectedLightboxItem && (
                        <motion.div 
                            className="fixed inset-0 z-[100] flex items-center justify-center p-8 md:p-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setSelectedLightboxItem(null)} />
                            <button onClick={() => setSelectedLightboxItem(null)} className="absolute top-8 right-8 z-[110] p-4 text-white hover:rotate-90 transition-transform duration-500">
                                <X className="w-8 h-8" />
                            </button>
                            <div className="relative z-[110] flex flex-col md:flex-row gap-12 max-w-7xl w-full items-center" onClick={() => setSelectedLightboxItem(null)}>
                                <motion.div 
                                    className="w-full md:w-3/5 flex items-center justify-center bg-white/5 border border-white/10 p-4 min-h-[40vh]"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                >
                                    <motion.img 
                                        src={selectedLightboxItem.cover_asset} 
                                        alt={selectedLightboxItem.title} 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        loading="lazy"
                                        className="max-w-full max-h-[75vh] object-contain shadow-2xl" 
                                    />
                                </motion.div>
                                <div className="w-full md:w-2/5 flex flex-col gap-8" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                    <div>
                                        <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.4, x: 0 }} transition={{ delay: 0.3 }} className="text-xs tracking-[0.5em] font-bold uppercase block">
                                            {selectedLightboxItem.category} &bull; {selectedLightboxItem.item_type}
                                        </motion.span>
                                        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-4xl md:text-7xl font-bold tracking-tighter leading-none mt-2">
                                            {selectedLightboxItem.title}
                                        </motion.h2>
                                    </div>
                                    {selectedLightboxItem.description && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                                            <p className={`text-sm md:text-base leading-relaxed max-w-md whitespace-pre-wrap break-words opacity-60 transition-all ${
                                                descExpanded ? '' : 'line-clamp-4'
                                            }`}>
                                                {selectedLightboxItem.description}
                                            </p>
                                            {selectedLightboxItem.description.length > 200 && (
                                                <button
                                                    onClick={() => setDescExpanded(v => !v)}
                                                    className="mt-2 text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity"
                                                >
                                                    {descExpanded ? 'See Less ↑' : 'See More ↓'}
                                                </button>
                                            )}
                                        </motion.div>
                                    )}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex gap-6 mt-4">
                                        <button className="flex items-center gap-3 px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.2em] hover:scale-105 transition-transform">
                                            SAVE WORK <ArrowRight className="w-4 h-4" />
                                        </button>
                                        <button className="text-xs font-bold tracking-[0.2em] border border-white/20 px-8 py-4 hover:bg-white/10 transition-colors">SHARE</button>
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
