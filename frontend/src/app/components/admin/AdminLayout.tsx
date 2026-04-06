
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
    LayoutDashboard, 
    Layers, 
    Image as ImageIcon, 
    Film, 
    Tag, 
    ShoppingBag, 
    FileText, 
    FlaskConical, 
    Settings, 
    BarChart3,
    LogOut,
    Plus
} from 'lucide-react';
import { useState } from 'react';

const ADMIN_SECTIONS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'projects', label: 'Projects', icon: Layers, path: '/admin/projects' },
    { id: 'media', label: 'Media Library', icon: ImageIcon, path: '/admin/media' },
    { id: 'motion', label: 'Motion Manager', icon: Film, path: '/admin/motion' },
    { id: 'categories', label: 'Categories', icon: Tag, path: '/admin/categories' },
    { id: 'shop', label: 'Shop', icon: ShoppingBag, path: '/admin/shop' },
    { id: 'pages', label: 'Pages', icon: FileText, path: '/admin/pages' },
    { id: 'playground', label: 'Playground', icon: FlaskConical, path: '/admin/playground' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export function AdminLayout() {
    const location = useLocation();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    return (
        <div className="flex min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* ADMIN SIDEBAR */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarExpanded ? '280px' : '80px' }}
                className="fixed left-0 top-0 bottom-0 z-[100] bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-all duration-500"
            >
                <div className="p-6 flex items-center justify-between border-b border-white/5 mb-6">
                    <AnimatePresence mode="wait">
                        {isSidebarExpanded ? (
                            <motion.div 
                                key="logo-expanded"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                                    <FlaskConical className="text-black w-5 h-5" />
                                </div>
                                <span className="font-bold tracking-tighter text-lg text-white">STUDIO<span className="text-cyan-500">.</span>OS</span>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="logo-collapsed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mx-auto"
                            >
                                <FlaskConical className="text-black w-5 h-5" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
                    {ADMIN_SECTIONS.map((section) => {
                        const isActive = location.pathname === section.path || (section.path !== '/admin' && location.pathname.startsWith(section.path));
                        const Icon = section.icon;
                        
                        return (
                            <Link 
                                key={section.id}
                                to={section.path}
                                className={`group flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 relative
                                    ${isActive ? 'bg-cyan-500/10 text-cyan-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'}
                                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'group-hover:text-white'}`} />
                                {isSidebarExpanded && (
                                    <span className="text-sm font-medium tracking-tight uppercase">{section.label}</span>
                                )}
                                {isActive && (
                                    <motion.div 
                                        layoutId="sidebarActive"
                                        className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5 flex flex-col gap-4">
                    <button 
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all w-full"
                    >
                        <motion.div 
                            animate={{ rotate: isSidebarExpanded ? 180 : 0 }}
                            className="w-5 h-5 flex items-center justify-center"
                        >
                            <ArrowRightIcon className="w-4 h-4" />
                        </motion.div>
                        {isSidebarExpanded && <span className="text-xs font-bold tracking-widest uppercase">Collapse</span>}
                    </button>
                    <Link to="/" className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all">
                        <LogOut className="w-5 h-5" />
                        {isSidebarExpanded && <span className="text-xs font-bold tracking-widest uppercase">Exit Studio</span>}
                    </Link>
                </div>
            </motion.aside>

            {/* MAIN CONTENT AREA */}
            <main 
                className="flex-1 transition-all duration-500 pb-24"
                style={{ marginLeft: isSidebarExpanded ? '280px' : '80px' }}
            >
                {/* ADMIN TOOLBAR */}
                <header className="h-20 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-[90]">
                    <div className="flex flex-col">
                        <span className="text-[10px] tracking-[0.3em] font-bold text-cyan-500 uppercase">System Active</span>
                        <h2 className="text-sm font-bold tracking-[0.1em] uppercase text-white">MUBARAK ISMAIL / STUDIO CONSOLE</h2>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-colors">
                            <Plus className="w-3.5 h-3.5 text-cyan-500" /> New Project
                        </button>
                        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            <span className="text-black font-black text-xs">MI</span>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-7xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

function ArrowRightIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
    );
}
