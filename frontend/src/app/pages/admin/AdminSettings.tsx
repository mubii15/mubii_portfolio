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
    Database,
    Zap,
    ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function AdminSettings() {
    const [activeTab, setActiveTab] = useState<'general' | 'socials' | 'system'>('general');
    const [settings, setSettings] = useState<Record<string, string>>({
        site_name: 'MUBARAK ISMAIL',
        system_email: 'mubarak@studio.com',
        timezone: 'UTC+0 (London)',
        currency: 'USD ($)',
        meta_desc: 'Cinematic Portfolio & Modern Print Shop. London / New York.',
        instagram: '',
        youtube: '',
        twitter: '',
        vimeo: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        axios.get(`${API_URL}/api/settings`)
            .then(res => {
                if (res.data && Object.keys(res.data).length > 0) {
                    setSettings(prev => ({ ...prev, ...res.data }));
                }
            })
            .catch(err => console.error('Failed to load settings', err));
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await axios.post(`${API_URL}/api/settings`, settings);
            const btn = document.getElementById('save-btn');
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = 'SAVED ✓';
                setTimeout(() => { btn.innerText = originalText; }, 2000);
            }
        } catch (err) {
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const updateSetting = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col gap-10">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic font-black">Environment</h1>
                    <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">System config / V. 01.04.26</p>
                </div>
                <button 
                    id="save-btn"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-3 px-8 py-3 bg-white text-black text-[10px] font-black tracking-widest uppercase rounded-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50"
                >
                    <Save className="w-4 h-4" /> {isSaving ? 'Committing...' : 'Commit Changes'}
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
                                     <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center text-white">
                                         <User className="w-6 h-6" />
                                     </div>
                                     <h3 className="text-2xl font-black uppercase tracking-tighter italic">Identity Specs</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <SettingsInput label="Site Name" value={settings.site_name} onChange={(v: string) => updateSetting('site_name', v)} />
                                    <SettingsInput label="System Email" value={settings.system_email} onChange={(v: string) => updateSetting('system_email', v)} icon={Mail} />
                                    <SettingsInput label="Timezone" value={settings.timezone} onChange={(v: string) => updateSetting('timezone', v)} />
                                    <SettingsInput label="Currency" value={settings.currency} onChange={(v: string) => updateSetting('currency', v)} />
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <SettingsInput label="Meta Baseline Description" isTextArea value={settings.meta_desc} onChange={(v: string) => updateSetting('meta_desc', v)} />
                                </div>
                            </section>
                        )}

                        {activeTab === 'socials' && (
                            <section className="space-y-10">
                                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                                     <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center text-white/50">
                                         <Globe className="w-6 h-6" />
                                     </div>
                                     <h3 className="text-2xl font-black uppercase tracking-tighter italic">Network Sync</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <SettingsInput label="Instagram" placeholder="@username" value={settings.instagram} onChange={(v: string) => updateSetting('instagram', v)} icon={Instagram} />
                                    <SettingsInput label="YouTube" placeholder="Link to channel..." value={settings.youtube} onChange={(v: string) => updateSetting('youtube', v)} icon={Youtube} />
                                    <SettingsInput label="Twitter / X" placeholder="@username" value={settings.twitter} onChange={(v: string) => updateSetting('twitter', v)} icon={Twitter} />
                                    <SettingsInput label="Vimeo" placeholder="Profile URL..." value={settings.vimeo} onChange={(v: string) => updateSetting('vimeo', v)} icon={ExternalLink} />
                                </div>
                            </section>
                        )}

                        {activeTab === 'system' && (
                            <section className="space-y-10">
                                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                                     <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center text-white/30">
                                         <Zap className="w-6 h-6" />
                                     </div>
                                     <h3 className="text-2xl font-black uppercase tracking-tighter italic">Studio Engine</h3>
                                </div>
                                <div className="p-8 bg-white/[0.03] border border-white/10 rounded-sm space-y-6 group">
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
                                            className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" 
                                          />
                                     </div>
                                     <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
                                          <span>42% Studio Utilization</span>
                                          <span>1.4 GB / 3.0 GB Limit</span>
                                     </div>
                                </div>
                                
                                <div className="flex items-start gap-4 p-6 bg-red-500/5 border border-red-500/10 rounded-md">
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
            className={`w-full flex items-center justify-between p-6 rounded-sm border transition-all group
                ${active ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.1)]' : 'bg-[#0a0a0a] border-white/5 text-white/40 hover:border-white/20'}
            `}
        >
            <div className="flex items-center gap-4">
                 <Icon className={`w-5 h-5 ${active ? 'text-black' : 'text-slate-600 group-hover:text-white'} transition-colors`} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <ChevronRight className={`w-4 h-4 opacity-20 ${active ? 'opacity-100' : 'group-hover:translate-x-1'} transition-all`} />
        </button>
    );
}

function SettingsInput({ label, placeholder, value, onChange, isTextArea = false, icon: Icon }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />}
                {isTextArea ? (
                    <textarea 
                        value={value || ''}
                        onChange={e => onChange && onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-black border border-white/5 rounded-md p-5 text-sm font-medium text-white focus:border-white outline-none transition-all placeholder:text-white/5 min-h-[120px] resize-none"
                    />
                ) : (
                    <input 
                        type="text"
                        value={value || ''}
                        onChange={e => onChange && onChange(e.target.value)}
                        placeholder={placeholder}
                        className={`w-full bg-black border border-white/5 rounded-md p-5 text-sm font-medium text-white focus:border-white outline-none transition-all placeholder:text-white/5 ${Icon ? 'pl-14' : ''}`}
                    />
                )}
            </div>
        </div>
    );
}

function ChevronRight(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
}
