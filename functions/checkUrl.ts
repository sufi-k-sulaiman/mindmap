import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Common 404 page indicators in HTML content
const NOT_FOUND_PATTERNS = [
    /page\s*(not|was\s*not)\s*found/i,
    /404\s*(error|not\s*found)?/i,
    /does\s*n[o']t\s*exist/i,
    /no\s*longer\s*(available|exists)/i,
    /article\s*(not|was\s*not)\s*found/i,
    /content\s*(not|is\s*not)\s*available/i,
    /<title>[^<]*404[^<]*<\/title>/i,
    /<title>[^<]*not\s*found[^<]*<\/title>/i,
    /class="[^"]*error-?404[^"]*"/i,
    /id="[^"]*404[^"]*"/i,
];

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { url } = await req.json();
        
        if (!url || !url.startsWith('http')) {
            return Response.json({ valid: false, reason: 'Invalid URL format' });
        }

        try {
            // First try HEAD to check status code
            const headResponse = await fetch(url, { 
                method: 'HEAD',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                redirect: 'follow'
            });
            
            // If server returns actual 404/5xx, it's definitely invalid
            if (headResponse.status >= 400) {
                return Response.json({ valid: false, status: headResponse.status, reason: 'HTTP error status' });
            }

            // For 200 responses, we need to check if it's a soft 404 (SPA returning 200 for non-existent pages)
            // Do a GET request and check the content
            const getResponse = await fetch(url, { 
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                redirect: 'follow'
            });

            if (getResponse.status >= 400) {
                return Response.json({ valid: false, status: getResponse.status, reason: 'HTTP error status' });
            }

            // Check content for soft 404 patterns
            const contentType = getResponse.headers.get('content-type') || '';
            if (contentType.includes('text/html')) {
                const html = await getResponse.text();
                
                // Check if the page contains 404 indicators (soft 404 detection)
                for (const pattern of NOT_FOUND_PATTERNS) {
                    if (pattern.test(html)) {
                        return Response.json({ valid: false, status: 200, reason: 'Soft 404 detected' });
                    }
                }
                
                // Check if HTML is suspiciously short (might be an error page)
                if (html.length < 500) {
                    return Response.json({ valid: false, status: 200, reason: 'Page content too short' });
                }
            }

            return Response.json({ valid: true, status: getResponse.status });
            
        } catch (fetchError) {
            return Response.json({ valid: false, error: 'Network error', details: fetchError.message });
        }
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});