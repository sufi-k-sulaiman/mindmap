import React, { useState } from 'react';

export default function StepCards({ 
    title = 'Process Steps',
    steps = [
        { id: 'A', step: '01', label: 'Planning', color: '#6B4EE6', size: 'large' },
        { id: 'B', step: '02', label: 'Development', color: '#6B4EE6', size: 'wide' },
        { id: 'C', step: '03', label: 'Testing', color: '#8BC34A', size: 'small' }
    ],
    onStepClick = null
}) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const getSizeClasses = (size) => {
        switch(size) {
            case 'large': return 'w-32 h-32';
            case 'wide': return 'w-48 h-24';
            case 'small': return 'w-24 h-20';
            default: return 'w-32 h-24';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {title && <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>}
            
            <div className="flex flex-wrap items-end gap-4">
                {steps.map((step, index) => {
                    const isHovered = hoveredIndex === index;
                    const isDashed = step.dashed;
                    
                    return (
                        <div
                            key={index}
                            className={`relative ${getSizeClasses(step.size)} rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                                isHovered ? 'scale-105 shadow-lg' : ''
                            } ${isDashed ? 'border-2 border-dashed' : ''}`}
                            style={{ 
                                backgroundColor: isDashed ? 'transparent' : step.color,
                                borderColor: isDashed ? step.color : 'transparent'
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => onStepClick?.(step, index)}
                        >
                            {/* Badge */}
                            <div 
                                className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                                style={{ backgroundColor: isDashed ? step.color : '#8BC34A' }}
                            >
                                {step.id}
                            </div>
                            
                            <div className={`text-center ${isDashed ? '' : 'text-white'}`} style={{ color: isDashed ? step.color : 'white' }}>
                                <p className="text-xs font-medium opacity-80">STEP</p>
                                <p className="text-2xl font-bold">{step.step}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex gap-4 mt-6 pt-4 border-t border-gray-100">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-4 h-4 rounded flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ backgroundColor: step.color }}
                        >
                            {step.id}
                        </div>
                        <span className="text-sm text-gray-600">{step.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}