
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GALLERY_DATA } from '../../data/galleryData';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import { useEffect } from 'react';

export function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const project = GALLERY_DATA.find(item => item.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                    <button onClick={() => navigate(-1)} className="text-xs tracking-[0.3em] uppercase opacity-50 hover:opacity-100">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pb-24">
            
            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
                <button 
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-4 text-xs font-bold tracking-[0.3em] uppercase"
                >
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span>Back to Gallery</span>
                </button>

                <div className="flex gap-6">
                    <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                        <Heart className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative h-[90vh] overflow-hidden">
                <motion.img 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    src={project.image} 
                    alt={project.name} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
                
                <div className="absolute bottom-24 left-12 md:left-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <span className="text-xs md:text-sm tracking-[0.5em] font-bold uppercase opacity-60 block mb-4">
                            {project.category} &bull; {project.date}
                        </span>
                        <h1 className="text-6xl md:text-[10vw] font-bold tracking-tighter leading-none mb-8">
                            {project.name}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section className="max-w-7xl mx-auto px-8 md:px-24 mt-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                    {/* Sidebar Info */}
                    <div className="md:col-span-4 flex flex-col gap-12">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] tracking-[0.3em] font-bold uppercase opacity-30">The Concept</h3>
                            <p className="text-lg leading-relaxed opacity-80 italic">
                                "{project.description}"
                            </p>
                        </div>

                        <div className="flex flex-col gap-6 border-t border-white/10 pt-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-[9px] tracking-[0.3em] font-bold uppercase opacity-30 mb-2">Role</h4>
                                    <span className="text-xs font-bold uppercase">{project.subtitle}</span>
                                </div>
                                <div>
                                    <h4 className="text-[9px] tracking-[0.3em] font-bold uppercase opacity-30 mb-2">Location</h4>
                                    <span className="text-xs font-bold uppercase">GLOBAL</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content / Image Stacks */}
                    <div className="md:col-span-8 flex flex-col gap-24">
                        {project.additionalImages?.map((img, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className={`w-full aspect-square md:aspect-video bg-white/5 overflow-hidden border border-white/10 
                                    ${idx % 2 === 0 ? 'ml-0' : 'md:ml-24 md:w-[90%]'}
                                `}
                            >
                                <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt="Detail" />
                            </motion.div>
                        ))}

                        <div className="py-24 border-t border-white/10">
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12">NEXT PROJECT</h2>
                            <button 
                                onClick={() => navigate(`/project/${GALLERY_DATA[(GALLERY_DATA.findIndex(p => p.id === project.id) + 1) % GALLERY_DATA.length].id}`)}
                                className="group flex items-center gap-8 text-2xl md:text-4xl font-bold tracking-tighter opacity-40 hover:opacity-100 transition-opacity"
                            >
                                {GALLERY_DATA[(GALLERY_DATA.findIndex(p => p.id === project.id) + 1) % GALLERY_DATA.length].name}
                                <ArrowLeft className="w-8 h-8 rotate-180 group-hover:translate-x-4 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
