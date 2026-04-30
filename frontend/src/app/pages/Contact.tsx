import { motion } from 'motion/react';
import { ArrowRight, Instagram, Twitter, Youtube, Mail, MapPin, Briefcase, Users } from 'lucide-react';

export function Contact() {
    const contactSections = [
        {
            title: 'General Inquiries',
            info: 'work@mubarakismail.studio',
            subInfo: '+44 7900 000 000',
            icon: Mail
        },
        {
            title: 'Collaborations',
            info: 'create@mubarakismail.studio',
            subInfo: 'Available for Global Travel',
            icon: Users
        },
        {
            title: 'Careers / Internships',
            info: 'join@mubarakismail.studio',
            subInfo: 'Portfolios via Link Only',
            icon: Briefcase
        },
        {
            title: 'Studio Address',
            info: '15 Creative Way, Shoreditch',
            subInfo: 'London, E1 6HU',
            icon: MapPin
        }
    ];

    const socials = [
        { label: 'Instagram', url: 'https://instagram.com/mubii15' },
        { label: 'YouTube', url: 'http://youtube.com/@mubii15' },
        { label: 'Twitter', url: 'https://twitter.com/mubii_15' },
        { label: 'Behance', url: '#' }
    ];

    return (
        <div className="min-h-screen pt-40 pb-20 px-8 md:px-24 bg-black text-white selection:bg-white selection:text-black">
            <div className="max-w-7xl mx-auto">
                
                {/* TOP SECTION: TITLE & CONTACT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                    
                    {/* Left: Contact Us Header */}
                    <div className="lg:col-span-5 space-y-8">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-7xl md:text-9xl font-bold tracking-tighter leading-none uppercase italic"
                        >
                            Contact <br /> Us
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="text-lg md:text-xl font-light tracking-wide max-w-sm leading-relaxed"
                        >
                            Get in touch with us for any inquiries, project commissions, or creative collaborations.
                        </motion.p>
                    </div>

                    {/* Right: Detailed Info Grid */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 py-8">
                        {contactSections.map((section, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + idx * 0.1, duration: 0.8 }}
                                className="space-y-4 group"
                            >
                                <div className="flex items-center gap-3 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                                    <section.icon size={14} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">{section.title}</h3>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm md:text-lg font-bold tracking-tight uppercase hover:text-cyan-500 transition-colors cursor-pointer">{section.info}</p>
                                    <p className="text-[10px] md:text-xs font-bold opacity-30 uppercase tracking-widest">{section.subInfo}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* BOTTOM SECTION: SOCIALS & FEATURE IMAGE */}
                <div className="mt-40 grid grid-cols-1 lg:grid-cols-12 gap-20 items-end">
                    
                    {/* Bottom Left: Social Links */}
                    <div className="lg:col-span-5 flex flex-wrap gap-8">
                        {socials.map((social, idx) => (
                            <motion.a 
                                key={idx}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                whileHover={{ opacity: 1, x: 5 }}
                                transition={{ delay: 0.6 + idx * 0.1 }}
                                className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2 group"
                            >
                                {social.label}
                                <ArrowRight className="w-3 h-3 -rotate-45 opacity-0 group-hover:opacity-100 transition-all" />
                            </motion.a>
                        ))}
                    </div>

                    {/* Bottom Right: Large Feature Image */}
                    <div className="lg:col-span-12 mt-20">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full aspect-[21/9] bg-white/5 border border-white/10 overflow-hidden rounded-[48px] relative group shadow-2xl"
                        >
                            <img 
                                src="/assets/contact_studio.png" // Placeholder path, I'll recommend the user to place the generated image here
                                alt="Studio Atmosphere" 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
                                <span className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-40">Mubarak Ismail Studio / Creative Sanctuary</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
