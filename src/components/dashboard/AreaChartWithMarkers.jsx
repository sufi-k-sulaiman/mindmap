import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

const CustomMarker = ({ cx, cy, payload, isActive, color }) => {
    if (!payload?.marker) return null;
    
    return (
        <g>
            <circle cx={cx} cy={cy - 30} r={isActive ? 18 : 14} fill={color} className="transition-all duration-200" />
            <text x={cx} y={cy - 30} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={10} fontWeight="bold">
                {payload.marker}
            </text>
            <line x1={cx} y1={cy - 16} x2={cx} y2={cy} stroke={color} strokeWidth={2} />
        </g>
    );
};

export default function AreaChartWithMarkers({ 
    title = 'Growth Analysis',
    data = [
        { name: 'A', value: 10 },
        { name: 'B', value: 15, marker: '12%' },
        { name: 'C', value: 25 },
        { name: 'D', value: 40, marker: '32%' },
        { name: 'E', value: 55 },
        { name: 'F', value: 70 },
        { name: 'G', value: 85, marker: '50%' },
        { name: 'H', value: 95 },
        { name: 'I', value: 100 }
    ],
    color = '#6B4EE6',
    markerColor = '#0D1321',
    onPointClick = null
}) {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {title && <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>}
            
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                        data={data}
                        onMouseMove={(e) => setActiveIndex(e?.activeTooltipIndex)}
                        onMouseLeave={() => setActiveIndex(null)}
                        margin={{ top: 40, right: 20, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="areaGradientMarkers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={color} stopOpacity={0.2}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={color}
                            strokeWidth={3}
                            fill="url(#areaGradientMarkers)"
                            dot={(props) => (
                                <CustomMarker 
                                    {...props} 
                                    isActive={activeIndex === props.index}
                                    color={props.payload.marker ? markerColor : 'transparent'}
                                />
                            )}
                            activeDot={{ r: 6, fill: color }}
                            onClick={(data, index) => onPointClick?.(data, index)}
                            className="cursor-pointer"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}