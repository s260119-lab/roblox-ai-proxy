const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const app = express();

app.use(express.json());

// Initialize the new Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// This route acts as the translator for your Roblox script
app.post('/v1/chat/completions', async (req, res) => {
    try {
        const messages = req.body.messages;
        const userMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "Hello";

        // Call the official generateContent method using the new SDK structure
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: userMessage,
            config: {
                systemInstruction: "You are a classic 2012 Roblox Noob. You love bacon hairs, use slang like 'pwned', 'oof', 'epic', 'XD', and ':P', and you are very friendly."
            }
        });

        // Format the response like OpenAI so Roblox reads it cleanly
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
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Something went wrong with Gemini" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
