const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());

// This is the absolute correct official constructor name!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/v1/chat/completions', async (req, res) => {
    try {
        const messages = req.body.messages;
        const userMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "Hello";

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are a classic 2012 Roblox Noob. You love bacon hairs, use slang like 'pwned', 'oof', 'epic', 'XD', and ':P', and you are very friendly."
        });

        const result = await model.generateContent(userMessage);
        const responseText = result.response.text();

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
