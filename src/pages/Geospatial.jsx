import React, { useState, useMemo } from 'react';
import { 
    Globe, Building2, Scale, Shield, Users, DollarSign, Heart, GraduationCap, 
    Home, Palette, TrendingUp, Percent, Ship, Briefcase, HardHat, Wrench,
    Plane, Package, Pickaxe, MapPin, Search, RefreshCw, ChevronRight, ArrowUp, ArrowDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import InteractiveMap from '../components/geospatial/InteractiveMap';

const DOMAINS = [
    { id: 'governance', name: 'Governance', icon: Building2, color: '#6366F1' },
    { id: 'economy', name: 'Economy', icon: TrendingUp, color: '#22C55E' },
    { id: 'health', name: 'Health', icon: Heart, color: '#EC4899' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: '#10B981' },
    { id: 'defense', name: 'Defense', icon: Shield, color: '#EF4444' },
    { id: 'trade', name: 'Trade', icon: Ship, color: '#3B82F6' },
    { id: 'labor', name: 'Labor', icon: Briefcase, color: '#F97316' },
    { id: 'tourism', name: 'Tourism', icon: Plane, color: '#0EA5E9' },
];

const REGIONS = [
    { id: 'north-america', name: 'North America', countries: ['USA', 'Canada', 'Mexico'] },
    { id: 'europe', name: 'Europe', countries: ['UK', 'Germany', 'France', 'Italy', 'Spain'] },
    { id: 'asia-pacific', name: 'Asia Pacific', countries: ['China', 'Japan', 'India', 'Australia', 'South Korea'] },
    { id: 'latin-america', name: 'Latin America', countries: ['Brazil', 'Argentina', 'Chile', 'Colombia'] },
    { id: 'middle-east', name: 'Middle East', countries: ['UAE', 'Saudi Arabia', 'Israel', 'Qatar'] },
    { id: 'africa', name: 'Africa', countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt'] },
];

const generateCountryData = () => {
    return REGIONS.flatMap(r => r.countries.map(country => ({
        country,
        region: r.name,
        regionId: r.id,
        score: Math.round(40 + Math.random() * 55),
        change: Math.round((Math.random() - 0.5) * 20),
        trend: Array.from({ length: 8 }, () => Math.round(40 + Math.random() * 50)),
    })));
};

export default function Geospatial() {
    const [activeDomain, setActiveDomain] = useState('economy');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    
    const countryData = useMemo(() => generateCountryData(), []);
    
    const filteredCountries = useMemo(() => {
        let data = [...countryData];
        if (selectedRegion !== 'all') {
            data = data.filter(c => c.regionId === selectedRegion);
        }
        if (searchQuery) {
            data = data.filter(c => c.country.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return data.sort((a, b) => b.score - a.score);
    }, [countryData, selectedRegion, searchQuery]);

    const domainInfo = DOMAINS.find(d => d.id === activeDomain);
    const topCountries = filteredCountries.slice(0, 5);
    const avgScore = Math.round(filteredCountries.reduce((sum, c) => sum + c.score, 0) / filteredCountries.length);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Geospatial Intelligence</h1>
                            <p className="text-sm text-gray-500">Compare countries across {DOMAINS.length} domains</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                                placeholder="Search countries..." className="pl-9 w-48 bg-white" />
                        </div>
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                            <SelectTrigger className="w-40 bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                {REGIONS.map(r => (
                                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Domain Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {DOMAINS.map(domain => {
                        const Icon = domain.icon;
                        return (
                            <button key={domain.id} onClick={() => setActiveDomain(domain.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                                    activeDomain === domain.id
                                        ? 'bg-white shadow-md text-gray-900 border-2'
                                        : 'bg-white/50 text-gray-600 hover:bg-white border border-gray-200'
                                }`}
                                style={{ borderColor: activeDomain === domain.id ? domain.color : undefined }}>
                                <Icon className="w-4 h-4" style={{ color: domain.color }} />
                                <span className="font-medium text-sm">{domain.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map */}
                    <div className="lg:col-span-2">
                        <InteractiveMap 
                            countryData={countryData} 
                            activeDomain={activeDomain} 
                            selectedRegion={selectedRegion}
                            onSelectCountry={setSelectedCountry}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Summary Stats */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <domainInfo.icon className="w-4 h-4" style={{ color: domainInfo?.color }} />
                                {domainInfo?.name} Overview
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-gray-50">
                                    <p className="text-2xl font-bold" style={{ color: domainInfo?.color }}>{avgScore}</p>
                                    <p className="text-xs text-gray-500">Avg Score</p>
                                </div>
                                <div className="p-3 rounded-lg bg-gray-50">
                                    <p className="text-2xl font-bold text-gray-900">{filteredCountries.length}</p>
                                    <p className="text-xs text-gray-500">Countries</p>
                                </div>
                            </div>
                        </div>

                        {/* Top Rankings */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Top Countries</h3>
                            <div className="space-y-2">
                                {topCountries.map((country, i) => (
                                    <div key={country.country} 
                                        onClick={() => setSelectedCountry(country)}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                                            selectedCountry?.country === country.country 
                                                ? 'bg-purple-50 border border-purple-200' 
                                                : 'hover:bg-gray-50'
                                        }`}>
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                            i < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                        }`}>{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm truncate">{country.country}</p>
                                            <p className="text-xs text-gray-500">{country.region}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm" style={{ color: domainInfo?.color }}>{country.score}</p>
                                            <p className={`text-xs font-medium ${country.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {country.change >= 0 ? '+' : ''}{country.change}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Selected Country Detail */}
                        {selectedCountry && (
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-900">{selectedCountry.country}</h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{selectedCountry.region}</span>
                                </div>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold" style={{ color: domainInfo?.color }}>{selectedCountry.score}</p>
                                        <p className="text-xs text-gray-500">Score</p>
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                                        selectedCountry.change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                        {selectedCountry.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                        <span className="text-sm font-medium">{Math.abs(selectedCountry.change)}%</span>
                                    </div>
                                </div>
                                <div className="h-20">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={selectedCountry.trend.map((v, i) => ({ i, v }))}>
                                            <Area type="monotone" dataKey="v" stroke={domainInfo?.color} fill={`${domainInfo?.color}30`} strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Country Comparison Bar Chart */}
                <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Country Comparison - {domainInfo?.name}</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredCountries.slice(0, 10)} layout="vertical">
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis type="category" dataKey="country" width={80} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="score" fill={domainInfo?.color} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}