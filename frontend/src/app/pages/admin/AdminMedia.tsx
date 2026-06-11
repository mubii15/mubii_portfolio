
import { motion, AnimatePresence } from 'motion/react';
import { 
    Search, 
    Upload, 
    Trash2, 
    Copy,
    Image as ImageIcon,
    Film,
    CheckCircle2,
    X,
    ChevronDown,
    FolderOpen,
    Pencil
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const THUMBNAIL_CATEGORIES = ["PHOTOGRAPHY", "CINEMATOGRAPHY", "VFX", "COLOR GRADING", "CONTEMPORARY ART"];

interface MediaItem {
    id: number | string;
    title: string;
    slug: string;
    category: string;
    item_type: string;
    cover_asset: string;
    status: string;
    created_at: string;
}

export function AdminMedia() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('date_desc');
    const [selectedItems, setSelectedItems] = useState<(number | string)[]>([]);
    const [isCopying, setIsCopying] = useState<number | string | null>(null);
    const [thumbnails, setThumbnails] = useState<any[]>([]);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [settingThumbnailFor, setSettingThumbnailFor] = useState<number | null>(null);
    const [visibleCount, setVisibleCount] = useState(24);

    const fetchMedia = () => {
        setIsLoading(true);
        axios.get(`${API_URL}/api/projects`)
            .then(({ data }) => {
                if (Array.isArray(data)) {
                    // Flatten projects into their individual assets for the "All Images" view
                    const flattened: any[] = [];
                    data.forEach((project: any) => {
                        // Add the project cover itself
                        flattened.push({
                            ...project,
                            isProjectRoot: true 
                        });
                        
                        // Add sub-assets from blocks if they are images
                        if (project.blocks && typeof project.blocks === 'string') {
                            try { project.blocks = JSON.parse(project.blocks); } catch(e) {}
                        }
                        
                        if (project.blocks && Array.isArray(project.blocks)) {
                            project.blocks.forEach((block: any, idx: number) => {
                                if (block.type === 'image' && block.data?.url) {
                                    flattened.push({
                                        id: `${project.id}-sub-${idx}`,
                                        title: `${project.title} (Asset ${idx + 1})`,
                                        category: project.category,
                                        cover_asset: block.data.url,
                                        status: project.status,
                                        item_type: 'project_asset',
                                        parentProjectId: project.id,
                                        parentProjectTitle: project.title
                                    });
                                }
                            });
                        }
                    });
                    setMedia(flattened);
                } else {
                    setMedia([]);
                }
            })
            .catch(err => console.error('Media fetch error:', err))
            .finally(() => setIsLoading(false));
    };

    const fetchThumbnails = () => {
        axios.get(`${API_URL}/api/thumbnails`)
            .then(({ data }) => { if (!data.error) setThumbnails(data); })
            .catch(err => console.error('Thumbnails fetch error:', err));
    };

    useEffect(() => {
        fetchMedia();
        fetchThumbnails();
    }, []);

    const handleSetThumbnail = async (category: string, url: string) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/thumbnails`,
                { category, source_url: url },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (data.success) {
                fetchThumbnails();
                setSettingThumbnailFor(null);
            } else {
                alert('Failed to set thumbnail: ' + data.error);
            }
        } catch (err: any) {
            alert('Failed: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this item?')) return;
        try {
            await axios.delete(`${API_URL}/api/projects?id=${id}`);
            fetchMedia();
        } catch (err: any) {
            alert('Delete failed: ' + (err.response?.data?.error || err.message));
        }
    };

    const openEdit = (item: MediaItem) => {
        const targetId = (item as any).parentProjectId || item.id;
        navigate(`/admin/projects/${targetId}`);
    };

    const copyToClipboard = (url: string, id: number) => {
        navigator.clipboard.writeText(url);
        setIsCopying(id);
        setTimeout(() => setIsCopying(null), 2000);
    };

    const toggleSelect = (id: number | string) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const categories = ['all', ...Array.from(new Set(media.map(m => m.category)))];

    const filteredMedia = useMemo(() => {
        let result = media.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  item.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCat = filterCategory === 'all' || item.category === filterCategory;
            
            let matchesType = true;
            if (filterType === 'projects') matchesType = item.isProjectRoot === true && item.item_type === 'project';
            if (filterType === 'assets') matchesType = !!(item as any).parentProjectId;

            return matchesSearch && matchesCat && matchesType;
        });

        result.sort((a, b) => {
            if (sortBy === 'date_desc') {
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
            }
            if (sortBy === 'date_asc') {
                return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
            }
            if (sortBy === 'name_asc') {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === 'name_desc') {
                return b.title.localeCompare(a.title);
            }
            return 0;
        });

        return result;
    }, [media, searchQuery, filterCategory, filterType, sortBy]);

    useEffect(() => {
        setVisibleCount(24);
    }, [searchQuery, filterCategory, filterType, sortBy]);

    const visibleMedia = filteredMedia.slice(0, visibleCount);

    return (
        <div className="flex flex-col gap-10">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic font-black">Vault</h1>
                    <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">Asset Control / {media.length} Items</p>
                </div>
                <div className="flex gap-4">
                    {selectedItems.length > 0 && (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => { selectedItems.forEach(id => handleDelete(id)); setSelectedItems([]); }}
                            className="flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black tracking-widest uppercase rounded-sm hover:bg-red-500/20 transition-all"
                        >
                            <Trash2 className="w-4 h-4" /> Delete ({selectedItems.length})
                        </motion.button>
                    )}
                    <button 
                        onClick={() => navigate('/admin/upload')}
                        className="flex items-center gap-3 px-8 py-3 bg-white text-black text-[10px] font-black tracking-widest uppercase rounded-sm hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                        <Upload className="w-4 h-4" /> Upload Assets
                    </button>
                </div>
            </div>

            {/* CATEGORY THUMBNAILS PANEL */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-sm backdrop-blur-3xl">
                <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500 mb-6 px-2">Active Stack Thumbnails</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {THUMBNAIL_CATEGORIES.map(cat => {
                        const thumb = thumbnails.find(t => t.category === cat);
                        return (
                            <div key={cat} className="flex flex-col gap-3">
                                <div className="aspect-square bg-black border border-white/5 rounded-md overflow-hidden relative flex items-center justify-center">
                                    {thumb?.cropped_url ? (
                                        <img src={thumb.cropped_url} alt={cat} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-white/10" />
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-white">{cat}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white/[0.02] border border-white/5 p-5 rounded-sm backdrop-blur-3xl">
                <div className="relative flex-1 max-w-xl group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="SEARCH BY TITLE OR CATEGORY..."
                        className="w-full bg-black/50 border border-white/5 rounded-md py-4 pl-16 pr-6 text-[10px] font-bold tracking-widest uppercase focus:border-white/50 outline-none transition-all placeholder:text-white/10"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full">
                            <X className="w-3 h-3 text-slate-500" />
                        </button>
                    )}
                </div>
                <div className="flex gap-3 flex-wrap">
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="bg-black/50 border border-white/5 rounded-md px-5 py-3 text-[10px] font-bold tracking-widest uppercase focus:border-white/50 outline-none transition-all text-white/70 appearance-none"
                    >
                        <option value="all">All Categories</option>
                        {categories.filter(c => c !== 'all').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="bg-black/50 border border-white/5 rounded-md px-5 py-3 text-[10px] font-bold tracking-widest uppercase focus:border-white/50 outline-none transition-all text-white/70 appearance-none"
                    >
                        <option value="all">All Types</option>
                        <option value="projects">Projects Only</option>
                        <option value="assets">Assets Only</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="bg-black/50 border border-white/5 rounded-md px-5 py-3 text-[10px] font-bold tracking-widest uppercase focus:border-white/50 outline-none transition-all text-white/70 appearance-none"
                    >
                        <option value="date_desc">Newest First</option>
                        <option value="date_asc">Oldest First</option>
                        <option value="name_asc">Name (A-Z)</option>
                        <option value="name_desc">Name (Z-A)</option>
                    </select>
                </div>
            </div>

            {/* LOADING STATE */}
            {isLoading && (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4 opacity-40">
                    <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
                    <span className="text-xs font-bold tracking-[0.4em] uppercase">Loading Vault...</span>
                </div>
            )}

            {/* EMPTY STATE */}
            {!isLoading && filteredMedia.length === 0 && (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-6 border-2 border-dashed border-white/5 rounded-[40px]">
                    <FolderOpen className="w-12 h-12 text-white/10" />
                    <div className="text-center">
                        <p className="text-xs font-black tracking-[0.4em] uppercase opacity-20">
                            {searchQuery ? 'No assets match your search' : 'Vault is empty'}
                        </p>
                        <p className="text-[10px] tracking-widest uppercase opacity-10 mt-2">
                            {!searchQuery && 'Upload your first piece to get started'}
                        </p>
                    </div>
                    {!searchQuery && (
                        <button
                            onClick={() => navigate('/admin/upload')}
                            className="px-8 py-3 bg-white text-black text-[10px] font-black tracking-widest uppercase rounded-sm hover:scale-105 transition-all"
                        >
                            Upload First Asset
                        </button>
                    )}
                </div>
            )}

            {/* MEDIA GRID */}
            {!isLoading && filteredMedia.length > 0 && (
                <div className="flex flex-col gap-8 pb-24">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {visibleMedia.map((item: any, i) => {
                        const isSelected = selectedItems.includes(item.id);
                        const isVideo = item.category.includes('CINEMA') || item.category.includes('VFX');
                        const isSubAsset = !!item.parentProjectId;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (i % 24) * 0.02 }}
                                className={`group relative flex flex-col gap-3 p-3 rounded-lg border transition-all duration-500
                                    ${isSelected ? 'bg-white/10 border-white/50' : 'bg-white/[0.01] border-white/5 hover:border-white/20'}
                                    ${item.isProjectRoot ? 'shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : ''}
                                `}
                            >
                                <div
                                    onClick={() => toggleSelect(item.id)}
                                    className="relative aspect-square rounded-[18px] bg-black cursor-pointer shadow-2xl"
                                >
                                    {item.isProjectRoot && item.item_type === 'project' && (
                                        <>
                                            <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-[18px] translate-x-1 translate-y-1 rotate-1" />
                                            <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-[18px] translate-x-0.5 translate-y-0.5" />
                                        </>
                                    )}
                                    <div className="absolute inset-0 rounded-[18px] overflow-hidden">
                                        {item.cover_asset ? (
                                            <motion.img
                                                src={`${API_URL}/api/thumb?path=${encodeURIComponent(item.cover_asset)}`}
                                                alt={item.title}
                                                loading="lazy"
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true }}
                                                className={`w-full h-full object-cover transition-all duration-700
                                                    ${isSelected ? 'scale-90 opacity-40' : 'group-hover:scale-110'}
                                                `}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-8 h-8 text-white/10" />
                                            </div>
                                        )}
                                        {isVideo && (
                                            <div className="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                                                <Film className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                        {isSubAsset && (
                                            <div className="absolute top-2 left-2 p-1.5 bg-white/80 backdrop-blur-md rounded-lg border border-white/70/20">
                                                <div className="text-[7px] font-black text-black">ASSET</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* OVERLAY ACTIONS */}
                                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 gap-2 rounded-[18px]">
                                        {/* Edit Button */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                                            className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 text-white border border-white/20 text-[9px] font-black tracking-widest uppercase rounded-lg hover:bg-white/20"
                                        >
                                            <Pencil className="w-3 h-3" /> Edit Details
                                        </button>
                                        {/* Thumbnail Assignment */}
                                        <div className="relative w-full">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSettingThumbnailFor(settingThumbnailFor === item.id ? null : item.id); }}
                                                className="w-full flex items-center justify-between py-2 px-3 bg-white/10 text-white/70 border border-white/20 text-[9px] font-black tracking-widest uppercase rounded-lg hover:bg-white/20"
                                            >
                                                Set Thumbnail <ChevronDown className="w-3 h-3" />
                                            </button>
                                            <AnimatePresence>
                                                {settingThumbnailFor === item.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 5 }}
                                                        className="absolute bottom-full left-0 right-0 mb-2 bg-slate-900 border border-white/10 rounded-sm overflow-hidden shadow-2xl z-20 flex flex-col"
                                                    >
                                                        {THUMBNAIL_CATEGORIES.map(cat => (
                                                            <button
                                                                key={cat}
                                                                onClick={(e) => { e.stopPropagation(); handleSetThumbnail(cat, item.cover_asset); }}
                                                                className="text-left px-4 py-3 hover:bg-white/5 text-[9px] font-bold tracking-widest uppercase border-b border-white/5 last:border-0 text-white"
                                                            >
                                                                {cat}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyToClipboard(item.cover_asset, item.id); }}
                                            className="w-full flex items-center justify-center gap-2 py-2 bg-white text-black text-[9px] font-black tracking-widest uppercase rounded-lg hover:bg-slate-200"
                                        >
                                            <Copy className="w-3 h-3" /> {isCopying === item.id ? 'Copied' : 'Copy URL'}
                                        </button>
                                    </div>

                                    {/* SELECTION CHECK */}
                                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500
                                        ${isSelected ? 'bg-white border-white scale-100' : 'bg-black/40 border-white/20 scale-0 group-hover:scale-90'}
                                    `}>
                                        <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-white'}`} />
                                    </div>
                                </div>

                                <div className="flex flex-col px-1 gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/80 truncate uppercase tracking-tight leading-none group-hover:text-white/70 transition-colors">{item.title}</span>
                                        {item.isProjectRoot && (
                                            <span className="text-[7px] font-black bg-white/10 px-1.5 py-0.5 rounded-md opacity-40">STACK</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between opacity-30 group-hover:opacity-60 transition-opacity">
                                        <div className="flex items-center gap-1.5 truncate">
                                            <span className="text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">{item.category}</span>
                                            {item.parentProjectId && (
                                                <>
                                                    <div className="w-0.5 h-0.5 rounded-full bg-white" />
                                                    <span className="text-[7px] font-black text-white/80 uppercase truncate">Part of {item.parentProjectTitle}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    </div>
                    {visibleCount < filteredMedia.length && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 24)}
                                className="px-8 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black tracking-widest uppercase rounded-sm hover:bg-white/10 transition-all"
                            >
                                Load More Assets ({filteredMedia.length - visibleCount} remaining)
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* MODAL REMOVED - User now navigates to the full editor */}
        </div>
    );
}
