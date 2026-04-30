import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Loader2, X, ArrowRight, Expand } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import axios from 'axios';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<any>(null);
    const [nextProject, setNextProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        window.scrollTo(0, 0);

        const fetchProject = async () => {
            try {
                // Fetch current project
                const { data: currentProject } = await axios.get(`${API_URL}/api/projects?id=${id}`);

                // If backend didn't parse blocks, we do it
                if (currentProject.blocks && typeof currentProject.blocks === 'string') {
                    try { currentProject.blocks = JSON.parse(currentProject.blocks); } catch (e) { }
                }

                setProject(currentProject);

                // Fetch all projects to find next one
                const { data: allProjects } = await axios.get(`${API_URL}/api/projects`);
                if (Array.isArray(allProjects)) {
                    const currentIndex = allProjects.findIndex((p: any) => p.id === currentProject.id || p.slug === currentProject.slug);
                    if (currentIndex !== -1) {
                        const next = allProjects[(currentIndex + 1) % allProjects.length];
                        setNextProject(next);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch project:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <Loader2 className="w-12 h-12 animate-spin text-white/20" />
                    <span className="text-[10px] tracking-[0.4em] font-bold opacity-30 uppercase animate-pulse">Unfolding Exhibition...</span>
                </motion.div>
            </div>
        );
    }

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

    const blocks = Array.isArray(project.blocks) ? project.blocks : [];
    const imageBlocks = blocks.filter((b: any) => b.type === 'image' && b.data?.url);

    // Merge master asset into gallery list as the first item
    const allGalleryAssets = [
        { url: project.cover_asset, title: 'Master Frame' },
        ...imageBlocks.map((b: any) => ({ url: b.data.url, title: 'Scene Detail' }))
    ];

    // Bento grid span helper
    const getGridSpan = (index: number) => {
        const patterns = [
            "md:col-span-8 md:row-span-2", // Large
            "md:col-span-4 md:row-span-1", // Small Top
            "md:col-span-4 md:row-span-1", // Small Bottom
            "md:col-span-6 md:row-span-2", // Mid Wide
            "md:col-span-6 md:row-span-2", // Mid Wide
        ];
        return patterns[index % patterns.length];
    };

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
                    src={project.cover_asset}
                    alt={project.title}
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
                            {project.category} &bull; {project.date ? new Date(project.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase() : 'PRESENT'}
                        </span>
                        <h1 className="text-6xl md:text-[8vw] font-bold tracking-tighter leading-none mb-8 uppercase italic">
                            {project.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* CONTENT SECTION - BENTO GRID & STICKY INFO */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 mt-24 mb-32">
                <div className="flex flex-col md:flex-row gap-12 items-start">

                    {/* STICKY INFO BLOCK */}
                    <div className="w-full md:w-1/3 md:sticky top-32 space-y-8">
                        <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 space-y-12">
                            <div className="space-y-4">
                                <h3 className="text-[10px] tracking-[0.4em] font-black uppercase opacity-20">The Concept</h3>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="text-xl md:text-2xl leading-tight font-light italic opacity-90"
                                >
                                    "{project.description}"
                                </motion.p>
                            </div>

                            <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Role</span>
                                    <p className="text-[10px] font-bold uppercase">{project.item_type === 'project' ? 'LEAD EXHIBITOR' : 'SINGLE PIECE'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Medium</span>
                                    <p className="text-[10px] font-bold uppercase">{project.category}</p>
                                </div>
                            </div>
                        </div>

                        {/* SHARE / ACTIONS (Moved here for better sticky utility) */}
                        <div className="px-8 flex gap-4">
                            <button className="flex-1 py-4 border border-white/10 rounded-2xl text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all">Save Piece</button>
                            <button className="w-14 h-14 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* MASONRY GALLERY GRID */}
                    <div className="w-full md:w-2/3">
                        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
                            <Masonry gutter="24px">
                                {allGalleryAssets.map((asset, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                        onClick={() => setSelectedImage(asset.url)}
                                        className="group relative overflow-hidden border border-white/10 bg-white/5 cursor-pointer"
                                    >
                                        <img
                                            src={asset.url}
                                            loading="lazy"
                                            className="w-full h-auto transition-all duration-1000 group-hover:scale-105"
                                            alt={asset.title}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <Expand className="w-6 h-6 text-white" />
                                        </div>
                                    </motion.div>
                                ))}
                            </Masonry>
                        </ResponsiveMasonry>
                    </div>
                </div>

                {/* NEXT PROJECT FOOTER */}
                {nextProject && (
                    <div className="mt-32 pt-24 border-t border-white/10">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 uppercase italic opacity-10">Up Next</h2>
                        <button
                            onClick={() => navigate(`/project/${nextProject.id}`)}
                            className="group flex flex-col items-start gap-4 transition-all duration-500"
                        >
                            <div className="flex items-center gap-8 text-2xl md:text-7xl font-bold tracking-tighter opacity-100 group-hover:translate-x-4 transition-transform duration-700">
                                {nextProject.title}
                                <ArrowLeft className="w-8 h-8 rotate-180 group-hover:translate-x-2 transition-transform opacity-30 group-hover:opacity-100" />
                            </div>
                            <span className="text-[10px] tracking-[0.5em] font-bold uppercase opacity-30 ml-1">{nextProject.category}</span>
                        </button>
                    </div>
                )}
            </section>

            {/* LIGHTBOX */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                            onClick={() => setSelectedImage(null)}
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-8 right-8 z-[110] w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="relative z-[110] w-full max-w-[85vw] max-h-[85vh] flex items-center justify-center">
                            <motion.img
                                src={selectedImage}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                                className="max-w-full max-h-full object-contain shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                            />
                        </div>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-2">
                            <span className="text-[10px] tracking-[0.4em] font-bold opacity-40 uppercase">{project.category}</span>
                            <h4 className="text-xl font-bold tracking-tighter uppercase italic">{project.title}</h4>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
