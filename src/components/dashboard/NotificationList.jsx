import React from 'react';
import { Bell, AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export default function NotificationList({
    title = "Notifications",
    notifications = [
        { type: 'success', title: 'Payment Received', message: 'Invoice #4523 paid successfully', time: '2 min ago' },
        { type: 'warning', title: 'Low Inventory', message: 'Product SKU-123 running low', time: '15 min ago' },
        { type: 'info', title: 'New Feature', message: 'Check out the new analytics dashboard', time: '1 hour ago' },
        { type: 'error', title: 'Sync Failed', message: 'Unable to sync with external service', time: '3 hours ago' }
    ]
}) {
    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50';
            case 'warning':
                return 'bg-yellow-50';
            case 'error':
                return 'bg-red-50';
            default:
                return 'bg-blue-50';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                </div>
                <span className="text-xs text-purple-600 cursor-pointer hover:underline">Mark all read</span>
            </div>
            <div className="space-y-3">
                {notifications.map((notification, index) => (
                    <div key={index} className={`flex items-start gap-3 p-3 rounded-xl ${getBgColor(notification.type)}`}>
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{notification.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}