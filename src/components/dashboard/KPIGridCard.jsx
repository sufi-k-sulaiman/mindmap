import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KPIGridCard({
    title = "Key Metrics",
    kpis = [
        { label: 'MRR', value: '$84.5K', change: 12.3, trend: 'up' },
        { label: 'ARR', value: '$1.01M', change: 15.8, trend: 'up' },
        { label: 'Churn Rate', value: '2.4%', change: -0.3, trend: 'down' },
        { label: 'LTV', value: '$2,450', change: 8.2, trend: 'up' },
        { label: 'CAC', value: '$145', change: -5.1, trend: 'down' },
        { label: 'NPS', value: '72', change: 4, trend: 'up' }
    ]
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {kpis.map((kpi, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
                        <p className="text-xl font-bold text-gray-900 mb-2">{kpi.value}</p>
                        <div className={`flex items-center gap-1 text-xs font-medium ${
                            (kpi.trend === 'up' && kpi.change > 0) || (kpi.trend === 'down' && kpi.change < 0) 
                                ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {kpi.change > 0 ? (
                                <ArrowUpRight className="w-3 h-3" />
                            ) : (
                                <ArrowDownRight className="w-3 h-3" />
                            )}
                            {Math.abs(kpi.change)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}