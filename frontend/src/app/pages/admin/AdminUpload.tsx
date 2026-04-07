
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    ArrowRight, 
    Image as ImageIcon, 
    Layers, 
    Upload, 
    Video, 
    Link as LinkIcon,
    ChevronLeft,
    CheckCircle2,
    Calendar,
    Type,
    Plus,
    X,
    Film
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Step = 1 | 2 | 3 | 'success';
type UploadType = 'single' | 'project' | null;

export function AdminUpload() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>(1);
    const [uploadType, setUploadType] = useState<UploadType>(null);
    
    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('PHOTOGRAPHY');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [videoLink, setVideoLink] = useState('');
    
    const CATEGORIES = [
        "PHOTOGRAPHY", 
        "CINEMATOGRAPHY", 
        "VFX", 
        "COLOR GRADING", 
        "CONTEMPORARY ART"
    ];

    const isVideoCategory = category === "CINEMATOGRAPHY" || category === "VFX" || category === "COLOR GRADING";

    const handleNext = () => setStep((prev) => (typeof prev === 'number' ? (prev + 1) as Step : prev));
    const handleBack = () => setStep((prev) => (typeof prev === 'number' ? (prev - 1) as Step : prev));

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
            
            {/* PROGRESS TRACKER */}
            <div className="flex gap-4 mb-20 items-center">
                {[1, 2, 3].map((s) => (
                    <div 
                        key={s}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-700
                            ${step === s ? 'scale-[2.5] bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 
                              typeof step === 'number' && step > s ? 'bg-white opacity-40' : 'bg-white/10'}
                        `}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* STEP 1: INTENT (Project vs Single) */}
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        <UploadCard 
                            icon={ImageIcon} 
                            title="Single Piece" 
                            desc="A standalone asset, frame, or look."
                            onClick={() => { setUploadType('single'); handleNext(); }}
                        />
                        <UploadCard 
                            icon={Layers} 
                            title="A Project" 
                            desc="A collection, series, or exhibition."
                            onClick={() => { setUploadType('project'); handleNext(); }}
                        />
                    </motion.div>
                )}

                {/* STEP 2: IDENTITY (Meta & Category) */}
                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-2xl bg-white/[0.02] border border-white/5 p-12 rounded-[48px] backdrop-blur-3xl"
                    >
                        <div className="flex items-center gap-4 mb-12">
                             <button onClick={handleBack} className="p-3 hover:bg-white/5 rounded-full transition-all"><ChevronLeft className="w-5 h-5"/></button>
                             <div className="flex flex-col">
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Identity</h2>
                                <span className="text-[10px] tracking-[0.3em] font-bold opacity-30 uppercase">{uploadType} mode active</span>
                             </div>
                        </div>

                        <div className="space-y-10">
                             <div className="grid grid-cols-1 gap-10">
                                <FormInput label="Title / Name" placeholder="e.g. Nuit Noire" value={title} onChange={setTitle} icon={Type} />
                                
                                <div className="space-y-4">
                                    <label className="text-[10px] tracking-[0.4em] font-black opacity-30 uppercase block px-1">Exhibition Category</label>
                                    <div className="relative group">
                                        <select 
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-black border border-white/10 rounded-2xl p-5 text-xs font-bold tracking-widest uppercase appearance-none focus:border-cyan-500/50 outline-none transition-all cursor-pointer"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <FormInput label="Description" placeholder="Brief narrative..." isTextArea value={description} onChange={setDescription} />
                                <FormInput label="Date / Timeline" placeholder="April 2026" value={date} onChange={setDate} icon={Calendar} />
                             </div>

                             <button 
                                onClick={handleNext}
                                className="w-full py-6 bg-white text-black text-[11px] font-black tracking-[0.4em] uppercase hover:scale-[1.02] active:scale-95 transition-all mt-4 rounded-2xl"
                             >
                                Continue to Assets
                             </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: ASSETS (Conditional Logic) */}
                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12"
                    >
                        {/* LEFT COLUMN: GUIDELINES & BACK */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 mb-4">
                                <button onClick={handleBack} className="p-3 hover:bg-white/5 border border-white/10 rounded-full transition-all"><ChevronLeft className="w-5 h-5"/></button>
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Delivery</h2>
                            </div>
                            
                            <div className="p-8 bg-cyan-500/5 border border-cyan-500/10 rounded-[32px] space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Asset Specs Required:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-[10px] font-bold text-white/40 uppercase tracking-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1" />
                                        Master thumbnail must be 4:5 or 16:9
                                    </li>
                                    <li className="flex items-start gap-3 text-[10px] font-bold text-white/40 uppercase tracking-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1" />
                                        Max file size: 50MB per asset
                                    </li>
                                    {isVideoCategory && (
                                        <li className="flex items-start gap-3 text-[10px] font-bold text-white/40 uppercase tracking-tight">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1" />
                                            Embed links must be Vimeo or YT
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {isVideoCategory && (
                                <FormInput 
                                    label="Source URL (Vimeo/YT)" 
                                    placeholder="https://..." 
                                    value={videoLink} 
                                    onChange={setVideoLink} 
                                    icon={LinkIcon}
                                />
                            )}
                        </div>

                        {/* RIGHT COLUMN: UPLOAD ZONES */}
                        <div className="space-y-8">
                             {/* MAIN DROPZONE */}
                             <div className="border-2 border-dashed border-white/5 rounded-[48px] p-20 flex flex-col items-center justify-center text-center gap-6 group hover:border-cyan-500/40 transition-all cursor-pointer bg-white/[0.01]">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                     <h3 className="text-xl font-bold tracking-tighter uppercase italic">
                                        {uploadType === 'single' ? 'Master Frame' : 'Master Thumbnail'}
                                     </h3>
                                     <p className="text-[9px] tracking-[0.2em] font-black opacity-30 uppercase">Drop asset or click to browse</p>
                                </div>
                             </div>

                             {/* PROJECT COLLECTION OR VIDEO PREVIEWS */}
                             {(uploadType === 'project' || isVideoCategory) && (
                                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] space-y-6">
                                     <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                            {uploadType === 'project' ? 'Collection Assets' : 'Frame Previews'}
                                        </h4>
                                        <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest italic">Multi-upload active</span>
                                     </div>
                                     <div className="grid grid-cols-3 gap-4">
                                        <div className="aspect-square bg-black border border-white/5 rounded-2xl flex items-center justify-center group cursor-pointer hover:border-white/20 transition-all">
                                            <Plus className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                     </div>
                                </div>
                             )}

                             <button 
                                onClick={() => setStep('success')}
                                className="w-full py-6 bg-cyan-500 text-black text-[12px] font-black tracking-[0.5em] uppercase hover:scale-[1.02] active:scale-95 transition-all mt-4 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)]"
                             >
                                Finalize Exhibition
                             </button>
                        </div>
                    </motion.div>
                )}

                {/* SUCCESS SCREEN */}
                {step === 'success' && (
                    <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-10"
                    >
                        <div className="relative">
                            <div className="w-32 h-32 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-16 h-16 text-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)]" />
                            </div>
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl -z-10"
                            />
                        </div>
                        <div>
                             <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none">Archived</h2>
                             <p className="text-[10px] tracking-[0.4em] font-bold opacity-30 mt-4 uppercase">Asset integrated into the studio ecosystem</p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => setStep(1)} className="px-12 py-4 border border-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-white/5 transition-all">Archive Another</button>
                            <button onClick={() => navigate('/admin/projects')} className="px-12 py-4 bg-white text-black rounded-2xl text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all">View Archive</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function UploadCard({ icon: Icon, title, desc, onClick }: { icon: any, title: string, desc: string, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="group relative bg-[#0a0a0a] border border-white/5 p-16 rounded-[56px] text-left hover:border-cyan-500/50 transition-all overflow-hidden shadow-2xl"
        >
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 space-y-8">
                <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center group-hover:scale-[1.15] group-hover:bg-cyan-500 text-white group-hover:text-black transition-all duration-700">
                    <Icon className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-5xl font-black tracking-tighter uppercase italic group-hover:translate-x-4 transition-transform duration-700 leading-none">{title}</h3>
                    <p className="text-[11px] tracking-[0.25em] font-bold opacity-20 uppercase mt-2 group-hover:opacity-60 transition-opacity duration-700">{desc}</p>
                </div>
                <div className="flex items-center gap-3 text-cyan-500 text-[10px] font-black tracking-[0.4em] opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0 transition-all duration-700 uppercase">
                    Select <div className="w-8 h-[2px] bg-cyan-500" />
                </div>
            </div>
        </button>
    );
}

function FormInput({ label, placeholder, isTextArea = false, value, onChange, icon: Icon }: any) {
    return (
        <div className="space-y-4">
            <label className="text-[10px] tracking-[0.4em] font-black opacity-30 uppercase block px-1">{label}</label>
            <div className="relative group">
                {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-cyan-500 transition-colors" />}
                {isTextArea ? (
                    <textarea 
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-black border border-white/10 rounded-3xl p-6 text-sm font-bold tracking-tight h-40 focus:border-cyan-500/50 outline-none transition-all placeholder:opacity-10"
                    />
                ) : (
                    <input 
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={`w-full bg-black border border-white/10 rounded-2xl p-5 text-xs font-bold tracking-widest uppercase focus:border-cyan-500/50 outline-none transition-all placeholder:opacity-10 ${Icon ? 'pl-16' : ''}`}
                    />
                )}
            </div>
        </div>
    );
}
