import React from 'react';
import { Island1, Island2, Island3, Island4, Island5, Island6, Island7, Island8, Island9 } from '@/components/islands/IslandSVGs';
import { Island10, Island11, Island12, Island13, Island14, Island15, Island16, Island17, Island18 } from '@/components/islands/IslandSVGs2';
import { Island19, Island20, Island21, Island22, Island23, Island24, Island25, Island26, Island27 } from '@/components/islands/IslandSVGs3';

// All 27 island components
const ALL_ISLANDS = [
    Island1, Island2, Island3, Island4, Island5, Island6, Island7, Island8, Island9,
    Island10, Island11, Island12, Island13, Island14, Island15, Island16, Island17, Island18,
    Island19, Island20, Island21, Island22, Island23, Island24, Island25, Island26, Island27
];

// App theme colors
const APP_COLORS = {
    primary: '#6B4EE6',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    success: '#10B981',
};

// Simple hash function for consistent randomization
function hashIndex(index, seed = 0) {
    return ((index * 7 + seed * 13 + 3) * 17) % ALL_ISLANDS.length;
}

export default function IslandSVG({ index, color, completed, progress = 0, variant = 0 }) {
    // Create a unique island selection based on index and variant
    const islandIndex = hashIndex(index, variant);
    const IslandComponent = ALL_ISLANDS[islandIndex];
    
    // Use provided color or fall back to palette
    const islandColor = color || ISLAND_COLORS[islandIndex];
    
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Water background */}
            <svg viewBox="0 0 120 100" className="absolute inset-0 w-full h-full">
                <ellipse cx="60" cy="55" rx="55" ry="40" fill="#7DD3FC" />
                <ellipse cx="60" cy="55" rx="50" ry="36" fill="#38BDF8" />
            </svg>
            
            {/* Island */}
            <IslandComponent className="w-24 h-20 relative z-10" color={islandColor} />
            
            {/* Progress ring overlay */}
            {progress > 0 && progress < 100 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 120 100">
                    <circle
                        cx="60"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#E9D5FF"
                        strokeWidth="2"
                        opacity="0.5"
                    />
                    <circle
                        cx="60"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                        strokeDasharray={`${progress * 2.64} 264`}
                        strokeLinecap="round"
                        transform="rotate(-90, 60, 50)"
                    />
                </svg>
            )}
            
            {/* Completed badge */}
            {completed && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 120 100">
                    <circle cx="100" cy="20" r="10" fill="#10B981" />
                    <path d="M95,20 L98,23 L105,16" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
    );
}