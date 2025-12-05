import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Radio, Settings, Brain, FileText, BarChart3, GraduationCap, ListTodo, Lightbulb, StickyNote, Newspaper, Gamepad2, Globe } from "lucide-react";

// Redirect Home to MindMap
export default function HomePage() {
    return <Navigate to={createPageUrl('MindMap')} replace />;
}

const pages = [
    { name: 'Qwirey', page: 'Qwirey', icon: Sparkles, description: 'Your all-in-one Ai assistant, powered by Qwirey', color: 'from-purple-600 to-indigo-600' },
    { name: 'MindMap', page: 'MindMap', icon: Brain, description: 'Ai-powered knowledge visualization and exploration', color: 'from-pink-600 to-rose-600' },
    { name: 'SearchPods', page: 'SearchPods', icon: Radio, description: 'Ai-generated podcasts on any topic with voice playback', color: 'from-blue-600 to-cyan-600' },
    { name: 'Markets', page: 'Markets', icon: BarChart3, description: 'Ai-powered stock market analysis and screening', color: 'from-orange-600 to-amber-600' },
    { name: 'News', page: 'News', icon: Newspaper, description: 'AI-powered news aggregator across topics', color: 'from-red-600 to-orange-600' },
    { name: 'Learning', page: 'Learning', icon: GraduationCap, description: 'Navigate knowledge islands with progress tracking', color: 'from-emerald-600 to-teal-600' },
    { name: 'Geospatial', page: 'Geospatial', icon: Globe, description: 'Global data intelligence across 18 domains', color: 'from-indigo-600 to-purple-600' },
    { name: 'Intelligence', page: 'Intelligence', icon: Lightbulb, description: 'AI predictive analytics and scenario modeling', color: 'from-indigo-600 to-purple-600' },
    { name: 'ResumePro', page: 'ResumeBuilder', icon: FileText, description: 'AI-powered professional resume generator', color: 'from-green-600 to-emerald-600' },
    { name: 'Tasks', page: 'Tasks', icon: ListTodo, description: 'Track initiatives across all departments', color: 'from-violet-600 to-purple-600' },
    { name: 'Notes', page: 'Notes', icon: StickyNote, description: 'Rich text notes with Ai assistance', color: 'from-pink-600 to-rose-600' },
    { name: 'Games', page: 'Games', icon: Gamepad2, description: 'Learn while you play with Word Shooter', color: 'from-purple-600 to-pink-600' },
    { name: 'Settings', page: 'Settings', icon: Settings, description: 'Customize your experience with accessibility options', color: 'from-gray-600 to-slate-600' },
];

// Keeping old pages array for reference if needed later