
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Layers, 
    Image as ImageIcon, 
    Tag, 
    ShoppingBag, 
    FileText, 
    Settings, 
    Upload,
} from 'lucide-react';

const ADMIN_SECTIONS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'upload', label: 'Upload', icon: Upload, path: '/admin/upload' },
    { id: 'archive', label: 'Archive', icon: Layers, path: '/admin/projects' },
    { id: 'media', label: 'Media Library', icon: ImageIcon, path: '/admin/media' },
    { id: 'shop', label: 'Shop', icon: ShoppingBag, path: '/admin/shop' },
    { id: 'orders', label: 'Orders', icon: FileText, path: '/admin/orders' },
    { id: 'categories', label: 'Categories', icon: Tag, path: '/admin/categories' },
    { id: 'pages', label: 'Pages', icon: FileText, path: '/admin/pages' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export function AdminLayout() {
    const location = useLocation();

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            
            {/* ADMIN SIDEBAR - Matching Category Gallery (30vw) */}
            <div className="w-full h-auto md:w-[30vw] md:h-screen md:sticky top-0 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 bg-black/50 backdrop-blur-3xl z-[100]">
                <div>
                    <div className="flex justify-between items-center mb-8 md:mb-24 text-center md:text-left">
                        <Link to="/" className="text-xl font-bold tracking-tighter opacity-100 hover:opacity-80 transition-opacity flex items-center gap-3 group">
                             <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover:scale-125 transition-transform" />
                             <span>MUBARAK <span className="font-light italic">ISMAIL</span></span>
                        </Link>
                        <div className="md:hidden flex flex-col items-end gap-1">
                             <span className="text-[8px] tracking-[0.4em] opacity-40 font-bold uppercase">STUDIO OS</span>
                        </div>
                    </div>

                    <h1 className="text-[8vw] md:text-[5vw] leading-[0.9] font-bold tracking-tighter mb-8 md:mb-16 max-w-[15ch] md:max-w-[10ch] text-center md:text-left uppercase">
                        STUDIO <span className="opacity-40 italic font-light text-[6vw] md:text-[4vw]">CONSOLE</span>
                    </h1>

                    <nav className="flex flex-row md:flex-col gap-6 md:gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide px-2 md:px-0">
                        {ADMIN_SECTIONS.map((section) => {
                             const isActive = location.pathname === section.path || (section.path !== '/admin' && location.pathname.startsWith(section.path));

                             return (
                                <Link
                                    key={section.id}
                                    to={section.path}
                                    className="flex items-center gap-3 md:gap-4 group text-left whitespace-nowrap min-w-fit"
                                >
                                    <div 
                                        className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border transition-all duration-500
                                            ${isActive ? 'scale-125 border-cyan-500 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'border-white/20 group-hover:border-white/50 bg-transparent'}
                                        `}
                                    />
                                    <span 
                                        className={`text-[10px] md:text-xs tracking-[0.3em] font-bold transition-all duration-300 
                                            ${isActive ? 'translate-x-1 md:translate-x-2 text-cyan-400' : 'opacity-30 group-hover:opacity-60 text-white'}
                                        `}
                                    >
                                        {section.label.toUpperCase()}
                                    </span>
                                </Link>
                             );
                        })}
                    </nav>
                </div>

                <div className="hidden md:flex flex-col gap-4">
                    <div className="flex items-center gap-6 border-t border-white/5 pt-8 mb-4">
                         <Link to="/admin/settings" className="text-[10px] tracking-[0.3em] font-bold opacity-30 hover:opacity-100 transition-opacity uppercase">Settings</Link>
                         <Link to="/" className="text-[10px] tracking-[0.3em] font-bold text-red-500/60 hover:text-red-500 transition-colors uppercase">Exit Studio</Link>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] tracking-[0.4em] opacity-10 font-bold uppercase italic">V. 01.04.26</span>
                        <span className="text-[10px] tracking-[0.4em] opacity-30 font-bold uppercase">MUBARAK ISMAIL &copy; 2026</span>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA - Matches Content Section (70vw) */}
            <main className="w-full md:w-[70vw] min-h-screen p-6 md:p-12 bg-black relative">
                 <div className="max-w-6xl mx-auto">
                    <Outlet />
                 </div>
            </main>
        </div>
    );
}

// Removing unused ArrowRightIcon component if no longer needed

