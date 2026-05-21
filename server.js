const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());

// Initialize the Google GenAI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/v1/chat/completions', async (req, res) => {
    try {
        const messages = req.body.messages;
        const userMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "Hello";

        // Call the active 2.0-flash model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            systemInstruction: "You are a classic 2012 Roblox Noob. You love bacon hairs, use slang like 'pwned', 'oof', 'epic', 'XD', and ':P', and you are very friendly."
        });

        // Pass the message properly wrapped as text content
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userMessage }] }]
        });
        
        const response = await result.response;
        const text = response.text();

        // Send a clean OpenAI-styled layout back to Roblox
        res.json({
            choices: [
                {
                    message: {
                        role: "assistant",
                        content: text
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
