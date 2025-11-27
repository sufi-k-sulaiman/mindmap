import React, { useState } from 'react';
import { 
    Brain, TrendingUp, Target, Sparkles, Play, Loader2, Activity, Lightbulb, Zap,
    LineChart, GitBranch, Shield, AlertTriangle, CheckCircle2, X, Maximize2, Minimize2,
    Sliders, BarChart3, RefreshCw, Layers, Clock, Cpu, ChevronRight, SlidersHorizontal,
    FileText, Users, MessageSquare, Share2, Download, Settings2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart as RechartLine, Line, Legend } from 'recharts';

const MODULES = [
    { id: 'forecast', name: 'Forecasting', icon: LineChart, color: '#8B5CF6', desc: 'Time-series predictions with ARIMA, LSTM, Transformer models' },
    { id: 'scenario', name: 'Scenario Builder', icon: GitBranch, color: '#10B981', desc: 'Drag-and-drop scenario construction with templates' },
    { id: 'whatif', name: 'What-If Analysis', icon: Sliders, color: '#F59E0B', desc: 'Parameter sliders with instant recalculation' },
    { id: 'simulation', name: 'Simulation', icon: Activity, color: '#3B82F6', desc: 'Agent-based, system dynamics, Monte Carlo runs' },
    { id: 'risk', name: 'Risk Assessment', icon: Shield, color: '#EF4444', desc: 'Threat analysis, scoring matrices, early warnings' },
    { id: 'opportunity', name: 'Opportunity Mapping', icon: Lightbulb, color: '#EC4899', desc: 'Growth potential, emerging markets, ROI forecasting' },
    { id: 'impact', name: 'Impact Analysis', icon: Target, color: '#0EA5E9', desc: 'Policy quantification, cross-domain ripple effects' },
];

const DOMAINS = ['Economy', 'Health', 'Education', 'Defense', 'Trade', 'Labor', 'Tourism', 'Climate'];
const TIME_HORIZONS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', '5-Year', '10-Year'];
const MODEL_TYPES = ['ARIMA', 'LSTM', 'Transformer', 'Ensemble', 'Gradient Boosting'];

const generateForecastData = () => {
    const data = [];
    let base = 100;
    for (let i = 0; i < 24; i++) {
        base = base + (Math.random() - 0.45) * 5;
        data.push({
            period: `M${i + 1}`,
            actual: i < 12 ? Math.round(base) : null,
            forecast: i >= 10 ? Math.round(base + (Math.random() - 0.5) * 3) : null,
            upper: i >= 10 ? Math.round(base + 8 + Math.random() * 4) : null,
            lower: i >= 10 ? Math.round(base - 8 - Math.random() * 4) : null,
        });
    }
    return data;
};

