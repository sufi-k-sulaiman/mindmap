import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Edge TTS voices
const VOICES = {
    "en-US-AriaNeural": "Female (US)",
    "en-US-GuyNeural": "Male (US)",
    "en-GB-SoniaNeural": "Female (UK)",
    "en-GB-RyanNeural": "Male (UK)",
    "en-AU-NatashaNeural": "Female (AU)",
};

// Main Edge-TTS function using WebSocket streaming
async function textToSpeechEdge(text, voice) {
    const wsUrl = "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4";
    
    const escapedText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${voice}">${escapedText}</voice></speak>`;

    const connectionId = crypto.randomUUID().replace(/-/g, "");
    const requestId = crypto.randomUUID().replace(/-/g, "");
    
    const configMsg = `X-RequestId:${connectionId}\r\nPath:speech.config\r\nContent-Type:application/json; charset=utf-8\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":false},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
    const ttsMsg = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml}`;

    const chunks = [];

    return new Promise((resolve, reject) => {
        const ws = new WebSocket(wsUrl);
        
        const timeout = setTimeout(() => {
            ws.close();
            reject(new Error("Timeout"));
        }, 30000);

        ws.onopen = () => {
            ws.send(configMsg);
            ws.send(ttsMsg);
        };

        ws.onmessage = async (event) => {
            if (typeof event.data === "string") {
                if (event.data.includes("Path:turn.end")) {
                    clearTimeout(timeout);
                    ws.close();
                }
            } else {
                // Handle binary data (Blob or ArrayBuffer)
                let arrayBuffer;
                if (event.data instanceof Blob) {
                    arrayBuffer = await event.data.arrayBuffer();
                } else {
                    arrayBuffer = event.data;
                }
                
                const data = new Uint8Array(arrayBuffer);
                
                // Skip the header part (find \r\n\r\n)
                for (let i = 0; i < data.length - 3; i++) {
                    if (data[i] === 13 && data[i+1] === 10 && data[i+2] === 13 && data[i+3] === 10) {
                        if (i + 4 < data.length) {
                            chunks.push(data.slice(i + 4));
                        }
                        break;
                    }
                }
            }
        };

        ws.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("WebSocket error"));
        };

        ws.onclose = () => {
            clearTimeout(timeout);
            if (chunks.length === 0) {
                reject(new Error("No audio data"));
                return;
            }
            
            // Combine chunks
            const total = chunks.reduce((sum, c) => sum + c.length, 0);
            const result = new Uint8Array(total);
            let offset = 0;
            for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.length;
            }
            resolve(result);
        };
    });
}

// Convert Uint8Array to base64
function toBase64(bytes) {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            }
        });
    }

    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { text, voice = "en-US-AriaNeural" } = body;

        if (!text) {
            return Response.json({ error: "No text provided" }, { status: 400 });
        }

        console.log(`Generating TTS for ${text.length} chars with voice ${voice}`);

        const audio = await textToSpeechEdge(text, voice);
        
        console.log(`Generated ${audio.length} bytes`);

        return Response.json({
            audio: toBase64(audio),
            format: "mp3",
            bytes: audio.length
        });

    } catch (error) {
        console.error("TTS Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});