
import { motion } from 'motion/react';
import { 
    Search, 
    Filter, 
    ArrowUpRight, 
    CreditCard, 
    Calendar,
    User,
    Package,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronRight,
    Search as SearchIcon
} from 'lucide-react';
import { useState } from 'react';

const MOCK_ORDERS = [
    { id: 'ORD-1204', customer: 'Alexander Rohde', product: 'Cyberpunk LUT Pack', amount: '$45.00', status: 'Completed', date: '06 Apr 2026', type: 'Digital' },
    { id: 'ORD-1203', customer: 'Elena Belova', product: 'Urban Solitude / Print', amount: '$120.00', status: 'Processing', date: '05 Apr 2026', type: 'Physical' },
    { id: 'ORD-1202', customer: 'Julian Casablancas', product: 'Film Preset Bundle', amount: '$30.00', status: 'Completed', date: '04 Apr 2026', type: 'Digital' },
    { id: 'ORD-1201', customer: 'Sarah Jenkins', product: 'Cyanotype Series / Print', amount: '$85.00', status: 'Failed', date: '04 Apr 2026', type: 'Physical' },
];

export function AdminOrders() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="flex flex-col gap-10">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic font-black">Ledger</h1>
                    <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">Sales tracking / {MOCK_ORDERS.length} Transactions</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black tracking-widest uppercase rounded-xl hover:bg-white/10 transition-all">
                        Export CSV
                    </button>
                    <button className="flex items-center gap-3 px-8 py-3 bg-cyan-500 text-black text-[10px] font-black tracking-widest uppercase rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                        Inquiry Manager
                    </button>
                </div>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-[28px]">
                <div className="flex gap-4 flex-1 max-w-md ml-2">
                    <div className="relative flex-1 group">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-cyan-500 transition-colors" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH BY ORDER ID OR CUSTOMER..." 
                            className="w-full bg-black/50 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-bold tracking-widest uppercase focus:border-cyan-500/50 outline-none transition-all placeholder:text-white/10"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-[10px] font-bold tracking-widest uppercase text-cyan-500">All Orders</button>
                    <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-[10px] font-bold tracking-widest uppercase opacity-40">Processing</button>
                    <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-[10px] font-bold tracking-widest uppercase opacity-40">Completed</button>
                </div>
            </div>

            {/* ORDERS TABLE */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30">ID</th>
                            <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Customer</th>
                            <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Product Asset</th>
                            <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Amount</th>
                            <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_ORDERS.map((order, i) => (
                            <motion.tr 
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                onClick={() => {}} // Could open modal
                            >
                                <td className="px-10 py-7">
                                    <span className="text-[11px] font-black text-white tracking-widest group-hover:text-cyan-400 transition-colors">{order.id}</span>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-white uppercase tracking-tight">{order.customer}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-white uppercase tracking-widest">{order.product}</span>
                                        <span className={`text-[8px] font-black uppercase tracking-widest
                                            ${order.type === 'Digital' ? 'text-purple-500' : 'text-cyan-500'}
                                        `}>
                                            {order.type} SHIPMENT
                                        </span>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <span className="text-sm font-bold text-white font-mono">{order.amount}</span>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-2">
                                        {order.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />}
                                        {order.status === 'Processing' && <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                                        {order.status === 'Failed' && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                                        <span className={`text-[9px] font-black uppercase tracking-widest
                                            ${order.status === 'Completed' ? 'text-cyan-500' : 
                                              order.status === 'Processing' ? 'text-amber-500' : 'text-red-500'}
                                        `}>
                                            {order.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-10 py-7 text-right">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{order.date}</span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* SALES SUMMARY (QUICK) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
                <SummaryCard label="Monthly Revenue" value="$4,820" change="+12%" icon={CreditCard} />
                <SummaryCard label="Active Shipments" value="03" change="-1" icon={Package} />
                <SummaryCard label="Fulfillment Rate" value="98.2%" change="+0.4%" icon={CheckCircle2} />
            </div>
        </div>
    );
}

function SummaryCard({ label, value, change, icon: Icon }: any) {
    return (
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] flex items-center justify-between group hover:border-cyan-500/30 transition-all">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-white tracking-tighter">{value}</span>
                    <span className={`text-[10px] font-bold ${change.startsWith('+') ? 'text-cyan-500' : 'text-red-500'}`}>{change}</span>
                </div>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}
