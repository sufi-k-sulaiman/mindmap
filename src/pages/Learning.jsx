import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { 
    GraduationCap, Trophy, Zap, Star, Flame, Target, Award,
    Loader2, RefreshCw, Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import PageLayout from '../components/PageLayout';
import SubjectSelector from '../components/learning/SubjectSelector';
import LearningIslandCard from '../components/learning/LearningIslandCard';
import CourseModal from '../components/learning/CourseModal';
import { SUBJECTS } from '../components/learning/SubjectData';

// App theme colors
const THEME = {
    primary: '#6B4EE6',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    success: '#10B981',
};

const RANKS = [
    { name: 'Novice', minXP: 0, color: '#9CA3AF', icon: '🌱' },
    { name: 'Explorer', minXP: 500, color: THEME.primary, icon: '🧭' },
    { name: 'Scholar', minXP: 2000, color: THEME.success, icon: '📚' },
    { name: 'Expert', minXP: 5000, color: THEME.secondary, icon: '🎓' },
    { name: 'Master', minXP: 10000, color: THEME.accent, icon: '👑' },
    { name: 'Legend', minXP: 25000, color: '#EF4444', icon: '🌟' },
];

export default function Learning() {
    const [selectedSubjects, setSelectedSubjects] = useState([SUBJECTS[0]]); // Default to first subject
    const [subTopics, setSubTopics] = useState([]);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [userProgress, setUserProgress] = useState({});
    
    // Gamification state
    const [totalXP, setTotalXP] = useState(1250);
    const [streak, setStreak] = useState(7);
    const [completedCourses, setCompletedCourses] = useState(3);
    const [certificates, setCertificates] = useState(1);

    const currentRank = RANKS.filter(r => totalXP >= r.minXP).pop() || RANKS[0];
    const nextRank = RANKS.find(r => r.minXP > totalXP);
    const xpToNextRank = nextRank ? nextRank.minXP - totalXP : 0;

    // Generate sub-topics when subjects change
    useEffect(() => {
        if (selectedSubjects.length > 0) {
            generateSubTopics();
        } else {
            setSubTopics([]);
        }
    }, [selectedSubjects]);

    const generateSubTopics = async () => {
        setLoadingTopics(true);
        try {
            const subjectNames = selectedSubjects.map(s => s.name).join(', ');
            
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 10 specific learning sub-topics/courses for these subjects: ${subjectNames}.
                Each topic should be a focused, learnable concept that could be a standalone course.
                Make them practical and engaging for learners.
                Include a mix of beginner and advanced topics.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        topics: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    difficulty: { type: "string" },
                                    estimatedHours: { type: "number" },
                                    parentSubject: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            // Map generated topics to include colors from parent subjects
            const topicsWithColors = (response?.topics || []).map((topic, i) => {
                const parentSubject = selectedSubjects.find(s => 
                    s.name.toLowerCase() === topic.parentSubject?.toLowerCase()
                ) || selectedSubjects[i % selectedSubjects.length];
                
                return {
                    ...topic,
                    color: parentSubject?.color || '#6B4EE6',
                    icon: parentSubject?.icon || 'BookOpen',
                    id: topic.id || `topic-${i}`
                };
            });

            setSubTopics(topicsWithColors);
            
            // Initialize progress for new topics
            const newProgress = {};
            topicsWithColors.forEach(t => {
                newProgress[t.id] = userProgress[t.id] || Math.floor(Math.random() * 30);
            });
            setUserProgress(newProgress);
            
        } catch (error) {
            console.error('Error generating topics:', error);
            // Fallback topics based on selected subjects
            const fallbackTopics = selectedSubjects.flatMap((subject, si) => [
                { id: `${subject.id}-1`, name: `Introduction to ${subject.name}`, description: 'Core fundamentals', color: subject.color, icon: subject.icon, difficulty: 'Beginner', estimatedHours: 4 },
                { id: `${subject.id}-2`, name: `Advanced ${subject.name}`, description: 'Deep dive into concepts', color: subject.color, icon: subject.icon, difficulty: 'Advanced', estimatedHours: 8 },
            ]).slice(0, 10);
            setSubTopics(fallbackTopics);
        } finally {
            setLoadingTopics(false);
        }
    };

    const handleExplore = (topic) => {
        setSelectedTopic(topic);
        setShowCourseModal(true);
    };

    const handleCourseComplete = () => {
        if (selectedTopic) {
            setUserProgress(prev => ({ ...prev, [selectedTopic.id]: 100 }));
            setTotalXP(prev => prev + 500);
            setCompletedCourses(prev => prev + 1);
        }
        setShowCourseModal(false);
    };

    return (
        <PageLayout activePage="Learning" showSearch={false}>
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
                {/* Hero Header with theme colors */}
                <div className="text-white" style={{ background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 50%, #3B82F6 100%)` }}>
                    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* User Profile & Stats */}
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl">
                                    {currentRank.icon}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Learning Explorer</h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span 
                                            className="px-3 py-1 rounded-full text-sm font-medium"
                                            style={{ backgroundColor: `${currentRank.color}40` }}
                                        >
                                            {currentRank.name}
                                        </span>
                                        {nextRank && (
                                            <span className="text-white/70 text-sm">
                                                {xpToNextRank} XP to {nextRank.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="flex flex-wrap gap-3">
                                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: THEME.accent }}>
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{totalXP.toLocaleString()}</p>
                                        <p className="text-xs text-white/70">Total XP</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                                        <Flame className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{streak}</p>
                                        <p className="text-xs text-white/70">Day Streak</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: THEME.success }}>
                                        <Trophy className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{completedCourses}</p>
                                        <p className="text-xs text-white/70">Completed</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: THEME.primary }}>
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{certificates}</p>
                                        <p className="text-xs text-white/70">Certificates</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* XP Progress Bar */}
                        {nextRank && (
                            <div className="mt-6">
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all"
                                        style={{ width: `${((totalXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Subject Selector */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                                    <Sparkles className="w-5 h-5 inline mr-2" style={{ color: THEME.primary }} />
                                    Select Your Learning Path
                                </h2>
                                <p className="text-sm text-gray-500">Choose subjects to generate personalized learning islands</p>
                            </div>
                            <SubjectSelector 
                                selectedSubjects={selectedSubjects}
                                onSelectionChange={setSelectedSubjects}
                            />
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={generateSubTopics}
                                disabled={loadingTopics || selectedSubjects.length === 0}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loadingTopics ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Learning Islands Grid */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
                    {loadingTopics ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: THEME.primary }} />
                            <p className="text-gray-600">Generating learning islands for you...</p>
                        </div>
                    ) : subTopics.length === 0 ? (
                        <div className="text-center py-20">
                            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Select subjects to explore</h3>
                            <p className="text-gray-400">Choose one or more subjects above to generate learning islands</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Your Learning Archipelago
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Target className="w-4 h-4" />
                                    {subTopics.length} islands to explore
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {subTopics.map((topic, index) => (
                                    <LearningIslandCard
                                        key={topic.id}
                                        topic={topic}
                                        index={index}
                                        progress={userProgress[topic.id] || 0}
                                        onExplore={handleExplore}
                                        locked={false}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Summary Stats */}
                {subTopics.length > 0 && (
                    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${THEME.primary}20` }}>
                                        <Star className="w-6 h-6" style={{ color: THEME.primary }} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900">{subTopics.length}</p>
                                        <p className="text-sm text-gray-500">Learning Islands</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${THEME.success}20` }}>
                                        <Target className="w-6 h-6" style={{ color: THEME.success }} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {Object.values(userProgress).filter(p => p === 100).length}
                                        </p>
                                        <p className="text-sm text-gray-500">Islands Completed</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${THEME.accent}20` }}>
                                        <Zap className="w-6 h-6" style={{ color: THEME.accent }} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {subTopics.length * 500}
                                        </p>
                                        <p className="text-sm text-gray-500">Potential XP</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Course Modal */}
            <CourseModal 
                isOpen={showCourseModal}
                onClose={() => setShowCourseModal(false)}
                topic={selectedTopic}
                onComplete={handleCourseComplete}
            />
        </PageLayout>
    );
}