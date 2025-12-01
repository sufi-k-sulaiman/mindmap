import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import edge_tts from 'npm:edge-tts@1.0.3';

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

        console.log(`Generating TTS: ${text.substring(0, 50)}...`);

        // Use edge-tts npm package
        const tts = new edge_tts.Communicate(text, voice);
        const chunks = [];
        
        for await (const chunk of tts.stream()) {
            if (chunk.type === "audio") {
                chunks.push(chunk.data);
            }
        }

        // Combine all audio chunks
        const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
        const audioData = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            audioData.set(new Uint8Array(chunk), offset);
            offset += chunk.length;
        }

        // Convert to base64
        let binary = "";
        for (let i = 0; i < audioData.length; i++) {
            binary += String.fromCharCode(audioData[i]);
        }
        const base64Audio = btoa(binary);

        console.log(`Generated ${audioData.length} bytes`);

        return Response.json({
            audio: base64Audio,
            format: "mp3",
            bytes: audioData.length
        });

    } catch (error) {
        console.error("TTS Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});