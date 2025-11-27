import React from 'react';
import { Target } from 'lucide-react';

export default function ProgressListCard({
    title = "Goals Progress",
    items = [
        { label: 'Q4 Revenue Target', value: 78, target: '$500K', current: '$390K', color: '#8B5CF6' },
        { label: 'New Customers', value: 92, target: '1,000', current: '920', color: '#10B981' },
        { label: 'Product Launches', value: 60, target: '5', current: '3', color: '#3B82F6' },
        { label: 'Team Growth', value: 45, target: '20', current: '9', color: '#F59E0B' }
    ]
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="space-y-5">
                {items.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                            <span className="text-sm text-gray-500">{item.current} / {item.target}</span>
                        </div>
                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                                style={{ width: `${item.value}%`, backgroundColor: item.color }}
                            />
                        </div>
                        <p className="text-right text-xs text-gray-400 mt-1">{item.value}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}