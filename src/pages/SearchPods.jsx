import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { 
    Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
    Sparkles, Radio, Loader2, ChevronRight, Plus, Cpu, BookOpen, 
    Film, Trophy, Building2, Plane, ChevronLeft, X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageLayout from '../components/PageLayout';

const CATEGORIES = [
    { name: 'Technology', icon: Cpu, color: '#6B4EE6' },
    { name: 'Education', icon: BookOpen, color: '#3B82F6' },
    { name: 'Entertainment', icon: Film, color: '#EC4899' },
    { name: 'Sports', icon: Trophy, color: '#10B981' },
    { name: 'Politics', icon: Building2, color: '#F59E0B' },
    { name: 'Travel', icon: Plane, color: '#06B6D4' },
];

export default function SearchPods() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState('default');
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [generatingCategory, setGeneratingCategory] = useState(null);
    const [currentCaption, setCurrentCaption] = useState('');
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [bass, setBass] = useState(50);
    const [mid, setMid] = useState(50);
    const [treble, setTreble] = useState(50);
    
    const sentencesRef = useRef([]);
    const currentIndexRef = useRef(0);
    const isPlayingRef = useRef(false);
    const timerRef = useRef(null);

    useEffect(() => {
        loadCategories();
        // Preload voices
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
            window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
        }
        return () => {
            window.speechSynthesis?.cancel();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const results = await Promise.all(
                CATEGORIES.map(async (cat) => {
                    const response = await base44.integrations.Core.InvokeLLM({
                        prompt: `Generate 4 podcast topics for "${cat.name}".`,
                        add_context_from_internet: true,
                        response_json_schema: {
                            type: "object",
                            properties: {
                                episodes: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: { title: { type: "string" } }
                                    }
                                },
                                subtopics: { type: "array", items: { type: "string" } }
                            }
                        }
                    });

                    const episodes = (response?.episodes || []).slice(0, 4).map((ep, i) => ({
                        ...ep, id: i, category: cat.name, thumbnail: null
                    }));

                    // Generate thumbnails in parallel
                    const withThumbs = await Promise.all(episodes.map(async (ep) => {
                        try {
                            const img = await base44.integrations.Core.GenerateImage({
                                prompt: `Podcast cover for "${ep.title}" - ${cat.name}, modern style`
                            });
                            return { ...ep, thumbnail: img?.url };
                        } catch { return ep; }
                    }));

                    return { ...cat, episodes: withThumbs, subtopics: response?.subtopics || [], episodeCount: withThumbs.length };
                })
            );
            setCategories(results);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateMoreEpisodes = async (categoryName) => {
        setGeneratingCategory(categoryName);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 3 new podcast topics for "${categoryName}".`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        episodes: { type: "array", items: { type: "object", properties: { title: { type: "string" } } } }
                    }
                }
            });

            const newEpisodes = await Promise.all(
                (response?.episodes || []).map(async (ep, i) => {
                    try {
                        const img = await base44.integrations.Core.GenerateImage({
                            prompt: `Podcast cover for "${ep.title}" - ${categoryName}`
                        });
                        return { ...ep, id: Date.now() + i, thumbnail: img?.url, category: categoryName };
                    } catch { return { ...ep, id: Date.now() + i, category: categoryName }; }
                })
            );

            setCategories(prev => prev.map(cat => 
                cat.name === categoryName 
                    ? { ...cat, episodes: [...cat.episodes, ...newEpisodes], episodeCount: cat.episodeCount + newEpisodes.length }
                    : cat
            ));
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setGeneratingCategory(null);
        }
    };

    const playEpisode = async (episode) => {
        window.speechSynthesis?.cancel();
        if (timerRef.current) clearInterval(timerRef.current);
        
        setCurrentEpisode(episode);
        setShowPlayer(true);
        setCurrentTime(0);
        setIsPlaying(false);
        isPlayingRef.current = false;
        setIsGeneratingAudio(true);
        setCurrentCaption('Generating podcast script...');

        try {
            const scriptResponse = await base44.integrations.Core.InvokeLLM({
                prompt: `Write a 2-minute podcast script about "${episode.title}". 
                Make it engaging, informative, with intro and conclusion.
                Write in a natural speaking style.`,
                add_context_from_internet: true
            });

            const script = scriptResponse || `Welcome to this episode about ${episode.title}.`;
            const sentences = script.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 5);
            
            sentencesRef.current = sentences;
            currentIndexRef.current = 0;
            setDuration(sentences.length * 4);
            setIsGeneratingAudio(false);
            setCurrentCaption(sentences[0] || 'Ready to play');
            
            // Auto-start playback
            setTimeout(() => startSpeaking(), 500);

        } catch (error) {
            console.error('Error:', error);
            setIsGeneratingAudio(false);
            sentencesRef.current = [`Welcome to ${episode.title}. This is an exciting topic.`];
            setCurrentCaption(sentencesRef.current[0]);
            setDuration(10);
        }
    };

    const startSpeaking = () => {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech is not supported');
            return;
        }

        window.speechSynthesis.cancel();
        isPlayingRef.current = true;
        setIsPlaying(true);
        
        speakNextSentence();
        
        timerRef.current = setInterval(() => {
            setCurrentTime(prev => Math.min(prev + 1, duration));
        }, 1000);
    };

    const speakNextSentence = () => {
        if (!isPlayingRef.current) return;
        
        if (currentIndexRef.current >= sentencesRef.current.length) {
            stopPlayback();
            return;
        }

        const text = sentencesRef.current[currentIndexRef.current];
        setCurrentCaption(text);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = playbackSpeed;
        utterance.volume = isMuted ? 0 : volume / 100;
        utterance.pitch = 1;

        // Get available voices
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            if (selectedVoice === 'female') {
                const female = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Moira'));
                if (female) utterance.voice = female;
            } else if (selectedVoice === 'male') {
                const male = voices.find(v => v.name.includes('Male') || v.name.includes('Daniel') || v.name.includes('Alex') || v.name.includes('David') || v.name.includes('Fred'));
                if (male) utterance.voice = male;
            }
        }

        utterance.onend = () => {
            currentIndexRef.current++;
            if (isPlayingRef.current) {
                speakNextSentence();
            }
        };

        utterance.onerror = () => {
            currentIndexRef.current++;
            if (isPlayingRef.current) speakNextSentence();
        };

        window.speechSynthesis.speak(utterance);
    };

    const stopPlayback = () => {
        window.speechSynthesis?.cancel();
        isPlayingRef.current = false;
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            stopPlayback();
        } else {
            isPlayingRef.current = true;
            setIsPlaying(true);
            speakNextSentence();
            timerRef.current = setInterval(() => {
                setCurrentTime(prev => Math.min(prev + 1, duration));
            }, 1000);
        }
    };

    const closePlayer = () => {
        stopPlayback();
        setShowPlayer(false);
    };

    const handleSearch = async (query) => {
        const episode = { title: query, category: 'Search' };
        try {
            const img = await base44.integrations.Core.GenerateImage({ prompt: `Podcast cover: ${query}` });
            episode.thumbnail = img?.url;
        } catch {}
        playEpisode(episode);
    };

    const formatTime = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

    const handleMoreClick = (categoryName) => {
        setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    };

    return (
        <PageLayout activePage="SearchPods" onSearch={handleSearch} searchPlaceholder="Search any topic to create a podcast...">
            <div className="p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => {
                            const IconComponent = category.icon;
                            const isExpanded = expandedCategory === category.name;
                            return (
                                <div key={category.name} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}15` }}>
                                                <IconComponent className="w-5 h-5" style={{ color: category.color }} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                                                <p className="text-xs text-gray-500">{category.episodeCount} episodes</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleMoreClick(category.name)}
                                            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                                        >
                                            {isExpanded ? 'Less' : 'More'} 
                                            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                        </button>
                                    </div>

                                    {/* Subtopics */}
                                    {isExpanded && category.subtopics?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {category.subtopics.map((sub, i) => (
                                                <button 
                                                    key={i} 
                                                    onClick={() => playEpisode({ title: sub, category: category.name })}
                                                    className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700"
                                                >
                                                    {sub}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Episodes */}
                                    <div className="space-y-3">
                                        {category.episodes?.slice(0, isExpanded ? undefined : 3).map((episode) => (
                                            <div 
                                                key={episode.id} 
                                                onClick={() => playEpisode(episode)}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                                    {episode.thumbnail ? (
                                                        <img src={episode.thumbnail} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Radio className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Play className="w-5 h-5 text-white" fill="white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-800 truncate">{episode.title}</h4>
                                                    <p className="text-xs text-gray-500">Click to play</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Generate More */}
                                    <button 
                                        onClick={() => generateMoreEpisodes(category.name)}
                                        disabled={generatingCategory === category.name}
                                        className="w-full mt-4 py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-purple-500 hover:text-purple-600 flex flex-col items-center gap-1"
                                    >
                                        {generatingCategory === category.name ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-5 h-5" />
                                        )}
                                        <span className="text-sm font-medium">Generate More</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Player Modal */}
            <Dialog open={showPlayer} onOpenChange={closePlayer}>
                <DialogContent className="max-w-2xl p-0 bg-white overflow-hidden max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <button onClick={closePlayer} className="text-gray-400 hover:text-gray-600">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <span className="text-sm text-gray-500 uppercase tracking-wider">Now Playing</span>
                            <button onClick={closePlayer} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Thumbnail */}
                        <div className="flex justify-center mb-6">
                            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 overflow-hidden shadow-lg">
                                {currentEpisode?.thumbnail ? (
                                    <img src={currentEpisode.thumbnail} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Radio className="w-16 h-16 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-1">{currentEpisode?.title}</h2>
                            <p className="text-sm text-purple-600">{currentEpisode?.category}</p>
                        </div>

                        {isGeneratingAudio && (
                            <div className="flex items-center justify-center gap-3 py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                                <span className="text-gray-600">Generating podcast...</span>
                            </div>
                        )}

                        {/* Equalizer */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Equalizer</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div><label className="text-xs text-gray-500">Bass</label><Slider value={[bass]} max={100} onValueChange={([v]) => setBass(v)} /></div>
                                <div><label className="text-xs text-gray-500">Mid</label><Slider value={[mid]} max={100} onValueChange={([v]) => setMid(v)} /></div>
                                <div><label className="text-xs text-gray-500">Treble</label><Slider value={[treble]} max={100} onValueChange={([v]) => setTreble(v)} /></div>
                            </div>
                        </div>

                        {/* Caption */}
                        <div className="bg-purple-50 rounded-xl p-4 mb-6 min-h-[80px] flex items-center justify-center border border-purple-100">
                            <p className="text-center text-gray-700 leading-relaxed">{currentCaption}</p>
                        </div>

                        {/* Voice & Volume */}
                        <div className="flex items-center gap-4 mb-6">
                            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="male">Male</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-2 flex-1">
                                <button onClick={() => setIsMuted(!isMuted)}>
                                    {isMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-gray-600" />}
                                </button>
                                <Slider value={[isMuted ? 0 : volume]} max={100} onValueChange={([v]) => { setVolume(v); setIsMuted(false); }} className="flex-1" />
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-6">
                            <Slider value={[currentTime]} max={duration || 100} className="w-full" />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-6 mb-6">
                            <Button variant="ghost" size="icon" className="text-gray-500"><SkipBack className="w-6 h-6" /></Button>
                            <Button size="icon" className="w-16 h-16 rounded-full bg-purple-600 text-white hover:bg-purple-700" onClick={togglePlayPause} disabled={isGeneratingAudio}>
                                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="text-gray-500"><SkipForward className="w-6 h-6" /></Button>
                        </div>

                        {/* Speed */}
                        <div className="flex justify-center gap-2">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                <button key={speed} onClick={() => setPlaybackSpeed(speed)} className={`px-3 py-1 rounded-lg text-sm ${playbackSpeed === speed ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                                    {speed}x
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}