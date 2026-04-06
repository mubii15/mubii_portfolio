
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
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic font-black">Project Manager</h1>
                    <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">Curating the gallery / {GALLERY_DATA.length} Total items</p>
                </div>
                <button className="flex items-center gap-3 px-6 py-3 bg-cyan-500 text-black text-xs font-black tracking-widest uppercase rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <Plus className="w-4 h-4" /> New Exhibition
                </button>
            </div>

            {/* FILTERS & SEARCH */}
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
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all">
                        <Filter className="w-4 h-4 text-slate-500" /> Filter
                    </button>
                    <div className="h-6 w-px bg-white/10 self-center mx-2" />
                    <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-[10px] font-bold tracking-widest uppercase text-cyan-500">Drafts (2)</button>
                    <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-[10px] font-bold tracking-widest uppercase">Published ({GALLERY_DATA.length})</button>
                </div>
            </div>

            {/* PROJECTS TABLE */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">Project / Title</th>
                            <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">Category</th>
                            <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] uppercase text-white/40">Date</th>
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
                                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        <span className="text-[10px] font-black tracking-widest uppercase text-green-500">Live</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                                            <img src={project.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors tracking-tight uppercase">{project.name}</span>
                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">/slug/{project.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                        {project.category}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] font-medium text-slate-400 font-mono tracking-tighter uppercase">{project.date}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="View Page">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors" title="Edit Content">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-500 transition-colors" title="Delete Archive">
                                            <Trash2 className="w-4 h-4" />
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
