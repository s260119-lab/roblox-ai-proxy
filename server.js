const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// Initialize Google Gen AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/v1/chat/completions', async (req, res) => {
    try {
        const messages = req.body.messages;
        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: "No messages found" });
        }

        const userMessage = messages[messages.length - 1].content;

        // FIXED STRUCT: This is the exact correct layout for this SDK version
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite" 
        });

        // We pass the system instruction right inside the generation config to prevent initialization crashes
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            generationConfig: {
                systemInstruction: "You are a casual, modern, friendly host of this Roblox social baseplate game. Speak like a normal modern player. Do NOT use retro 2012 slang like oof or rawr. Keep answers short (1-3 sentences max) and always ask the player an engaging question to keep them talking."
            }
        });

        const response = await result.response;
        const aiText = response.text();

        res.json({
            choices: [
                {
                    message: {
                        role: "assistant",
                        content: aiText
                    }
                }
            ]
        });

    } catch (error) {
        console.error("PROXY ERROR:", error);
        res.status(500).json({ error: "Something went wrong with Gemini" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
