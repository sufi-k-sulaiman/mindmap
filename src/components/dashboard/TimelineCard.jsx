import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Circle } from 'lucide-react';

export default function TimelineCard({ 
    title = "Activity Timeline",
    events = [
        { time: '10:30 AM', title: 'New order received', status: 'completed', description: 'Order #12345 placed' },
        { time: '11:45 AM', title: 'Payment processed', status: 'completed', description: 'Payment confirmed' },
        { time: '2:15 PM', title: 'Shipping in progress', status: 'current', description: 'Package dispatched' },
        { time: '4:00 PM', title: 'Delivery pending', status: 'pending', description: 'Expected arrival' }
    ]
}) {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'current':
                return <AlertCircle className="w-4 h-4 text-blue-500" />;
            default:
                return <Circle className="w-4 h-4 text-gray-300" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'border-green-500';
            case 'current':
                return 'border-blue-500';
            default:
                return 'border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="relative">
                {events.map((event, index) => (
                    <div key={index} className="flex gap-4 pb-6 last:pb-0">
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white ${getStatusColor(event.status)}`}>
                                {getStatusIcon(event.status)}
                            </div>
                            {index !== events.length - 1 && (
                                <div className={`w-0.5 flex-1 mt-2 ${event.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'}`} />
                            )}
                        </div>
                        <div className="flex-1 pt-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-gray-400">{event.time}</span>
                            </div>
                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                            <p className="text-sm text-gray-500">{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}