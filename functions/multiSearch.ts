import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { query } = await req.json();
        
        if (!query || !query.trim()) {
            return Response.json({ error: 'Query is required' }, { status: 400 });
        }

        // Use LLM with internet context to search across multiple engines
        const searchPrompt = `Search the web thoroughly for: "${query}"

Provide comprehensive search results from multiple sources. For each result include:
- Title
- URL/Link
- Brief description/snippet

Organize results by perceived source/category. Find at least 15-20 diverse results from different websites and sources.`;

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: searchPrompt,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    results: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                url: { type: "string" },
                                snippet: { type: "string" },
                                source: { type: "string" }
                            }
                        }
                    },
                    total_results: { type: "number" },
                    query: { type: "string" }
                }
            }
        });

        // Also try direct fetch from DuckDuckGo API (one of few that allows direct queries)
        let duckDuckGoResults = [];
        try {
            const ddgResponse = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
            if (ddgResponse.ok) {
                const ddgData = await ddgResponse.json();
                if (ddgData.RelatedTopics) {
                    duckDuckGoResults = ddgData.RelatedTopics
                        .filter(t => t.FirstURL)
                        .slice(0, 10)
                        .map(t => ({
                            title: t.Text?.split(' - ')[0] || t.Text,
                            url: t.FirstURL,
                            snippet: t.Text,
                            source: 'DuckDuckGo'
                        }));
                }
            }
        } catch (e) {
            console.log('DuckDuckGo API error:', e);
        }

        // Combine results
        const allResults = [
            ...(response?.results || []),
            ...duckDuckGoResults
        ];

        // Remove duplicates by URL
        const uniqueResults = allResults.reduce((acc, curr) => {
            if (!acc.find(r => r.url === curr.url)) {
                acc.push(curr);
            }
            return acc;
        }, []);

        return Response.json({
            query: query,
            results: uniqueResults,
            total_results: uniqueResults.length,
            engines_queried: ['Web Search (AI)', 'DuckDuckGo API']
        });

    } catch (error) {
        console.error('Multi-search error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});