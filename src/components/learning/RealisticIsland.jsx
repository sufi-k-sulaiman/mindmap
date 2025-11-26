import React from 'react';

// Realistic island shapes inspired by real islands (Hawaii, Maldives, Caribbean, etc.)
const ISLAND_CONFIGS = [
    // Hawaii Big Island style - volcanic
    {
        main: 'M45,30 Q70,15 100,20 Q140,25 160,50 Q175,80 165,115 Q150,145 110,155 Q60,160 30,140 Q10,115 15,75 Q20,45 45,30',
        terrain: [
            { path: 'M80,40 Q100,35 115,45 Q125,60 120,80 Q110,95 90,90 Q70,85 65,70 Q60,55 80,40', fill: '#166534' }, // mountain
            { path: 'M50,70 Q65,60 80,65 Q90,75 85,90 Q75,100 55,95 Q40,85 50,70', fill: '#15803D' }, // hill
        ],
        beach: 'M30,130 Q60,145 110,148 Q145,140 155,125',
        lagoon: { cx: 130, cy: 100, rx: 20, ry: 12 },
    },
    // Maldives atoll style - ring shape
    {
        main: 'M90,20 Q140,25 165,55 Q180,95 160,135 Q130,165 80,160 Q35,150 15,110 Q5,65 35,35 Q60,15 90,20',
        terrain: [
            { path: 'M60,50 Q80,40 100,50 Q110,70 95,85 Q70,90 55,75 Q50,60 60,50', fill: '#22C55E' },
        ],
        beach: 'M25,100 Q45,130 90,145 Q140,140 160,110',
        lagoon: { cx: 90, cy: 85, rx: 35, ry: 25 },
        isAtoll: true,
    },
    // Caribbean tropical style
    {
        main: 'M50,25 Q90,10 135,30 Q170,55 165,100 Q155,140 115,160 Q65,165 30,135 Q5,100 15,60 Q30,30 50,25',
        terrain: [
            { path: 'M70,45 Q95,35 120,50 Q135,75 120,100 Q95,115 70,100 Q55,80 70,45', fill: '#166534' },
            { path: 'M45,80 Q60,70 75,80 Q80,95 65,105 Q45,100 45,80', fill: '#15803D' },
        ],
        beach: 'M20,120 Q50,150 100,155 Q145,145 160,115',
        palmTrees: [{ x: 55, y: 60 }, { x: 125, y: 70 }, { x: 85, y: 110 }],
    },
    // Greek island style - rocky
    {
        main: 'M55,20 Q100,5 145,25 Q175,55 170,100 Q160,145 115,165 Q55,170 20,130 Q0,85 20,45 Q40,20 55,20',
        terrain: [
            { path: 'M75,35 Q110,25 140,45 Q155,80 135,115 Q100,135 65,115 Q45,85 55,55 Q65,40 75,35', fill: '#D4D4D8' }, // rocky mountain
            { path: 'M90,50 Q115,45 130,65 Q140,90 125,110 Q100,120 80,105 Q70,85 80,65 Q85,55 90,50', fill: '#A1A1AA' },
        ],
        beach: 'M15,115 Q40,145 90,155 Q140,150 165,120',
        village: { cx: 100, cy: 80, buildings: 5 },
    },
    // Fiji style - lush tropical
    {
        main: 'M60,15 Q110,5 150,30 Q180,65 170,110 Q155,150 105,170 Q45,165 15,125 Q-5,80 20,40 Q45,15 60,15',
        terrain: [
            { path: 'M80,30 Q120,20 145,50 Q160,90 140,125 Q100,145 60,125 Q40,95 50,60 Q65,35 80,30', fill: '#166534' },
            { path: 'M95,45 Q125,40 140,65 Q150,100 130,125 Q100,135 75,115 Q60,90 70,65 Q85,50 95,45', fill: '#22C55E' },
        ],
        beach: 'M10,110 Q35,145 90,160 Q145,150 165,115',
        waterfall: { x: 110, y: 70 },
        palmTrees: [{ x: 50, y: 75 }, { x: 140, y: 85 }, { x: 75, y: 125 }],
    },
    // Iceland style - volcanic/glacial
    {
        main: 'M45,25 Q95,10 145,30 Q175,60 165,105 Q150,145 100,165 Q45,160 15,120 Q-5,75 25,40 Q40,25 45,25',
        terrain: [
            { path: 'M75,35 Q110,25 135,50 Q150,85 130,115 Q95,130 65,110 Q50,80 60,55 Q70,40 75,35', fill: '#374151' }, // dark volcanic
            { path: 'M90,45 Q115,40 130,60 Q140,85 125,105 Q100,115 80,100 Q70,80 80,60 Q88,48 90,45', fill: '#4B5563' },
        ],
        beach: 'M10,110 Q40,140 95,150 Q145,140 160,105',
        glacier: { path: 'M95,50 Q115,45 125,60 Q130,80 115,90 Q95,85 90,70 Q88,55 95,50', fill: '#E0F2FE' },
    },
    // Seychelles style - granite boulders
    {
        main: 'M55,20 Q100,8 145,28 Q175,58 168,105 Q155,148 108,168 Q50,165 18,128 Q-2,85 18,45 Q42,18 55,20',
        terrain: [
            { path: 'M85,35 Q115,28 138,52 Q152,85 135,118 Q102,138 68,118 Q48,88 58,58 Q72,38 85,35', fill: '#166534' },
        ],
        beach: 'M12,115 Q42,148 100,158 Q148,148 165,115',
        boulders: [
            { cx: 75, cy: 65, r: 12, fill: '#9CA3AF' },
            { cx: 120, cy: 80, r: 10, fill: '#A1A1AA' },
            { cx: 95, cy: 100, r: 8, fill: '#D4D4D8' },
        ],
        palmTrees: [{ x: 55, y: 85 }, { x: 135, y: 95 }],
    },
    // Japanese island style
    {
        main: 'M50,22 Q95,8 142,28 Q172,58 165,105 Q152,148 105,168 Q48,165 15,128 Q-5,82 18,42 Q38,18 50,22',
        terrain: [
            { path: 'M78,32 Q112,22 138,48 Q155,82 138,118 Q105,142 68,118 Q45,85 55,52 Q68,35 78,32', fill: '#166534' }, // main mountain
            { path: 'M92,42 Q118,35 135,58 Q145,88 130,112 Q102,128 78,108 Q65,82 75,58 Q85,45 92,42', fill: '#15803D' },
        ],
        beach: 'M12,118 Q45,148 100,158 Q145,148 162,118',
        torii: { x: 130, y: 125 },
        cherryTrees: [{ x: 60, y: 75 }, { x: 110, y: 90 }],
    },
    // Mauritius style
    {
        main: 'M58,18 Q105,5 148,28 Q178,62 168,108 Q155,152 105,172 Q48,168 15,128 Q-8,82 18,42 Q42,15 58,18',
        terrain: [
            { path: 'M82,32 Q118,22 145,52 Q162,88 142,125 Q108,148 68,125 Q42,92 55,55 Q72,35 82,32', fill: '#166534' },
            { path: 'M95,48 Q122,42 142,68 Q152,98 138,122 Q108,138 78,118 Q62,92 75,65 Q88,52 95,48', fill: '#22C55E' },
        ],
        beach: 'M8,118 Q42,152 98,162 Q148,152 165,118',
        coralReef: true,
        palmTrees: [{ x: 52, y: 82 }, { x: 138, y: 92 }, { x: 88, y: 128 }],
    },
    // New Zealand style
    {
        main: 'M52,18 Q98,5 145,25 Q178,58 170,108 Q158,152 108,175 Q48,172 12,132 Q-8,85 15,42 Q38,15 52,18',
        terrain: [
            { path: 'M78,28 Q115,18 145,48 Q162,85 145,122 Q112,148 72,128 Q42,98 52,58 Q68,32 78,28', fill: '#166534' },
            { path: 'M92,42 Q122,35 145,62 Q158,92 142,118 Q112,138 78,118 Q58,92 68,62 Q82,45 92,42', fill: '#15803D' },
            { path: 'M105,55 Q125,52 138,72 Q145,95 132,112 Q108,122 88,108 Q78,88 88,68 Q98,58 105,55', fill: '#4ADE80' },
        ],
        beach: 'M8,122 Q42,155 102,168 Q152,158 168,122',
        hotSpring: { cx: 75, cy: 85, r: 8 },
    },
];

