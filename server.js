const express = require('express');
const { GoogleAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());

// Fixed: Using the correct GoogleAI class constructor
const ai = new GoogleAI({ apiKey: process.env.GEMINI_API_KEY });

// This route handles what the Roblox script sends
app.post('/v1/chat/completions', async (req, res) => {
    try {
        const messages = req.body.messages;
        const userMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "Hello";

        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are a classic 2012 Roblox Noob. You love bacon hairs, use slang like 'pwned', 'oof', 'epic', 'XD', and ':P', and you are very friendly."
        });

        const result = await model.generateContent(userMessage);
        const responseText = result.response.text();

        // Sends it back formatted exactly like OpenAI so Roblox understands it perfectly
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

// Backup route
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
