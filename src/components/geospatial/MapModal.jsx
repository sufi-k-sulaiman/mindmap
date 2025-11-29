import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Loader2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import GeospatialMap from './GeospatialMap';
import { base44 } from '@/api/base44Client';

const USE_CASE_CONTEXT = {
    carbon: {
        title: 'Carbon Hotspots',
        description: 'Global CO2 emission concentrations and climate impact zones'
    },
    forests: {
        title: 'Forest Coverage',
        description: 'Global forest density, deforestation rates, and biodiversity zones'
    },
    resources: {
        title: 'Natural Resources',
        description: 'Mining sites, energy reserves, and extraction impact areas'
    }
};

export default function MapModal({ isOpen, onClose, title, icon: Icon, iconColor, useCase, mapType }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && useCase) {
            fetchAnalysis();
        }
    }, [isOpen, useCase]);

    const fetchAnalysis = async () => {
        setLoading(true);
        try {
            const context = USE_CASE_CONTEXT[useCase] || { title: useCase, description: '' };
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Provide a detailed 2024 analysis for ${context.title} (${context.description}).

Include:
1. Current Status: What's happening globally right now with specific numbers (gigatons, hectares, percentages)
2. Key Impacts: How this is affecting the environment and ecosystems with real data
3. Good Actors (5): Countries/organizations making positive impact with specific achievements and data
4. Bad Actors (5): Countries/corporations causing harm with specific violations and data

Use real 2024 data. Be specific with numbers, dates, and measurable impacts.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        current_status: { type: "string" },
                        key_impacts: { type: "array", items: { type: "string" } },
                        good_actors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    achievement: { type: "string" },
                                    data: { type: "string" }
                                }
                            }
                        },
                        bad_actors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    issue: { type: "string" },
                                    data: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setAnalysis(response);
        } catch (err) {
            console.error('Error fetching analysis:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0" style={{ zIndex: 9999 }}>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${iconColor}20` }}
                            >
                                <Icon className="w-5 h-5" style={{ color: iconColor }} />
                            </div>
                        )}
                        <div>
                            <h2 className="font-semibold text-gray-900">{title}</h2>
                            <p className="text-sm text-gray-500">{USE_CASE_CONTEXT[useCase]?.description || mapType + ' view'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onClose(false)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4">
                    {/* Map */}
                    <div className="rounded-xl overflow-hidden border border-gray-200 mb-4" style={{ position: 'relative', zIndex: 1 }}>
                        <GeospatialMap 
                            useCase={useCase}
                            mapType={mapType}
                            height="400px"
                            color={iconColor}
                        />
                    </div>

                    {/* Analysis Section */}
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-purple-600 animate-spin mr-3" />
                            <span className="text-gray-600">Analyzing {title}...</span>
                        </div>
                    ) : analysis ? (
                        <div className="space-y-4">
                            {/* Current Status */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" style={{ color: iconColor }} />
                                    Current Status
                                </h3>
                                <p className="text-gray-700">{analysis.current_status}</p>
                            </div>

                            {/* Key Impacts */}
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                <h3 className="font-semibold text-amber-800 mb-2">Key Impacts</h3>
                                <ul className="space-y-1">
                                    {analysis.key_impacts?.map((impact, i) => (
                                        <li key={i} className="text-amber-900 flex items-start gap-2">
                                            <span className="text-amber-500 mt-1">•</span>
                                            {impact}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Good & Bad Actors */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Good Actors */}
                                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                    <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Good Actors
                                    </h3>
                                    <div className="space-y-3">
                                        {analysis.good_actors?.map((actor, i) => (
                                            <div key={i} className="bg-white rounded-lg p-3 border border-green-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                    <span className="font-medium text-green-900">{actor.name}</span>
                                                </div>
                                                <p className="text-green-800 mb-1">{actor.achievement}</p>
                                                <p className="text-green-600 text-sm font-medium">{actor.data}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bad Actors */}
                                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                                    <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Bad Actors
                                    </h3>
                                    <div className="space-y-3">
                                        {analysis.bad_actors?.map((actor, i) => (
                                            <div key={i} className="bg-white rounded-lg p-3 border border-red-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                                    <span className="font-medium text-red-900">{actor.name}</span>
                                                </div>
                                                <p className="text-red-800 mb-1">{actor.issue}</p>
                                                <p className="text-red-600 text-sm font-medium">{actor.data}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}