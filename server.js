const express = require('express');
const { GoogleGenAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());

// Initialize Gemini safely
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// This route handles what the Roblox script is sending!
app.post('/v1/chat/completions', async (req, res) => {
    try {
        // Grab the message your Roblox script sent
        const messages = req.body.messages;
        const userMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "Hello";

        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are a classic 2012 Roblox Noob. You love bacon hairs, use slang like 'pwned', 'oof', 'epic', 'XD', and ':P', and you are very friendly."
        });

        const result = await model.generateContent(userMessage);
        const responseText = result.response.text();

        // Send it back disguised as an OpenAI response so the Roblox script understands it!
        res.json({
            choices: [
                {
                    message: {
                        role: "assistant",
                        content: responseText
                    }
                }
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// A quick backup route just in case
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        res.json({ response: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
