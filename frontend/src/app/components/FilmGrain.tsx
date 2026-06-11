import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function FilmGrain() {
    const location = useLocation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (location.pathname.startsWith('/admin')) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Dust particles — fixed positions per page/mount
        const NUM_DUST = 22;
        type DustParticle = { x: number; y: number; r: number; alpha: number };
        let dustParticles: DustParticle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const spawnDust = () => {
            const w = canvas.width;
            const h = canvas.height;
            dustParticles = Array.from({ length: NUM_DUST }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.4 + 0.3,
                alpha: Math.random() * 0.45 + 0.2,
            }));
        };

        let frame = 0;

        function draw() {
            if (!canvas || !ctx) return;

            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            // ─── Film Grain (random pixels every other frame) ─────
            if (frame % 2 === 0) {
                const imageData = ctx.createImageData(w, h);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const v = Math.random() * 255;
                    data[i]     = v;
                    data[i + 1] = v;
                    data[i + 2] = v;
                    data[i + 3] = Math.random() < 0.92 ? 0 : Math.random() * 38 + 10;
                }
                ctx.putImageData(imageData, 0, 0);
            }

            // ─── Film Dust — Stationary per page ─────────────────
            for (const p of dustParticles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
                ctx.fill();
            }

            frame++;
            rafRef.current = requestAnimationFrame(draw);
        }

        let lastWidth = window.innerWidth;
        const onResize = () => { 
            if (window.innerWidth !== lastWidth) {
                lastWidth = window.innerWidth;
                resize(); 
                spawnDust(); 
            }
        };

        resize();
        spawnDust();
        window.addEventListener('resize', onResize);
        rafRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', onResize);
        };
    }, [location.pathname]); // Re-spawn dust on every page navigation

    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-40"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
