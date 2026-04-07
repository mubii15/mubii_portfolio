
import { motion } from 'motion/react';
import { 
    Settings, 
    Globe, 
    Shield, 
    Mail, 
    Instagram, 
    Youtube, 
    Twitter, 
    Save, 
    User, 
    Key, 
    Database,
    Zap,
    ExternalLink
} from 'lucide-react';
import { useState } from 'react';

export function AdminSettings() {
    const [activeTab, setActiveTab] = useState<'general' | 'socials' | 'system'>('general');

    return (
        <div className="flex flex-col gap-10">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic font-black">Environment</h1>
                    <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">System config / V. 01.04.26</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-3 bg-cyan-500 text-black text-[10px] font-black tracking-widest uppercase rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                    <Save className="w-4 h-4" /> Commit Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* TABS SIDEBAR */}
                <div className="lg:col-span-1 space-y-4">
                    <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} label="Core Config" icon={Settings} />
                    <TabButton active={activeTab === 'socials'} onClick={() => setActiveTab('socials')} label="Network / Socials" icon={Globe} />
                    <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} label="Studio Engine" icon={Zap} />
                </div>

                {/* CONTENT AREA */}
                <div className="lg:col-span-3">
                    <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/[0.02] border border-white/5 p-12 rounded-[56px] space-y-12 backdrop-blur-3xl"
                    >
                        {activeTab === 'general' && (
                            <section className="space-y-10">
                                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-500">
                                         <User className="w-6 h-6" />
                                     </div>
                                     <h3 className="text-2xl font-black uppercase tracking-tighter italic">Identity Specs</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <SettingsInput label="Site Name" defaultValue="MUBARAK ISMAIL" />
                                    <SettingsInput label="System Email" defaultValue="mubarak@studio.com" icon={Mail} />
                                    <SettingsInput label="Timezone" defaultValue="UTC+0 (London)" />
                                    <SettingsInput label="Currency" defaultValue="USD ($)" />
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <SettingsInput label="Meta Baseline Description" isTextArea defaultValue="Cinematic Portfolio & Modern Print Shop. London / New York." />
                                </div>
                            </section>
                        )}

                        {activeTab === 'socials' && (
                            <section className="space-y-10">
                                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-purple-500">
                                         <Globe className="w-6 h-6" />
                                     </div>
                                     <h3 className="text-2xl font-black uppercase tracking-tighter italic">Network Sync</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <SettingsInput label="Instagram" placeholder="@username" icon={Instagram} />
                                    <SettingsInput label="YouTube" placeholder="Link to channel..." icon={Youtube} />
                                    <SettingsInput label="Twitter / X" placeholder="@username" icon={Twitter} />
                                    <SettingsInput label="Vimeo" placeholder="Profile URL..." icon={ExternalLink} />
                                </div>
                            </section>
                        )}

                        {activeTab === 'system' && (
                            <section className="space-y-10">
                                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500">
                                         <Zap className="w-6 h-6" />
                                     </div>
                                     <h3 className="text-2xl font-black uppercase tracking-tighter italic">Studio Engine</h3>
                                </div>
                                <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-6 group">
                                     <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-4">
                                               <Database className="w-5 h-5 text-slate-500" />
                                               <span className="text-[11px] font-black uppercase tracking-widest">Cache / Runtime Storage</span>
                                          </div>
                                          <button className="px-4 py-2 border border-red-500/20 text-red-500 text-[9px] font-bold uppercase rounded-lg hover:bg-red-500/10 transition-all">Flush Environment</button>
                                     </div>
                                     <div className="h-2 bg-black rounded-full overflow-hidden">
                                          <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: '42%' }}
                                            className="h-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]" 
                                          />
                                     </div>
                                     <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
                                          <span>42% Studio Utilization</span>
                                          <span>1.4 GB / 3.0 GB Limit</span>
                                     </div>
                                </div>
                                
                                <div className="flex items-start gap-4 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                     <Shield className="w-5 h-5 text-red-500 shrink-0" />
                                     <div className="flex flex-col gap-1">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Security Clearance</span>
                                          <p className="text-[9px] font-bold text-red-500/40 uppercase tracking-widest leading-relaxed">Changes to runtime environment may cause temporary studio downtime during re-deployment.</p>
                                     </div>
                                </div>
                            </section>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, label, icon: Icon, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center justify-between p-6 rounded-[32px] border transition-all group
                ${active ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.1)]' : 'bg-[#0a0a0a] border-white/5 text-white/40 hover:border-white/20'}
            `}
        >
            <div className="flex items-center gap-4">
                 <Icon className={`w-5 h-5 ${active ? 'text-black' : 'text-slate-600 group-hover:text-cyan-500'} transition-colors`} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <ChevronRight className={`w-4 h-4 opacity-20 ${active ? 'opacity-100' : 'group-hover:translate-x-1'} transition-all`} />
        </button>
    );
}

function SettingsInput({ label, placeholder, defaultValue, isTextArea = false, icon: Icon }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />}
                {isTextArea ? (
                    <textarea 
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-medium text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/5 min-h-[120px] resize-none"
                    />
                ) : (
                    <input 
                        type="text"
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        className={`w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-medium text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/5 ${Icon ? 'pl-14' : ''}`}
                    />
                )}
            </div>
        </div>
    );
}

function ChevronRight(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
}
