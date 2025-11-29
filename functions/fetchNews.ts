import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const NEWSAPI_KEY = Deno.env.get('NEWSAPI_KEY');

function formatTime(dateStr) {
    if (!dateStr) return 'Recently';
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    } catch {
        return 'Recently';
    }
}

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let body = {};
        try {
            body = await req.json();
        } catch {
            // Empty body is fine
        }
        
        const { query, category, limit = 20 } = body;
        const searchTerm = query || category || 'technology';
        
        // Try LLM first with internet context
        try {
            const llmResponse = await base44.integrations.Core.InvokeLLM({
                prompt: `Find the latest ${limit} news articles about "${searchTerm}". Return real, current news from today or this week.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        articles: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    source: { type: "string" },
                                    summary: { type: "string" },
                                    url: { type: "string" },
                                    publishedAt: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            
            const articles = (llmResponse?.articles || [])
                .filter(a => a.title && a.url)
                .map(a => ({
                    title: a.title,
                    source: a.source || 'News',
                    summary: a.summary || '',
                    url: a.url,
                    time: formatTime(a.publishedAt)
                }));
            
            if (articles.length >= 5) {
                return Response.json({
                    success: true,
                    source: 'llm',
                    count: articles.length,
                    articles: articles,
                });
            }
        } catch (llmError) {
            console.log('LLM fetch failed, trying NewsAPI:', llmError.message);
        }
        
        // Fallback to NewsAPI
        if (NEWSAPI_KEY) {
            try {
                const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchTerm)}&sortBy=publishedAt&pageSize=${limit}&language=en&apiKey=${NEWSAPI_KEY}`;
                
                const response = await fetch(newsApiUrl);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    const articles = (data.articles || [])
                        .filter(a => a.title && a.url && !a.title.includes('[Removed]'))
                        .map(a => ({
                            title: a.title,
                            source: a.source?.name || 'News',
                            summary: a.description || '',
                            url: a.url,
                            time: formatTime(a.publishedAt)
                        }));
                    
                    return Response.json({
                        success: true,
                        source: 'newsapi',
                        count: articles.length,
                        articles: articles,
                    });
                }
            } catch (newsApiError) {
                console.log('NewsAPI fetch failed:', newsApiError.message);
            }
        }
        
        // Both failed
        return Response.json({
            success: false,
            error: 'Unable to fetch news from any source',
            articles: []
        });
        
    } catch (error) {
        console.error('fetchNews error:', error);
        return Response.json({ 
            success: false, 
            error: error.message,
            articles: [] 
        }, { status: 500 });
    }
});