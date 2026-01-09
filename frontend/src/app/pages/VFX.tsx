import { motion } from 'motion/react';
import { useState } from 'react';

const projects = [
  {
    id: 1,
    title: 'COLOR GRADE TRANSFORMATION',
    before: 'https://images.unsplash.com/photo-1750610546688-64ff8b75da69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBwaG90b2dyYXBoeSUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3Njc4MzExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    after: 'https://images.unsplash.com/photo-1767474077025-80d652ac99d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXN1YWwlMjBlZmZlY3RzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzY3ODMxMTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'Color Grading',
  },
  {
    id: 2,
    title: 'VFX COMPOSITE',
    before: 'https://images.unsplash.com/photo-1639426106423-62e489d806a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtbWFraW5nJTIwY2luZW1hdG9ncmFwaHx8ZW58MXx8fHwxNzY3ODMxMTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    after: 'https://images.unsplash.com/photo-1536241455566-5709c3aefd3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbnRlbXBvcmFyeSUyMGFydHxlbnwxfHx8fDE3Njc4MDQ3NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'Visual Effects',
  },
  {
    id: 3,
    title: 'EDITORIAL POLISH',
    before: 'https://images.unsplash.com/photo-1715558643347-9a6ff81f6c5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBob3RvZ3JhcGh5JTIwbW9vZHl8ZW58MXx8fHwxNzY3ODMxMTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    after: 'https://images.unsplash.com/photo-1543121170-856f92d04651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwbm9pciUyMGJsYWNrJTIwd2hpdGV8ZW58MXx8fHwxNzY3ODMxMTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'Post Production',
  },
];

function BeforeAfterSlider({ before, after, title }: { before: string; after: string; title: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div
      className="relative aspect-[16/9] overflow-hidden cursor-col-resize"
      onMouseMove={handleMouseMove}
    >
      <img src={after} alt={`${title} - After`} className="absolute inset-0 w-full h-full object-cover" />
      
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img src={before} alt={`${title} - Before`} className="absolute inset-0 w-full h-full object-cover" />
      </motion.div>

      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-black" />
            <div className="w-1 h-4 bg-black" />
          </div>
        </div>
      </motion.div>

      <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm text-xs tracking-wider">
        BEFORE
      </div>
      <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm text-xs tracking-wider">
        AFTER
      </div>
    </div>
  );
}

export function VFX() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <h1 className="text-7xl md:text-9xl tracking-tighter mb-4">
          VFX / COLOR / EDIT
        </h1>
        <p className="text-xl opacity-50 tracking-wide">
          Post-production artistry
        </p>
      </motion.div>

      <div className="space-y-16">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <BeforeAfterSlider
              before={project.before}
              after={project.after}
              title={project.title}
            />
            <div className="mt-6 flex justify-between items-center">
              <div>
                <h2 className="text-3xl tracking-tighter mb-1">{project.title}</h2>
                <p className="text-sm opacity-50 tracking-wider uppercase">{project.type}</p>
              </div>
              <div className="text-6xl tracking-tighter opacity-10">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-24 text-center"
      >
        <div className="text-sm tracking-[0.3em] uppercase opacity-30 mb-4">
          POST-PRODUCTION SERVICES
        </div>
        <div className="flex justify-center gap-8 text-xs tracking-wider opacity-50">
          <span>COLOR GRADING</span>
          <span>•</span>
          <span>VFX COMPOSITING</span>
          <span>•</span>
          <span>EDITING</span>
          <span>•</span>
          <span>SOUND DESIGN</span>
        </div>
      </motion.div>
    </div>
  );
}
