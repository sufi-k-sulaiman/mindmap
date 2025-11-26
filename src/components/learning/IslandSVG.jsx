import React from 'react';

// 10 unique island shape designs
const ISLAND_SHAPES = [
    // Classic oval island
    {
        outer: 'M60,25 Q100,10 140,25 Q175,45 170,85 Q165,125 130,145 Q90,160 50,145 Q15,125 10,85 Q5,45 40,25 Q50,20 60,25',
        inner: 'M65,35 Q95,25 130,35 Q155,50 150,80 Q145,110 120,125 Q85,135 55,125 Q30,110 25,80 Q20,50 45,35 Q55,30 65,35',
        platform: { cx: 90, cy: 75, rx: 30, ry: 12 },
    },
    // Crescent moon shape
    {
        outer: 'M40,30 Q90,5 150,30 Q180,60 170,100 Q155,140 100,155 Q45,150 25,110 Q10,70 40,30',
        inner: 'M50,42 Q90,22 138,42 Q160,65 152,95 Q140,125 95,137 Q52,132 37,100 Q25,68 50,42',
        platform: { cx: 95, cy: 80, rx: 28, ry: 11 },
    },
    // Star-like island
    {
        outer: 'M90,15 Q120,25 150,20 Q165,50 175,80 Q165,115 145,140 Q110,155 75,145 Q40,130 20,100 Q15,60 35,35 Q60,20 90,15',
        inner: 'M90,30 Q115,38 138,33 Q150,55 158,78 Q150,105 135,125 Q105,137 78,128 Q50,115 35,92 Q32,62 48,45 Q68,33 90,30',
        platform: { cx: 95, cy: 78, rx: 26, ry: 10 },
    },
    // Heart-shaped island
    {
        outer: 'M90,20 Q130,5 160,35 Q180,70 160,110 Q130,150 90,165 Q50,150 20,110 Q0,70 20,35 Q50,5 90,20',
        inner: 'M90,35 Q120,22 145,45 Q160,72 145,105 Q120,135 90,147 Q60,135 35,105 Q20,72 35,45 Q60,22 90,35',
        platform: { cx: 90, cy: 85, rx: 28, ry: 11 },
    },
    // Hexagonal island
    {
        outer: 'M90,15 L150,40 L165,100 L130,155 L50,155 L15,100 L30,40 Z',
        inner: 'M90,32 L138,52 L150,100 L120,142 L60,142 L30,100 L42,52 Z',
        platform: { cx: 90, cy: 95, rx: 30, ry: 12 },
    },
    // Curved archipelago
    {
        outer: 'M30,50 Q50,20 100,25 Q150,30 170,60 Q185,100 165,135 Q135,160 85,155 Q35,150 15,115 Q0,80 30,50',
        inner: 'M40,58 Q58,35 100,40 Q140,45 155,68 Q168,100 152,128 Q128,148 85,144 Q45,140 28,110 Q18,80 40,58',
        platform: { cx: 95, cy: 90, rx: 32, ry: 13 },
    },
    // Teardrop island
    {
        outer: 'M90,10 Q140,20 165,60 Q180,110 160,145 Q120,170 80,165 Q40,155 20,120 Q5,75 30,40 Q55,15 90,10',
        inner: 'M90,28 Q128,36 148,68 Q160,108 145,135 Q112,155 80,150 Q50,142 35,115 Q22,78 42,50 Q62,30 90,28',
        platform: { cx: 92, cy: 88, rx: 28, ry: 11 },
    },
    // Cloud-like island
    {
        outer: 'M50,40 Q30,35 25,55 Q15,65 20,85 Q15,110 35,130 Q60,150 100,148 Q140,145 160,125 Q175,100 170,75 Q175,50 155,35 Q130,25 100,30 Q70,28 50,40',
        inner: 'M55,52 Q40,48 37,65 Q30,73 34,88 Q30,108 45,122 Q65,138 100,136 Q130,134 145,118 Q157,98 153,78 Q157,58 142,47 Q122,40 98,44 Q72,42 55,52',
        platform: { cx: 95, cy: 92, rx: 30, ry: 12 },
    },
    // Diamond island
    {
        outer: 'M90,10 Q140,35 170,85 Q145,140 90,165 Q35,140 10,85 Q35,35 90,10',
        inner: 'M90,30 Q125,48 148,85 Q128,125 90,145 Q52,125 32,85 Q52,48 90,30',
        platform: { cx: 90, cy: 90, rx: 25, ry: 10 },
    },
    // Amoeba island
    {
        outer: 'M60,25 Q95,15 130,30 Q165,50 170,90 Q168,130 140,150 Q100,165 60,150 Q25,130 15,95 Q10,55 35,35 Q48,25 60,25',
        inner: 'M65,40 Q95,32 122,44 Q150,60 154,90 Q152,120 130,135 Q98,148 65,135 Q38,120 30,92 Q26,62 45,48 Q55,40 65,40',
        platform: { cx: 92, cy: 88, rx: 27, ry: 11 },
    },
];

