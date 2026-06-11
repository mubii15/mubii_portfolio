
import { motion } from 'motion/react';
import { 
    Search, 
    Filter, 
    ExternalLink, 
    Edit3, 
    Trash2, 
    Plus 
} from 'lucide-react';
import { GALLERY_DATA, GalleryItem } from '../../../data/galleryData';

export function AdminProjects() {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic font-black">Archive</h1>
                    <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">Archive Control / {GALLERY_DATA.length} Total items</p>
                </div>
                <button 
                    onClick={() => window.location.href = '/admin/upload'}
                    className="flex items-center gap-3 px-6 py-3 bg-white text-black text-xs font-black tracking-widest uppercase rounded-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                >
                    <Plus className="w-4 h-4" /> Add New
                </button>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white/[0.03] border border-white/5 p-4 rounded-md">
                <div className="flex gap-4 flex-1 max-w-md">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                        <input 
                            type="text" 
                            placeholder="SEARCH ARCHIVE..." 
                            className="w-full bg-black/50 border border-white/5 rounded-sm py-3 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:border-white/50 outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-[10px] font-bold tracking-widest uppercase text-white">All ({GALLERY_DATA.length})</button>
                    <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-[10px] font-bold tracking-widest uppercase opacity-40">Drafts (2)</button>
                    <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-[10px] font-bold tracking-widest uppercase opacity-40">Published</button>
                </div>
            </div>

            {/* PROJECTS TABLE */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl transition-all">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">Exhibition / Asset</th>
                            <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">Category</th>
                            <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">Type</th>
                            <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {GALLERY_DATA.map((project: GalleryItem, i: number) => (
                            <motion.tr 
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-white/[0.02] transition-colors"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                        <span className="text-[9px] font-bold tracking-widest uppercase text-white">Live</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 group-hover:border-white/50 transition-colors">
                                            <img src={project.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white group-hover:text-white/70 transition-colors tracking-tight uppercase tracking-widest leading-none">{project.name}</span>
                                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] opacity-40 mt-1">ID: {project.id}0426</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                                        {project.category}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                                        {project.type}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white/70 transition-colors">
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
