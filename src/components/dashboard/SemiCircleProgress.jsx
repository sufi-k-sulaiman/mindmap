import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius + 8}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
        />
    );
};

export default function SemiCircleProgress({ 
    title = 'Progress Steps',
    steps = [
        { name: 'Step 01', value: 20, color: '#8BC34A' },
        { name: 'Step 02', value: 20, color: '#6B4EE6' },
        { name: 'Step 03', value: 20, color: '#8BC34A' },
        { name: 'Step 04', value: 20, color: '#A78BFA' },
        { name: 'Step 05', value: 20, color: '#C4B5FD' }
    ],
    onStepClick = null
}) {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {title && <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>}
            
            <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={steps}
                            cx="50%"
                            cy="85%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={80}
                            outerRadius={120}
                            dataKey="value"
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            onClick={(data, index) => onStepClick?.(data, index)}
                            className="cursor-pointer"
                        >
                            {steps.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Step labels */}
                <div className="absolute inset-0 pointer-events-none">
                    {steps.map((step, index) => {
                        const angle = 180 - (index + 0.5) * (180 / steps.length);
                        const rad = (angle * Math.PI) / 180;
                        const x = 50 + 45 * Math.cos(rad);
                        const y = 85 - 45 * Math.sin(rad);
                        return (
                            <div 
                                key={index}
                                className="absolute text-xs font-medium text-gray-600 transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${x}%`, top: `${y}%` }}
                            >
                                <div className="text-center">
                                    <div className="text-[10px] text-gray-400">STEP</div>
                                    <div className="font-bold">{String(index + 1).padStart(2, '0')}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-4">
                {steps.map((step, index) => (
                    <div 
                        key={index}
                        className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => onStepClick?.(step, index)}
                    >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: step.color }} />
                        <span className="text-xs text-gray-600">{step.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}