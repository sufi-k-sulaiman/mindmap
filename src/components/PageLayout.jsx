import React from 'react';

export default function PageLayout({ children, activePage }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
}