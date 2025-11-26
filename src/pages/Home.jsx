import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from '../components/PageLayout';

export default function Home() {
    return (
        <PageLayout activePage="" searchPlaceholder="Search publications, authors, documents...">
            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to 1cPublishing</h1>
                    <p className="mb-8 text-gray-600">Your comprehensive publishing management platform.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* AI Hub Card */}
                        <Link to={createPageUrl('AIHub')} className="col-span-full">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center">
                                        <Sparkles className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl">AI Hub - Qwirey</h3>
                                        <p className="text-white/80">Your all-in-one AI assistant for content creation</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow" style={{ borderLeft: '4px solid #6B4EE6' }}>
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#6B4EE6' }}>
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2 text-gray-800">Content Block {i}</h3>
                                <p className="text-sm text-gray-500">Dynamic content will be displayed here based on your data.</p>
                                <Button className="mt-4 text-white" style={{ backgroundColor: '#6B4EE6' }}>
                                    View Details
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}