
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { FanOutStack } from '../components/FanOutStack';
import { useState, useRef } from 'react';

// Import images
import img1 from '../../assets/images/img1.png';
import img2 from '../../assets/images/img2.png';
import img3 from '../../assets/images/img3.png';
import img4 from '../../assets/images/img4.png';

export function Home() {
  const portfolioImages = [img1, img2, img3, img4];
  const containerRef = useRef<HTMLDivElement>(null);

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

      {/* Background Gradients (Fixed) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[120px]" />
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
        <div className="relative h-screen flex flex-col justify-end pb-8 md:pb-12 pointer-events-none">
          <motion.div
            style={{ opacity: galleryOpacity, y: galleryY }}
            className="border-t border-white/10 pt-4 flex items-end justify-between transition-all duration-500"
          >
            <div className="text-[12vw] md:text-[8vw] leading-none font-light tracking-tighter opacity-80 transition-all duration-500">
              {selectedCategoryIndex !== null ? `0${selectedCategoryIndex + 1}` : '08'}
            </div>
            <div className="text-[12vw] md:text-[8vw] leading-none font-light tracking-tighter text-right opacity-80 uppercase transition-all duration-500">
              {selectedCategoryIndex !== null ? categories[selectedCategoryIndex] : 'PORTFOLIO'}
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
