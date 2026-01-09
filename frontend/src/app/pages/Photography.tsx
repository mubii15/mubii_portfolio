import { motion } from 'motion/react';
import { useState } from 'react';

const photos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1750610546688-64ff8b75da69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBwaG90b2dyYXBoeSUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3Njc4MzExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'MIDNIGHT DREAMS',
    location: 'Tokyo, 2024',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1715558643347-9a6ff81f6c5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBob3RvZ3JhcGh5JTIwbW9vZHl8ZW58MXx8fHwxNzY3ODMxMTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'SOLITUDE',
    location: 'New York, 2024',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1543121170-856f92d04651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwbm9pciUyMGJsYWNrJTIwd2hpdGV8ZW58MXx8fHwxNzY3ODMxMTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'NOIR NIGHTS',
    location: 'Paris, 2023',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1536241455566-5709c3aefd3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbnRlbXBvcmFyeSUyMGFydHxlbnwxfHx8fDE3Njc4MDQ3NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'ABSTRACT FORMS',
    location: 'Berlin, 2024',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1767474077025-80d652ac99d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXN1YWwlMjBlZmZlY3RzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzY3ODMxMTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'CHROMATIC',
    location: 'Los Angeles, 2024',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1639426106423-62e489d806a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtbWFraW5nJTIwY2luZW1hdG9ncmFwaHl8ZW58MXx8fHwxNzY3ODMxMTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'BEHIND THE LENS',
    location: 'London, 2023',
  },
];

export function Photography() {
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
          PHOTOGRAPHY
        </h1>
        <p className="text-xl opacity-50 tracking-wide">
          A curated collection of visual narratives
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`relative overflow-hidden cursor-hover group ${
              index % 3 === 0 ? 'md:col-span-2 md:row-span-2' : ''
            } ${index % 5 === 0 ? 'lg:col-span-1 lg:row-span-1' : ''}`}
            onMouseEnter={() => setHoveredId(photo.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <motion.div
              className="aspect-[4/5] overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredId === photo.id ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6"
            >
              <h3 className="text-2xl tracking-tight mb-1">{photo.title}</h3>
              <p className="text-sm opacity-70 tracking-wider">{photo.location}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-16 text-center"
      >
        <div className="text-8xl tracking-tighter opacity-10">06</div>
        <div className="text-sm tracking-[0.3em] uppercase opacity-30 mt-2">
          SELECTED WORKS
        </div>
      </motion.div>
    </div>
  );
}
