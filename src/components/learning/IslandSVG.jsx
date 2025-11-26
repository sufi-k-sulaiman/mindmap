import React from 'react';

// 8 unique island designs inspired by the reference image
const IslandDesigns = {
    // Island 1: Grassy with pond and small trees
    GrassyPond: ({ color }) => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Water base */}
            <ellipse cx="100" cy="145" rx="90" ry="15" fill="#7DD3FC" opacity="0.6" />
            <ellipse cx="100" cy="140" rx="85" ry="12" fill="#38BDF8" opacity="0.4" />
            
            {/* Sand/beach ring */}
            <ellipse cx="100" cy="125" rx="80" ry="20" fill="#FCD34D" />
            <ellipse cx="100" cy="122" rx="75" ry="18" fill="#FBBF24" />
            
            {/* Main grass island */}
            <ellipse cx="100" cy="115" rx="70" ry="22" fill="#4ADE80" />
            <ellipse cx="100" cy="110" rx="65" ry="20" fill="#22C55E" />
            
            {/* Grass patches */}
            <ellipse cx="70" cy="105" rx="25" ry="12" fill="#16A34A" opacity="0.6" />
            <ellipse cx="130" cy="108" rx="20" ry="10" fill="#15803D" opacity="0.5" />
            
            {/* Pond */}
            <ellipse cx="65" cy="100" rx="18" ry="8" fill="#67E8F9" />
            <ellipse cx="63" cy="98" rx="8" ry="4" fill="#A5F3FC" opacity="0.7" />
            
            {/* Small bushes/trees */}
            <circle cx="120" cy="95" r="8" fill="#166534" />
            <circle cx="115" cy="90" r="6" fill="#15803D" />
            <circle cx="125" cy="88" r="7" fill="#166534" />
            <circle cx="140" cy="100" r="5" fill="#22C55E" />
            
            {/* Grass tufts */}
            <path d="M50,105 Q52,95 54,105" stroke="#15803D" strokeWidth="2" fill="none" />
            <path d="M90,100 Q92,92 94,100" stroke="#166534" strokeWidth="2" fill="none" />
        </svg>
    ),

    // Island 2: Mountain with pine trees
    MountainPines: ({ color }) => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Water */}
            <ellipse cx="100" cy="148" rx="95" ry="12" fill="#7DD3FC" opacity="0.5" />
            
            {/* Beach */}
            <ellipse cx="100" cy="135" rx="85" ry="18" fill="#FCD34D" />
            
            {/* Grass base */}
            <ellipse cx="100" cy="128" rx="78" ry="22" fill="#4ADE80" />
            <ellipse cx="100" cy="122" rx="72" ry="20" fill="#22C55E" />
            
            {/* Mountain */}
            <path d="M100,35 L145,110 L55,110 Z" fill="#6B7280" />
            <path d="M100,35 L125,85 L100,90 L75,85 Z" fill="#9CA3AF" />
            <path d="M100,35 L110,55 L100,60 L90,55 Z" fill="#D1D5DB" />
            
            {/* Pine trees - left side */}
            <path d="M55,115 L60,85 L65,115 Z" fill="#166534" />
            <path d="M57,100 L60,75 L63,100 Z" fill="#15803D" />
            <rect x="58" y="115" width="4" height="8" fill="#92400E" />
            
            <path d="M70,118 L77,82 L84,118 Z" fill="#166534" />
            <path d="M72,100 L77,70 L82,100 Z" fill="#15803D" />
            <rect x="75" y="118" width="4" height="8" fill="#78350F" />
            
            {/* Pine trees - right side */}
            <path d="M125,118 L132,85 L139,118 Z" fill="#166534" />
            <path d="M127,102 L132,75 L137,102 Z" fill="#15803D" />
            <rect x="130" y="118" width="4" height="8" fill="#92400E" />
            
            <path d="M140,115 L145,90 L150,115 Z" fill="#166534" />
            <rect x="143" y="115" width="4" height="6" fill="#78350F" />
        </svg>
    ),

    // Island 3: Tropical palm island (small beach)
    TropicalPalm: ({ color }) => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Water */}
            <ellipse cx="100" cy="145" rx="85" ry="15" fill="#38BDF8" opacity="0.5" />
            <ellipse cx="100" cy="142" rx="80" ry="12" fill="#7DD3FC" opacity="0.4" />
            
            {/* Sand island */}
            <ellipse cx="100" cy="130" rx="65" ry="20" fill="#FDE68A" />
            <ellipse cx="100" cy="125" rx="60" ry="18" fill="#FCD34D" />
            <ellipse cx="100" cy="122" rx="55" ry="15" fill="#FBBF24" />
            
            {/* Palm tree trunk */}
            <path d="M95,125 Q85,80 90,50" stroke="#92400E" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M95,125 Q85,80 90,50" stroke="#A16207" strokeWidth="4" fill="none" strokeLinecap="round" />
            
            {/* Palm fronds */}
            <path d="M90,50 Q60,40 40,55" stroke="#22C55E" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M90,50 Q65,35 50,40" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M90,50 Q110,30 140,45" stroke="#22C55E" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M90,50 Q120,35 145,35" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M90,50 Q85,25 80,15" stroke="#4ADE80" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M90,50 Q100,30 115,25" stroke="#4ADE80" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Second smaller palm */}
            <path d="M130,128 Q140,100 135,80" stroke="#78350F" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M135,80 Q115,75 100,85" stroke="#22C55E" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M135,80 Q150,70 165,75" stroke="#22C55E" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M135,80 Q140,65 145,55" stroke="#4ADE80" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
    ),

    // Island 4: Rocky mountain with bushes
    RockyMountain: ({ color }) => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Water */}
            <ellipse cx="100" cy="148" rx="92" ry="12" fill="#7DD3FC" opacity="0.5" />
            
            {/* Beach */}
            <ellipse cx="100" cy="138" rx="82" ry="16" fill="#FCD34D" />
            
            {/* Grass */}
            <ellipse cx="100" cy="130" rx="75" ry="20" fill="#4ADE80" />
            <ellipse cx="100" cy="125" rx="70" ry="18" fill="#22C55E" />
            
            {/* Rocky mountain */}
            <path d="M70,125 L95,40 L130,125 Z" fill="#78716C" />
            <path d="M80,125 L95,55 L115,125 Z" fill="#A8A29E" />
            <path d="M85,110 L95,70 L105,110 Z" fill="#D6D3D1" opacity="0.5" />
            
            {/* Rock details */}
            <path d="M75,120 L80,100 L90,120 Z" fill="#57534E" />
            <path d="M105,118 L115,95 L125,118 Z" fill="#57534E" />
            
            {/* Bushes */}
            <ellipse cx="50" cy="118" rx="15" ry="10" fill="#166534" />
            <ellipse cx="45" cy="115" rx="10" ry="7" fill="#22C55E" />
            <ellipse cx="55" cy="112" rx="8" ry="6" fill="#15803D" />
            
            <ellipse cx="150" cy="120" rx="12" ry="8" fill="#166534" />
            <ellipse cx="155" cy="115" rx="8" ry="6" fill="#22C55E" />
        </svg>
    ),

    // Island 5: Cave with forest
    CaveForest: ({ color }) => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Water */}
            <ellipse cx="100" cy="148" rx="90" ry="12" fill="#38BDF8" opacity="0.5" />
            
            {/* Beach */}
            <ellipse cx="100" cy="138" rx="80" ry="15" fill="#FCD34D" />
            
            {/* Grass */}
            <ellipse cx="100" cy="130" rx="75" ry="18" fill="#4ADE80" />
            
            {/* Cave mountain */}
            <path d="M60,130 L100,45 L140,130 Z" fill="#78716C" />
            <path d="M70,130 L100,60 L130,130 Z" fill="#A8A29E" />
            
            {/* Cave opening */}
            <ellipse cx="100" cy="115" rx="18" ry="15" fill="#1F2937" />
            <ellipse cx="100" cy="112" rx="12" ry="10" fill="#111827" />
            
            {/* Pine trees around cave */}
            <path d="M45,130 L52,95 L59,130 Z" fill="#166534" />
            <path d="M47,115 L52,85 L57,115 Z" fill="#15803D" />
            
            <path d="M145,128 L152,98 L159,128 Z" fill="#166534" />
            <path d="M147,115 L152,90 L157,115 Z" fill="#15803D" />
            
            <path d="M155,130 L160,105 L165,130 Z" fill="#166534" />
            
            {/* Trees on top */}
            <path d="M85,70 L90,50 L95,70 Z" fill="#166534" />
            <path d="M105,72 L110,55 L115,72 Z" fill="#15803D" />
        </svg>
    ),

    // Island 6: Desert/sand island
    DesertIsland: ({ color }) => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Water */}
            <ellipse cx="100" cy="145" rx="90" ry="15" fill="#38BDF8" opacity="0.6" />
            <ellipse cx="100" cy="142" rx="85" ry="12" fill="#7DD3FC" opacity="0.4" />
            
            {/* Sand island - flat */}
            <ellipse cx="100" cy="128" rx="75" ry="18" fill="#FDE68A" />
            <ellipse cx="100" cy="125" rx="70" ry="15" fill="#FCD34D" />
            <ellipse cx="100" cy="122" rx="65" ry="12" fill="#FBBF24" />
            
            {/* Sand dunes/ripples */}
            <path d="M50,120 Q70,115 90,120" stroke="#F59E0B" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M80,118 Q100,113 120,118" stroke="#F59E0B" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M110,120 Q130,115 150,120" stroke="#F59E0B" strokeWidth="2" fill="none" opacity="0.5" />
        </svg>
    ),

    // Island 7: Waterfall island
    WaterfallIsland: ({ color }) => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Water pool */}
            <ellipse cx="100" cy="145" rx="90" ry="15" fill="#38BDF8" opacity="0.7" />
            <ellipse cx="85" cy="140" rx="30" ry="10" fill="#67E8F9" opacity="0.6" />
            
            {/* Beach */}
            <ellipse cx="100" cy="132" rx="80" ry="18" fill="#FCD34D" />
            
            {/* Grass */}
            <ellipse cx="100" cy="125" rx="72" ry="20" fill="#4ADE80" />
            <ellipse cx="110" cy="120" rx="50" ry="15" fill="#22C55E" />
            
            {/* Rocks for waterfall */}
            <path d="M55,125 L70,70 L90,125 Z" fill="#9CA3AF" />
            <path d="M60,125 L72,80 L85,125 Z" fill="#D1D5DB" />
            <circle cx="50" cy="118" r="10" fill="#78716C" />
            <circle cx="92" cy="115" r="8" fill="#A1A1AA" />
            
            {/* Waterfall */}
            <path d="M72,75 Q70,100 68,125" stroke="#7DD3FC" strokeWidth="8" fill="none" opacity="0.8" />
            <path d="M72,75 Q74,100 76,125" stroke="#BAE6FD" strokeWidth="4" fill="none" opacity="0.6" />
            
            {/* Splash at bottom */}
            <ellipse cx="72" cy="130" rx="15" ry="5" fill="#BAE6FD" opacity="0.5" />
            
            {/* Palm trees */}
            <path d="M130,125 Q140,90 138,65" stroke="#92400E" strokeWidth="4" fill="none" />
            <path d="M138,65 Q115,60 100,70" stroke="#22C55E" strokeWidth="3" fill="none" />
            <path d="M138,65 Q155,55 170,60" stroke="#22C55E" strokeWidth="3" fill="none" />
            <path d="M138,65 Q145,45 150,35" stroke="#4ADE80" strokeWidth="2" fill="none" />
            
            <path d="M155,128 Q160,105 158,88" stroke="#78350F" strokeWidth="3" fill="none" />
            <path d="M158,88 Q145,85 135,92" stroke="#22C55E" strokeWidth="2" fill="none" />
            <path d="M158,88 Q170,82 178,85" stroke="#22C55E" strokeWidth="2" fill="none" />
        </svg>
    ),

    // Island 8: Small grassy mound
    GrassyMound: ({ color }) => (
        <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Water */}
            <ellipse cx="100" cy="145" rx="85" ry="15" fill="#38BDF8" opacity="0.5" />
            <ellipse cx="100" cy="142" rx="80" ry="12" fill="#7DD3FC" opacity="0.4" />
            
            {/* Beach */}
            <ellipse cx="100" cy="132" rx="70" ry="16" fill="#FCD34D" />
            
            {/* Grass base */}
            <ellipse cx="100" cy="125" rx="60" ry="18" fill="#4ADE80" />
            
            {/* Grass mounds */}
            <ellipse cx="85" cy="110" rx="30" ry="20" fill="#22C55E" />
            <ellipse cx="115" cy="115" rx="25" ry="15" fill="#16A34A" />
            <ellipse cx="100" cy="105" rx="20" ry="18" fill="#15803D" />
            
            {/* Small bushes */}
            <circle cx="70" cy="115" r="6" fill="#166534" />
            <circle cx="130" cy="118" r="5" fill="#166534" />
            
            {/* Grass tufts */}
            <path d="M95,95 Q97,85 99,95" stroke="#15803D" strokeWidth="2" fill="none" />
            <path d="M102,92 Q104,82 106,92" stroke="#166534" strokeWidth="2" fill="none" />
            <path d="M80,105 Q82,98 84,105" stroke="#15803D" strokeWidth="2" fill="none" />
            <path d="M115,100 Q117,93 119,100" stroke="#166534" strokeWidth="2" fill="none" />
        </svg>
    ),
};

const ISLAND_TYPES = [
    'GrassyPond',
    'MountainPines', 
    'TropicalPalm',
    'RockyMountain',
    'CaveForest',
    'DesertIsland',
    'WaterfallIsland',
    'GrassyMound',
];

export default function IslandSVG({ index, color, completed, progress = 0 }) {
    const islandType = ISLAND_TYPES[index % ISLAND_TYPES.length];
    const IslandComponent = IslandDesigns[islandType];
    
    return (
        <div className="relative w-full h-full">
            <IslandComponent color={color} />
            
            {/* Progress ring overlay */}
            {progress > 0 && progress < 100 && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 160">
                    <circle
                        cx="100"
                        cy="80"
                        r="25"
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeDasharray={`${progress * 1.57} 157`}
                        strokeLinecap="round"
                        transform="rotate(-90, 100, 80)"
                        opacity="0.9"
                    />
                </svg>
            )}
            
            {/* Completed badge */}
            {completed && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 160">
                    <circle cx="155" cy="40" r="14" fill="#10B981" />
                    <path d="M148,40 L153,46 L163,35" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
    );
}