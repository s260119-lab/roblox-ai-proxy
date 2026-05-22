const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// Initialize Google Gen AI using the environment variable from your Render dashboard
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This matches the exact URL path your Roblox script is hitting
app.post('/v1/chat/completions', async (req, res) => {
    try {
        const messages = req.body.messages;
        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: "No messages found in request body" });
        }

        // Extract the latest chat message sent by the player in Roblox
        const userMessage = messages[messages.length - 1].content;

        // UPDATED PERSONALITY: Changed from retro noob to an engaging, friendly social game host
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            systemInstruction: `You are an upbeat, friendly, and highly engaging host of this Roblox Social Baseplate game. 
            Talk like a normal, modern Roblox player—casual, cool, and welcoming. Do NOT use old 2012 slang like 'oof' or 'rawr'.
            Your main goal is to keep players entertained and talking. Always be helpful, ask open-ended questions about what they like to build, who they are hanging out with, or what kind of music they like. 
            Keep your responses concise (1-3 short sentences max) so it fits beautifully inside an in-game text GUI.`
        });

        // Request the text generation from Google
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const aiText = response.text();

        // Send response back in the OpenAI data structure your Roblox script reads
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
        console.error("CRITICAL GEMINI ERROR:", error);
        res.status(500).json({ error: "Something went wrong with Gemini" });
    }
});

// Bind to the automatic port Render assigns, or default to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server actively running on port ${PORT}`));
