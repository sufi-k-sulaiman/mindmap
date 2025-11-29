import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { url } = await req.json();
        
        if (!url || !url.startsWith('http')) {
            return Response.json({ valid: false });
        }

        try {
            const response = await fetch(url, { 
                method: 'HEAD',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                redirect: 'follow'
            });
            
            // Check if status is 2xx or 3xx (success or redirect)
            const valid = response.status >= 200 && response.status < 400;
            return Response.json({ valid, status: response.status });
        } catch (fetchError) {
            // Try GET if HEAD fails (some servers don't support HEAD)
            try {
                const response = await fetch(url, { 
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    redirect: 'follow'
                });
                const valid = response.status >= 200 && response.status < 400;
                return Response.json({ valid, status: response.status });
            } catch {
                return Response.json({ valid: false, error: 'Network error' });
            }
        }
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});