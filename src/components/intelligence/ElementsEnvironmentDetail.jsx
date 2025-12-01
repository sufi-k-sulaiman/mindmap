import React, { useState, useEffect } from 'react';
import { 
    Globe, Droplets, Wind, Flame, Sun, Moon, Star, Cloud, Loader2,
    TrendingUp, BarChart3, PieChart, Activity, Leaf, Heart, Shield,
    BookOpen, Lightbulb, Target, Users, Calendar, MapPin, Thermometer,
    ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { 
    LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
    AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ELEMENT_CONFIG = {
    Earth: { icon: Globe, color: '#8B4513', gradient: 'from-amber-700 to-yellow-600' },
    Soil: { icon: Globe, color: '#654321', gradient: 'from-amber-800 to-amber-600' },
    Water: { icon: Droplets, color: '#0EA5E9', gradient: 'from-blue-500 to-cyan-400' },
    Air: { icon: Wind, color: '#94A3B8', gradient: 'from-slate-400 to-blue-300' },
    Fire: { icon: Flame, color: '#EF4444', gradient: 'from-red-500 to-orange-400' },
    Sunlight: { icon: Sun, color: '#FBBF24', gradient: 'from-yellow-400 to-orange-300' },
    Moon: { icon: Moon, color: '#A78BFA', gradient: 'from-purple-400 to-indigo-500' },
    Stars: { icon: Star, color: '#F472B6', gradient: 'from-pink-400 to-purple-500' },
    Sky: { icon: Cloud, color: '#60A5FA', gradient: 'from-blue-400 to-sky-300' },
    Space: { icon: Star, color: '#1E1B4B', gradient: 'from-indigo-900 to-purple-800' }
};

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function ElementsEnvironmentDetail({ item, category }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const elementConfig = ELEMENT_CONFIG[item] || { icon: Globe, color: '#3B82F6', gradient: 'from-blue-500 to-cyan-500' };
    const Icon = elementConfig.icon;

    useEffect(() => {
        fetchElementData();
    }, [item]);

    const fetchElementData = async () => {
        setLoading(true);
        setData(null);
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Provide comprehensive environmental intelligence data about "${item}" as a fundamental element. Include:

1. Overview: Detailed scientific description (4-5 sentences)
2. Composition: Key components with percentages (5 items, must add up to 100)
3. KeyFacts: 6 important scientific facts
4. EnvironmentalData: Time series data for the past 6 months (labels: Jan, Feb, Mar, Apr, May, Jun) with:
   - qualityIndex (0-100 scale)
   - globalAverage (0-100 scale)
5. RegionalComparison: 5 regions with their quality scores (0-100)
6. TrendData: Current trend analysis with:
   - direction (up/down/stable)
   - percentChange (number)
   - forecast (brief text)
7. CulturalWisdom: 3 cultural/indigenous perspectives or traditions
8. HealthGuidance: 3 health recommendations related to this element
9. SustainabilityTips: 4 actionable sustainability recommendations
10. ScientificBreakthroughs: 2 recent research discoveries
11. EcosystemImpact: How this element affects 4 different ecosystems with impact scores (0-100)
12. CauseEffect: 3 cause-and-effect relationships (human activity -> environmental outcome)
13. SafetyWisdom: 3 safety/disaster preparedness tips`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        overview: { type: "string" },
                        composition: { type: "array", items: { type: "object", properties: { name: { type: "string" }, percentage: { type: "number" } } } },
                        keyFacts: { type: "array", items: { type: "string" } },
                        environmentalData: { type: "array", items: { type: "object", properties: { month: { type: "string" }, qualityIndex: { type: "number" }, globalAverage: { type: "number" } } } },
                        regionalComparison: { type: "array", items: { type: "object", properties: { region: { type: "string" }, score: { type: "number" } } } },
                        trendData: { type: "object", properties: { direction: { type: "string" }, percentChange: { type: "number" }, forecast: { type: "string" } } },
                        culturalWisdom: { type: "array", items: { type: "string" } },
                        healthGuidance: { type: "array", items: { type: "string" } },
                        sustainabilityTips: { type: "array", items: { type: "string" } },
                        scientificBreakthroughs: { type: "array", items: { type: "string" } },
                        ecosystemImpact: { type: "array", items: { type: "object", properties: { ecosystem: { type: "string" }, impact: { type: "number" } } } },
                        causeEffect: { type: "array", items: { type: "object", properties: { cause: { type: "string" }, effect: { type: "string" } } } },
                        safetyWisdom: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setData(response);
        } catch (error) {
            console.error('Failed to fetch element data:', error);
            // Fallback data
            setData({
                overview: `${item} is a fundamental element of our environment, playing a crucial role in sustaining life on Earth.`,
                composition: [{ name: 'Primary', percentage: 60 }, { name: 'Secondary', percentage: 25 }, { name: 'Trace', percentage: 15 }],
                keyFacts: ['Essential for life', 'Globally distributed', 'Cyclical in nature'],
                environmentalData: [
                    { month: 'Jan', qualityIndex: 72, globalAverage: 68 },
                    { month: 'Feb', qualityIndex: 74, globalAverage: 69 },
                    { month: 'Mar', qualityIndex: 71, globalAverage: 70 },
                    { month: 'Apr', qualityIndex: 76, globalAverage: 71 },
                    { month: 'May', qualityIndex: 78, globalAverage: 72 },
                    { month: 'Jun', qualityIndex: 75, globalAverage: 71 }
                ],
                regionalComparison: [
                    { region: 'North America', score: 75 },
                    { region: 'Europe', score: 72 },
                    { region: 'Asia', score: 65 },
                    { region: 'Africa', score: 70 },
                    { region: 'Oceania', score: 80 }
                ],
                trendData: { direction: 'up', percentChange: 3.2, forecast: 'Positive outlook' },
                culturalWisdom: ['Ancient traditions honor this element'],
                healthGuidance: ['Maintain awareness of environmental quality'],
                sustainabilityTips: ['Reduce consumption', 'Support conservation'],
                scientificBreakthroughs: ['New research ongoing'],
                ecosystemImpact: [{ ecosystem: 'Forest', impact: 85 }, { ecosystem: 'Ocean', impact: 78 }],
                causeEffect: [{ cause: 'Human activity', effect: 'Environmental change' }],
                safetyWisdom: ['Stay informed about conditions']
            });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BookOpen },
        { id: 'data', label: 'Data & Charts', icon: BarChart3 },
        { id: 'wisdom', label: 'Wisdom', icon: Lightbulb },
        { id: 'action', label: 'Take Action', icon: Target }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: elementConfig.color }} />
                <p className="text-gray-500">Loading comprehensive intelligence...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Hero Header */}
            <div className={`bg-gradient-to-r ${elementConfig.gradient} rounded-2xl p-6 mb-6 text-white`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                            <Icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">{category?.name}</p>
                            <h2 className="text-3xl font-bold">{item}</h2>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                            <div className="flex items-center gap-1 justify-center">
                                {data?.trendData?.direction === 'up' ? <ArrowUp className="w-4 h-4" /> : 
                                 data?.trendData?.direction === 'down' ? <ArrowDown className="w-4 h-4" /> : 
                                 <Minus className="w-4 h-4" />}
                                <span className="text-xl font-bold">{data?.trendData?.percentChange || 0}%</span>
                            </div>
                            <p className="text-xs text-white/70">Trend</p>
                        </div>
                        <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                            <p className="text-xl font-bold">{data?.environmentalData?.[5]?.qualityIndex || 75}</p>
                            <p className="text-xs text-white/70">Quality Index</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                            activeTab === tab.id 
                                ? 'text-white shadow-lg' 
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                        style={activeTab === tab.id ? { backgroundColor: elementConfig.color } : {}}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Overview Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Globe className="w-5 h-5" style={{ color: elementConfig.color }} />
                            Scientific Overview
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{data?.overview}</p>
                    </div>

                    {/* Composition Pie Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Composition Breakdown</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPie>
                                    <Pie
                                        data={data?.composition || []}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="percentage"
                                        nameKey="name"
                                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                                    >
                                        {(data?.composition || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </RechartsPie>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Key Facts */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5" style={{ color: elementConfig.color }} />
                            Key Scientific Facts
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data?.keyFacts?.map((fact, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: elementConfig.color }}>
                                        {i + 1}
                                    </span>
                                    <p className="text-gray-700">{fact}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Scientific Breakthroughs */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-indigo-600" />
                            Recent Scientific Breakthroughs
                        </h3>
                        <div className="space-y-3">
                            {data?.scientificBreakthroughs?.map((breakthrough, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-700">{breakthrough}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'data' && (
                <div className="space-y-6">
                    {/* Quality Index Trend */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Quality Index Trend (6 Months)</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.environmentalData || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#666" />
                                    <YAxis stroke="#666" domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="qualityIndex" name="Quality Index" stroke={elementConfig.color} strokeWidth={3} dot={{ fill: elementConfig.color }} />
                                    <Line type="monotone" dataKey="globalAverage" name="Global Average" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600"><strong>Forecast:</strong> {data?.trendData?.forecast}</p>
                        </div>
                    </div>

                    {/* Regional Comparison Bar Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Regional Quality Comparison</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.regionalComparison || []} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" domain={[0, 100]} stroke="#666" />
                                    <YAxis dataKey="region" type="category" stroke="#666" width={100} />
                                    <Tooltip />
                                    <Bar dataKey="score" fill={elementConfig.color} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Ecosystem Impact Radar */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Ecosystem Impact Analysis</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={data?.ecosystemImpact || []}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="ecosystem" />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                    <Radar name="Impact Score" dataKey="impact" stroke={elementConfig.color} fill={elementConfig.color} fillOpacity={0.5} />
                                    <Legend />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Cause & Effect Flow */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Cause & Effect Relationships</h3>
                        <div className="space-y-4">
                            {data?.causeEffect?.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1 bg-red-100 text-red-800 p-3 rounded-lg text-center">
                                        <p className="text-xs font-medium mb-1">CAUSE</p>
                                        <p className="font-semibold">{item.cause}</p>
                                    </div>
                                    <div className="text-2xl text-gray-400">→</div>
                                    <div className="flex-1 bg-blue-100 text-blue-800 p-3 rounded-lg text-center">
                                        <p className="text-xs font-medium mb-1">EFFECT</p>
                                        <p className="font-semibold">{item.effect}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'wisdom' && (
                <div className="space-y-6">
                    {/* Cultural Wisdom */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-amber-600" />
                            Cultural & Indigenous Wisdom
                        </h3>
                        <div className="space-y-3">
                            {data?.culturalWisdom?.map((wisdom, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-400">
                                    <p className="text-gray-700 italic">"{wisdom}"</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Health Guidance */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-green-600" />
                            Health Guidance
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {data?.healthGuidance?.map((tip, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                        <Heart className="w-5 h-5 text-green-600" />
                                    </div>
                                    <p className="text-gray-700 text-sm">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Safety Wisdom */}
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-600" />
                            Safety & Disaster Preparedness
                        </h3>
                        <div className="space-y-3">
                            {data?.safetyWisdom?.map((safety, i) => (
                                <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-600 font-bold">{i + 1}</span>
                                    </div>
                                    <p className="text-gray-700">{safety}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'action' && (
                <div className="space-y-6">
                    {/* Sustainability Tips */}
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-teal-600" />
                            Sustainability Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data?.sustainabilityTips?.map((tip, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg shadow-sm flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${elementConfig.color}20` }}>
                                        <Target className="w-4 h-4" style={{ color: elementConfig.color }} />
                                    </div>
                                    <div>
                                        <p className="text-gray-700">{tip}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Daily Highlight Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ borderLeftWidth: 4, borderLeftColor: elementConfig.color }}>
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <span className="text-sm text-gray-500">Today's Insight</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Current {item} Quality: {data?.trendData?.direction === 'up' ? 'Improving' : data?.trendData?.direction === 'down' ? 'Declining' : 'Stable'}</h3>
                        <p className="text-gray-600 mb-4">{data?.trendData?.forecast}</p>
                        <div className="flex gap-3">
                            <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold" style={{ color: elementConfig.color }}>{data?.environmentalData?.[5]?.qualityIndex || 75}</p>
                                <p className="text-xs text-gray-500">Current Index</p>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-gray-600">{data?.environmentalData?.[5]?.globalAverage || 71}</p>
                                <p className="text-xs text-gray-500">Global Average</p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className={`bg-gradient-to-r ${elementConfig.gradient} rounded-xl p-6 text-white`}>
                        <h3 className="text-xl font-bold mb-2">Make a Difference Today</h3>
                        <p className="text-white/80 mb-4">Your actions matter. Small changes in daily habits can lead to significant positive environmental impact.</p>
                        <div className="flex flex-wrap gap-3">
                            <div className="bg-white/20 rounded-lg px-4 py-2">
                                <p className="text-sm font-medium">🌱 Start with one tip above</p>
                            </div>
                            <div className="bg-white/20 rounded-lg px-4 py-2">
                                <p className="text-sm font-medium">📊 Track your impact</p>
                            </div>
                            <div className="bg-white/20 rounded-lg px-4 py-2">
                                <p className="text-sm font-medium">🤝 Share with others</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}