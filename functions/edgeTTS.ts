import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import MsEdgeTTS from 'npm:msedge-tts@1.3.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { text, voice = 'en-US-AriaNeural' } = await req.json();
        
        if (!text) {
            return Response.json({ error: 'Text is required' }, { status: 400 });
        }

        // Truncate text if too long
        const maxChars = 10000;
        const truncatedText = text.length > maxChars ? text.substring(0, maxChars) + '...' : text;

        // Create TTS instance
        const tts = new MsEdgeTTS();
        await tts.setMetadata(voice, MsEdgeTTS.OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
        
        // Generate audio
        const { audioBuffer } = await tts.toArrayBuffer(truncatedText);
        
        // Convert to base64
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

        return Response.json({ 
            audio: base64Audio,
            format: 'mp3',
            voice: voice
        });

    } catch (error) {
        console.error('Edge TTS error:', error);
        
        // Fallback: Try Google TTS translate API
        try {
            const { text, voice = 'en-US-AriaNeural' } = await req.json().catch(() => ({}));
            const lang = voice.startsWith('en-GB') ? 'en-gb' : 'en-us';
            
            // Use Google Translate TTS as fallback (limited but works)
            const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.substring(0, 200))}&tl=${lang}&client=tw-ob`;
            
            const response = await fetch(googleTtsUrl);
            if (response.ok) {
                const audioBuffer = await response.arrayBuffer();
                const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
                return Response.json({ 
                    audio: base64Audio,
                    format: 'mp3',
                    voice: 'google-fallback'
                });
            }
        } catch (fallbackError) {
            console.error('Fallback TTS also failed:', fallbackError);
        }
        
        return Response.json({ error: error.message }, { status: 500 });
    }
});