// Decorative elements for islands
const TreeCluster = ({ x, y, variant }) => {
    const colors = variant % 2 === 0 ? ['#166534', '#15803D'] : ['#14532D', '#166534'];
    return (
        <g transform={`translate(${x}, ${y})`}>
            <ellipse cx="0" cy="8" rx="8" ry="4" fill={colors[0]} opacity="0.3" />
            <path d="M0,-12 L-8,8 L8,8 Z" fill={colors[0]} />
            <path d="M0,-8 L-6,5 L6,5 Z" fill={colors[1]} />
        </g>
    );
};

const Bush = ({ x, y, color }) => (
    <g transform={`translate(${x}, ${y})`}>
        <ellipse cx="0" cy="0" rx="6" ry="4" fill={color} opacity="0.7" />
        <ellipse cx="-4" cy="-2" rx="4" ry="3" fill={color} opacity="0.5" />
        <ellipse cx="4" cy="-2" rx="4" ry="3" fill={color} opacity="0.5" />
    </g>
);

const Pond = ({ cx, cy, rx, ry }) => (
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#67E8F9" opacity="0.8" />
);

export default function IslandSVG({ index, color, completed, progress = 0 }) {
    const shape = ISLAND_SHAPES[index % ISLAND_SHAPES.length];
    const darkerColor = color;
    
    // Generate decorations based on index
    const trees = [
        { x: 35 + (index * 7) % 30, y: 50 + (index * 5) % 20 },
        { x: 130 - (index * 5) % 25, y: 55 + (index * 3) % 25 },
        { x: 55 + (index * 3) % 20, y: 110 + (index * 7) % 20 },
    ];
    
    const bushes = [
        { x: 45 + (index * 5) % 20, y: 70 },
        { x: 135 - (index * 3) % 20, y: 100 },
    ];
    
    const hasPond = index % 3 === 0;
    
    return (
        <svg viewBox="0 0 180 180" className="w-full h-full">
            {/* Water shadow */}
            <ellipse cx="90" cy="165" rx="70" ry="12" fill="#0EA5E9" opacity="0.2" />
            
            {/* Outer island (darker edge) */}
            <path d={shape.outer} fill="#166534" />
            
            {/* Main grass */}
            <path d={shape.inner} fill="#4ADE80" />
            
            {/* Lighter grass patches */}
            <path d={shape.inner} fill="#86EFAC" opacity="0.4" transform="translate(5, 5) scale(0.85)" />
            
            {/* Pond */}
            {hasPond && (
                <Pond cx={70 + (index * 10) % 30} cy={95} rx={15} ry={8} />
            )}
            
            {/* Trees */}
            {trees.map((t, i) => (
                <TreeCluster key={i} x={t.x} y={t.y} variant={index + i} />
            ))}
            
            {/* Bushes */}
            {bushes.map((b, i) => (
                <Bush key={i} x={b.x} y={b.y} color={i % 2 === 0 ? '#166534' : '#15803D'} />
            ))}
            
            {/* Platform for icon */}
            <ellipse 
                cx={shape.platform.cx} 
                cy={shape.platform.cy + 5} 
                rx={shape.platform.rx} 
                ry={shape.platform.ry} 
                fill="#D4A574" 
            />
            <ellipse 
                cx={shape.platform.cx} 
                cy={shape.platform.cy} 
                rx={shape.platform.rx} 
                ry={shape.platform.ry} 
                fill="#E5B887" 
            />
            
            {/* Progress ring */}
            {progress > 0 && (
                <circle
                    cx={shape.platform.cx}
                    cy={shape.platform.cy - 20}
                    r="22"
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeDasharray={`${progress * 1.38} 138`}
                    strokeLinecap="round"
                    transform={`rotate(-90, ${shape.platform.cx}, ${shape.platform.cy - 20})`}
                    opacity="0.8"
                />
            )}
            
            {/* Completed badge */}
            {completed && (
                <g transform={`translate(${shape.platform.cx + 25}, ${shape.platform.cy - 35})`}>
                    <circle cx="0" cy="0" r="12" fill="#10B981" />
                    <path d="M-5,0 L-2,4 L6,-4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            )}
        </svg>
    );
}

export { ISLAND_SHAPES };