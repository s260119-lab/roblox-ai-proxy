const express = require('express');
const { GoogleGenAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());

// FIXED LINE: This correctly matches how the software starts up
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

app.post('/v1/chat/completions', async (req, res) => {
    try {
        const messages = req.body.messages;
        const userMessage = messages && messages[messages.length - 1] ? messages[messages.length - 1].content : "Hi";

        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are a classic, silly Roblox Noob NPC. Use lots of typos, say things like 'hai', 'ur', 'wat', and use emoticons like :D, :3, and xD. Keep responses short and enthusiastic!"
        });

        const result = await model.generateContent(userMessage);
        const responseText = result.response.text();

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