// Palm tree SVG component
const PalmTree = ({ x, y, scale = 1 }) => (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        <path d="M0,0 L2,20 L-2,20 Z" fill="#92400E" />
        <ellipse cx="0" cy="-2" rx="8" ry="4" fill="#166534" />
        <path d="M-12,-5 Q-6,0 0,-2" stroke="#15803D" strokeWidth="3" fill="none" />
        <path d="M12,-5 Q6,0 0,-2" stroke="#15803D" strokeWidth="3" fill="none" />
        <path d="M0,-10 Q0,-5 0,-2" stroke="#22C55E" strokeWidth="2" fill="none" />
    </g>
);

// Cherry blossom tree
const CherryTree = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
        <path d="M0,0 L1,12 L-1,12 Z" fill="#78350F" />
        <circle cx="-4" cy="-3" r="5" fill="#FDA4AF" />
        <circle cx="4" cy="-2" r="4" fill="#FB7185" />
        <circle cx="0" cy="-6" r="5" fill="#FECDD3" />
    </g>
);

// Torii gate
const Torii = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
        <rect x="-12" y="0" width="3" height="18" fill="#DC2626" />
        <rect x="9" y="0" width="3" height="18" fill="#DC2626" />
        <rect x="-15" y="-2" width="30" height="3" fill="#DC2626" />
        <rect x="-13" y="5" width="26" height="2" fill="#DC2626" />
    </g>
);

