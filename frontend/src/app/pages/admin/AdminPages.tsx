
import { motion, AnimatePresence } from 'motion/react';
import { 
    Layout, 
    Home, 
    User, 
    Mail, 
    ArrowUpRight, 
    Settings2, 
    Save, 
    Eye, 
    Sparkles, 
    Type,
    FileText,
    Image as ImageIcon
} from 'lucide-react';
import { useState } from 'react';

const PAGES = [
    { id: 'home', label: 'Landing / Home', icon: Home, lastEdited: '2h ago', status: 'Live' },
    { id: 'about', label: 'Biography / Profile', icon: User, lastEdited: '1d ago', status: 'Live' },
    { id: 'contact', label: 'Communications', icon: Mail, lastEdited: '4d ago', status: 'Live' },
];

export function AdminPages() {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-10">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic font-black">Architecture</h1>
                    <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">Static Content Manager / {PAGES.length} PAGES</p>
                </div>
                {selectedPage && (
                    <button 
                        onClick={() => setSelectedPage(null)}
                        className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black tracking-widest uppercase rounded-sm hover:bg-white/10 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                        Save & Exit Editor
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {!selectedPage ? (
                    <motion.div 
                        key="list"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {PAGES.map((page, i) => (
                            <motion.div 
                                key={page.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setSelectedPage(page.id)}
                                className="group relative bg-[#0a0a0a] border border-white/5 p-10 rounded-md flex flex-col items-center text-center gap-8 cursor-pointer hover:border-white/30 transition-all"
                            >
                                <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center text-slate-500 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,1)]">
                                    <page.icon className="w-10 h-10" />
                                </div>
                                <div className="flex flex-col gap-2">
                                     <h3 className="text-2xl font-bold tracking-tighter text-white uppercase italic">{page.label}</h3>
                                     <div className="flex items-center justify-center gap-2 opacity-30 group-hover:opacity-100 transition-all">
                                        <div className="w-1 h-1 rounded-full bg-white" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{page.status} &bull; {page.lastEdited}</span>
                                     </div>
                                </div>
                                
                                <button className="mt-4 px-6 py-3 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-black group-hover:border-white transition-all translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                    Enter Editor
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="editor"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-24"
                    >
                        {/* EDITOR CANVAS */}
                        <div className="lg:col-span-2 space-y-12">
                             <section className="bg-white/[0.02] border border-white/5 p-12 rounded-[56px] space-y-12">
                                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                     <div className="flex items-center gap-6">
                                         <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center text-white">
                                             <Sparkles className="w-6 h-6" />
                                         </div>
                                         <h3 className="text-2xl font-black uppercase tracking-tighter italic">Reality Engine / <span className="opacity-40">{selectedPage.toUpperCase()}</span></h3>
                                     </div>
                                     <div className="flex gap-4">
                                         <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-all shadow-2xl">
                                             <Eye className="w-5 h-5" />
                                         </button>
                                         <button className="flex items-center gap-3 px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:scale-105 active:scale-95 transition-all">
                                             <Save className="w-4 h-4" /> Deploy
                                         </button>
                                     </div>
                                </div>

                                <div className="space-y-10">
                                     <PageSection label="Hero Narrative (H1)" placeholder="Enter headline..." defaultValue="MUBARAK ISMAIL" />
                                     <PageSection label="Sub-Narrative (P)" placeholder="Enter content..." isTextArea defaultValue="Curating cinematic photography and visual effects for the digital edge." />
                                     <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Hero Asset</label>
                                            <div className="aspect-video bg-black/50 border-2 border-dashed border-white/5 rounded-sm group cursor-pointer hover:border-white/30 transition-all flex flex-col items-center justify-center p-12 text-center gap-4">
                                                <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center text-slate-500 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500">
                                                    <ImageIcon className="w-8 h-8" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                     <span className="text-xs font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">Select Visual</span>
                                                     <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Motion or Frame</span>
                                                </div>
                                            </div>
                                     </div>
                                </div>
                             </section>
                        </div>

                        {/* CONFIG PANEL */}
                        <div className="lg:col-span-1 space-y-8">
                             <section className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[40px] space-y-8 shadow-2xl">
                                 <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20 flex items-center gap-2 border-b border-white/5 pb-6">
                                    <Settings2 className="w-3.5 h-3.5" /> Meta Architecture
                                 </h3>
                                 <div className="space-y-6">
                                      <SmallInput label="SEO Title Pattern" placeholder="[Name] / [Page]" />
                                      <SmallInput label="Meta Description" isTextArea placeholder="Brief summary for indexing engines..." />
                                      <div className="p-6 bg-white/5 border border-white/10 rounded-md flex items-center gap-4 group">
                                            <div className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center text-white">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                 <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Indexable</span>
                                                 <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none">CRAWL SPECS PASSING</span>
                                            </div>
                                      </div>
                                 </div>
                             </section>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PageSection({ label, placeholder, isTextArea = false, defaultValue }: any) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                 <Type className="w-3.5 h-3.5 text-white shadow-[2px_2px_10px_rgba(255,255,255,0.4)]" />
                 <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{label}</label>
            </div>
            {isTextArea ? (
                <textarea 
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-b border-white/5 rounded-none py-4 px-0 text-3xl font-bold tracking-tighter text-white focus:border-white outline-none transition-all placeholder:text-white/5 min-h-[140px] resize-none"
                />
            ) : (
                <input 
                    type="text"
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-b border-white/5 rounded-none py-6 px-0 text-5xl font-black tracking-tighter text-white focus:border-white outline-none transition-all placeholder:text-white/5"
                />
            )}
        </div>
    );
}

function SmallInput({ label, placeholder, isTextArea = false }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.4cm] text-slate-500 px-1">{label}</label>
            {isTextArea ? (
                <textarea 
                    placeholder={placeholder}
                    className="w-full bg-black/50 border border-white/10 rounded-sm p-4 text-xs font-bold text-white/60 focus:border-white outline-none transition-all placeholder:text-white/5 min-h-[100px] resize-none"
                />
            ) : (
                <input 
                    type="text"
                    placeholder={placeholder}
                    className="w-full bg-black/50 border border-white/10 rounded-sm p-4 text-xs font-bold text-white/60 focus:border-white outline-none transition-all placeholder:text-white/5"
                />
            )}
        </div>
    );
}
