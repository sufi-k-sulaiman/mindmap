import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Menu, ChevronLeft, GraduationCap, Award, Trophy, Star,
    Brain, Shield, Users, BookOpen, Cpu, Leaf, Heart, Building2, 
    Scale, Zap, Globe, ChevronDown, MapPin, CheckCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOGO_URL, menuItems, footerLinks } from '../components/NavigationConfig';
import PageLayout from '../components/PageLayout';

// Learning Topics with icons and colors
const LEARNING_TOPICS = [
    { id: 1, name: 'AI Integration', icon: Brain, color: '#6B4EE6', priority: 1 },
    { id: 2, name: 'Cybersecurity', icon: Shield, color: '#EF4444', priority: 2 },
    { id: 3, name: 'Workforce Readiness', icon: Users, color: '#3B82F6', priority: 3 },
    { id: 4, name: 'STEM Education', icon: GraduationCap, color: '#10B981', priority: 4 },
    { id: 5, name: 'Digital Transformation', icon: Cpu, color: '#8B5CF6', priority: 5 },
    { id: 6, name: 'Biotechnology', icon: Zap, color: '#F59E0B', priority: 6 },
    { id: 7, name: 'Climate Change', icon: Leaf, color: '#06B6D4', priority: 7 },
    { id: 8, name: 'Healthcare Access', icon: Heart, color: '#EC4899', priority: 8 },
    { id: 9, name: 'Infrastructure', icon: Building2, color: '#84CC16', priority: 9 },
    { id: 10, name: 'Public Policy', icon: Scale, color: '#14B8A6', priority: 10 },
];

const COUNTRIES = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
];

const RANKS = [
    { name: 'Novice', minPoints: 0, color: '#9CA3AF' },
    { name: 'Explorer', minPoints: 1000, color: '#3B82F6' },
    { name: 'Scholar', minPoints: 5000, color: '#10B981' },
    { name: 'Expert', minPoints: 10000, color: '#8B5CF6' },
    { name: 'Master', minPoints: 25000, color: '#F59E0B' },
    { name: 'Legend', minPoints: 50000, color: '#EF4444' },
];

// Island SVG Component
const LearningIsland = ({ topic, index, explored, onExplore }) => {
    const [hovered, setHovered] = useState(false);
    const Icon = topic.icon;
    
    // Different island shapes
    const shapes = [
        'M50,20 Q80,10 100,30 Q120,50 110,80 Q100,110 70,120 Q40,130 20,100 Q0,70 20,40 Q30,20 50,20',
        'M60,15 Q90,5 110,25 Q130,50 120,85 Q110,115 75,125 Q35,135 15,100 Q-5,65 15,35 Q30,10 60,15',
        'M55,18 Q85,8 105,28 Q125,55 115,88 Q105,118 70,128 Q32,138 12,102 Q-8,68 12,38 Q28,12 55,18',
    ];
    
    const shape = shapes[index % shapes.length];
    
    return (
        <div 
            className="relative cursor-pointer group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onExplore(topic)}
        >
            {/* Priority number badge */}
            <div 
                className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                style={{ backgroundColor: topic.color }}
            >
                {topic.priority}
            </div>
            
            {/* Island SVG */}
            <svg 
                viewBox="0 0 130 140" 
                className={`w-32 h-36 transition-transform duration-300 ${hovered ? 'scale-110' : ''}`}
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}
            >
                {/* Water reflection */}
                <ellipse cx="65" cy="130" rx="50" ry="8" fill="#93C5FD" opacity="0.3" />
                
                {/* Island base (darker edge) */}
                <path d={shape} fill="#166534" transform="translate(0, 5)" />
                
                {/* Island grass (main) */}
                <path d={shape} fill="#4ADE80" />
                
                {/* Inner grass highlight */}
                <path d={shape} fill="#22C55E" transform="translate(10, 10) scale(0.85)" />
                
                {/* Decorative elements */}
                <circle cx="30" cy="50" r="6" fill="#166534" opacity="0.5" />
                <circle cx="95" cy="70" r="5" fill="#166534" opacity="0.5" />
                <circle cx="50" cy="95" r="4" fill="#15803D" opacity="0.5" />
                
                {/* Icon platform */}
                <ellipse cx="65" cy="70" rx="22" ry="10" fill="#D4A574" />
                <ellipse cx="65" cy="68" rx="22" ry="10" fill="#E5B887" />
            </svg>
            
            {/* Icon */}
            <div 
                className="absolute top-12 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300"
                style={{ backgroundColor: topic.color, transform: hovered ? 'translate(-50%, -4px)' : 'translate(-50%, 0)' }}
            >
                <Icon className="w-5 h-5 text-white" />
            </div>
            
            {/* Status badge */}
            {explored && (
                <div className="absolute top-8 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow">
                    <CheckCircle className="w-4 h-4 text-white" />
                </div>
            )}
            
            {/* Label */}
            <div className="text-center mt-2">
                <h3 className="font-semibold text-gray-800 text-sm">{topic.name}</h3>
                <p className="text-xs text-gray-500">Priority #{topic.priority}</p>
            </div>
        </div>
    );
};

