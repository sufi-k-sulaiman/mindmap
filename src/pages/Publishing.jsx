import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mic, Menu, X, Home, FileText, Users, Settings, HelpCircle, BookOpen } from "lucide-react";

const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/868a98750_1cPublishing-logo.png";

export default function Publishing() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const searchRef = useRef(null);

    // Sample suggestions - in production, fetch dynamically
    const allSuggestions = [
        "Publishing guidelines",
        "Content management",
        "Author submissions",
        "Editorial process",
        "Copyright policies",
        "Digital publishing",
        "Print on demand",
        "Marketing resources",
        "Distribution channels",
        "Royalty information"
    ];

    useEffect(() => {
        if (searchQuery.length > 0) {
            const filtered = allSuggestions.filter(s => 
                s.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
            };
            recognition.onerror = () => setIsListening(false);

            recognition.start();
        } else {
            alert('Voice search is not supported in this browser.');
        }
    };

    const menuItems = [
        { icon: Home, label: "Dashboard", href: "#" },
        { icon: BookOpen, label: "Publications", href: "#" },
        { icon: FileText, label: "Documents", href: "#" },
        { icon: Users, label: "Authors", href: "#" },
        { icon: Settings, label: "Settings", href: "#" },
        { icon: HelpCircle, label: "Help", href: "#" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-600 hover:text-purple-600"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                        <div className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <span className="text-xl font-bold text-purple-600">1cPublishing</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div ref={searchRef} className="flex-1 max-w-2xl mx-8 relative">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search publications, authors, documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery && setShowSuggestions(true)}
                                className="w-full pl-12 pr-12 py-6 text-lg rounded-full border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleVoiceSearch}
                                className={`absolute right-2 rounded-full ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-purple-600'}`}
                            >
                                <Mic className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSearchQuery(suggestion);
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center gap-3 text-gray-700"
                                    >
                                        <Search className="w-4 h-4 text-gray-400" />
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-32" /> {/* Spacer for balance */}
                </div>
            </header>

            <div className="flex flex-1">
                {/* Left Sidebar */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to 1cPublishing</h1>
                        <p className="text-gray-600 mb-8">Your comprehensive publishing management platform.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                        <BookOpen className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Content Block {i}</h3>
                                    <p className="text-gray-500 text-sm">Dynamic content will be displayed here based on your data.</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-auto">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain brightness-0 invert" />
                            <span className="font-semibold">1cPublishing</span>
                        </div>
                        
                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a>
                            <a href="#" className="hover:text-purple-400 transition-colors">Governance</a>
                            <a href="#" className="hover:text-purple-400 transition-colors">Cookie Policy</a>
                            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Use</a>
                        </nav>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
                        © {new Date().getFullYear()} 1cPublishing. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}