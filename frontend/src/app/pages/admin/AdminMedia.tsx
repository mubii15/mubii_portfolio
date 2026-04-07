
import { motion, AnimatePresence } from 'motion/react';
import { 
    Search, 
    Filter, 
    Grid, 
    Upload, 
    Trash2, 
    Copy,
    Image as ImageIcon,
    Film,
    CheckCircle2,
    X,
    ExternalLink,
    ChevronDown
} from 'lucide-react';
import { GALLERY_DATA, GalleryItem } from '../../../data/galleryData';
import { useState, useMemo } from 'react';

export function AdminMedia() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isCopying, setIsCopying] = useState<string | null>(null);

    const filteredMedia = useMemo(() => {
        return GALLERY_DATA.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'all' || 
                              (filterType === 'image' && !item.category.includes('CINEMA') && !item.category.includes('VFX')) ||
                              (filterType === 'video' && (item.category.includes('CINEMA') || item.category.includes('VFX')));
            return matchesSearch && matchesType;
        });
    }, [searchQuery, filterType]);

    const toggleSelect = (id: string) => {
        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setIsCopying(id);
        setTimeout(() => setIsCopying(null), 2000);
    };

    return (
        <div className="flex flex-col gap-10">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic font-black">Vault</h1>
                    <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">Asset Control / {filteredMedia.length} Items</p>
                </div>
                <div className="flex gap-4">
                    {selectedItems.length > 0 && (
                        <motion.button 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black tracking-widest uppercase rounded-xl hover:bg-red-500/20 transition-all"
                        >
                            <Trash2 className="w-4 h-4" /> Delete ({selectedItems.length})
                        </motion.button>
                    )}
                    <button className="flex items-center gap-3 px-8 py-3 bg-cyan-500 text-black text-[10px] font-black tracking-widest uppercase rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                        <Upload className="w-4 h-4" /> Upload Assets
                    </button>
                </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white/[0.02] border border-white/5 p-5 rounded-[32px] backdrop-blur-3xl">
                <div className="flex gap-4 flex-1 max-w-xl">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-cyan-500 transition-colors" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH BY NAME, TYPE OR CATEGORY..." 
                            className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-[10px] font-bold tracking-widest uppercase focus:border-cyan-500/50 outline-none transition-all placeholder:text-white/10"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full">
                                <X className="w-3 h-3 text-slate-500" />
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <FilterButton 
                        active={filterType === 'all'} 
                        onClick={() => setFilterType('all')} 
                        label="Everything" 
                    />
                    <FilterButton 
                        active={filterType === 'image'} 
                        onClick={() => setFilterType('image')} 
                        icon={ImageIcon} 
                        label="Images" 
                    />
                    <FilterButton 
                        active={filterType === 'video'} 
                        onClick={() => setFilterType('video')} 
                        icon={Film} 
                        label="Videos" 
                    />
                </div>
            </div>

            {/* MEDIA GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-24">
                {filteredMedia.map((item: GalleryItem, i: number) => {
                    const isSelected = selectedItems.includes(item.id);
                    const isVideo = item.category.includes('CINEMA') || item.category.includes('VFX');
                    
                    return (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                            className={`group relative flex flex-col gap-3 p-3 rounded-[24px] border transition-all duration-500
                                ${isSelected ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-white/[0.01] border-white/5 hover:border-white/20'}
                            `}
                        >
                            <div 
                                onClick={() => toggleSelect(item.id)}
                                className="relative aspect-square rounded-[18px] overflow-hidden bg-black cursor-pointer shadow-2xl"
                            >
                                <img 
                                    src={item.image} 
                                    alt="" 
                                    className={`w-full h-full object-cover transition-all duration-700
                                        ${isSelected ? 'scale-90 opacity-40' : 'group-hover:scale-110'}
                                    `}
                                />
                                
                                {isVideo && (
                                    <div className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                                        <Film className="w-3 h-3 text-cyan-500" />
                                    </div>
                                )}

                                {/* OVERLAY ACTIONS */}
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-3">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); copyToClipboard(item.image, item.id); }}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-black text-[9px] font-black tracking-widest uppercase rounded-lg hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Copy className="w-3.5 h-3.5" /> {isCopying === item.id ? 'Copied' : 'Copy URL'}
                                    </button>
                                    <div className="flex gap-2 w-full">
                                        <button className="flex-1 flex items-center justify-center py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="flex-1 flex items-center justify-center py-2.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-500">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* SELECTION CHECK */}
                                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500
                                    ${isSelected ? 'bg-cyan-500 border-cyan-500 scale-100' : 'bg-black/40 border-white/20 scale-0 group-hover:scale-90'}
                                `}>
                                    <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-white'}`} />
                                </div>
                            </div>
                            
                            <div className="flex flex-col px-1 gap-0.5">
                                <span className="text-[10px] font-bold text-white/80 truncate uppercase tracking-tight leading-none group-hover:text-cyan-400 transition-colors">{item.name}</span>
                                <div className="flex items-center justify-between opacity-30 group-hover:opacity-60 transition-opacity">
                                    <span className="text-[8px] font-bold uppercase tracking-widest">{isVideo ? 'MP4' : 'JPEG'}</span>
                                    <span className="text-[8px] font-bold uppercase tracking-widest italic">1.4 MB</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filteredMedia.length === 0 && (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4 opacity-20 border-2 border-dashed border-white/5 rounded-[40px]">
                    <Search className="w-10 h-10" />
                    <span className="text-xs font-bold tracking-[0.4em] uppercase italic">No assets matching crawl specs</span>
                </div>
            )}
        </div>
    );
}

function FilterButton({ active, icon: Icon, label, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-bold tracking-widest uppercase border transition-all
                ${active ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-transparent border-white/5 text-white/40 hover:border-white/20 hover:text-white'}
            `}
        >
            {Icon && <Icon className="w-3.5 h-3.5" />} {label}
        </button>
    );
}
