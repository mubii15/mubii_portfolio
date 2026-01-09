import { motion } from 'motion/react';
import { useState } from 'react';
import { Play } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'ETERNAL NIGHT',
    role: 'Director of Photography',
    camera: 'Arri Alexa Mini LF',
    grade: 'FilmConvert Nitrate',
    thumbnail: 'https://images.unsplash.com/photo-1639426106423-62e489d806a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtbWFraW5nJTIwY2luZW1hdG9ncmFwaHl8ZW58MXx8fHwxNzY3ODMxMTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    year: '2024',
  },
  {
    id: 2,
    title: 'NEON DREAMS',
    role: 'Cinematographer / Colorist',
    camera: 'RED Komodo 6K',
    grade: 'DaVinci Resolve',
    thumbnail: 'https://images.unsplash.com/photo-1767474077025-80d652ac99d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXN1YWwlMjBlZmZlY3RzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzY3ODMxMTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    year: '2024',
  },
  {
    id: 3,
    title: 'SHADOWS & LIGHT',
    role: 'DP / Gaffer',
    camera: 'Sony FX6',
    grade: 'Custom LUT',
    thumbnail: 'https://images.unsplash.com/photo-1750610546688-64ff8b75da69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBwaG90b2dyYXBoeSUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3Njc4MzExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    year: '2023',
  },
];

export function Cinematography() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <h1 className="text-7xl md:text-9xl tracking-tighter mb-4">
          CINEMATOGRAPHY
        </h1>
        <p className="text-xl opacity-50 tracking-wide">
          Moving pictures that tell stories
        </p>
      </motion.div>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="relative group cursor-hover"
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative aspect-[21/9] overflow-hidden">
              <motion.img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: hoveredId === project.id ? 1 : 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 rounded-full border-2 border-white/50 flex items-center justify-center"
                >
                  <Play className="w-8 h-8 ml-1" />
                </motion.div>
              </motion.div>

              <div className="absolute top-8 left-8 text-9xl font-bold opacity-10 tracking-tighter">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-start">
              <div>
                <h2 className="text-4xl tracking-tighter mb-2">{project.title}</h2>
                <p className="text-sm opacity-50 tracking-wider uppercase">
                  {project.role}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: hoveredId === project.id ? 1 : 0,
                  x: hoveredId === project.id ? 0 : -20,
                }}
                transition={{ duration: 0.3 }}
                className="text-right text-sm"
              >
                <div className="opacity-70">
                  <div className="mb-1">
                    <span className="opacity-50">CAMERA:</span> {project.camera}
                  </div>
                  <div className="mb-1">
                    <span className="opacity-50">GRADE:</span> {project.grade}
                  </div>
                  <div>
                    <span className="opacity-50">YEAR:</span> {project.year}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-24 text-right"
      >
        <div className="text-[12rem] tracking-tighter opacity-5 leading-none">
          REEL
        </div>
      </motion.div>
    </div>
  );
}