// Waterfall
const Waterfall = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
        <rect x="-3" y="0" width="6" height="25" fill="#93C5FD" opacity="0.8" />
        <ellipse cx="0" cy="28" rx="10" ry="4" fill="#67E8F9" opacity="0.6" />
    </g>
);

// Village buildings
const Village = ({ cx, cy, buildings }) => (
    <g>
        {Array.from({ length: buildings }).map((_, i) => (
            <g key={i} transform={`translate(${cx + (i - 2) * 12}, ${cy})`}>
                <rect x="-4" y="-6" width="8" height="8" fill="#FAFAF9" />
                <path d="M-6,-6 L0,-12 L6,-6 Z" fill="#78716C" />
            </g>
        ))}
    </g>
);

export default function RealisticIsland({ index, color, completed, progress = 0, Icon }) {
    const config = ISLAND_CONFIGS[index % ISLAND_CONFIGS.length];
    
    return (
        <svg viewBox="0 0 180 185" className="w-full h-full drop-shadow-lg">
            {/* Ocean background gradient */}
            <defs>
                <radialGradient id={`ocean-${index}`} cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0369A1" stopOpacity="0.1" />
                </radialGradient>
                <linearGradient id={`beach-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#FCD34D" />
                </linearGradient>
            </defs>
            
            {/* Ocean water effect */}
            <ellipse cx="90" cy="170" rx="80" ry="15" fill={`url(#ocean-${index})`} />
            
            {/* Coral reef effect */}
            {config.coralReef && (
                <ellipse cx="90" cy="165" rx="75" ry="12" fill="#06B6D4" opacity="0.2" />
            )}
            
            {/* Shadow */}
            <ellipse cx="92" cy="168" rx="65" ry="10" fill="#0C4A6E" opacity="0.15" />
            
            {/* Main island base */}
            <path d={config.main} fill="#2D5016" transform="translate(0, 3)" />
            <path d={config.main} fill="#4ADE80" />
            
            {/* Beach */}
            <path d={config.beach} stroke={`url(#beach-${index})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            
            {/* Lagoon for atolls */}
            {config.lagoon && (
                <ellipse 
                    cx={config.lagoon.cx} 
                    cy={config.lagoon.cy} 
                    rx={config.lagoon.rx} 
                    ry={config.lagoon.ry} 
                    fill={config.isAtoll ? "#67E8F9" : "#22D3EE"} 
                    opacity="0.7" 
                />
            )}
            
            {/* Terrain/Mountains */}
            {config.terrain?.map((t, i) => (
                <path key={i} d={t.path} fill={t.fill} />
            ))}
            
            {/* Glacier */}
            {config.glacier && (
                <path d={config.glacier.path} fill={config.glacier.fill} opacity="0.9" />
            )}
            
            {/* Boulders */}
            {config.boulders?.map((b, i) => (
                <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.fill} />
            ))}
            
            {/* Hot spring */}
            {config.hotSpring && (
                <g>
                    <circle cx={config.hotSpring.cx} cy={config.hotSpring.cy} r={config.hotSpring.r} fill="#67E8F9" />
                    <circle cx={config.hotSpring.cx} cy={config.hotSpring.cy - 5} r="3" fill="white" opacity="0.6" />
                </g>
            )}
            
            {/* Waterfall */}
            {config.waterfall && <Waterfall x={config.waterfall.x} y={config.waterfall.y} />}
            
            {/* Village */}
            {config.village && <Village cx={config.village.cx} cy={config.village.cy} buildings={config.village.buildings} />}
            
            {/* Torii */}
            {config.torii && <Torii x={config.torii.x} y={config.torii.y} />}
            
            {/* Palm trees */}
            {config.palmTrees?.map((tree, i) => (
                <PalmTree key={i} x={tree.x} y={tree.y} scale={0.8} />
            ))}
            
            {/* Cherry trees */}
            {config.cherryTrees?.map((tree, i) => (
                <CherryTree key={i} x={tree.x} y={tree.y} />
            ))}
            
            {/* Icon platform */}
            <ellipse cx="90" cy="82" rx="22" ry="10" fill="#D4A574" />
            <ellipse cx="90" cy="79" rx="22" ry="10" fill="#E5B887" />
            
            {/* Progress ring */}
            {progress > 0 && progress < 100 && (
                <circle
                    cx="90"
                    cy="58"
                    r="20"
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeDasharray={`${progress * 1.26} 126`}
                    strokeLinecap="round"
                    transform="rotate(-90, 90, 58)"
                    opacity="0.9"
                />
            )}
            
            {/* Completed checkmark */}
            {completed && (
                <g transform="translate(115, 45)">
                    <circle cx="0" cy="0" r="12" fill="#10B981" />
                    <path d="M-5,0 L-2,4 L6,-4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            )}
        </svg>
    );
}