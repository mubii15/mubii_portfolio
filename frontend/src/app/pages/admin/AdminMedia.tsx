import { motion } from 'motion/react';
import { 
    Search, 
    Filter, 
    Grid, 
    List, 
    Upload, 
    FolderPlus, 
    Download, 
    Trash2, 
    CheckCircle2
} from 'lucide-react';
import { GALLERY_DATA, GalleryItem } from '../../../data/galleryData';
import { useState } from 'react';

export function AdminMedia() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic font-black">Media Engine</h1>
                    <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">Central Storage Hub / 1.4 GB USED</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-black tracking-widest uppercase rounded-xl hover:bg-white/10 transition-all">
                        <FolderPlus className="w-4 h-4" /> New Folder
                    </button>
                    <button className="flex items-center gap-3 px-6 py-3 bg-cyan-500 text-black text-xs font-black tracking-widest uppercase rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                        <Upload className="w-4 h-4" /> Drop Files
                    </button>
                </div>
            </div>

            {/* DRAG & DROP UPLOAD AREA (MOCK) */}
            <div className="group relative">
                <div className="absolute inset-0 bg-cyan-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative border-2 border-dashed border-white/10 bg-white/[0.02] rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4 group-hover:border-cyan-500/50 transition-all cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-cyan-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-bold text-white tracking-widest uppercase">Select file or drag & drop</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">High-res JPEG, PNG, MP4 (Max 250MB per file)</p>
                    </div>
                </div>
            </div>

            {/* FILTERS & TOOLBAR */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                <div className="flex gap-4 flex-1 max-w-md">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-cyan-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="SEARCH BY FILENAME OR TITLE..." 
                            className="w-full bg-black/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:border-cyan-500/50 outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex p-1 bg-black/50 border border-white/5 rounded-lg mr-4">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-cyan-500' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-cyan-500' : 'text-slate-500 hover:text-white'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all">
                        <Filter className="w-4 h-4 text-slate-500" /> Filter
                    </button>
                </div>
            </div>

            {/* MEDIA GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-20">
                {GALLERY_DATA.map((item: GalleryItem, i: number) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="group relative flex flex-col gap-2 cursor-pointer"
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/5 hover:border-cyan-500/50 transition-all">
                            <img 
                                src={item.image} 
                                alt="" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Download">
                                    <Download className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-500" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="absolute top-3 right-3 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <CheckCircle2 className="w-3 h-3 text-black" />
                            </div>
                        </div>
                        <div className="flex flex-col px-1">
                            <span className="text-[10px] font-bold text-white/60 truncate group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{item.name}</span>
                            <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">1.4 MB &bull; JPEG</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
