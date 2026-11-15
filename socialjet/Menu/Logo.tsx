/** The plugin's logo.svg as a component (gradient ids prefixed so they can't clash on the page). */
const Logo = ({size = 32}: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" aria-hidden="true">
        <defs>
            <linearGradient id="sjlogo-bg" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0" stopColor="#1b1850"/>
                <stop offset="1" stopColor="#3a2f99"/>
            </linearGradient>
            <radialGradient id="sjlogo-glow" cx="0.72" cy="0.3" r="0.6">
                <stop offset="0" stopColor="#6366f1" stopOpacity="0.45"/>
                <stop offset="1" stopColor="#6366f1" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="sjlogo-flame" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fde047"/>
                <stop offset="0.5" stopColor="#fb923c"/>
                <stop offset="1" stopColor="#f43f5e" stopOpacity="0.9"/>
            </linearGradient>
            <linearGradient id="sjlogo-body" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0.5" stopColor="#ffffff"/>
                <stop offset="0.5" stopColor="#e3e6ff"/>
            </linearGradient>
        </defs>
        <rect width="256" height="256" rx="58" fill="url(#sjlogo-bg)"/>
        <rect width="256" height="256" rx="58" fill="url(#sjlogo-glow)"/>
        <g fill="none" strokeLinecap="round" strokeWidth="10" transform="translate(166 90)">
            <path d="M5.2 -29.5 A30 30 0 0 1 29.5 -5.2" stroke="#a5b4fc"/>
            <path d="M9 -51.2 A52 52 0 0 1 51.2 -9" stroke="#818cf8" strokeOpacity="0.6"/>
        </g>
        <g transform="translate(112 144) rotate(45)">
            <path d="M-20 44 Q0 140 20 44 Z" fill="url(#sjlogo-flame)"/>
            <path d="M-9 50 Q0 100 9 50 Z" fill="#fef9c3"/>
            <path d="M-27 4 L-50 34 L-50 54 L-27 42 Z M27 4 L50 34 L50 54 L27 42 Z" fill="#a5b4fc"/>
            <path d="M0 -80 C28 -55 32 -20 27 42 L-27 42 C-32 -20 -28 -55 0 -80 Z" fill="url(#sjlogo-body)"/>
            <path d="M-6 42 H6 V56 H-6 Z" fill="#a5b4fc"/>
            <circle cx="0" cy="-22" r="14" fill="#3a2f99"/>
            <circle cx="0" cy="-22" r="8" fill="#818cf8"/>
            <circle cx="-3" cy="-25" r="3" fill="#ffffff" fillOpacity="0.8"/>
        </g>
    </svg>
);

export default Logo;
