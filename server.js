const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const app = express();

app.use(express.json());

// This matches the exact @google/genai library constructor format!
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// This route handles what the Roblox script sends
app.post('/v1/chat/completions', async (req, res) => {
    try {
        const messages = req.body.messages;
        const userMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "Hello";

        // Using the updated library models syntax
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: userMessage,
            config: {
                systemInstruction: "You are a classic 2012 Roblox Noob. You love bacon hairs, use slang like 'pwned', 'oof', 'epic', 'XD', and ':P', and you are very friendly."
            }
        });

        // Sends it back formatted exactly like OpenAI so Roblox understands it perfectly
        res.json({
            choices: [
                {
                    message: {
                        role: "assistant",
                        content: response.text
                    }
                }
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Backup route
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: message
        });
        res.json({ response: response.text });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
