import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * SmartTTS - Edge TTS for Deno
 * Based on Python edge-tts library logic
 * Returns MP3 audio (Deno serverless can't do format conversion)
 */

const VOICES = {
    'en-US-AriaNeural': { name: 'Aria', gender: 'female', locale: 'US' },
    'en-US-GuyNeural': { name: 'Guy', gender: 'male', locale: 'US' },
    'en-GB-SoniaNeural': { name: 'Sonia', gender: 'female', locale: 'UK' },
    'en-GB-RyanNeural': { name: 'Ryan', gender: 'male', locale: 'UK' },
    'en-AU-NatashaNeural': { name: 'Natasha', gender: 'female', locale: 'AU' },
    'en-AU-WilliamNeural': { name: 'William', gender: 'male', locale: 'AU' },
};

// Edge TTS WebSocket endpoint
const EDGE_TTS_URL = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1';
const TRUSTED_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';

async function textToSpeechEdge(text, voice, rate = 0, pitch = 0) {
    const requestId = crypto.randomUUID().replace(/-/g, '');
    const wsUrl = `${EDGE_TTS_URL}?TrustedClientToken=${TRUSTED_TOKEN}&ConnectionId=${requestId}`;
    
    return new Promise((resolve, reject) => {
        const audioChunks = [];
        const ws = new WebSocket(wsUrl);
        ws.binaryType = 'arraybuffer';
        
        const timeout = setTimeout(() => {
            ws.close();
            reject(new Error('Timeout'));
        }, 30000);
        
        ws.onopen = () => {
            // Config message
            ws.send(`Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-96kbitrate-mono-mp3"}}}}`);
            
            // SSML message
            const rateStr = rate >= 0 ? `+${rate}%` : `${rate}%`;
            const pitchStr = pitch >= 0 ? `+${pitch}Hz` : `${pitch}Hz`;
            const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voice}'><prosody pitch='${pitchStr}' rate='${rateStr}'>${escapeXml(text)}</prosody></voice></speak>`;
            
            ws.send(`X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date().toISOString()}Z\r\nPath:ssml\r\n\r\n${ssml}`);
        };
        
        ws.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                const data = new Uint8Array(event.data);
                const headerEnd = findHeaderEnd(data);
                if (headerEnd !== -1 && headerEnd < data.length) {
                    audioChunks.push(data.slice(headerEnd));
                }
            } else if (typeof event.data === 'string' && event.data.includes('Path:turn.end')) {
                clearTimeout(timeout);
                ws.close();
                
                // Combine chunks
                const total = audioChunks.reduce((s, c) => s + c.length, 0);
                const combined = new Uint8Array(total);
                let offset = 0;
                for (const chunk of audioChunks) {
                    combined.set(chunk, offset);
                    offset += chunk.length;
                }
                resolve(combined);
            }
        };
        
        ws.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('WebSocket error'));
        };
        
        ws.onclose = (e) => {
            clearTimeout(timeout);
            if (audioChunks.length === 0) {
                reject(new Error('No audio received'));
            }
        };
    });
}

function escapeXml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function findHeaderEnd(data) {
    for (let i = 0; i < data.length - 3; i++) {
        if (data[i] === 0x0D && data[i+1] === 0x0A && data[i+2] === 0x0D && data[i+3] === 0x0A) {
            return i + 4;
        }
    }
    return -1;
}

// Generate silence (0.8s pause between paragraphs)
function generateSilence(ms = 800) {
    const frames = Math.ceil(ms / 26);
    const frame = new Uint8Array([0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const silence = new Uint8Array(frames * frame.length);
    for (let i = 0; i < frames; i++) silence.set(frame, i * frame.length);
    return silence;
}

function toBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
    }

    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const { text, paragraphs: inputParas, voice = 'en-US-AriaNeural', rate = 0, pitch = 0, pauseMs = 800, listVoices = false } = await req.json();

        if (listVoices) {
            return Response.json({ voices: Object.entries(VOICES).map(([id, info]) => ({ id, ...info })) });
        }

        // Split text into paragraphs
        const paragraphs = inputParas || (text ? text.split(/\n\s*\n|\n/).map(p => p.trim()).filter(p => p) : []);
        if (!paragraphs.length) return Response.json({ error: 'No text provided' }, { status: 400 });

        console.log(`Generating ${paragraphs.length} paragraphs with ${voice}...`);

        // Generate audio for each paragraph
        const segments = [];
        const silence = generateSilence(pauseMs);

        for (let i = 0; i < paragraphs.length; i++) {
            console.log(`Paragraph ${i + 1}/${paragraphs.length}...`);
            const audio = await textToSpeechEdge(paragraphs[i], voice, rate, pitch);
            segments.push(audio);
            if (i < paragraphs.length - 1) segments.push(silence);
        }

        // Combine all segments
        const totalSize = segments.reduce((s, seg) => s + seg.length, 0);
        const combined = new Uint8Array(totalSize);
        let offset = 0;
        for (const seg of segments) {
            combined.set(seg, offset);
            offset += seg.length;
        }

        console.log(`Done! ${totalSize} bytes`);

        return Response.json({
            audio: toBase64(combined),
            format: 'mp3',
            voice,
            paragraphs: paragraphs.length,
            bytes: totalSize
        });

    } catch (error) {
        console.error('TTS Error:', error);
        return Response.json({ error: error.message || 'TTS failed' }, { status: 500 });
    }
});