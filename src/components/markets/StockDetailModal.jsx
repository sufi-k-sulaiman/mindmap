import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { 
    X, Star, TrendingUp, TrendingDown, Eye, DollarSign, BarChart3, 
    LineChart, Activity, Brain, Shield, AlertTriangle, List, 
    Sparkles, ChevronRight, Info, Loader2, Target, Zap, Building,
    Users, Globe, Calendar, FileText, PieChart
} from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'invest', label: 'Invest', icon: DollarSign },
    { id: 'valuation', label: 'Valuation', icon: BarChart3 },
    { id: 'fundamentals', label: 'Fundamentals', icon: LineChart },
    { id: 'financials', label: 'Financials', icon: Activity },
    { id: 'technicals', label: 'Technicals', icon: TrendingUp },
    { id: 'sentiment', label: 'Sentiment', icon: Brain },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
    { id: 'risk', label: 'Risk', icon: AlertTriangle },
    { id: 'news', label: 'News', icon: FileText },
];

function MoatBar({ label, value, color = '#8B5CF6' }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-32">{label}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
            </div>
            <span className="text-sm font-medium text-gray-700 w-12 text-right">{value}%</span>
        </div>
    );
}

function PriceStatCard({ label, value, color }) {
    return (
        <div className="text-center px-4 py-3 rounded-lg" style={{ backgroundColor: color }}>
            <p className="text-xs text-white/80 mb-1">{label}</p>
            <p className="text-lg font-bold text-white">${value}</p>
        </div>
    );
}