export default function Learning() {
    const [country, setCountry] = useState('US');
    const [points, setPoints] = useState(5500);
    const [certificates, setCertificates] = useState(3);
    const [exploredIslands, setExploredIslands] = useState([1, 3, 5]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const selectedCountry = COUNTRIES.find(c => c.code === country);
    const currentRank = RANKS.filter(r => points >= r.minPoints).pop() || RANKS[0];

    const handleExplore = (topic) => {
        setSelectedTopic(topic);
        setShowModal(true);
    };

    const markAsExplored = () => {
        if (selectedTopic && !exploredIslands.includes(selectedTopic.id)) {
            setExploredIslands([...exploredIslands, selectedTopic.id]);
            setPoints(points + 500);
        }
        setShowModal(false);
    };

    return (
        <PageLayout activePage="Learning" showSearch={true} searchPlaceholder="Search learning topics...">
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* User Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                    <GraduationCap className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Learning Explorer</h1>
                                    <p className="text-gray-500">Citizen • Knowledge Seeker</p>
                                </div>
                            </div>

                            {/* Country Selector */}
                            <div className="flex items-center gap-4">
                                <Select value={country} onValueChange={setCountry}>
                                    <SelectTrigger className="w-[200px] bg-white border-gray-200">
                                        <SelectValue>
                                            <span className="flex items-center gap-2">
                                                <span className="text-xl">{selectedCountry?.flag}</span>
                                                <span>{selectedCountry?.name}</span>
                                            </span>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COUNTRIES.map(c => (
                                            <SelectItem key={c.code} value={c.code}>
                                                <span className="flex items-center gap-2">
                                                    <span className="text-xl">{c.flag}</span>
                                                    <span>{c.name}</span>
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">{points.toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">Points</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-amber-500">{certificates}</div>
                                    <div className="text-sm text-gray-500">Certificates</div>
                                </div>
                                <div 
                                    className="px-4 py-2 rounded-lg flex items-center gap-2"
                                    style={{ backgroundColor: `${currentRank.color}20`, color: currentRank.color }}
                                >
                                    <Trophy className="w-5 h-5" />
                                    <div>
                                        <div className="font-bold">{currentRank.name}</div>
                                        <div className="text-xs opacity-80">Rank</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                    {/* Title */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Globe className="w-8 h-8 text-purple-600" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                {selectedCountry?.name} Learning Archipelago
                            </h2>
                        </div>
                        <p className="text-gray-600">
                            Navigate knowledge islands tailored to {selectedCountry?.name}'s strategic priorities and gaps
                        </p>
                    </div>

                    {/* Islands Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
                        {LEARNING_TOPICS.map((topic, index) => (
                            <LearningIsland 
                                key={topic.id}
                                topic={topic}
                                index={index}
                                explored={exploredIslands.includes(topic.id)}
                                onExplore={handleExplore}
                            />
                        ))}
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">{LEARNING_TOPICS.length}</div>
                                    <div className="text-sm text-gray-500">Knowledge Islands</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">{exploredIslands.length}</div>
                                    <div className="text-sm text-gray-500">Islands Explored</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <Star className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">{LEARNING_TOPICS.length - exploredIslands.length}</div>
                                    <div className="text-sm text-gray-500">To Discover</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Topic Detail Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            {selectedTopic && (
                                <>
                                    <div 
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: selectedTopic.color }}
                                    >
                                        <selectedTopic.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span>{selectedTopic.name}</span>
                                </>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedTopic && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span 
                                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                                    style={{ backgroundColor: selectedTopic.color }}
                                >
                                    Priority #{selectedTopic.priority}
                                </span>
                                {exploredIslands.includes(selectedTopic.id) && (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                                        Explored
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-gray-600">
                                Explore comprehensive learning resources about {selectedTopic.name}. 
                                This island contains curated content tailored to {selectedCountry?.name}'s strategic priorities.
                            </p>
                            
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Learning Objectives</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        Understand core concepts and principles
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        Apply knowledge to real-world scenarios
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        Complete assessments to earn points
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="flex gap-3">
                                <Button 
                                    className="flex-1"
                                    style={{ backgroundColor: selectedTopic.color }}
                                    onClick={markAsExplored}
                                >
                                    {exploredIslands.includes(selectedTopic.id) ? 'Continue Learning' : 'Start Exploring (+500 pts)'}
                                </Button>
                                <Button variant="outline" onClick={() => setShowModal(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}