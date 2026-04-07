
import { motion, AnimatePresence } from 'motion/react';
import { 
    Tag, 
    Plus, 
    Trash2, 
    Edit3, 
    Search,
    Hash,
    Layers,
    CheckCircle2,
    X
} from 'lucide-react';
import { useState } from 'react';

const MOCK_CATEGORIES = [
    { id: '1', name: 'PHOTOGRAPHY', count: 18, color: '#38bdf8' },
    { id: '2', name: 'CINEMATOGRAPHY', count: 12, color: '#fbbf24' },
    { id: '3', name: 'VFX / COLOR', count: 8, color: '#a855f7' },
    { id: '4', name: 'CONTEMPORARY ART', count: 6, color: '#4ade80' },
];

export function AdminCategories() {
    const [categories, setCategories] = useState(MOCK_CATEGORIES);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');

    const addCategory = () => {
        if (!newName) return;
        setCategories([...categories, { 
            id: Math.random().toString(), 
            name: newName.toUpperCase(), 
            count: 0, 
            color: '#ffffff' 
        }]);
        setNewName('');
        setIsAdding(false);
    };

    return (
        <div className="flex flex-col gap-10 max-w-4xl">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic font-black">Taxonomy</h1>
                    <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">System Tags / {categories.length} ACTIVE CATEGORIES</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-3 px-8 py-3 bg-cyan-500 text-black text-[10px] font-black tracking-widest uppercase rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                >
                    <Plus className="w-4 h-4" /> Add Tag
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/[0.02] border border-white/10 p-8 rounded-[32px] flex items-center gap-6 group"
                    >
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500">
                             <Hash className="w-6 h-6" />
                        </div>
                        <input 
                            type="text" 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="CATEGORY NAME..." 
                            className="bg-transparent border-none text-2xl font-black tracking-tighter uppercase text-white outline-none flex-1 placeholder:text-white/5"
                            autoFocus
                        />
                        <div className="flex gap-3">
                             <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-white/5 rounded-full text-slate-500 transition-all"><X className="w-5 h-5"/></button>
                             <button onClick={addCategory} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-all"><CheckCircle2 className="w-5 h-5"/></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CATEGORY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {categories.map((cat, i) => (
                    <motion.div 
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] flex items-center justify-between group hover:border-white/20 transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl rounded-full -mr-16 -mt-16" style={{ background: cat.color }} />
                        
                        <div className="flex items-center gap-6">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color, boxShadow: `0 0 20px ${cat.color}66` }} />
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-bold tracking-tighter uppercase italic text-white group-hover:text-cyan-400 transition-colors">{cat.name}</h3>
                                <div className="flex items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                                    <Layers className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{cat.count} Linked Projects</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <button className="p-3 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                            <button className="p-3 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
