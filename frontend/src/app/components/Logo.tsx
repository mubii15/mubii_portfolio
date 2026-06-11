

export function Logo({ className = "w-6 h-auto", fill = "currentColor" }: { className?: string, fill?: string }) {
    return (
        <svg viewBox="0 0 7 6" fill={fill} className={className} xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="1" height="6" />
            <rect x="2" y="0" width="1" height="6" />
            <rect x="4" y="0" width="1" height="6" />
            <rect x="6" y="0" width="1" height="1" />
            <rect x="6" y="2" width="1" height="4" />
        </svg>
    );
}
