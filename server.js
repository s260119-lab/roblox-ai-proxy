const express = require('express');
const { GoogleGenAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());

// FIXED CLIENT INITIALIZATION (Best practice format)
const ai = new GoogleGenAI({});

app.post('/v1/chat/completions', async (req, res) => {
    try {
        const messages = req.body.messages;
        const userMessage = messages && messages[messages.length - 1] ? messages[messages.length - 1].content : "Hi";

        // FIXED CHAT METHOD: Using the proper models.generateContent format
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userMessage,
            config: {
                systemInstruction: "You are a classic, silly Roblox Noob NPC. Use lots of typos, say things like 'hai', 'ur', 'wat', and use emoticons like :D, :3, and xD. Keep responses short and enthusiastic!"
            }
        });

        const responseText = response.text;

        // Formatted exactly so your current Roblox script thinks it's talking to OpenAI
        res.json({
            choices: [{
                message: {
                    role: "assistant",
                    content: responseText
                }
            }]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy translation running on port ${PORT}`));
