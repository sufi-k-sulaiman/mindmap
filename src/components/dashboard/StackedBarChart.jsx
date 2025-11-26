import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export default function StackedBarChart({ 
    title = 'Yearly Comparison',
    data = [
        { name: '1990', value1: 30, value2: 25, value3: 20, value4: 15, value5: 10 },
        { name: '2000', value1: 35, value2: 30, value3: 25, value4: 20, value5: 15 },
        { name: '2010', value1: 40, value2: 35, value3: 30, value4: 25, value5: 20 },
        { name: '2020', value1: 50, value2: 40, value3: 35, value4: 30, value5: 25 },
        { name: '2030', value1: 45, value2: 38, value3: 32, value4: 28, value5: 22 }
    ],
    colors = ['#6B4EE6', '#8BC34A', '#6B4EE6', '#8BC34A', '#6B4EE6'],
    legend = [
        { name: 'Series A', color: '#6B4EE6' },
        { name: 'Series B', color: '#8BC34A' }
    ],
    description = '',
    onBarClick = null
}) {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {title && <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>}
            
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={data}
                        onMouseMove={(e) => setActiveIndex(e?.activeTooltipIndex)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                            cursor={{ fill: 'rgba(107, 78, 230, 0.1)' }}
                        />
                        {['value1', 'value2', 'value3', 'value4', 'value5'].map((key, i) => (
                            <Bar 
                                key={key}
                                dataKey={key} 
                                stackId="a"
                                fill={colors[i % colors.length]}
                                onClick={(data, index) => onBarClick?.(data, index)}
                                className="cursor-pointer"
                            >
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={index}
                                        opacity={activeIndex === index ? 1 : 0.85}
                                    />
                                ))}
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                {legend.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-8 h-3 rounded" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                ))}
                {description && <p className="text-sm text-gray-500 ml-4">{description}</p>}
            </div>
        </div>
    );
}