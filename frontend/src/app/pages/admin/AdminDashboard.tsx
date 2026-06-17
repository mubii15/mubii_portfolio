import { motion } from 'motion/react';
import { 
    Layers, 
    Eye, 
    Upload,
    ArrowUpRight,
    Image as ImageIcon,
    Clock,
    Hash
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://mubii.com.ng';

export function AdminDashboard() {
    const [time, setTime] = useState(new Date());
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/api/stats`)
            .then(res => setStats(res.data))
            .catch(err => console.error('Failed to fetch stats:', err));
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');

    let greeting = "GOOD EVENING";
    if (hours < 12) greeting = "GOOD MORNING";
    else if (hours < 18) greeting = "GOOD AFTERNOON";

    const STATS = [
        { label: 'Total Projects', value: stats?.totalProjects || '0', icon: Layers, color: 'text-white' },
        { label: 'Total Assets in Vault', value: stats?.totalMedia || '0', icon: ImageIcon, color: 'text-white/70' },
        { label: 'Categories Used', value: stats?.totalCategories || '0', icon: Hash, color: 'text-white/50' },
    ];

    return (
        <div className="flex flex-col gap-10 pb-20">
            {/* HEADER ROW */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex flex-col gap-2">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tighter text-white"
                    >
                        {greeting}, <span className="text-white italic font-black">CHIEF.</span>
                    </motion.h1>
                    <p className="text-slate-500 text-xs tracking-[0.2em] font-medium uppercase">System Online &bull; Access Granted</p>
                </div>
                
                {/* CLOCK WIDGET */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-end bg-white/5 border border-white/10 rounded-lg p-4 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12" />
                    <div className="flex items-center gap-2 text-white/50 mb-1 z-10">
                        <Clock className="w-3 h-3" />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Local Time</span>
                    </div>
                    <div className="text-3xl font-black tracking-tighter text-white z-10 flex items-baseline gap-1">
                        {displayHours}<span className="opacity-50 animate-pulse">:</span>{minutes}
                        <span className="text-sm opacity-50 ml-1">{seconds} {ampm}</span>
                    </div>
                </motion.div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {STATS.map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-md hover:bg-white/10 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-white/10 transition-colors" />
                        <div className="flex justify-between items-start relative z-10">
                            <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                        </div>
                        <div className="flex flex-col relative z-10">
                            <span className="text-3xl font-black text-white tracking-tighter">{stats === null ? '-' : stat.value}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-white/30">{stat.label}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* QUICK ACTIONS */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 border-b border-white/5 pb-4">Quick Control</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={() => window.location.href = '/admin/upload'}
                            className="flex items-center justify-between p-5 bg-white rounded-md text-black hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                        >
                            <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-2 transition-transform">
                                <span className="text-xs font-black uppercase tracking-widest leading-none">Upload Project</span>
                                <span className="text-[10px] font-bold opacity-60 uppercase tracking-tight">Full Exhibition</span>
                            </div>
                            <Layers className="w-6 h-6 rotate-[-10deg] group-hover:rotate-0 transition-transform" />
                        </button>
                        <button 
                            onClick={() => window.location.href = '/admin/upload'}
                            className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-md text-white hover:bg-white/10 transition-all group"
                        >
                            <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-2 transition-transform">
                                <span className="text-xs font-black uppercase tracking-widest leading-none">Upload Single</span>
                                <span className="text-[10px] font-bold opacity-30 uppercase tracking-tight">One Asset</span>
                            </div>
                            <Upload className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                        </button>
                    </div>
                </div>

                {/* LATEST ADDITIONS */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-white/40">Latest Additions</h3>
                        <button onClick={() => window.location.href = '/admin/media'} className="text-[10px] font-bold tracking-widest uppercase text-white hover:underline underline-offset-4">Open Vault</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {stats === null ? (
                            <div className="text-center py-10 opacity-30 text-[10px] font-bold tracking-widest uppercase">Fetching Records...</div>
                        ) : stats.recentActivity?.length === 0 ? (
                            <div className="text-center py-10 opacity-30 text-[10px] font-bold tracking-widest uppercase">Vault is empty</div>
                        ) : (
                            stats.recentActivity?.map((item: any, i: number) => {
                                const date = new Date(item.created_at);
                                const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                
                                return (
                                    <motion.div 
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-6 p-4 bg-white/[0.02] border border-white/5 rounded-md hover:border-white/10 transition-colors group cursor-pointer"
                                        onClick={() => window.location.href = '/admin/media'}
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-black overflow-hidden shrink-0 border border-white/10">
                                            {item.cover ? (
                                                <img 
                                                    src={`${API_URL}/api/thumb?path=${encodeURIComponent(item.cover)}`} 
                                                    alt={item.title} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                    <ImageIcon className="w-4 h-4 text-white/20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white group-hover:text-white/70 transition-colors uppercase tracking-tight">{item.title}</span>
                                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[9px] font-bold uppercase text-slate-500 whitespace-nowrap hidden sm:block">{dateString}</span>
                                                <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
