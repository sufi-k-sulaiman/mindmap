import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronLeft, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LOGO_URL } from '../NavigationConfig';

export default function Header({ title, sidebarOpen, setSidebarOpen, children }) {
    return (
        <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm h-[72px]">
            <div className="flex items-center justify-between px-4 h-full">
                <div className="flex items-center gap-4">
                    <Link to={createPageUrl('Home')} className="flex items-center gap-3 hover:opacity-80">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-gray-900">1cPublishing</span>
                            {title && <p className="text-xs font-medium text-purple-600">{title}</p>}
                        </div>
                    </Link>
                    {setSidebarOpen && (
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-100">
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-purple-600" /> : <Menu className="w-5 h-5 text-purple-600" />}
                        </Button>
                    )}
                </div>
                {children}
            </div>
        </header>
    );
}