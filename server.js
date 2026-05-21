const express = require('express');
const { GoogleGenAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());

// Correct way to initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message provided" });

        // Correct model retrieval method
        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash"
        });

        // Generate text response using system prompting directly inside the request
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: message }] }],
            systemInstruction: "You are a classic Roblox Noob. You love bacon hairs, use 2012 Roblox slang like 'pwned', 'oof', and 'epic', and you are very friendly."
        });
        
        const responseText = result.response.text();
        res.json({ response: responseText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
