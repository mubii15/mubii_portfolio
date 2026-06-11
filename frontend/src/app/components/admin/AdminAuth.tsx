import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, ArrowRight } from 'lucide-react';

export function AdminAuth({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('admin_passcode') === '1015') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === '1015') {
            localStorage.setItem('admin_passcode', '1015');
            setIsAuthenticated(true);
        } else {
            setError(true);
            setPasscode('');
            setTimeout(() => setError(false), 2000);
        }
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 bg-[#050505] text-white flex flex-col items-center justify-center z-[100]">
            {/* Cinematic background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-sm"
            >
                <div className="flex flex-col items-center text-center gap-6 mb-12">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500
                        ${error ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-white/10 text-white shadow-[0_0_30px_rgba(255,255,255,0.1)]'}
                    `}>
                        {error ? <Lock className="w-6 h-6 animate-pulse" /> : <Unlock className="w-6 h-6" />}
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black uppercase tracking-tighter italic">Restricted Access</h1>
                        <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">System Control Room</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">
                    <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="ENTER PASSCODE"
                        className={`w-full bg-black/50 backdrop-blur-md border rounded-xl p-5 text-center text-2xl tracking-[1em] font-black outline-none transition-all
                            ${error ? 'border-red-500/50 text-red-500 placeholder:text-red-500/20' : 'border-white/10 focus:border-white/50 text-white placeholder:text-white/10'}
                        `}
                        autoFocus
                    />
                    
                    <button 
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    >
                        <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className={`text-[9px] font-black tracking-widest uppercase transition-all
                        ${error ? 'text-red-500 opacity-100' : 'text-white/20 opacity-100'}
                    `}>
                        {error ? 'ACCESS DENIED' : 'UNAUTHORIZED PERSONNEL WILL BE LOGGED'}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
