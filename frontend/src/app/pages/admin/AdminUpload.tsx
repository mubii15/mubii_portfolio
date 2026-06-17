
import { useState, useRef } from 'react';
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
    Calendar as CalendarIcon,
    Type,
    Plus,
    X,
    Film
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import axios from 'axios';

type Step = 1 | 2 | 3 | 'success';
type UploadType = 'single' | 'project' | null;
const API_URL = import.meta.env.VITE_API_URL || 'https://mubii.com.ng';

export function AdminUpload() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState<Step>(1);
    const [uploadType, setUploadType] = useState<UploadType>(null);
    
    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('PHOTOGRAPHY');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date>();
    const [videoLink, setVideoLink] = useState('');
    const [coverAsset, setCoverAsset] = useState<string>('');
    const [projectAssets, setProjectAssets] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const multiFileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await axios.post(`${API_URL}/api/upload`, formData, {
                onUploadProgress: (evt) => {
                    if (evt.total) {
                        setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
                    }
                }
            });
            if (data.url) {
                setCoverAsset(data.url);
            } else {
                alert('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err: any) {
            const msg = err.response?.data?.error || err.message || 'Unknown error';
            alert('Upload failed: ' + msg);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        const uploadedUrls: string[] = [];
        const total = files.length;

        for (let i = 0; i < total; i++) {
            setUploadStatus(`Uploading asset ${i + 1} of ${total}...`);
            setUploadProgress(Math.round((i / total) * 100));
            
            const formData = new FormData();
            formData.append('file', files[i]);
            try {
                const { data } = await axios.post(`${API_URL}/api/upload`, formData);
                if (data.url) uploadedUrls.push(data.url);
            } catch (err) {
                console.error("Failed to upload asset", i, err);
            }
        }

        setUploadProgress(100);
        setUploadStatus('Finalizing...');
        setTimeout(() => {
            setProjectAssets([...projectAssets, ...uploadedUrls]);
            setIsUploading(false);
            setUploadProgress(0);
            setUploadStatus('');
            if (multiFileInputRef.current) multiFileInputRef.current.value = '';
        }, 500);
    };
    
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

    const handleFinalize = async () => {
        if (!coverAsset) {
            alert('Please upload a master image before finalizing.');
            return;
        }
        setIsFinalizing(true);
        try {
            const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `item-${Date.now()}`;
            await axios.post(`${API_URL}/api/projects`, {
                title: title || 'Untitled',
                slug,
                description,
                category,
                status: 'published',
                cover_asset: coverAsset,
                item_type: (uploadType === 'single' && !isVideoCategory) ? 'single' : 'project',
                date: date ? date.toISOString().split('T')[0] : null,
                video_link: videoLink || null,
                blocks: projectAssets.map(url => ({ type: 'image', data: { url } }))
            });
            setStep('success');
        } catch (err: any) {
            alert('Failed to save: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsFinalizing(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
            
            {/* PROGRESS TRACKER */}
            <div className="flex gap-4 mb-20 items-center">
                {[1, 2, 3].map((s) => (
                    <div 
                        key={s}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-700
                            ${step === s ? 'scale-[2.5] bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]' : 
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
                        className="w-full max-w-2xl bg-white/[0.02] border border-white/5 p-12 rounded-md backdrop-blur-3xl"
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
                                            className="w-full bg-black border border-white/10 rounded-md p-5 text-xs font-bold tracking-widest uppercase appearance-none focus:border-white/50 outline-none transition-all cursor-pointer"
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
                                
                                {/* Proper Date Picker */}
                                <div className="space-y-4">
                                    <label className="text-[10px] tracking-[0.4em] font-black opacity-30 uppercase block px-1">Date / Timeline</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button
                                                className={`w-full flex items-center bg-black border border-white/10 rounded-md p-5 text-xs font-bold tracking-widest uppercase focus:border-white/50 outline-none transition-all placeholder:opacity-10 justify-start text-left font-normal ${
                                                    !date ? "text-white/30" : "text-white"
                                                }`}
                                            >
                                                <CalendarIcon className="mr-3 h-4 w-4 text-white/50" />
                                                {date ? format(date, "MMMM yyyy") : <span>Select a date</span>}
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-[#0a0a0a] border border-white/10 text-white" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                                nav_button_previous="[&_svg]:text-white/50"
                                                nav_button_next="[&_svg]:text-white/50"
                                                className="bg-[#0a0a0a] text-white rounded-sm"
                                                classNames={{
                                                    day_selected: "bg-white text-black hover:bg-white/70 hover:text-black focus:bg-white focus:text-black",
                                                    day_today: "bg-white/10 text-white",
                                                    day: "text-white hover:bg-white/10 transition-colors w-8 h-8 rounded-md mx-auto flex items-center justify-center",
                                                    caption_label: "text-white font-bold tracking-widest uppercase",
                                                    head_cell: "text-white/50 font-black tracking-widest uppercase text-[10px] w-8",
                                                    nav_button: "hover:bg-white/10 p-1 rounded-md transition-colors"
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                             </div>

                             <button 
                                onClick={handleNext}
                                className="w-full py-6 bg-white text-black text-[11px] font-black tracking-[0.4em] uppercase hover:scale-[1.02] active:scale-95 transition-all mt-4 rounded-md"
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
                            
                            <div className="p-8 bg-white/5 border border-white/10 rounded-sm space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Asset Specs Required:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-[10px] font-bold text-white/40 uppercase tracking-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white mt-1" />
                                        Master thumbnail must be 4:5 or 16:9
                                    </li>
                                    <li className="flex items-start gap-3 text-[10px] font-bold text-white/40 uppercase tracking-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white mt-1" />
                                        Max file size: 50MB per asset
                                    </li>
                                    {isVideoCategory && (
                                        <li className="flex items-start gap-3 text-[10px] font-bold text-white/40 uppercase tracking-tight">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white mt-1" />
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
                             <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-md p-20 flex flex-col items-center justify-center text-center gap-6 group transition-all cursor-pointer relative overflow-hidden
                                    ${coverAsset ? 'border-white/50 bg-black/40' : 'border-white/5 bg-white/[0.01] hover:border-white/40'}
                                `}
                             >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileUpload} 
                                    className="hidden" 
                                    accept="image/*"
                                />

                                {coverAsset ? (
                                    <>
                                        <img src={coverAsset} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                        <div className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500 text-white">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <h3 className="relative z-10 text-xl font-bold tracking-tighter uppercase italic shadow-black/50 drop-shadow-lg">
                                            Asset Secured
                                        </h3>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500">
                                            {isUploading ? <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full" /> : <Upload className="w-8 h-8" />}
                                        </div>
                                        <div className="space-y-3 relative z-10 w-full px-4">
                                             <h3 className="text-xl font-bold tracking-tighter uppercase italic">
                                                {uploadType === 'single' ? 'Master Frame' : 'Master Thumbnail'}
                                             </h3>
                                             <p className="text-[9px] tracking-[0.2em] font-black opacity-30 uppercase">
                                                {isUploading ? `UPLOADING... ${uploadProgress}%` : 'Drop asset or click to browse'}
                                             </p>
                                             {isUploading && (
                                                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                     <div
                                                         className="h-full bg-white rounded-full transition-all duration-300"
                                                         style={{ width: `${uploadProgress}%` }}
                                                     />
                                                 </div>
                                             )}
                                        </div>
                                    </>
                                )}
                             </div>

                             {/* PROJECT COLLECTION OR VIDEO PREVIEWS */}
                             {(uploadType === 'project' || isVideoCategory) && (
                                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] space-y-6">
                                     <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                            {uploadType === 'project' ? 'Collection Assets' : 'Frame Previews'}
                                        </h4>
                                        <span className="text-[8px] font-black text-white uppercase tracking-widest italic">Multi-upload active</span>
                                     </div>
                                     
                                     <input 
                                        type="file" 
                                        ref={multiFileInputRef} 
                                        onChange={handleMultiUpload} 
                                        className="hidden" 
                                        accept="image/*"
                                        multiple
                                     />

                                     <div className="grid grid-cols-3 gap-4">
                                        {projectAssets.map((url, idx) => (
                                            <div key={idx} className="aspect-square bg-black border border-white/10 rounded-md overflow-hidden relative group">
                                                <img src={url} alt={`Asset ${idx}`} className="w-full h-full object-cover" />
                                                <button 
                                                   onClick={() => setProjectAssets(projectAssets.filter((_, i) => i !== idx))}
                                                   className="absolute top-2 right-2 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                           onClick={() => multiFileInputRef.current?.click()}
                                           className="aspect-square bg-black border border-white/5 rounded-md flex items-center justify-center group cursor-pointer hover:border-white/20 transition-all"
                                        >
                                            <Plus className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                     </div>
                                </div>
                             )}

                             <button 
                                onClick={handleFinalize}
                                disabled={isFinalizing}
                                className={`w-full py-6 bg-white text-black text-[12px] font-black tracking-[0.5em] uppercase transition-all mt-4 rounded-md shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center justify-center gap-4
                                    ${isFinalizing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}
                                `}
                             >
                                {isFinalizing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        <span>ESTABLISHING EXHIBITION...</span>
                                    </>
                                ) : (
                                    'Finalize Exhibition'
                                )}
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
                            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-16 h-16 text-white shadow-[0_0_30px_rgba(255,255,255,0.4)]" />
                            </div>
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute inset-0 bg-white/10 rounded-full blur-3xl -z-10"
                            />
                        </div>
                        <div>
                             <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none">Archived</h2>
                             <p className="text-[10px] tracking-[0.4em] font-bold opacity-30 mt-4 uppercase">Asset integrated into the studio ecosystem</p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => setStep(1)} className="px-12 py-4 border border-white/10 rounded-md text-[10px] font-black tracking-widest uppercase hover:bg-white/5 transition-all">Archive Another</button>
                            <button onClick={() => navigate('/admin/projects')} className="px-12 py-4 bg-white text-black rounded-md text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-all">View Archive</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GLOBAL UPLOAD OVERLAY */}
            <AnimatePresence>
                {isUploading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-xl"
                    >
                        <div className="max-w-md w-full px-12 space-y-8 text-center">
                            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                                <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                                <div 
                                    className="absolute inset-0 border-4 border-white rounded-full transition-all duration-500 ease-out" 
                                    style={{ 
                                        clipPath: `inset(${100 - uploadProgress}% 0 0 0)`,
                                        filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                                    }}
                                />
                                <Upload className="w-8 h-8 text-white animate-bounce" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Uploading Gallery</h3>
                                <p className="text-[10px] tracking-[0.4em] font-bold opacity-30 uppercase">{uploadStatus || `${uploadProgress}% Complete`}</p>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                <motion.div 
                                    className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                                    animate={{ width: `${uploadProgress}%` }}
                                />
                            </div>
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
            className="group relative bg-[#0a0a0a] border border-white/5 p-16 rounded-[56px] text-left hover:border-white/50 transition-all overflow-hidden shadow-2xl"
        >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 space-y-8">
                <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center group-hover:scale-[1.15] group-hover:bg-white text-white group-hover:text-black transition-all duration-700">
                    <Icon className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-5xl font-black tracking-tighter uppercase italic group-hover:translate-x-4 transition-transform duration-700 leading-none">{title}</h3>
                    <p className="text-[11px] tracking-[0.25em] font-bold opacity-20 uppercase mt-2 group-hover:opacity-60 transition-opacity duration-700">{desc}</p>
                </div>
                <div className="flex items-center gap-3 text-white text-[10px] font-black tracking-[0.4em] opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0 transition-all duration-700 uppercase">
                    Select <div className="w-8 h-[2px] bg-white" />
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
                {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-white transition-colors" />}
                {isTextArea ? (
                    <textarea 
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-black border border-white/10 rounded-3xl p-6 text-sm font-bold tracking-tight h-40 focus:border-white/50 outline-none transition-all placeholder:opacity-10"
                    />
                ) : (
                    <input 
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={`w-full bg-black border border-white/10 rounded-md p-5 text-xs font-bold tracking-widest uppercase focus:border-white/50 outline-none transition-all placeholder:opacity-10 ${Icon ? 'pl-16' : ''}`}
                    />
                )}
            </div>
        </div>
    );
}
