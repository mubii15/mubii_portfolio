import { motion } from 'motion/react';

const artworks = [
  {
    id: 1,
    title: 'CHROMATIC VOID',
    medium: 'Digital Installation',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1536241455566-5709c3aefd3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbnRlbXBvcmFyeSUyMGFydHxlbnwxfHx8fDE3Njc4MDQ3NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2,
    title: 'EPHEMERAL LIGHT',
    medium: 'Mixed Media',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1767474077025-80d652ac99d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXN1YWwlMjBlZmZlY3RzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzY3ODMxMTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3,
    title: 'NOIR SERIES #7',
    medium: 'Photography',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1543121170-856f92d04651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwbm9pciUyMGJsYWNrJTIwd2hpdGV8ZW58MXx8fHwxNzY3ODMxMTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 4,
    title: 'URBAN DECAY',
    medium: 'Video Art',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1750610546688-64ff8b75da69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBwaG90b2dyYXBoeSUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3Njc4MzExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function ContemporaryArt() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-8 pb-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mb-24"
      >
        <h1 className="text-[15vw] leading-[0.85] tracking-tighter">
          CONTEMPORARY
          <br />
          <span className="text-[10vw] opacity-40">ART</span>
        </h1>
      </motion.div>

      <div className="relative">
        {artworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: index * 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-32"
            style={{
              position: index % 2 === 0 ? 'relative' : 'relative',
              marginLeft: index % 2 === 0 ? '0' : 'auto',
              marginRight: index % 2 === 0 ? 'auto' : '0',
              maxWidth: index % 3 === 0 ? '70%' : '50%',
              float: index % 2 === 0 ? 'left' : 'right',
            }}
          >
            <motion.div
              className="relative overflow-hidden cursor-hover"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-auto"
              />
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 mix-blend-multiply"
                whileHover={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.3 + 0.4 }}
              className={`mt-6 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}
            >
              <div className="text-8xl tracking-tighter opacity-5 mb-2">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h2 className="text-3xl tracking-tighter mb-2">{artwork.title}</h2>
              <p className="text-sm opacity-50 tracking-wider uppercase">
                {artwork.medium} — {artwork.year}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-32 clear-both"
      >
        <div className="text-center">
          <p className="text-sm tracking-[0.5em] uppercase opacity-30 mb-4">
            EXHIBITION
          </p>
          <h3 className="text-6xl tracking-tighter opacity-10">
            DIGITAL GALLERY
          </h3>
        </div>
      </motion.div>
    </div>
  );
}
