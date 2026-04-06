
import { motion } from 'motion/react';
import { 
    Users, 
    Layers, 
    Eye, 
    TrendingUp, 
    Clock, 
    ArrowUpRight,
    Plus,
    Upload,
    MessageSquare,
} from 'lucide-react';

const STATS = [
    { label: 'Total Projects', value: '32', change: '+4.2%', icon: Layers, color: 'text-cyan-500' },
    { label: 'Page Views', value: '18.4K', change: '+12.5%', icon: Eye, color: 'text-purple-500' },
    { label: 'Active Clients', value: '14', change: '+1', icon: Users, color: 'text-green-500' },
    { label: 'Conversion', value: '3.4%', change: '-0.2%', icon: TrendingUp, color: 'text-red-500' },
];

const RECENT_ACTIVITY = [
    { id: 1, type: 'upload', user: 'Mubarak Ismail', action: 'Uploaded 12 raw files', project: 'Portrait Series / Diaz', time: '2 mins ago' },
    { id: 2, type: 'publish', user: 'System', action: 'Published new cinematography edit', project: 'Nuit Noire / Music Video', time: '1 hour ago' },
    { id: 3, type: 'message', user: 'Client', action: 'New inquiry regarding photography', project: 'Commercial / Nike', time: '4 hours ago', alert: true },
    { id: 4, type: 'edit', user: 'Mubarak Ismail', action: 'Updated project description', project: 'Urban Solitude', time: 'Yesterday' },
];

export function AdminDashboard() {
    return (
        <div className="flex flex-col gap-10">
            {/* WELCOME SECTION */}
            <div className="flex flex-col gap-2">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold tracking-tighter text-white"
                >
                    WELCOME BACK, <span className="text-cyan-500 italic font-black">CHIEF.</span>
                </motion.h1>
                <p className="text-slate-500 text-xs tracking-[0.2em] font-medium uppercase">Last system access: April 06, 2026 at 08:32 AM</p>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-cyan-500/10 transition-colors" />
                        <div className="flex justify-between items-start relative z-10">
                            <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                            <span className={`text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="flex flex-col relative z-10">
                            <span className="text-2xl font-bold text-white tracking-tighter">{stat.value}</span>
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
                        <button className="flex items-center justify-between p-5 bg-cyan-500 rounded-2xl text-black hover:scale-[1.02] active:scale-[0.98] transition-all group">
                            <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-2 transition-transform">
                                <span className="text-xs font-black uppercase tracking-widest">New Project</span>
                                <span className="text-[10px] font-bold opacity-60">Case-study dropdown</span>
                            </div>
                            <Plus className="w-6 h-6" />
                        </button>
                        <button className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all group">
                            <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-2 transition-transform">
                                <span className="text-xs font-black uppercase tracking-widest">Upload Media</span>
                                <span className="text-[10px] font-bold opacity-40">Photography / Film</span>
                            </div>
                            <Upload className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                        </button>
                        <button className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all group">
                            <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-2 transition-transform">
                                <span className="text-xs font-black uppercase tracking-widest">Schedule Drop</span>
                                <span className="text-[10px] font-bold opacity-40">System automation</span>
                            </div>
                            <Clock className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                        </button>
                    </div>
                </div>

                {/* RECENT ACTIVITY feed */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-white/40">Recent Activity</h3>
                        <button className="text-[10px] font-bold tracking-widest uppercase text-cyan-500 hover:underline underline-offset-4">See Logs</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {RECENT_ACTIVITY.map((activity, i) => (
                            <motion.div 
                                key={activity.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors group"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                    ${activity.alert ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-white/5 text-slate-400'}
                                `}>
                                    {activity.type === 'upload' && <Upload className="w-4 h-4" />}
                                    {activity.type === 'publish' && <ArrowUpRight className="w-4 h-4" />}
                                    {activity.type === 'message' && <MessageSquare className="w-4 h-4" />}
                                    {activity.type === 'edit' && <Layers className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{activity.action}</span>
                                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                                            {activity.user} &bull; <span className="text-white/40 italic">{activity.project}</span>
                                        </span>
                                    </div>
                                    <span className="text-[9px] font-bold uppercase text-slate-500 whitespace-nowrap">{activity.time}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
