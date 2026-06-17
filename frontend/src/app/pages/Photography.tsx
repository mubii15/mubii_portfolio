import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://mubii.com.ng';

interface Photo {
  id: number;
  title: string;
  description: string;
  cover_asset: string;
  created_at: string;
}

export function Photography() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/projects`)
      .then(({ data }) => {
        const filtered = Array.isArray(data)
          ? data.filter((p: any) => p.category === 'PHOTOGRAPHY' && p.status === 'published')
          : [];
        setPhotos(filtered);
      })
      .catch(err => console.error('Photography fetch error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-32 px-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <h1 className="text-7xl md:text-9xl tracking-tighter mb-4">PHOTOGRAPHY</h1>
        <p className="text-xl opacity-50 tracking-wide">A curated collection of visual narratives</p>
      </motion.div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
        </div>
      )}

      {!isLoading && photos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 gap-6 border border-white/5 rounded-3xl"
        >
          <ImageIcon className="w-12 h-12 opacity-10" />
          <div className="text-center">
            <p className="text-sm tracking-[0.4em] uppercase opacity-20">No works published yet</p>
            <p className="text-xs tracking-widest uppercase opacity-10 mt-2">Check back soon</p>
          </div>
        </motion.div>
      )}

      {!isLoading && photos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative overflow-hidden cursor-pointer group ${
                index % 3 === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onMouseEnter={() => setHoveredId(photo.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <motion.div
                className="aspect-[4/5] overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={photo.cover_asset}
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
                {photo.description && (
                  <p className="text-sm opacity-70 tracking-wider">{photo.description}</p>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && photos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 text-center"
        >
          <div className="text-8xl tracking-tighter opacity-10">{String(photos.length).padStart(2, '0')}</div>
          <div className="text-sm tracking-[0.3em] uppercase opacity-30 mt-2">SELECTED WORKS</div>
        </motion.div>
      )}
    </div>
  );
}
