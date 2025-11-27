import React, { useState } from 'react';
import { 
    Brain, TrendingUp, Globe, Target, Sparkles, Play, Loader2,
    BarChart3, Activity, Lightbulb, Zap, LineChart, GitBranch, Shield, 
    AlertTriangle, CheckCircle2, X, Maximize2, Minimize2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ANALYSIS_TYPES = [
    { id: 'forecast', name: 'Forecast', icon: TrendingUp, description: 'Predict future trends', color: '#8B5CF6' },
    { id: 'scenario', name: 'Scenario', icon: GitBranch, description: 'What-if analysis', color: '#10B981' },
    { id: 'simulation', name: 'Simulation', icon: Activity, description: 'Monte Carlo runs', color: '#F59E0B' },
    { id: 'risk', name: 'Risk Assessment', icon: Shield, description: 'Threat analysis', color: '#EF4444' },
    { id: 'opportunity', name: 'Opportunity', icon: Lightbulb, description: 'Growth potential', color: '#3B82F6' },
    { id: 'impact', name: 'Impact Analysis', icon: Target, description: 'Policy effects', color: '#EC4899' },
];

const SECTORS = ['Economy', 'Trade', 'Health', 'Defense', 'Education', 'Environment', 'Technology'];

export default function Intelligence() {
    const [selectedSector, setSelectedSector] = useState('Economy');
    const [selectedType, setSelectedType] = useState(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const runAnalysis = async (type) => {
        if (!query.trim()) return;
        setLoading(true);
        setSelectedType(type);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Perform a ${type.name} analysis for the ${selectedSector} sector based on this query: "${query}"
                
Provide:
1. Executive Summary (2-3 sentences)
2. Key Findings (4-5 bullet points)
3. Risk Level (Low/Medium/High) with explanation
4. Recommendations (3-4 actionable items)
5. Projected Impact with metrics`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        summary: { type: "string" },
                        findings: { type: "array", items: { type: "string" } },
                        riskLevel: { type: "string" },
                        riskExplanation: { type: "string" },
                        recommendations: { type: "array", items: { type: "string" } },
                        projectedImpact: { type: "string" },
                        confidenceScore: { type: "number" }
                    }
                }
            });
            setResults(response);
            setShowModal(true);
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = [
        { name: 'Jan', value: 65 }, { name: 'Feb', value: 72 }, { name: 'Mar', value: 68 },
        { name: 'Apr', value: 78 }, { name: 'May', value: 82 }, { name: 'Jun', value: 88 }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-4">
                        <Brain className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">AI Intelligence</h1>
                    <p className="text-gray-500 mt-1">Ask questions, get AI-powered insights</p>
                </div>

                {/* Sector Selection */}
                <div className="flex justify-center gap-2 mb-6 flex-wrap">
                    {SECTORS.map(sector => (
                        <button key={sector} onClick={() => setSelectedSector(sector)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedSector === sector
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                            }`}>
                            {sector}
                        </button>
                    ))}
                </div>

                {/* Query Input */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-900">What do you want to analyze?</span>
                    </div>
                    <Textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`e.g., "What's the impact of AI on ${selectedSector.toLowerCase()} in 2025?" or "Predict ${selectedSector.toLowerCase()} trends for the next 5 years"`}
                        className="min-h-[100px] text-base resize-none border-gray-200 focus:border-purple-400"
                    />
                </div>

                {/* Analysis Types */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                    {ANALYSIS_TYPES.map(type => (
                        <button key={type.id} onClick={() => runAnalysis(type)} disabled={loading || !query.trim()}
                            className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group">
                            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center transition-colors"
                                style={{ backgroundColor: `${type.color}15` }}>
                                {loading && selectedType?.id === type.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: type.color }} />
                                ) : (
                                    <type.icon className="w-5 h-5" style={{ color: type.color }} />
                                )}
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{type.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                        </button>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Analyses Run', value: '8,432', change: '+18%', color: 'purple' },
                        { label: 'Accuracy Rate', value: '94.2%', change: '+2.1%', color: 'emerald' },
                        { label: 'Scenarios', value: '1,247', color: 'blue' },
                        { label: 'Active Models', value: '12', color: 'amber' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            {stat.change && <p className={`text-sm text-${stat.color}-600`}>{stat.change}</p>}
                        </div>
                    ))}
                </div>

                {/* Trend Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">{selectedSector} Trend Analysis</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="url(#colorGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Results Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className={`${isFullscreen ? 'max-w-full w-full h-full rounded-none' : 'max-w-2xl max-h-[85vh]'} overflow-y-auto p-0`}>
                    {results && (
                        <div>
                            <div className="p-5 text-white" style={{ background: `linear-gradient(135deg, ${selectedType?.color || '#8B5CF6'}, #6366F1)` }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {selectedType && <selectedType.icon className="w-6 h-6" />}
                                        <div>
                                            <h2 className="text-lg font-bold">{selectedType?.name} Analysis</h2>
                                            <p className="text-white/80 text-sm">{selectedSector} Sector</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="text-white hover:bg-white/20">
                                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="text-white hover:bg-white/20">
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                                    <p className="text-gray-700">{results.summary}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Key Findings</h3>
                                    <ul className="space-y-2">
                                        {results.findings?.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                                                <span className="text-gray-600">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-xl ${results.riskLevel === 'High' ? 'bg-red-50' : results.riskLevel === 'Medium' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <AlertTriangle className={`w-4 h-4 ${results.riskLevel === 'High' ? 'text-red-500' : results.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
                                            <span className="font-medium">Risk: {results.riskLevel}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{results.riskExplanation}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-purple-50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Target className="w-4 h-4 text-purple-600" />
                                            <span className="font-medium">Confidence: {results.confidenceScore}%</span>
                                        </div>
                                        <div className="h-2 bg-purple-200 rounded-full mt-2">
                                            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${results.confidenceScore}%` }} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Recommendations</h3>
                                    <ul className="space-y-2">
                                        {results.recommendations?.map((r, i) => (
                                            <li key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">{i+1}</span>
                                                <span className="text-gray-700">{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-1">Projected Impact</h3>
                                    <p className="text-gray-600">{results.projectedImpact}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}