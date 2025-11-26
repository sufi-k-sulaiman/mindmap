import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { base44 } from '@/api/base44Client';
import { 
    X, Play, CheckCircle, Lock, Star, Trophy, Zap, Clock, 
    BookOpen, Video, FileText, HelpCircle, Award, Target,
    ChevronRight, Flame, Medal, Gift, Sparkles, Loader2
} from 'lucide-react';

// Unit/Module component
const CourseUnit = ({ unit, index, isUnlocked, onStartLesson, completedLessons }) => {
    const [expanded, setExpanded] = useState(index === 0);
    const completedCount = unit.lessons?.filter(l => completedLessons.includes(l.id))?.length || 0;
    const totalLessons = unit.lessons?.length || 0;
    const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
    
    return (
        <div className={`border rounded-xl overflow-hidden ${isUnlocked ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
            <button
                onClick={() => isUnlocked && setExpanded(!expanded)}
                className={`w-full flex items-center gap-4 p-4 text-left ${isUnlocked ? 'hover:bg-gray-50' : ''}`}
                disabled={!isUnlocked}
            >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                    progress === 100 ? 'bg-emerald-500' : isUnlocked ? 'bg-purple-600' : 'bg-gray-300'
                }`}>
                    {progress === 100 ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{unit.title}</h4>
                    <p className="text-sm text-gray-500">{totalLessons} lessons • {completedCount} completed</p>
                </div>
                {isUnlocked ? (
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                ) : (
                    <Lock className="w-5 h-5 text-gray-300" />
                )}
            </button>
            
            {expanded && isUnlocked && (
                <div className="border-t border-gray-100 bg-gray-50/50">
                    {unit.lessons?.map((lesson, i) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        const lessonUnlocked = i === 0 || completedLessons.includes(unit.lessons[i-1]?.id);
                        
                        return (
                            <div 
                                key={lesson.id}
                                className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 ${
                                    lessonUnlocked ? 'cursor-pointer hover:bg-white' : 'opacity-50'
                                }`}
                                onClick={() => lessonUnlocked && onStartLesson(lesson)}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    isCompleted ? 'bg-emerald-100 text-emerald-600' : 
                                    lessonUnlocked ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : 
                                     lesson.type === 'video' ? <Video className="w-4 h-4" /> :
                                     lesson.type === 'quiz' ? <HelpCircle className="w-4 h-4" /> :
                                     <FileText className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                                        {lesson.title}
                                    </p>
                                    <p className="text-xs text-gray-400">{lesson.duration || '5 min'}</p>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                                    <Zap className="w-3 h-3" />
                                    {lesson.xp || 25}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// Achievement badge component
const AchievementBadge = ({ achievement, earned }) => (
    <div className={`flex flex-col items-center gap-1 ${earned ? '' : 'opacity-40'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            earned ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gray-200'
        }`}>
            {achievement.icon === 'star' && <Star className="w-6 h-6 text-white" />}
            {achievement.icon === 'trophy' && <Trophy className="w-6 h-6 text-white" />}
            {achievement.icon === 'flame' && <Flame className="w-6 h-6 text-white" />}
            {achievement.icon === 'medal' && <Medal className="w-6 h-6 text-white" />}
        </div>
        <span className="text-xs text-gray-600 text-center">{achievement.name}</span>
    </div>
);

export default function CourseModal({ isOpen, onClose, topic, onComplete }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [userXP, setUserXP] = useState(0);
    const [streak, setStreak] = useState(7);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [currentLesson, setCurrentLesson] = useState(null);

    useEffect(() => {
        if (isOpen && topic) {
            generateCourseContent();
        }
    }, [isOpen, topic]);

    const generateCourseContent = async () => {
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Create a comprehensive course curriculum for "${topic.name}". 
                Generate 4-5 units/modules, each with 4-6 lessons.
                Include a mix of video lectures, reading materials, and quizzes.
                Make it engaging and progressive in difficulty.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        totalDuration: { type: "string" },
                        difficulty: { type: "string" },
                        prerequisites: { type: "array", items: { type: "string" } },
                        learningOutcomes: { type: "array", items: { type: "string" } },
                        units: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    lessons: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                title: { type: "string" },
                                                type: { type: "string" },
                                                duration: { type: "string" },
                                                xp: { type: "number" }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        achievements: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    icon: { type: "string" },
                                    requirement: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            
            setCourseData(response);
        } catch (error) {
            console.error('Error generating course:', error);
            // Fallback content
            setCourseData({
                title: `${topic.name} Fundamentals`,
                description: `Master the core concepts of ${topic.name} through interactive lessons and hands-on projects.`,
                totalDuration: '12 hours',
                difficulty: 'Beginner to Intermediate',
                prerequisites: ['Basic understanding of the subject area', 'Curiosity and willingness to learn'],
                learningOutcomes: [
                    'Understand fundamental concepts',
                    'Apply knowledge to real scenarios',
                    'Complete hands-on projects',
                    'Pass certification assessment'
                ],
                units: [
                    {
                        title: 'Introduction & Foundations',
                        description: 'Get started with the basics',
                        lessons: [
                            { id: '1-1', title: 'Welcome & Course Overview', type: 'video', duration: '10 min', xp: 25 },
                            { id: '1-2', title: 'Core Concepts Explained', type: 'reading', duration: '15 min', xp: 30 },
                            { id: '1-3', title: 'Knowledge Check', type: 'quiz', duration: '5 min', xp: 50 },
                        ]
                    },
                    {
                        title: 'Deep Dive into Key Topics',
                        description: 'Explore advanced concepts',
                        lessons: [
                            { id: '2-1', title: 'Advanced Theory', type: 'video', duration: '20 min', xp: 40 },
                            { id: '2-2', title: 'Case Studies', type: 'reading', duration: '15 min', xp: 35 },
                            { id: '2-3', title: 'Practice Exercise', type: 'exercise', duration: '25 min', xp: 60 },
                            { id: '2-4', title: 'Module Quiz', type: 'quiz', duration: '10 min', xp: 75 },
                        ]
                    },
                ],
                achievements: [
                    { name: 'First Steps', description: 'Complete your first lesson', icon: 'star', requirement: '1 lesson' },
                    { name: 'Quick Learner', description: 'Complete a unit in one day', icon: 'flame', requirement: '1 unit' },
                    { name: 'Scholar', description: 'Complete the entire course', icon: 'trophy', requirement: 'All lessons' },
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    const startLesson = (lesson) => {
        setCurrentLesson(lesson);
        setShowLessonModal(true);
    };

    const completeLesson = () => {
        if (currentLesson && !completedLessons.includes(currentLesson.id)) {
            setCompletedLessons([...completedLessons, currentLesson.id]);
            setUserXP(userXP + (currentLesson.xp || 25));
        }
        setShowLessonModal(false);
    };

    const totalLessons = courseData?.units?.reduce((acc, u) => acc + (u.lessons?.length || 0), 0) || 0;
    const progress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

    if (!topic) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                        <p className="text-gray-600">Generating personalized course content...</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-[85vh]">
                        {/* Header */}
                        <div className="relative p-6 text-white" style={{ backgroundColor: topic.color }}>
                            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-1">{courseData?.title}</h2>
                                    <p className="text-white/80 text-sm mb-3">{courseData?.description}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> {courseData?.totalDuration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Target className="w-4 h-4" /> {courseData?.difficulty}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" /> {totalLessons} lessons
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{Math.round(progress)}% Complete</span>
                                    <span>{completedLessons.length}/{totalLessons} lessons</span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* XP and Streak bar */}
                        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Total XP</p>
                                        <p className="font-bold text-amber-600">{userXP}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
                                        <Flame className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Day Streak</p>
                                        <p className="font-bold text-orange-600">{streak} days</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {courseData?.achievements?.slice(0, 3).map((a, i) => (
                                    <AchievementBadge key={i} achievement={a} earned={i === 0 && completedLessons.length > 0} />
                                ))}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b">
                            {['overview', 'curriculum', 'achievements'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                                        activeTab === tab 
                                            ? 'text-purple-600 border-b-2 border-purple-600' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-3">What you'll learn</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {courseData?.learningOutcomes?.map((outcome, i) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-gray-600">{outcome}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-3">Prerequisites</h3>
                                        <ul className="space-y-2">
                                            {courseData?.prerequisites?.map((prereq, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                                    {prereq}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <Button 
                                        className="w-full text-white"
                                        style={{ backgroundColor: topic.color }}
                                        onClick={() => setActiveTab('curriculum')}
                                    >
                                        <Play className="w-4 h-4 mr-2" /> Start Learning
                                    </Button>
                                </div>
                            )}

                            {activeTab === 'curriculum' && (
                                <div className="space-y-4">
                                    {courseData?.units?.map((unit, i) => (
                                        <CourseUnit
                                            key={i}
                                            unit={unit}
                                            index={i}
                                            isUnlocked={i === 0 || courseData.units[i-1]?.lessons?.every(l => completedLessons.includes(l.id))}
                                            onStartLesson={startLesson}
                                            completedLessons={completedLessons}
                                        />
                                    ))}
                                </div>
                            )}

                            {activeTab === 'achievements' && (
                                <div className="grid grid-cols-3 gap-4">
                                    {courseData?.achievements?.map((achievement, i) => (
                                        <div key={i} className="flex flex-col items-center p-4 border rounded-xl bg-gray-50">
                                            <AchievementBadge achievement={achievement} earned={false} />
                                            <p className="text-xs text-gray-500 mt-2 text-center">{achievement.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Lesson Modal */}
                {showLessonModal && currentLesson && (
                    <div className="absolute inset-0 bg-white z-50 flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold">{currentLesson.title}</h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowLessonModal(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                                    {currentLesson.type === 'video' && <Video className="w-10 h-10 text-purple-600" />}
                                    {currentLesson.type === 'reading' && <FileText className="w-10 h-10 text-purple-600" />}
                                    {currentLesson.type === 'quiz' && <HelpCircle className="w-10 h-10 text-purple-600" />}
                                </div>
                                <h4 className="text-lg font-semibold mb-2">{currentLesson.title}</h4>
                                <p className="text-gray-500 mb-4">Lesson content would appear here</p>
                                <div className="flex items-center justify-center gap-2 text-amber-500 mb-6">
                                    <Zap className="w-5 h-5" />
                                    <span className="font-bold">+{currentLesson.xp} XP</span>
                                </div>
                                <Button onClick={completeLesson} style={{ backgroundColor: topic.color }} className="text-white">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Mark Complete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}