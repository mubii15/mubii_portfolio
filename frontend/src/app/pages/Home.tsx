import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { FanOutStack } from '../components/FanOutStack';
import type { CategoryData } from '../components/FanOutStack';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const CATEGORY_KEYS = ['PHOTOGRAPHY', 'CINEMATOGRAPHY', 'VFX', 'CONTEMPORARY ART'];

// Fallback placeholder for categories with no thumbnail set
import img1 from '../../assets/images/img1.png';
import img2 from '../../assets/images/img2.png';
import img3 from '../../assets/images/img3.png';
import img4 from '../../assets/images/img4.png';
const FALLBACKS = [img1, img2, img3, img4];

export function Home() {
  const [portfolioImages, setPortfolioImages] = useState<string[]>(FALLBACKS);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch thumbnails for stack images
    axios.get(`${API_URL}/api/thumbnails`)
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          const imgs = CATEGORY_KEYS.map((cat, i) => {
            const thumb = data.find((t: any) => t.category === cat || t.category === cat.replace(' / COLOR', ''));
            return thumb?.cropped_url || FALLBACKS[i];
          });
          setPortfolioImages(imgs);
        }
      })
      .catch(() => {});

    // Fetch 3 most recent items per category for the detail reel
    axios.get(`${API_URL}/api/projects`)
      .then(({ data }) => {
        if (!Array.isArray(data)) return;
        const published = data.filter((p: any) => p.status === 'published');
        const built: CategoryData[] = CATEGORY_KEYS.map(cat => {
          const catKey = cat === 'VFX' ? 'VFX' : cat;
          const items = published
            .filter((p: any) => p.category === catKey)
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3);
          return { name: cat, items };
        });
        setCategoryData(built);
      })
      .catch(() => {});
  }, []);

  // Track scroll progress
  const { scrollY } = useScroll();

  const [variant, setVariant] = useState<'fan' | 'collapsed' | 'grid'>('fan');

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < 200) {
      setVariant('fan');
    } else if (latest >= 200 && latest < 600) {
      setVariant('collapsed');
    } else {
      setVariant('grid');
    }
  });

  // Animations linked to scroll
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Adjusted for earlier appearance + Slide Up
  const galleryOpacity = useTransform(scrollY, [350, 500], [0, 1]);
  const galleryY = useTransform(scrollY, [350, 500], [50, 0]);

  // Extended range for arrow opacity so it stays visible longer
  const arrowOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  // Smoothly expand container width from constrained (fan) to full (grid)
  // This replaces the abrupt class change. Matches the scroll points of the variant change.
  const containerMaxWidth = useTransform(scrollY, [500, 750], ["400px", "100vw"]);

  // Track selected category index
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const categories = ["PHOTOGRAPHY", "CINEMATOGRAPHY", "VFX / COLOR", "CONTEMPORARY ART"];

  return (
    <div ref={containerRef} className="relative bg-black text-white min-h-[250vh]">

      {/* Background Gradients & Lava Lamp Effect (Fixed) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[120px]" />
        
        {/* LAVA LAMP CIRCLES */}
        <motion.div 
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -150, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -left-[10%] w-[60vw] h-[60vw] bg-white/[0.07] rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{
            x: [0, -80, 120, 0],
            y: [0, -100, 100, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] right-[10%] w-[45vw] h-[45vw] bg-white/[0.05] rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{
            x: [0, 50, -100, 0],
            y: [0, -200, 50, 0],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute -bottom-[15%] left-[30%] w-[70vw] h-[70vw] bg-white/5 rounded-full blur-[150px]" 
        />
      </div>

      {/* Main Sticky Content Container - Images */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">

        {/* Fan Out Image Stack */}
        {/* Moved slightly UP by adjusting margin top (was -5vh originally, now -10vh) */}
        {/* We use motion.div with maxWidth to smoothly animate the container width expansion */}
        <motion.div
          className="pointer-events-auto flex justify-center mt-[-10vh]"
          style={{
            width: '100%',
            maxWidth: containerMaxWidth
          }}
        >
          <FanOutStack
            images={portfolioImages}
            variant={variant}
            selectedIndex={selectedCategoryIndex}
            onIndexSelect={setSelectedCategoryIndex}
            categoryData={categoryData}
          />
        </motion.div>

      </div>

      {/* Scrollable Content Layers */}
      {/* ADDED pointer-events-none to wrapper to prevent blocking clicks/swipes on the fixed layer below */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 pointer-events-none">

        {/* Hero Text Section (0vh - 100vh) */}
        {/* Adjusted padding: Added padding-top to push text down below images, removing negative margin */}
        <div className="relative h-screen flex flex-col items-center justify-center pt-[35vh] md:pt-[30vh]">
          {/* Re-enable pointer events for text interaction (selection) */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="text-center mix-blend-difference relative z-20 pointer-events-auto"
          >
            <motion.h1
              className="text-[14vw] md:text-[10vw] leading-[0.85] font-bold tracking-tighter"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
              HELLO, I'M
            </motion.h1>

            <motion.h1
              className="text-[14vw] md:text-[10vw] leading-[0.85] font-bold tracking-tighter mb-6"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
            >
              MUBARAK
              <span className="block md:inline text-[8vw] md:text-[6vw] font-light opacity-70 md:ml-6">ISMAIL</span>
            </motion.h1>

            <motion.p
              className="text-xs md:text-xl uppercase tracking-[0.2em] font-light opacity-60 px-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Photographer • Cinematographer • Contemporary Artist
            </motion.p>
          </motion.div>

          {/* Prominent Scroll Indicator */}
          {/* Now positioned relative to the screen container */}
          <motion.div
            style={{ opacity: arrowOpacity }}
            className="absolute bottom-12 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-[100] pointer-events-auto cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            {/* Thicker line and clearer background for visibility */}
            <div className="h-20 w-[2px] bg-white/30 overflow-hidden relative rounded-full">
              <motion.div
                className="absolute top-0 left-0 w-full h-1/2 bg-white box-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                animate={{ y: [80, -40] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold animate-pulse drop-shadow-md">SCROLL</span>
          </motion.div>
        </div>

        {/* Spacer for Transition (100vh - 150vh) */}
        <div className="h-[50vh]"></div>

        {/* Gallery Text Section */}
        {/* Adjusted padding top to ensure it doesn't overlap prematurely */}
        <div className="relative h-screen flex flex-col justify-end pb-16 md:pb-24 pointer-events-none">
          <motion.div
            style={{ opacity: galleryOpacity, y: galleryY }}
            className="border-t border-white/10 pt-4 flex flex-col gap-12 transition-all duration-500"
          >
            <div className="flex items-center justify-between">
              <div className="text-[4vw] md:text-[5vw] leading-none font-light tracking-tighter opacity-80 transition-all duration-500">
                {selectedCategoryIndex !== null ? `0${selectedCategoryIndex + 1}` : '08 '}
              </div>
              <div className="text-[4w] md:text-[5vw] leading-none font-light tracking-tighter text-right opacity-80 uppercase transition-all duration-500">
                {selectedCategoryIndex !== null ? categories[selectedCategoryIndex] : 'PORTFOLIO'}
              </div>

            <div className="flex justify-center pointer-events-auto">
              <Link 
                to="/gallery" 
                className="text-[15] group flex items-center gap-6 px-12 py-5  text-white text-xs font-bold tracking-[0.4em] uppercase transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
              >
                SEE ALL WORK
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
            </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Footer Elements */}
      <motion.div
        className="fixed bottom-6 left-8 md:bottom-8 md:left-8 text-xs uppercase tracking-widest opacity-40 hidden md:block z-30 pointer-events-none"
        style={{ opacity: heroOpacity }}
      >
        Mubarak Ismail
      </motion.div>

      <motion.div
        className="fixed bottom-6 right-8 md:bottom-8 md:right-8 text-xs uppercase tracking-widest opacity-40 hidden md:block z-30 pointer-events-none"
        style={{ opacity: heroOpacity }}
      >
        &copy; {new Date().getFullYear()}
      </motion.div>

    </div>
  );
}
