import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ComparisonTable({
    title = "Performance Comparison",
    headers = ['Metric', 'Current', 'Previous', 'Change'],
    rows = [
        { metric: 'Revenue', current: '$45.2M', previous: '$38.6M', change: 17.1 },
        { metric: 'Users', current: '12,450', previous: '10,230', change: 21.7 },
        { metric: 'Conversion', current: '3.8%', previous: '4.2%', change: -9.5 },
        { metric: 'Avg Order', current: '$156', previous: '$142', change: 9.9 }
    ]
}) {
    const getTrendIcon = (change) => {
        if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-gray-400" />;
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {headers.map((h, i) => (
                                <th key={i} className="text-left py-3 px-2 text-sm font-medium text-gray-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="border-b border-gray-50 last:border-0">
                                <td className="py-3 px-2 font-medium text-gray-900">{row.metric}</td>
                                <td className="py-3 px-2 text-gray-700">{row.current}</td>
                                <td className="py-3 px-2 text-gray-500">{row.previous}</td>
                                <td className="py-3 px-2">
                                    <div className="flex items-center gap-1">
                                        {getTrendIcon(row.change)}
                                        <span className={`font-medium ${row.change > 0 ? 'text-green-600' : row.change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                            {row.change > 0 ? '+' : ''}{row.change}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}