
import { motion, AnimatePresence } from 'motion/react';
import { 
    ChevronLeft, 
    Save, 
    Eye, 
    Plus, 
    Image as ImageIcon, 
    Type, 
    Film, 
    Move, 
    Trash2, 
    Copy, 
    Settings2,
    Layout,
    Sparkles,
    Check
} from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

type BlockType = 'image' | 'video' | 'text' | 'vfx';

interface ContentBlock {
    id: string;
    type: BlockType;
    content: any;
}

export function AdminProjectEditor() {
    const { id } = useParams();
    const isNew = id === 'new';
    
    const [blocks, setBlocks] = useState<ContentBlock[]>([
        { id: '1', type: 'text', content: { text: "The project explores the intersection of nature and synthetic light..." } },
        { id: '2', type: 'image', content: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' } }
    ]);

    const addBlock = (type: BlockType) => {
        const newBlock: ContentBlock = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: {}
        };
        setBlocks([...blocks, newBlock]);
    };

    const removeBlock = (blockId: string) => {
        setBlocks(blocks.filter(b => b.id !== blockId));
    };

    return (
        <div className="flex flex-col gap-10 max-w-5xl mx-auto">
            {/* EDITOR HEADER */}
            <div className="flex items-center justify-between sticky top-24 z-40 bg-[#050505]/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link to="/admin/projects" className="p-2 hover:bg-white/5 rounded-full transition-all">
                        <ChevronLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">
                            {isNew ? 'New Project' : 'Edit Project'}
                        </h1>
                        <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
                            {isNew ? 'Untitled / Creative Drafting' : `Draft / ${id}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all">
                        <Eye className="w-4 h-4 opacity-50" /> Preview
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black rounded-lg text-xs font-black tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* LEFT COL: PROJECT METADATA */}
                <div className="lg:col-span-1 space-y-8">
                    <section className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-white/30 border-b border-white/5 pb-4 flex items-center gap-2">
                            <Settings2 className="w-3.5 h-3.5" /> Project Config
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Project Title</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter title..." 
                                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm font-medium focus:border-cyan-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Slug (URL)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs">/project/</span>
                                    <input 
                                        type="text" 
                                        placeholder="url-slug" 
                                        className="w-full bg-black border border-white/10 rounded-xl py-3 pl-16 pr-4 text-sm font-medium focus:border-cyan-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Category</label>
                                    <select className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-widest focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer">
                                        <option>Photography</option>
                                        <option>Cinematography</option>
                                        <option>VFX / Color</option>
                                        <option>Contemporary Art</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Status</label>
                                    <div className="flex items-center gap-2 bg-black border border-white/10 rounded-xl p-1">
                                        <button className="flex-1 py-2 text-[8px] font-black uppercase tracking-widest bg-cyan-500 text-black rounded-lg transition-all">Draft</button>
                                        <button className="flex-1 py-2 text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Live</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl group cursor-pointer hover:border-cyan-500/30 transition-all overflow-hidden relative">
                        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xs font-bold tracking-widest uppercase text-white/30 border-b border-white/5 pb-4 mb-6">Cover Image</h3>
                        <div className="aspect-[4/5] bg-black border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-6 gap-3 group-hover:scale-[1.02] transition-transform">
                            <ImageIcon className="w-10 h-10 text-cyan-500/40" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Drag thumbnail here</span>
                        </div>
                    </section>
                </div>

                {/* RIGHT COL: LEGO BLOCK BUILDER */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[40px] min-h-[600px] flex flex-col gap-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-cyan-500 flex items-center gap-3">
                                <Layout className="w-4 h-4" /> Content Architecture
                            </h3>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
                                    <Move className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
                                    <Sparkles className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* BLOCK LIST */}
                        <div className="space-y-6">
                            {blocks.map((block, index) => (
                                <motion.div 
                                    key={block.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group relative bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all"
                                >
                                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-600 hover:text-white transition-colors cursor-grab">
                                            <Move className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-cyan-500/60">
                                            {block.type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                                            {block.type === 'text' && <Type className="w-3.5 h-3.5" />}
                                            {block.type === 'video' && <Film className="w-3.5 h-3.5" />}
                                            {block.type} Block
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors">
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => removeBlock(block.id)}
                                                className="p-1.5 hover:bg-red-500/10 rounded text-slate-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* BLOCK CONTENT RENDERER (MOCK) */}
                                    {block.type === 'text' && (
                                        <textarea 
                                            defaultValue={block.content.text}
                                            className="w-full bg-transparent border-none text-slate-400 text-sm leading-relaxed focus:ring-0 resize-none h-24 p-0"
                                        />
                                    )}
                                    {block.type === 'image' && (
                                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-white/5">
                                            <img src={block.content.url} alt="" className="w-full h-full object-cover opacity-50" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <button className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all">Change Asset</button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* EMPTY STATE / ADD BUTTONS */}
                            <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-white/5 rounded-3xl gap-6 mt-8">
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Assemble Page</div>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {[
                                        { type: 'image', icon: ImageIcon, label: 'Image' },
                                        { type: 'text', icon: Type, label: 'Text' },
                                        { type: 'video', icon: Film, label: 'Video' },
                                        { type: 'vfx', icon: Sparkles, label: 'VFX / Comparison' }
                                    ].map((btn) => (
                                        <button 
                                            key={btn.type}
                                            onClick={() => addBlock(btn.type as BlockType)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/30 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all"
                                        >
                                            <btn.icon className="w-3.5 h-3.5" /> {btn.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end gap-4 pb-20">
                         <button className="flex items-center gap-2 px-8 py-4 border border-white/10 rounded-2xl text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-all">
                            Save as Draft
                        </button>
                        <button className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl text-xs font-black tracking-widest uppercase hover:scale-105 transition-all">
                            Publish Exhibition
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
