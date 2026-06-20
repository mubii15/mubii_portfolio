import { useLocation } from 'react-router-dom';

/**
 * Ultra-lightweight film grain using CSS + SVG filter.
 * Zero JavaScript animation loop, zero canvas, zero main-thread cost.
 * Uses an SVG feTurbulence filter for the grain pattern and a CSS animation
 * to shift the baseFrequency, creating animated noise with no JS overhead.
 */
export function FilmGrain() {
    const location = useLocation();

    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    // Skip on mobile for performance
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return null;
    }

    return (
        <>
            {/* SVG filter definition — hidden, just defines the noise pattern */}
            <svg className="fixed w-0 h-0" aria-hidden="true">
                <defs>
                    <filter id="grain-filter">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.65"
                            numOctaves="3"
                            stitchTiles="stitch"
                            result="noise"
                        />
                        <feColorMatrix
                            type="saturate"
                            values="0"
                            in="noise"
                            result="monoNoise"
                        />
                    </filter>
                </defs>
            </svg>

            {/* The grain overlay — pure CSS, no JS loop */}
            <div
                className="pointer-events-none fixed inset-0 z-40"
                style={{
                    filter: 'url(#grain-filter)',
                    opacity: 0.08,
                    mixBlendMode: 'overlay',
                    animation: 'grain-shift 0.5s steps(4) infinite',
                }}
            />

            {/* Keyframes for subtle animation */}
            <style>{`
                @keyframes grain-shift {
                    0%, 100% { transform: translate(0, 0); }
                    25% { transform: translate(-2%, 2%); }
                    50% { transform: translate(2%, -2%); }
                    75% { transform: translate(-1%, -1%); }
                }
            `}</style>
        </>
    );
}
