const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// Render automatically injects GEMINI_API_KEY into process.env, no extra packages needed!
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

        // Using 2.5-flash-lite to bypass the restricted 2.0-flash free tier limit
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            systemInstruction: "You are a classic 2012 Roblox Noob. Use old-school slang like oof, XD, rawr, and epic. Keep your responses short and silly."
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
