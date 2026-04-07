
import { motion, AnimatePresence } from 'motion/react';
import { 
    ChevronLeft, 
    Save, 
    Eye, 
    Plus, 
    Image as ImageIcon, 
    Type, 
    Film, 
    Trash2, 
    Settings2,
    Layout,
    Upload,
    Link as LinkIcon,
    GripVertical,
    Globe
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

type BlockType = 'gallery' | 'video' | 'text';

interface ContentBlock {
    id: string;
    type: BlockType;
    data: any;
}

export function AdminProjectEditor() {
    const { id } = useParams();
    const isNew = id === 'new';
    
    // State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('PHOTOGRAPHY');
    const [status] = useState<'draft' | 'published'>('draft');
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);

    // Auto-slug logic
    useEffect(() => {
        if (isNew && title) {
            setSlug(title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
        }
    }, [title, isNew]);

    const addBlock = (type: BlockType) => {
        const newBlock: ContentBlock = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            data: type === 'gallery' ? [] : type === 'video' ? { url: '', type: 'link' } : { text: '' }
        };
        setBlocks([...blocks, newBlock]);
    };

    const removeBlock = (blockId: string) => {
        setBlocks(blocks.filter(b => b.id !== blockId));
    };

    return (
        <div className="flex flex-col gap-10 max-w-6xl mx-auto pb-24">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between sticky top-0 z-50 bg-black/80 backdrop-blur-3xl py-6 border-b border-white/5 -mx-4 px-8">
                <div className="flex items-center gap-6">
                    <Link to="/admin/projects" className="p-2 hover:bg-white/5 rounded-full transition-all">
                        <ChevronLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold tracking-tighter text-white uppercase italic">
                            {isNew ? 'New Exhibition' : 'Edit Exhibition'}
                        </h1>
                        <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${status === 'published' ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/20'}`} />
                             <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">{status}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-white/10 transition-all">
                        <Eye className="w-4 h-4 opacity-40" /> Preview
                    </button>
                    <button className="flex items-center gap-3 px-8 py-3 bg-cyan-500 text-black rounded-xl text-[10px] font-black tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                        <Save className="w-4 h-4" /> Save
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* CONFIGURATION COLUMN */}
                <div className="lg:col-span-1 space-y-10">
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20 flex items-center gap-2">
                            <Settings2 className="w-3.5 h-3.5" /> Identity
                        </h3>
                        
                        <div className="space-y-6">
                            <FormInput label="Project Title" placeholder="e.g. Nuit Noire" value={title} onChange={setTitle} />
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Slug (URL)</label>
                                <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 group focus-within:border-cyan-500/50 transition-all">
                                    <Globe className="w-3.5 h-3.5 text-slate-600 mr-2" />
                                    <span className="text-slate-600 text-xs">/exhibition/</span>
                                    <input 
                                        type="text" 
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="bg-transparent border-none text-xs font-bold text-white outline-none flex-1 ml-1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">Category</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['PHOTOGRAPHY', 'CINEMATOGRAPHY', 'VFX', 'ART'].map(cat => (
                                        <button 
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className={`py-2 rounded-lg text-[9px] font-bold tracking-widest border transition-all uppercase
                                                ${category === cat ? 'bg-white text-black border-white' : 'bg-transparent border-white/5 text-white/40 hover:border-white/20'}
                                            `}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <FormInput label="Brief Narrative" isTextArea placeholder="Describe the vision..." value={description} onChange={setDescription} />
                        </div>
                    </section>

                    <section className="space-y-4">
                         <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20">Cover Asset</h3>
                         <div className="aspect-[4/5] bg-white/[0.02] border-2 border-dashed border-white/5 rounded-3xl group cursor-pointer hover:border-cyan-500/30 transition-all flex flex-col items-center justify-center p-8 text-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 transition-all duration-500">
                                <Upload className="w-5 h-5 text-white group-hover:text-black" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Drop Master Thumbnail</span>
                         </div>
                    </section>
                </div>

                {/* BUILDER COLUMN */}
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-white/[0.01] border border-white/5 p-10 rounded-[40px] min-h-[500px] flex flex-col gap-10">
                        <div className="flex items-center justify-between border-b border-white/5 pb-8">
                             <div className="flex flex-col gap-1">
                                <h3 className="text-[11px] font-black tracking-[0.3em] uppercase text-cyan-500">Exhibition Layout</h3>
                                <p className="text-[9px] font-bold text-white/20 uppercase">Drag to reorder blocks</p>
                             </div>
                             <div className="flex gap-3">
                                <AddBlockButton icon={ImageIcon} label="Gallery" onClick={() => addBlock('gallery')} />
                                <AddBlockButton icon={Film} label="Video" onClick={() => addBlock('video')} />
                                <AddBlockButton icon={Type} label="Text" onClick={() => addBlock('text')} />
                             </div>
                        </div>

                        {/* BLOCK RENDERER */}
                        <div className="space-y-8">
                            <AnimatePresence>
                                {blocks.map((block) => (
                                    <motion.div 
                                        key={block.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group relative bg-white/[0.01] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all"
                                    >
                                        <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity cursor-grab">
                                            <GripVertical className="w-5 h-5" />
                                        </div>

                                        <div className="flex items-center justify-between mb-8">
                                             <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-500">
                                                    {block.type === 'gallery' && <ImageIcon className="w-4 h-4" />}
                                                    {block.type === 'video' && <Film className="w-4 h-4" />}
                                                    {block.type === 'text' && <Type className="w-4 h-4" />}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{block.type} BLOCK</span>
                                             </div>
                                             <button 
                                                onClick={() => removeBlock(block.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-500 transition-all"
                                             >
                                                <Trash2 className="w-4 h-4" />
                                             </button>
                                        </div>

                                        {/* BLOCK CONTENT */}
                                        {block.type === 'text' && (
                                            <textarea 
                                                placeholder="Write narrative..."
                                                className="w-full bg-transparent border-none text-white/60 text-base leading-relaxed focus:ring-0 resize-none h-32 p-0 placeholder:text-white/10"
                                            />
                                        )}

                                        {block.type === 'video' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center bg-black border border-white/10 rounded-2xl p-4 gap-4">
                                                     <LinkIcon className="w-5 h-5 text-white/20" />
                                                     <input 
                                                        type="text" 
                                                        placeholder="Vimeo or YouTube Link..." 
                                                        className="bg-transparent border-none text-sm font-medium text-white flex-1 outline-none"
                                                     />
                                                </div>
                                                <div className="aspect-video bg-black rounded-2xl flex items-center justify-center border border-white/5">
                                                     <Film className="w-12 h-12 text-white/5" />
                                                </div>
                                            </div>
                                        )}

                                        {block.type === 'gallery' && (
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="aspect-[4/5] bg-black rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 group/add cursor-pointer hover:border-cyan-500/40 transition-all">
                                                     <Plus className="w-6 h-6 text-white/10 group-hover/add:text-cyan-500" />
                                                     <span className="text-[8px] font-bold uppercase tracking-widest text-white/10 group-hover/add:text-cyan-500">Add Item</span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {blocks.length === 0 && (
                                <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] gap-4 opacity-20">
                                     <Layout className="w-10 h-10" />
                                     <span className="text-xs font-bold tracking-[0.4em] uppercase">Architecture Empty</span>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function AddBlockButton({ icon: Icon, label, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
        >
            <Icon className="w-3.5 h-3.5 text-cyan-500" /> {label}
        </button>
    );
}

function FormInput({ label, placeholder, isTextArea = false, value, onChange }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">{label}</label>
            {isTextArea ? (
                <textarea 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-5 text-sm font-medium focus:border-cyan-500 outline-none transition-all placeholder:text-white/10 min-h-[120px]"
                />
            ) : (
                <input 
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-5 text-sm font-medium focus:border-cyan-500 outline-none transition-all placeholder:text-white/10"
                />
            )}
        </div>
    );
}
