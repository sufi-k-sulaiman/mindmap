import React, { useState } from 'react';
import { 
    X, Star, TrendingUp, TrendingDown, Eye, DollarSign, BarChart3, 
    LineChart, Activity, Brain, Shield, AlertTriangle, List, 
    Sparkles, ChevronRight, Info
} from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'invest', label: 'Invest', icon: DollarSign },
    { id: 'valuation', label: 'Valuation', icon: BarChart3 },
    { id: 'fundamentals', label: 'Fundamentals', icon: LineChart },
    { id: 'financials', label: 'Financials', icon: Activity },
    { id: 'technicals', label: 'Technicals', icon: TrendingUp },
    { id: 'sentiment', label: 'Sentiment', icon: Brain },
    { id: 'legends', label: 'Legends', icon: Star },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
    { id: 'risk', label: 'Risk', icon: AlertTriangle },
    { id: 'macro', label: 'Macro', icon: Activity },
    { id: 'ratings', label: 'Ratings', icon: List },
    { id: 'watchlist', label: 'Watchlist', icon: Star },
];

function MoatBar({ label, value, color = '#8B5CF6' }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-32">{label}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full rounded-full transition-all" 
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
            <span className="text-sm font-medium text-gray-700 w-12 text-right">{value}%</span>
        </div>
    );
}

