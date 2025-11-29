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
    } catch (e) {
        return 'Recently';
    }
}

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    try {
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized', articles: [] }, { status: 401 });
        }

        let body = {};
        try {
            body = await req.json();
        } catch (e) {}
        
        const { query, category, limit = 15, refresh = false } = body;
        const searchTerm = query || category || 'technology';
        
        // First, try to get cached articles from database
        if (!refresh) {
            try {
                const cached = await base44.asServiceRole.entities.NewsArticle.filter(
                    { category: searchTerm },
                    '-created_date',
                    limit
                );
                
                if (cached && cached.length > 0) {
                    const articles = cached.map(a => ({
                        title: a.title,
                        source: a.source || 'News',
                        summary: a.summary || '',
                        url: a.url || '',
                        time: formatTime(a.published_at),
                        image_url: a.image_url
                    }));
                    
                    return Response.json({
                        success: true,
                        count: articles.length,
                        articles: articles,
                        cached: true
                    });
                }
            } catch (cacheError) {
                console.log('Cache check failed:', cacheError.message);
            }
        }
        
        // If no cache or refresh requested, fetch from NewsAPI
        if (!NEWSAPI_KEY) {
            return Response.json({
                success: false,
                error: 'NewsAPI key not configured',
                articles: []
            });
        }
        
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchTerm)}&sortBy=publishedAt&pageSize=${limit}&language=en&apiKey=${NEWSAPI_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status !== 'ok' || !data.articles) {
            return Response.json({
                success: false,
                error: data.message || 'Failed to fetch news',
                articles: []
            });
        }
        
        const articles = data.articles
            .filter(a => a.title && a.title !== '[Removed]')
            .map(a => ({
                title: a.title,
                source: a.source?.name || 'News',
                summary: a.description || '',
                url: a.url || '',
                time: formatTime(a.publishedAt),
                published_at: a.publishedAt
            }));
        
        // Save to database for caching
        try {
            // Delete old articles for this category
            const oldArticles = await base44.asServiceRole.entities.NewsArticle.filter({ category: searchTerm });
            for (const old of oldArticles) {
                await base44.asServiceRole.entities.NewsArticle.delete(old.id);
            }
            
            // Save new articles
            for (const article of articles.slice(0, limit)) {
                await base44.asServiceRole.entities.NewsArticle.create({
                    title: article.title,
                    source: article.source,
                    summary: article.summary,
                    url: article.url,
                    category: searchTerm,
                    published_at: article.published_at
                });
            }
        } catch (saveError) {
            console.log('Failed to cache articles:', saveError.message);
        }
        
        return Response.json({
            success: true,
            count: articles.length,
            articles: articles,
            cached: false
        });
        
    } catch (error) {
        console.error('fetchNews error:', error.message);
        return Response.json({ 
            success: false, 
            error: error.message,
            articles: [] 
        });
    }
});