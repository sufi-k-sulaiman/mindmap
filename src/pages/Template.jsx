import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Radio, Settings, BarChart3, TestTube, Home } from "lucide-react";
import PageLayout from '../components/PageLayout';

const allPages = [
    { name: 'Home', href: createPageUrl('Home'), icon: Home, description: 'Main dashboard' },
    { name: 'AI Hub', href: createPageUrl('AIHub'), icon: Sparkles, description: 'AI assistant' },
    { name: 'SearchPods', href: createPageUrl('SearchPods'), icon: Radio, description: 'AI podcasts' },
    { name: 'Settings', href: createPageUrl('Settings'), icon: Settings, description: 'App settings' },
    { name: 'Dashboard Components', href: createPageUrl('DashboardComponents'), icon: BarChart3, description: 'UI components' },
    { name: 'Test Functions', href: createPageUrl('TestFunctions'), icon: TestTube, description: 'Backend tests' },
];

export default function Template() {
    return (
        <PageLayout activePage="" searchPlaceholder="Search...">
            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">Template Page</h1>
                    <p className="mb-8 text-gray-600">All pages in this application:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allPages.map((page) => (
                            <Link key={page.name} to={page.href}>
                                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-purple-300 transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <page.icon className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-800">{page.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500">{page.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}