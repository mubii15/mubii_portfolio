import { motion } from 'motion/react';
import { Mail, Instagram, Twitter, Youtube } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <h1 className="text-7xl md:text-9xl tracking-tighter mb-8">
            MUBARAK ISMAIL
          </h1>
          <div className="text-2xl tracking-wider opacity-50 mb-2">aka Mubii</div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl tracking-tighter mb-6 opacity-50">About</h2>
            <div className="space-y-4 text-lg leading-relaxed opacity-70">
              <p>
                I'm Mubarak Ismail. Most people call me Mubii. I'm based in Abuja, Nigeria.
              </p>
              <p>
                I make photographs and films. Sometimes I build the camera first.
              </p>
              <p>
                Photography and filmmaking are the core of what I do — the frame, the light, the moment, the story inside the story. From there the practice expands: cinematography, contemporary art installations built with electronics and microcontrollers, alternative photographic processes, alternative art processes. Different tools, same instinct. My background is in computational arts — I spent time at Goldsmiths thinking about what happens when you put code and image-making in the same room. What stuck wasn't the software. It was the drive to understand a process well enough to break it on purpose. I figure it out, usually by taking something apart.
              </p>
              <p>

                My work has shown in Nigeria and the UK, turned up in a publication, landed on a London billboard, and earned me a Pexels Hero badge — which is a real thing that exists. I've run workshops, won a competition, and managed to keep a straight face through most of it.
              </p>
              <p>
                The work is built on allegory and easter eggs — things that reward a second look. Some pieces are quiet, some are strange. All of them are asking you something, they're just polite enough not to say it out loud.
              </p>
              <p>
                If you look closely enough, you'll find it. If not, that's fine too.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-4xl tracking-tighter mb-6 opacity-50">Services</h2>
            <div className="space-y-3">
              {[
                'Photography',
                'Cinematography',
                'Visual Effects',
                'Color Grading',
                'Video Editing',
                'Contemporary Art Direction',
                'Creative Consulting',
              ].map((service, index) => (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-lg tracking-wider border-l-2 border-white/20 pl-4 py-2 hover:border-white/60 transition-colors"
                >
                  {service}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="border-t border-white/10 pt-16"
        >
          <h2 className="text-4xl tracking-tighter mb-8 opacity-50">Get in Touch</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <a
              href="mailto:hello@mubarakismail.com"
              className="group cursor-hover"
            >
              <div className="flex items-center gap-4 p-6 border border-white/10 hover:border-white/30 transition-all">
                <Mail className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="text-xs tracking-wider uppercase opacity-50 mb-1">Email</div>
                  <div className="tracking-wide">hello@mubarakismail.com</div>
                </div>
              </div>
            </a>

            <a
              href="https://www.instagram.com/mubii15"
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-hover"
            >
              <div className="flex items-center gap-4 p-6 border border-white/10 hover:border-white/30 transition-all">
                <Instagram className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="text-xs tracking-wider uppercase opacity-50 mb-1">Instagram</div>
                  <div className="tracking-wide">@mubii15</div>
                </div>
              </div>
            </a>

            <a
              href="https://twitter.com/mubii_15"
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-hover"
            >
              <div className="flex items-center gap-4 p-6 border border-white/10 hover:border-white/30 transition-all">
                <Twitter className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="text-xs tracking-wider uppercase opacity-50 mb-1">Twitter</div>
                  <div className="tracking-wide">@mubii_15</div>
                </div>
              </div>
            </a>

            <a
              href="http://youtube.com/@mubii15"
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-hover"
            >
              <div className="flex items-center gap-4 p-6 border border-white/10 hover:border-white/30 transition-all">
                <Youtube className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="text-xs tracking-wider uppercase opacity-50 mb-1">YouTube</div>
                  <div className="tracking-wide">@mubii15</div>
                </div>
              </div>
            </a>
          </div>

          <div className="text-center">
            <p className="text-sm tracking-[0.3em] uppercase opacity-30">
              Available for select collaborations
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-32 text-center"
        >
          <div className="text-[15vw] tracking-tighter opacity-5 leading-none">
            MUBII
          </div>
        </motion.div>
      </div>
    </div>
  );
}