function MetricCard({ title, value, subtitle, badge, badgeColor = 'green' }) {
    const badgeColors = {
        green: 'bg-green-100 text-green-700',
        yellow: 'bg-yellow-100 text-yellow-700',
        red: 'bg-red-100 text-red-700',
        purple: 'bg-purple-100 text-purple-700',
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">{title}</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">{value}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
            {badge && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeColors[badgeColor]}`}>
                    <Star className="w-3 h-3" /> {badge}
                </span>
            )}
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

function KeyMetricsSidebar({ stock }) {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Key Metrics</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Good</span>
                </div>
                
                <div className="space-y-3">
                    <div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Mkt Cap</span>
                            <span className="font-bold text-gray-900">${stock.marketCap || '1696'}B</span>
                        </div>
                        <span className="text-xs text-gray-400">Large Cap</span>
                    </div>
                    
                    <div className="h-16 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg flex items-end px-2 pb-1">
                        {/* Mini chart placeholder */}
                        <div className="flex items-end gap-0.5 w-full h-full">
                            {[40, 55, 45, 60, 50, 70, 65, 80, 75, 90].map((h, i) => (
                                <div key={i} className="flex-1 bg-purple-500 rounded-t" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Past</span>
                        <span>Forecast</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">MOAT</span>
                    <span className="text-2xl font-bold text-purple-600">{stock.moat || 68}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Competitive edge</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" /> 2%
                </div>
                
                <div className="h-12 mt-2 bg-gradient-to-r from-green-100 to-green-50 rounded-lg flex items-end px-1">
                    {[30, 40, 35, 50, 45, 55, 60, 65, 70, 68].map((h, i) => (
                        <div key={i} className="flex-1 bg-green-500 rounded-t mx-0.5" style={{ height: `${h}%` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function StockDetailModal({ stock, isOpen, onClose }) {
    const [activeNav, setActiveNav] = useState('overview');
    const [isWatchlisted, setIsWatchlisted] = useState(false);

    if (!stock) return null;

    const isPositive = stock.change >= 0;

    // Generate 36-month price history
    const priceHistory = Array.from({ length: 36 }, (_, i) => {
        const basePrice = stock.price * 0.5;
        const trend = (i / 36) * stock.price * 0.5;
        const noise = (Math.random() - 0.5) * stock.price * 0.1;
        return {
            month: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12]} ${Math.floor(i / 12) + 22}`,
            price: Math.round((basePrice + trend + noise) * 100) / 100
        };
    });

    const startPrice = priceHistory[0]?.price || stock.price * 0.5;
    const highPrice = Math.max(...priceHistory.map(p => p.price));
    const lowPrice = Math.min(...priceHistory.map(p => p.price));
    const changePercent = (((stock.price - startPrice) / startPrice) * 100).toFixed(1);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[1400px] max-h-[90vh] p-0 overflow-hidden bg-gray-50">
                <div className="flex h-[85vh]">
                    {/* Left Sidebar - Stock Info & Nav */}
                    <div className="w-52 bg-white border-r border-gray-200 flex flex-col">
                        {/* Stock Header */}
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
                                {isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
                            </Button>
                        </div>

                        {/* Navigation */}
                        <div className="flex-1 overflow-y-auto">
                            <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">Navigation</p>
                            <nav className="px-2">
                                {NAV_ITEMS.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveNav(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                            activeNav === item.id
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                        <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Key Metrics Mini */}
                        <KeyMetricsSidebar stock={stock} />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
                                <span className="text-sm text-gray-500">
                                    MCap: ${stock.marketCap || '1696'}B • Vol: {stock.volume} • 52W: ${lowPrice?.toFixed(0)}-${highPrice?.toFixed(0)}
                                </span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Company Overview */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h1 className="text-2xl font-bold text-gray-900">{stock.name}</h1>
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-lg font-medium">{stock.ticker}</span>
                                        </div>
                                        <p className="text-gray-500">{stock.sector} • Software</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-gray-900">${stock.price?.toFixed(2)}</p>
                                        <p className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            {isPositive ? '+' : ''}{stock.change?.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 mb-4">
                                    {stock.name} is a {stock.sector} company with moderate competitive advantages.
                                </p>
                                
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">Monitor</span>
                                    <span className="text-sm text-gray-500">AI Confidence: {stock.moat}%</span>
                                </div>
                            </div>

                            {/* 36-Month Price History */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <LineChart className="w-5 h-5 text-purple-600" />
                                        <h3 className="font-semibold text-gray-900">36-Month Price History</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                            parseFloat(changePercent) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            <TrendingUp className="w-4 h-4" /> +{changePercent}%
                                        </span>
                                        <span className="text-sm text-gray-500">Hover events for details</span>
                                    </div>
                                </div>

                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={priceHistory}>
                                            <defs>
                                                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                            <Tooltip 
                                                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                                formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                                            />
                                            <Area type="monotone" dataKey="price" stroke="#8B5CF6" strokeWidth={2} fill="url(#priceGradient)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Price Stats */}
                                <div className="grid grid-cols-4 gap-3 mt-4">
                                    <PriceStatCard label="Start (36mo ago)" value={startPrice.toFixed(2)} color="#6B7280" />
                                    <PriceStatCard label="52W High" value={highPrice.toFixed(2)} color="#10B981" />
                                    <PriceStatCard label="52W Low" value={lowPrice.toFixed(2)} color="#EF4444" />
                                    <PriceStatCard label="Current" value={stock.price?.toFixed(2)} color="#8B5CF6" />
                                </div>
                            </div>

                            {/* Analysis Cards Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* MOAT Analysis */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-purple-600" />
                                            <h3 className="font-semibold text-gray-900">MOAT Analysis</h3>
                                        </div>
                                        <span className="text-3xl font-bold text-purple-600">{stock.moat}<span className="text-lg text-gray-400">/100</span></span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">Moderate competitive position with some barriers to entry</p>
                                    
                                    <div className="space-y-3">
                                        <MoatBar label="Brand Power" value={73} color="#8B5CF6" />
                                        <MoatBar label="Switching Costs" value={87} color="#10B981" />
                                        <MoatBar label="Network Effects" value={98} color="#10B981" />
                                        <MoatBar label="Cost Advantages" value={45} color="#F59E0B" />
                                        <MoatBar label="Intangibles" value={62} color="#8B5CF6" />
                                    </div>
                                </div>

                                {/* ROE & Z-Score */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Sparkles className="w-5 h-5 text-green-600" />
                                                    <h3 className="font-semibold text-gray-900">Return on Equity</h3>
                                                </div>
                                                <p className="text-sm text-gray-600">ROE of {stock.roe}% indicates efficient use of shareholder equity</p>
                                                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    <Star className="w-3 h-3" /> Excellent
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
                                                    {stock.zscore >= 3 ? 'Low bankruptcy risk - financially stable' : 
                                                     stock.zscore >= 1.8 ? 'Moderate risk - monitor closely' : 
                                                     'Elevated risk - exercise caution'}
                                                </p>
                                                <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    stock.zscore >= 3 ? 'bg-green-100 text-green-700' : 
                                                    stock.zscore >= 1.8 ? 'bg-yellow-100 text-yellow-700' : 
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {stock.zscore >= 3 ? 'Safe Zone' : stock.zscore >= 1.8 ? 'Gray Zone' : 'Distress Zone'}
                                                </span>
                                            </div>
                                            <span className="text-4xl font-bold text-green-600">{stock.zscore?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Metrics */}
                            <div className="grid grid-cols-4 gap-4">
                                <MetricCard title="P/E Ratio" value={stock.pe?.toFixed(1)} subtitle="Price to earnings" badge={stock.pe < 20 ? 'Undervalued' : 'Fair'} badgeColor={stock.pe < 20 ? 'green' : 'yellow'} />
                                <MetricCard title="EPS" value={`$${stock.eps}`} subtitle="Earnings per share" badge="Strong" badgeColor="green" />
                                <MetricCard title="ROA" value={`${stock.roa}%`} subtitle="Return on assets" badge={stock.roa >= 10 ? 'Excellent' : 'Good'} badgeColor={stock.roa >= 10 ? 'green' : 'yellow'} />
                                <MetricCard title="FCF" value={`$${stock.fcf}`} subtitle="Free cash flow (M)" badge="Healthy" badgeColor="green" />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}