export default function Intelligence() {
    const [activeTab, setActiveTab] = useState('forecast');
    const [selectedDomain, setSelectedDomain] = useState('Economy');
    const [timeHorizon, setTimeHorizon] = useState('Monthly');
    const [modelType, setModelType] = useState('Ensemble');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [forecastData] = useState(generateForecastData);

    // What-If Parameters
    const [interestRate, setInterestRate] = useState([3.5]);
    const [populationGrowth, setPopulationGrowth] = useState([1.2]);
    const [tradeFlows, setTradeFlows] = useState([50]);
    const [energyPrices, setEnergyPrices] = useState([75]);

    const runAnalysis = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Perform ${activeTab} analysis for ${selectedDomain} sector: "${query}"
Time horizon: ${timeHorizon}, Model: ${modelType}

Provide:
1. Executive Summary
2. Key Findings (5 points)
3. Risk Level with explanation
4. Confidence intervals
5. Recommendations
6. Projected Impact with metrics`,
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
                        confidenceScore: { type: "number" },
                        confidenceInterval: { type: "string" }
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

    const activeModule = MODULES.find(m => m.id === activeTab);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                <Brain className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Generative Intelligence Platform</h1>
                                <p className="text-white/80 text-sm">AI-powered forecasting, scenario planning & decision support</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold">7</p>
                                <p className="text-xs text-white/70">Analysis Modules</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">8</p>
                                <p className="text-xs text-white/70">Domains</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">5</p>
                                <p className="text-xs text-white/70">ML Models</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Module Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {MODULES.map(mod => (
                        <button key={mod.id} onClick={() => setActiveTab(mod.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                                activeTab === mod.id
                                    ? 'bg-white shadow-md border-2 text-gray-900'
                                    : 'bg-white/70 text-gray-600 hover:bg-white border border-gray-200'
                            }`}
                            style={{ borderColor: activeTab === mod.id ? mod.color : undefined }}>
                            <mod.icon className="w-4 h-4" style={{ color: mod.color }} />
                            <span className="font-medium text-sm">{mod.name}</span>
                        </button>
                    ))}
                </div>

                {/* Controls Row */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                        <SelectTrigger className="w-36 bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {DOMAINS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                        <SelectTrigger className="w-32 bg-white">
                            <Clock className="w-4 h-4 mr-2 text-gray-500" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {TIME_HORIZONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={modelType} onValueChange={setModelType}>
                        <SelectTrigger className="w-40 bg-white">
                            <Cpu className="w-4 h-4 mr-2 text-gray-500" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {MODEL_TYPES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Module Description */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                                    style={{ backgroundColor: `${activeModule?.color}15` }}>
                                    {activeModule && <activeModule.icon className="w-5 h-5" style={{ color: activeModule.color }} />}
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900">{activeModule?.name}</h2>
                                    <p className="text-sm text-gray-500">{activeModule?.desc}</p>
                                </div>
                            </div>
                        </div>

                        {/* Forecasting View */}
                        {activeTab === 'forecast' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Forecast Visualization</h3>
                                    <div className="flex gap-2">
                                        <span className="flex items-center gap-1 text-xs"><span className="w-3 h-1 bg-purple-600 rounded" /> Actual</span>
                                        <span className="flex items-center gap-1 text-xs"><span className="w-3 h-1 bg-emerald-500 rounded" /> Forecast</span>
                                        <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 bg-emerald-100 rounded" /> Confidence</span>
                                    </div>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={forecastData}>
                                            <defs>
                                                <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="period" axisLine={false} tickLine={false} fontSize={11} />
                                            <YAxis axisLine={false} tickLine={false} fontSize={11} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confBand)" />
                                            <Area type="monotone" dataKey="lower" stroke="none" fill="#fff" />
                                            <Line type="monotone" dataKey="actual" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                                            <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-4 gap-3 mt-4">
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <p className="text-lg font-bold text-purple-600">94.2%</p>
                                        <p className="text-xs text-gray-500">Accuracy</p>
                                    </div>
                                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                        <p className="text-lg font-bold text-emerald-600">±4.5%</p>
                                        <p className="text-xs text-gray-500">Confidence</p>
                                    </div>
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <p className="text-lg font-bold text-blue-600">Upward</p>
                                        <p className="text-xs text-gray-500">Trend</p>
                                    </div>
                                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                                        <p className="text-lg font-bold text-amber-600">Q2</p>
                                        <p className="text-xs text-gray-500">Seasonality</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* What-If Analysis */}
                        {activeTab === 'whatif' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Parameter Sliders</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Interest Rate</span>
                                            <span className="text-sm text-purple-600 font-medium">{interestRate[0]}%</span>
                                        </div>
                                        <Slider value={interestRate} onValueChange={setInterestRate} min={0} max={10} step={0.1} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Population Growth</span>
                                            <span className="text-sm text-purple-600 font-medium">{populationGrowth[0]}%</span>
                                        </div>
                                        <Slider value={populationGrowth} onValueChange={setPopulationGrowth} min={-2} max={5} step={0.1} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Trade Flows Index</span>
                                            <span className="text-sm text-purple-600 font-medium">{tradeFlows[0]}</span>
                                        </div>
                                        <Slider value={tradeFlows} onValueChange={setTradeFlows} min={0} max={100} step={1} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Energy Prices Index</span>
                                            <span className="text-sm text-purple-600 font-medium">{energyPrices[0]}</span>
                                        </div>
                                        <Slider value={energyPrices} onValueChange={setEnergyPrices} min={0} max={150} step={1} />
                                    </div>
                                </div>
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Projected Outcome</h4>
                                    <p className="text-2xl font-bold text-purple-600">
                                        GDP Growth: {(2.5 + (interestRate[0] * -0.2) + (populationGrowth[0] * 0.3) + (tradeFlows[0] * 0.02) - (energyPrices[0] * 0.01)).toFixed(1)}%
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Based on current parameter settings</p>
                                </div>
                            </div>
                        )}

                        {/* Scenario Builder */}
                        {activeTab === 'scenario' && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Scenario Templates</h3>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <Share2 className="w-4 h-4" /> Share
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Climate Transition', 'Economic Recession', 'Trade War', 'Tech Disruption', 'Pandemic Response', 'Defense Buildup'].map((scenario, i) => (
                                        <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all">
                                            <h4 className="font-medium text-gray-900">{scenario}</h4>
                                            <p className="text-xs text-gray-500 mt-1">Pre-configured scenario template</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Query Input */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                <span className="font-semibold text-gray-900">Custom Analysis Query</span>
                            </div>
                            <Textarea value={query} onChange={(e) => setQuery(e.target.value)}
                                placeholder={`e.g., "Forecast ${selectedDomain.toLowerCase()} indicators for ${timeHorizon.toLowerCase()} horizon using ${modelType} model..."`}
                                className="min-h-[80px] mb-3" />
                            <Button onClick={runAnalysis} disabled={loading || !query.trim()} className="bg-purple-600 hover:bg-purple-700">
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                                Run Analysis
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Capabilities */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Platform Capabilities</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <Cpu className="w-4 h-4 text-purple-600" />
                                    <span>Hybrid ML models (ARIMA, LSTM, Transformer)</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <RefreshCw className="w-4 h-4 text-blue-600" />
                                    <span>Real-time data ingestion & retraining</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <Layers className="w-4 h-4 text-emerald-600" />
                                    <span>Multi-domain coupling & transfer learning</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <BarChart3 className="w-4 h-4 text-amber-600" />
                                    <span>Confidence intervals & uncertainty scoring</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <FileText className="w-4 h-4 text-pink-600" />
                                    <span>AI narrative generation for reports</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <Users className="w-4 h-4 text-indigo-600" />
                                    <span>Collaborative workspaces with versioning</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Model Performance</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                    <p className="text-xl font-bold text-purple-600">94.2%</p>
                                    <p className="text-xs text-gray-500">Accuracy</p>
                                </div>
                                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                    <p className="text-xl font-bold text-emerald-600">8.4K</p>
                                    <p className="text-xs text-gray-500">Predictions</p>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xl font-bold text-blue-600">1.2K</p>
                                    <p className="text-xs text-gray-500">Scenarios</p>
                                </div>
                                <div className="text-center p-3 bg-amber-50 rounded-lg">
                                    <p className="text-xl font-bold text-amber-600">Live</p>
                                    <p className="text-xs text-gray-500">Retraining</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Analyses */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Recent Analyses</h3>
                            <div className="space-y-2">
                                {['GDP Forecast Q1 2025', 'Trade Flow Scenario', 'Climate Risk Assessment'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-700 flex-1">{item}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className={`${isFullscreen ? 'max-w-full w-full h-full rounded-none' : 'max-w-2xl max-h-[85vh]'} overflow-y-auto p-0`}>
                    {results && (
                        <div>
                            <div className="p-5 text-white" style={{ background: `linear-gradient(135deg, ${activeModule?.color || '#8B5CF6'}, #6366F1)` }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {activeModule && <activeModule.icon className="w-6 h-6" />}
                                        <div>
                                            <h2 className="text-lg font-bold">{activeModule?.name} Results</h2>
                                            <p className="text-white/80 text-sm">{selectedDomain} • {timeHorizon} • {modelType}</p>
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
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <Download className="w-4 h-4" /> Export
                                    </Button>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <Share2 className="w-4 h-4" /> Share
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}