import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Image, FileText, Code, MessageSquare, Lightbulb, Wand2, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from '@/api/base44Client';

const CAPABILITIES = [
    { id: 'chat', name: 'Chat', icon: MessageSquare, description: 'General conversation and Q&A', color: 'from-purple-500 to-indigo-500' },
    { id: 'write', name: 'Write', icon: FileText, description: 'Content creation and editing', color: 'from-blue-500 to-cyan-500' },
    { id: 'code', name: 'Code', icon: Code, description: 'Programming assistance', color: 'from-green-500 to-emerald-500' },
    { id: 'image', name: 'Image', icon: Image, description: 'Image generation', color: 'from-pink-500 to-rose-500' },
    { id: 'brainstorm', name: 'Brainstorm', icon: Lightbulb, description: 'Ideation and creativity', color: 'from-amber-500 to-orange-500' },
];

const QUICK_PROMPTS = [
    "Explain quantum computing in simple terms",
    "Write a professional email template",
    "Generate a creative story idea",
    "Help me debug my code",
    "Create a marketing strategy outline",
];

export default function AIHub() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeCapability, setActiveCapability] = useState('chat');
    const [copied, setCopied] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    const handleSubmit = async () => {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        setResponse('');
        setGeneratedImage(null);

        try {
            if (activeCapability === 'image') {
                const result = await base44.integrations.Core.GenerateImage({ prompt });
                setGeneratedImage(result.url);
            } else {
                const systemPrompts = {
                    chat: 'You are a helpful AI assistant powered by Qwirey. Be conversational and informative.',
                    write: 'You are a professional writer. Help with content creation, editing, and writing tasks.',
                    code: 'You are an expert programmer. Help with coding, debugging, and technical questions. Use code blocks with syntax highlighting.',
                    brainstorm: 'You are a creative brainstorming partner. Generate innovative ideas and think outside the box.',
                };

                const result = await base44.integrations.Core.InvokeLLM({
                    prompt: `${systemPrompts[activeCapability]}\n\nUser: ${prompt}`,
                    add_context_from_internet: activeCapability === 'chat',
                });
                setResponse(result);
            }
        } catch (error) {
            setResponse('Sorry, there was an error processing your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(response);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleQuickPrompt = (p) => {
        setPrompt(p);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">AI Hub</h1>
                            <p className="text-white/80">Your all-in-one AI assistant powered by Qwirey</p>
                        </div>
                    </div>
                </div>

                {/* Capabilities */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {CAPABILITIES.map(cap => (
                        <button
                            key={cap.id}
                            onClick={() => { setActiveCapability(cap.id); setResponse(''); setGeneratedImage(null); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                                activeCapability === cap.id
                                    ? 'bg-white shadow-md border-2 border-purple-500 text-gray-900'
                                    : 'bg-white/70 text-gray-600 hover:bg-white border border-gray-200'
                            }`}
                        >
                            <cap.icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{cap.name}</span>
                        </button>
                    ))}
                </div>

                {/* Quick Prompts */}
                {!response && !generatedImage && (
                    <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-3">Quick prompts:</p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_PROMPTS.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleQuickPrompt(p)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition-all"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={activeCapability === 'image' ? "Describe the image you want to generate..." : "Ask me anything..."}
                        className="min-h-[120px] border-0 focus-visible:ring-0 resize-none text-lg"
                        onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
                    />
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">Press ⌘+Enter to send</p>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !prompt.trim()}
                            className="bg-purple-600 hover:bg-purple-700 gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : activeCapability === 'image' ? (
                                <Wand2 className="w-4 h-4" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            {loading ? 'Processing...' : activeCapability === 'image' ? 'Generate' : 'Send'}
                        </Button>
                    </div>
                </div>

                {/* Response */}
                {(response || generatedImage) && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="font-medium text-gray-900">Qwirey AI</span>
                            </div>
                            {response && (
                                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1">
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            )}
                        </div>
                        
                        {generatedImage ? (
                            <img src={generatedImage} alt="Generated" className="rounded-lg max-w-full" />
                        ) : (
                            <div className="prose prose-sm max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-gray-700">{response}</pre>
                            </div>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
                        <p className="text-gray-500">
                            {activeCapability === 'image' ? 'Generating your image...' : 'Thinking...'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}