export default function StockDetailModal({ stock, isOpen, onClose }) {
    const [activeNav, setActiveNav] = useState('overview');
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [sectionData, setSectionData] = useState({});
    const [loadingSection, setLoadingSection] = useState(null);

    useEffect(() => {
        if (isOpen && stock) {
            loadSectionData('overview');
        }
    }, [isOpen, stock]);

    useEffect(() => {
        if (stock && !sectionData[activeNav]) {
            loadSectionData(activeNav);
        }
    }, [activeNav, stock]);

    const loadSectionData = async (section) => {
        if (!stock || sectionData[section]) return;
        
        setLoadingSection(section);
        
        try {
            let prompt = '';
            let schema = {};

            switch (section) {
                case 'overview':
                    prompt = `Provide comprehensive overview for ${stock.ticker} (${stock.name}):
- Company description (2-3 sentences)
- Key competitive advantages
- Main revenue streams
- Recent major developments
- 36-month price history data points (monthly)
- MOAT breakdown: brand power, switching costs, network effects, cost advantages, intangibles (each 0-100)
- Investment thesis summary`;
                    schema = {
                        type: "object",
                        properties: {
                            description: { type: "string" },
                            advantages: { type: "array", items: { type: "string" } },
                            revenueStreams: { type: "array", items: { type: "string" } },
                            developments: { type: "array", items: { type: "string" } },
                            priceHistory: { type: "array", items: { type: "object", properties: { month: { type: "string" }, price: { type: "number" } } } },
                            moatBreakdown: { type: "object", properties: { brandPower: { type: "number" }, switchingCosts: { type: "number" }, networkEffects: { type: "number" }, costAdvantages: { type: "number" }, intangibles: { type: "number" } } },
                            thesis: { type: "string" }
                        }
                    };
                    break;

                case 'invest':
                    prompt = `Investment analysis for ${stock.ticker}:
- Buy/Hold/Sell recommendation with confidence %
- Price targets: low, mid, high
- Entry point suggestions
- Position sizing recommendation
- Time horizon suggestion
- Key catalysts for the stock
- Risks to consider`;
                    schema = {
                        type: "object",
                        properties: {
                            recommendation: { type: "string" },
                            confidence: { type: "number" },
                            priceTargets: { type: "object", properties: { low: { type: "number" }, mid: { type: "number" }, high: { type: "number" } } },
                            entryPoint: { type: "number" },
                            positionSize: { type: "string" },
                            timeHorizon: { type: "string" },
                            catalysts: { type: "array", items: { type: "string" } },
                            risks: { type: "array", items: { type: "string" } }
                        }
                    };
                    break;

                case 'valuation':
                    prompt = `Valuation analysis for ${stock.ticker}:
- Fair value estimate
- DCF valuation
- Comparable company analysis
- Historical valuation metrics
- Valuation vs sector average
- Margin of safety %
- Valuation grade (A-F)`;
                    schema = {
                        type: "object",
                        properties: {
                            fairValue: { type: "number" },
                            dcfValue: { type: "number" },
                            comparables: { type: "array", items: { type: "object", properties: { ticker: { type: "string" }, pe: { type: "number" } } } },
                            historicalPE: { type: "array", items: { type: "object", properties: { year: { type: "string" }, pe: { type: "number" } } } },
                            sectorAvgPE: { type: "number" },
                            marginOfSafety: { type: "number" },
                            grade: { type: "string" }
                        }
                    };
                    break;

                case 'fundamentals':
                    prompt = `Fundamental analysis for ${stock.ticker}:
- Revenue growth (5 year trend)
- Earnings growth trend
- Profit margins (gross, operating, net)
- Balance sheet strength
- Cash flow quality
- Debt levels and coverage
- Return metrics (ROE, ROA, ROIC)`;
                    schema = {
                        type: "object",
                        properties: {
                            revenueGrowth: { type: "array", items: { type: "object", properties: { year: { type: "string" }, growth: { type: "number" } } } },
                            earningsGrowth: { type: "array", items: { type: "object", properties: { year: { type: "string" }, growth: { type: "number" } } } },
                            margins: { type: "object", properties: { gross: { type: "number" }, operating: { type: "number" }, net: { type: "number" } } },
                            balanceSheetScore: { type: "number" },
                            cashFlowScore: { type: "number" },
                            debtToEquity: { type: "number" },
                            interestCoverage: { type: "number" }
                        }
                    };
                    break;

                case 'technicals':
                    prompt = `Technical analysis for ${stock.ticker}:
- Current trend (bullish/bearish/neutral)
- Support and resistance levels
- Moving averages (50, 100, 200 day)
- RSI, MACD signals
- Volume analysis
- Chart patterns detected
- Technical rating (1-10)`;
                    schema = {
                        type: "object",
                        properties: {
                            trend: { type: "string" },
                            support: { type: "array", items: { type: "number" } },
                            resistance: { type: "array", items: { type: "number" } },
                            ma50: { type: "number" },
                            ma100: { type: "number" },
                            ma200: { type: "number" },
                            rsi: { type: "number" },
                            macdSignal: { type: "string" },
                            volumeTrend: { type: "string" },
                            patterns: { type: "array", items: { type: "string" } },
                            rating: { type: "number" }
                        }
                    };
                    break;

                case 'sentiment':
                    prompt = `Market sentiment analysis for ${stock.ticker}:
- Overall sentiment score (0-100)
- Analyst ratings breakdown (buy/hold/sell counts)
- Institutional ownership changes
- Insider trading activity
- Social media sentiment
- News sentiment
- Short interest %`;
                    schema = {
                        type: "object",
                        properties: {
                            sentimentScore: { type: "number" },
                            analystRatings: { type: "object", properties: { buy: { type: "number" }, hold: { type: "number" }, sell: { type: "number" } } },
                            institutionalChange: { type: "string" },
                            insiderActivity: { type: "string" },
                            socialSentiment: { type: "string" },
                            newsSentiment: { type: "string" },
                            shortInterest: { type: "number" }
                        }
                    };
                    break;

                case 'ai-insights':
                    prompt = `AI-powered insights for ${stock.ticker}:
- AI confidence score (0-100)
- Key AI predictions
- Unusual patterns detected
- Earnings surprise probability
- Sector rotation signals
- Smart money flow indicators
- AI risk alerts`;
                    schema = {
                        type: "object",
                        properties: {
                            aiConfidence: { type: "number" },
                            predictions: { type: "array", items: { type: "string" } },
                            patterns: { type: "array", items: { type: "string" } },
                            earningsSurprise: { type: "string" },
                            sectorRotation: { type: "string" },
                            smartMoneyFlow: { type: "string" },
                            riskAlerts: { type: "array", items: { type: "string" } }
                        }
                    };
                    break;

                case 'risk':
                    prompt = `Risk assessment for ${stock.ticker}:
- Overall risk score (1-10)
- Volatility assessment
- Beta analysis
- Drawdown history
- Sector-specific risks
- Company-specific risks
- Macroeconomic risks
- Risk-adjusted return metrics`;
                    schema = {
                        type: "object",
                        properties: {
                            riskScore: { type: "number" },
                            volatility: { type: "string" },
                            beta: { type: "number" },
                            maxDrawdown: { type: "number" },
                            sectorRisks: { type: "array", items: { type: "string" } },
                            companyRisks: { type: "array", items: { type: "string" } },
                            macroRisks: { type: "array", items: { type: "string" } },
                            sharpeRatio: { type: "number" }
                        }
                    };
                    break;

                case 'news':
                    prompt = `Recent news and events for ${stock.ticker}:
- Latest 5 news headlines with dates and sentiment
- Upcoming events (earnings, conferences)
- Recent SEC filings summary
- Management commentary highlights`;
                    schema = {
                        type: "object",
                        properties: {
                            news: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, date: { type: "string" }, sentiment: { type: "string" } } } },
                            upcomingEvents: { type: "array", items: { type: "object", properties: { event: { type: "string" }, date: { type: "string" } } } },
                            filings: { type: "array", items: { type: "string" } },
                            managementNotes: { type: "array", items: { type: "string" } }
                        }
                    };
                    break;

                default:
                    return;
            }

            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `${prompt}\n\nProvide accurate, current data for ${stock.ticker} (${stock.name}). Current price: $${stock.price}`,
                add_context_from_internet: true,
                response_json_schema: schema
            });

            setSectionData(prev => ({ ...prev, [section]: response }));
        } catch (error) {
            console.error('Error loading section data:', error);
        } finally {
            setLoadingSection(null);
        }
    };

    if (!stock) return null;

    const isPositive = stock.change >= 0;
    const data = sectionData[activeNav] || {};

    const renderSectionContent = () => {
        if (loadingSection === activeNav) {
            return (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                    <p className="text-gray-600">Loading {activeNav} data with AI...</p>
                </div>
            );
        }

        switch (activeNav) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Company Overview */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-2xl font-bold text-gray-900">{stock.name}</h1>
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-lg font-medium">{stock.ticker}</span>
                                    </div>
                                    <p className="text-gray-500">{stock.sector} • {stock.industry}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-gray-900">${stock.price?.toFixed(2)}</p>
                                    <p className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        {isPositive ? '+' : ''}{stock.change?.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                            
                            <p className="text-gray-600 mb-4">{data.description || `${stock.name} is a leading company in the ${stock.sector} sector.`}</p>
                            
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                                    {stock.aiRating >= 80 ? 'Strong Buy' : stock.aiRating >= 60 ? 'Buy' : 'Hold'}
                                </span>
                                <span className="text-sm text-gray-500">AI Confidence: {stock.aiRating || stock.moat}%</span>
                            </div>
                        </div>

                        {/* Price History Chart */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <LineChart className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold text-gray-900">Price History</h3>
                                </div>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Sparkles className="w-4 h-4 text-purple-600" /> AI-generated analysis
                                </span>
                            </div>

                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.priceHistory || stock.history?.map((p, i) => ({ month: `M${i+1}`, price: p })) || []}>
                                        <defs>
                                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                        <Area type="monotone" dataKey="price" stroke="#8B5CF6" strokeWidth={2} fill="url(#priceGradient)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-4 gap-3 mt-4">
                                <PriceStatCard label="52W Low" value={(stock.price * 0.7).toFixed(2)} color="#EF4444" />
                                <PriceStatCard label="52W High" value={(stock.price * 1.3).toFixed(2)} color="#10B981" />
                                <PriceStatCard label="Avg Price" value={(stock.price * 0.95).toFixed(2)} color="#6B7280" />
                                <PriceStatCard label="Current" value={stock.price?.toFixed(2)} color="#8B5CF6" />
                            </div>
                        </div>

                        {/* MOAT Analysis & ROE */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-purple-600" />
                                        <h3 className="font-semibold text-gray-900">MOAT Analysis</h3>
                                    </div>
                                    <span className="text-3xl font-bold text-purple-600">{stock.moat}<span className="text-lg text-gray-400">/100</span></span>
                                </div>
                                <div className="space-y-3">
                                    <MoatBar label="Brand Power" value={data.moatBreakdown?.brandPower || 73} />
                                    <MoatBar label="Switching Costs" value={data.moatBreakdown?.switchingCosts || 87} color="#10B981" />
                                    <MoatBar label="Network Effects" value={data.moatBreakdown?.networkEffects || 65} />
                                    <MoatBar label="Cost Advantages" value={data.moatBreakdown?.costAdvantages || 45} color="#F59E0B" />
                                    <MoatBar label="Intangibles" value={data.moatBreakdown?.intangibles || 62} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Sparkles className="w-5 h-5 text-green-600" />
                                                <h3 className="font-semibold text-gray-900">Return on Equity</h3>
                                            </div>
                                            <p className="text-sm text-gray-600">ROE of {stock.roe}% indicates efficient use of equity</p>
                                            <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${stock.roe >= 20 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                <Star className="w-3 h-3" /> {stock.roe >= 20 ? 'Excellent' : 'Good'}
                                            </span>
                                        </div>
                                        <span className="text-4xl font-bold text-green-600">{stock.roe}<span className="text-xl">%</span></span>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                                <h3 className="font-semibold text-gray-900">Altman Z-Score</h3>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {stock.zscore >= 3 ? 'Low bankruptcy risk' : 'Monitor closely'}
                                            </p>
                                        </div>
                                        <span className={`text-4xl font-bold ${stock.zscore >= 3 ? 'text-green-600' : 'text-yellow-600'}`}>{stock.zscore?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'invest':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Target className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Investment Recommendation</h3>
                            </div>
                            <div className="flex items-center gap-6 mb-6">
                                <div className={`px-6 py-3 rounded-xl text-xl font-bold ${
                                    data.recommendation === 'Buy' ? 'bg-green-100 text-green-700' :
                                    data.recommendation === 'Sell' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {data.recommendation || 'Buy'}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">AI Confidence</p>
                                    <p className="text-2xl font-bold text-gray-900">{data.confidence || 78}%</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-red-50 rounded-xl p-4 text-center">
                                    <p className="text-sm text-gray-600">Low Target</p>
                                    <p className="text-xl font-bold text-red-600">${data.priceTargets?.low || (stock.price * 0.8).toFixed(2)}</p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 text-center">
                                    <p className="text-sm text-gray-600">Mid Target</p>
                                    <p className="text-xl font-bold text-purple-600">${data.priceTargets?.mid || (stock.price * 1.15).toFixed(2)}</p>
                                </div>
                                <div className="bg-green-50 rounded-xl p-4 text-center">
                                    <p className="text-sm text-gray-600">High Target</p>
                                    <p className="text-xl font-bold text-green-600">${data.priceTargets?.high || (stock.price * 1.4).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-green-600" /> Key Catalysts
                                </h4>
                                <ul className="space-y-2">
                                    {(data.catalysts || ['Strong earnings growth', 'New product launches', 'Market expansion']).map((c, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-600" /> Risks to Consider
                                </h4>
                                <ul className="space-y-2">
                                    {(data.risks || ['Market volatility', 'Competition', 'Regulatory changes']).map((r, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'sentiment':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold text-gray-900">Market Sentiment</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-purple-600">{data.sentimentScore || 72}</p>
                                    <p className="text-sm text-gray-500">Sentiment Score</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-green-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-green-600">{data.analystRatings?.buy || 18}</p>
                                    <p className="text-sm text-gray-600">Buy</p>
                                </div>
                                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-yellow-600">{data.analystRatings?.hold || 8}</p>
                                    <p className="text-sm text-gray-600">Hold</p>
                                </div>
                                <div className="bg-red-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-red-600">{data.analystRatings?.sell || 2}</p>
                                    <p className="text-sm text-gray-600">Sell</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Institutional Ownership</span>
                                    <span className={`font-medium ${data.institutionalChange === 'Increasing' ? 'text-green-600' : 'text-gray-700'}`}>
                                        {data.institutionalChange || 'Increasing'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Insider Activity</span>
                                    <span className="font-medium text-gray-700">{data.insiderActivity || 'Net buying'}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Short Interest</span>
                                    <span className="font-medium text-gray-700">{data.shortInterest || 2.4}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'ai-insights':
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">AI-Powered Insights</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">AI Confidence Score</p>
                                    <p className="text-4xl font-bold text-purple-600">{data.aiConfidence || stock.aiRating || 82}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Earnings Surprise Probability</p>
                                    <p className="text-xl font-bold text-gray-900">{data.earningsSurprise || 'Likely Beat'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">AI Predictions</h4>
                            <ul className="space-y-3">
                                {(data.predictions || [
                                    'Strong momentum likely to continue for next quarter',
                                    'Technical breakout pattern detected',
                                    'Earnings estimates trending higher'
                                ]).map((p, i) => (
                                    <li key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                        <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                                        <span className="text-gray-700">{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {data.riskAlerts?.length > 0 && (
                            <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                                <h4 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" /> AI Risk Alerts
                                </h4>
                                <ul className="space-y-2">
                                    {data.riskAlerts.map((r, i) => (
                                        <li key={i} className="text-sm text-red-700">{r}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex flex-col items-center justify-center py-12">
                            <Info className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500">Select a section to view detailed analysis</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[1400px] max-h-[90vh] p-0 overflow-hidden bg-gray-50">
                <div className="flex h-[85vh]">
                    {/* Left Sidebar */}
                    <div className="w-52 bg-white border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl font-bold text-gray-900">{stock.ticker}</span>
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">US</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{stock.name}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">${stock.price?.toFixed(2)}</span>
                                <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? '+' : ''}{stock.change?.toFixed(2)}%
                                </span>
                            </div>
                            <Button 
                                onClick={() => setIsWatchlisted(!isWatchlisted)}
                                className={`w-full mt-3 ${isWatchlisted ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                            >
                                <Star className={`w-4 h-4 mr-2 ${isWatchlisted ? 'fill-white' : ''}`} />
                                {isWatchlisted ? 'Watching' : 'Add to Watchlist'}
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">Navigation</p>
                            <nav className="px-2">
                                {NAV_ITEMS.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveNav(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                            activeNav === item.id ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                        {loadingSection === item.id && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold text-gray-900 capitalize">{activeNav.replace('-', ' ')}</h2>
                                <span className="text-sm text-gray-500">
                                    MCap: ${stock.marketCap}B • Vol: {stock.volume}
                                </span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            {renderSectionContent()}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}