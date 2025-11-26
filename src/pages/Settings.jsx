import React, { useState, useEffect } from 'react';
import { Moon, Sun, Type, EyeOff, Eye, Volume2, VolumeX, Contrast } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import PageLayout from '../components/PageLayout';

const speakText = (text) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    }
};

export default function Settings() {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize') || '16'));
    const [hideIcons, setHideIcons] = useState(() => localStorage.getItem('hideIcons') === 'true');
    const [blackWhiteMode, setBlackWhiteMode] = useState(() => localStorage.getItem('blackWhiteMode') === 'true');
    const [voicePrompts, setVoicePrompts] = useState(() => localStorage.getItem('voicePrompts') === 'true');

    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('fontSize', fontSize.toString());
        document.documentElement.style.fontSize = `${fontSize}px`;
    }, [fontSize]);

    useEffect(() => {
        localStorage.setItem('hideIcons', hideIcons.toString());
    }, [hideIcons]);

    useEffect(() => {
        localStorage.setItem('blackWhiteMode', blackWhiteMode.toString());
    }, [blackWhiteMode]);

    useEffect(() => {
        localStorage.setItem('voicePrompts', voicePrompts.toString());
    }, [voicePrompts]);

    const handleFocus = (text) => {
        if (voicePrompts) speakText(text);
    };

    return (
        <PageLayout activePage="Settings" showSearch={true}>
            <div className="p-4 md:p-8 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Settings</h1>

                <div className="space-y-6">
                    {/* Dark Mode */}
                    <div 
                        className="p-6 rounded-2xl border bg-white border-gray-200"
                        onMouseEnter={() => handleFocus('Dark mode toggle')}
                        tabIndex={0}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {darkMode ? <Moon className="w-6 h-6 text-purple-500" /> : <Sun className="w-6 h-6 text-yellow-500" />}
                                <div>
                                    <h3 className="font-semibold text-gray-800">Dark Mode</h3>
                                    <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                                </div>
                            </div>
                            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>
                    </div>

                    {/* Black & White Mode */}
                    <div 
                        className="p-6 rounded-2xl border bg-white border-gray-200"
                        onMouseEnter={() => handleFocus('Black and white mode')}
                        tabIndex={0}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Contrast className="w-6 h-6 text-purple-500" />
                                <div>
                                    <h3 className="font-semibold text-gray-800">Black & White Mode</h3>
                                    <p className="text-sm text-gray-500">For users with color vision difficulties</p>
                                </div>
                            </div>
                            <Switch checked={blackWhiteMode} onCheckedChange={setBlackWhiteMode} />
                        </div>
                    </div>

                    {/* Voice Prompts */}
                    <div 
                        className="p-6 rounded-2xl border bg-white border-gray-200"
                        onMouseEnter={() => handleFocus('Voice prompts setting')}
                        tabIndex={0}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {voicePrompts ? <Volume2 className="w-6 h-6 text-purple-500" /> : <VolumeX className="w-6 h-6 text-gray-400" />}
                                <div>
                                    <h3 className="font-semibold text-gray-800">Voice Prompts</h3>
                                    <p className="text-sm text-gray-500">Speak button names on hover/focus</p>
                                </div>
                            </div>
                            <Switch checked={voicePrompts} onCheckedChange={setVoicePrompts} />
                        </div>
                    </div>

                    {/* Font Size */}
                    <div 
                        className="p-6 rounded-2xl border bg-white border-gray-200"
                        onMouseEnter={() => handleFocus('Font size adjustment')}
                        tabIndex={0}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <Type className="w-6 h-6 text-purple-500" />
                            <div>
                                <h3 className="font-semibold text-gray-800">Font Size</h3>
                                <p className="text-sm text-gray-500">Adjust base font size ({fontSize}px)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">A</span>
                            <Slider value={[fontSize]} min={12} max={24} step={1} onValueChange={([val]) => setFontSize(val)} className="flex-1" />
                            <span className="text-lg font-bold text-gray-500">A</span>
                        </div>
                    </div>

                    {/* Hide Icons */}
                    <div 
                        className="p-6 rounded-2xl border bg-white border-gray-200"
                        onMouseEnter={() => handleFocus('Hide icons toggle')}
                        tabIndex={0}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {hideIcons ? <EyeOff className="w-6 h-6 text-purple-500" /> : <Eye className="w-6 h-6 text-purple-500" />}
                                <div>
                                    <h3 className="font-semibold text-gray-800">Hide Icons</h3>
                                    <p className="text-sm text-gray-500">Hide icons in navigation menus</p>
                                </div>
                            </div>
                            <Switch checked={hideIcons} onCheckedChange={setHideIcons} />
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}