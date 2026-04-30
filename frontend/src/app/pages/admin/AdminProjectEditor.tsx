
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
import { Link, useParams, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

type BlockType = 'gallery' | 'video' | 'text';

interface ContentBlock {
    id: string;
    type: BlockType;
    data: any;
}

export function AdminProjectEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new';
    
    // State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('PHOTOGRAPHY');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [coverAsset, setCoverAsset] = useState<string>('');
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isNew) {
            fetch(`${API_URL}/api/projects?id=${id}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        setTitle(data.title || '');
                        setSlug(data.slug || '');
                        setDescription(data.description || '');
                        setCategory(data.category || 'PHOTOGRAPHY');
                        setStatus(data.status || 'draft');
                        setCoverAsset(data.cover_asset || '');
                        setBlocks(data.blocks || []);
                    }
                })
                .catch(err => console.error("Fetch error:", err));
        }
    }, [id, isNew]);

    // Auto-slug logic
    useEffect(() => {
        if (isNew && title) {
            setSlug(title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
        }
    }, [title, isNew]);

    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) return data.url;
        } catch (error) {
            console.error('Upload failed:', error);
        }
        return null;
    };

    const handleSave = async () => {
        setIsLoading(true);
        const projectData = { title, slug, description, category, status, cover_asset: coverAsset, blocks };
        const method = isNew ? 'POST' : 'PUT';
        const url = isNew ? `${API_URL}/api/projects` : `${API_URL}/api/projects?id=${id}`;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });
            const data = await response.json();
            if (data.success) {
                if (isNew) navigate(`/admin/projects/${data.id}`);
            } else {
                alert('Failed to save project');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save project');
        } finally {
            setIsLoading(false);
        }
    };

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
                    <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-3 px-8 py-3 bg-cyan-500 text-black rounded-xl text-[10px] font-black tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                    >
                        <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save'}
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
                         <div className="relative aspect-[4/5] bg-white/[0.02] border-2 border-dashed border-white/5 rounded-3xl group hover:border-cyan-500/30 transition-all flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                             {coverAsset ? (
                                <img src={coverAsset} className="absolute inset-0 w-full h-full object-cover" alt="Cover" />
                             ) : (
                                <>
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 transition-all duration-500 mb-4 z-10 pointer-events-none">
                                        <Upload className="w-5 h-5 text-white group-hover:text-black" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 z-10 pointer-events-none">Drop Master Thumbnail</span>
                                </>
                             )}
                             <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        const url = await handleFileUpload(e.target.files[0]);
                                        if (url) setCoverAsset(url);
                                    }
                                }}
                             />
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
                                                value={block.data?.text || ''}
                                                onChange={(e) => {
                                                    const newBlocks = [...blocks];
                                                    const idx = newBlocks.findIndex(b => b.id === block.id);
                                                    if (idx !== -1) newBlocks[idx].data = { text: e.target.value };
                                                    setBlocks(newBlocks);
                                                }}
                                                placeholder="Write narrative..."
                                                className="w-full bg-transparent border-none text-white/60 text-base leading-relaxed focus:ring-0 resize-none h-32 p-0 placeholder:text-white/10 outline-none"
                                            />
                                        )}

                                        {block.type === 'video' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center bg-black border border-white/10 rounded-2xl p-4 gap-4">
                                                     <LinkIcon className="w-5 h-5 text-white/20" />
                                                     <input 
                                                        type="text" 
                                                        value={block.data?.url || ''}
                                                        onChange={(e) => {
                                                            const newBlocks = [...blocks];
                                                            const idx = newBlocks.findIndex(b => b.id === block.id);
                                                            if (idx !== -1) newBlocks[idx].data = { url: e.target.value, type: 'link' };
                                                            setBlocks(newBlocks);
                                                        }}
                                                        placeholder="Vimeo or YouTube Link..." 
                                                        className="bg-transparent border-none text-sm font-medium text-white flex-1 outline-none"
                                                     />
                                                </div>
                                                <div className="aspect-video bg-black rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                                                    {block.data?.url ? (
                                                        <span className="text-white/40 text-xs truncate max-w-[80%] absolute">{block.data.url}</span>
                                                    ) : (
                                                        <Film className="w-12 h-12 text-white/5" />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {block.type === 'gallery' && (
                                            <div className="grid grid-cols-3 gap-4">
                                                {(block.data || []).map((imgUrl: string, i: number) => (
                                                    <div key={i} className="aspect-[4/5] bg-black rounded-xl border border-white/10 overflow-hidden relative group/img">
                                                        <img src={imgUrl} className="w-full h-full object-cover" />
                                                        <button 
                                                            onClick={() => {
                                                                const newBlocks = [...blocks];
                                                                const idx = newBlocks.findIndex(b => b.id === block.id);
                                                                if (idx !== -1) {
                                                                    newBlocks[idx].data = (newBlocks[idx].data || []).filter((_: any, index: number) => index !== i);
                                                                    setBlocks(newBlocks);
                                                                }
                                                            }}
                                                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-lg text-white opacity-0 group-hover/img:opacity-100 transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <div className="aspect-[4/5] bg-black rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 group/add relative hover:border-cyan-500/40 transition-all overflow-hidden">
                                                     <Plus className="w-6 h-6 text-white/10 group-hover/add:text-cyan-500 pointer-events-none" />
                                                     <span className="text-[8px] font-bold uppercase tracking-widest text-white/10 group-hover/add:text-cyan-500 pointer-events-none">Add Item</span>
                                                     <input 
                                                        type="file" 
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={async (e) => {
                                                            if (e.target.files?.[0]) {
                                                                const url = await handleFileUpload(e.target.files[0]);
                                                                if (url) {
                                                                    const newBlocks = [...blocks];
                                                                    const idx = newBlocks.findIndex(b => b.id === block.id);
                                                                    if (idx !== -1) {
                                                                        const currentData = Array.isArray(newBlocks[idx].data) ? newBlocks[idx].data : [];
                                                                        newBlocks[idx].data = [...currentData, url];
                                                                        setBlocks(newBlocks);
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                     />
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
