
import { motion, AnimatePresence } from 'motion/react';
import { 
    ShoppingBag, 
    Plus, 
    Search, 
    Trash2, 
    Edit3, 
    Tag, 
    DollarSign, 
    Package, 
    ChevronRight,
    Globe,
    Zap,
    ArrowUpRight,
    CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

const MOCK_PRODUCTS = [
    { id: '1', name: 'CYBERPUNK LUT PACK', price: '45.00', type: 'Digital', stock: '∞', status: 'In Stock', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80' },
    { id: '2', name: 'URBAN SOLITUDE / PRINT', price: '120.00', type: 'Physical', stock: '12', status: 'In Stock', image: 'https://images.unsplash.com/photo-1579546673173-c3ff1c3b9b5a?q=80' },
    { id: '3', name: 'FILM PRESET BUNDLE', price: '30.00', type: 'Digital', stock: '∞', status: 'In Stock', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80' },
];

export function AdminShop() {
    const [view, setView] = useState<'list' | 'add'>('list');
    const [productType, setProductType] = useState<'Digital' | 'Physical'>('Digital');

    return (
        <div className="flex flex-col gap-10">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic font-black">Commerce</h1>
                    <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">Storefront Manager / 3 ACTIVE PRODUCTS</p>
                </div>
                {view === 'list' ? (
                    <button 
                        onClick={() => setView('add')}
                        className="flex items-center gap-3 px-8 py-3 bg-white text-black text-[10px] font-black tracking-widest uppercase rounded-sm hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    >
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                ) : (
                    <button 
                        onClick={() => setView('list')}
                        className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black tracking-widest uppercase rounded-sm hover:bg-white/10 transition-all"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" /> Back to List
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {view === 'list' ? (
                    <motion.div 
                        key="list"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="space-y-6"
                    >
                        {/* PRODUCT LIST */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-3xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.01]">
                                        <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Asset</th>
                                        <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Product Name</th>
                                        <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Type</th>
                                        <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Price</th>
                                        <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30">Stock</th>
                                        <th className="px-10 py-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/30 text-right">Edit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {MOCK_PRODUCTS.map((product) => (
                                        <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-10 py-6">
                                                <div className="w-14 h-14 rounded-sm overflow-hidden border border-white/10 group-hover:border-white/40 transition-colors">
                                                    <img src={product.image} className="w-full h-full object-cover" alt="" />
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-white/70 transition-colors">{product.name}</span>
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">ID: {product.id}0426</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                                                    ${product.type === 'Digital' ? 'border-purple-500/30 text-purple-400 bg-purple-500/5' : 'border-white/30 text-white/70 bg-white/5'}
                                                `}>
                                                    {product.type}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="text-sm font-bold text-white font-mono">${product.price}</span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{product.stock}</span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                                                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="add"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                    >
                        {/* LEFT: MAIN FORM */}
                        <div className="lg:col-span-2 space-y-10">
                            <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                     <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
                                        <Package className="w-5 h-5" />
                                     </div>
                                     <h3 className="text-xl font-bold tracking-tighter uppercase italic">Product Spec</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <ShopInput label="Product Name" placeholder="e.g. Master LUT" />
                                    <ShopInput label="Price (USD)" placeholder="0.00" icon={DollarSign} />
                                </div>

                                <ShopInput label="Description" placeholder="Market narrative..." isTextArea />

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Fulfillment Engine</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <TypeCard 
                                            active={productType === 'Digital'} 
                                            onClick={() => setProductType('Digital')} 
                                            icon={Zap} 
                                            title="Digital Drop" 
                                            desc="Instant asset delivery (LUTs, Presets, Raws)" 
                                        />
                                        <TypeCard 
                                            active={productType === 'Physical'} 
                                            onClick={() => setProductType('Physical')} 
                                            icon={Globe} 
                                            title="Physical Piece" 
                                            desc="Managed shipping (Prints, Art books)" 
                                        />
                                    </div>
                                </div>
                            </section>

                            <button className="w-full py-6 bg-white text-black text-[13px] font-black uppercase tracking-[0.4em] rounded-lg hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                                Launch to Storefront
                            </button>
                        </div>

                        {/* RIGHT: MEDIA & INVENTORY */}
                        <div className="lg:col-span-1 space-y-8">
                            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-sm space-y-6">
                                 <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20 flex items-center gap-2">
                                    <ImageIcon className="w-3.5 h-3.5" /> Product Media
                                 </h3>
                                 <div className="aspect-square bg-black border-2 border-dashed border-white/5 rounded-md flex flex-col items-center justify-center p-6 text-center gap-4 group cursor-pointer hover:border-white/30 transition-all">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Add Hero View</span>
                                 </div>
                            </section>

                            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-sm space-y-6">
                                 <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20 flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5" /> Inventory
                                 </h3>
                                 <ShopInput label="Stock Quantity" placeholder={productType === 'Digital' ? '∞' : '0'} />
                                 <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                    <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Active on storefront</span>
                                 </div>
                            </section>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ShopInput({ label, placeholder, isTextArea = false, icon: Icon }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />}
                {isTextArea ? (
                    <textarea 
                        placeholder={placeholder}
                        className="w-full bg-black/50 border border-white/10 rounded-md p-5 text-sm font-medium focus:border-white outline-none transition-all placeholder:text-white/5 min-h-[120px]"
                    />
                ) : (
                    <input 
                        type="text"
                        placeholder={placeholder}
                        className={`w-full bg-black/50 border border-white/10 rounded-md p-5 text-sm font-medium focus:border-white outline-none transition-all placeholder:text-white/5 ${Icon ? 'pl-14' : ''}`}
                    />
                )}
            </div>
        </div>
    );
}

function TypeCard({ active, onClick, icon: Icon, title, desc }: any) {
    return (
        <button 
            onClick={onClick}
            className={`text-left p-6 rounded-md border transition-all
                ${active ? 'bg-white text-black border-white' : 'bg-black/50 border-white/10 text-white/40 hover:border-white/20'}
            `}
        >
            <Icon className={`w-6 h-6 mb-4 ${active ? 'text-black' : 'text-white'}`} />
            <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black uppercase tracking-widest">{title}</span>
                <span className="text-[9px] font-bold opacity-60 uppercase leading-relaxed">{desc}</span>
            </div>
        </button>
    );
}
