
require("dotenv").config();
const {Groq} = require("groq-sdk");

const groq = new Groq({
    apiKey:process.env.GROQ_API_KEY,
})


exports.getExplanation = async (req, res) => {
    const { code, messages, userMessage } = req.body;
  
    const promptMessages = [
      {
        role: "system",
        content: "You are an expert frontend mentor. Explain the styling part of the component in brief."
      },
      {
        role: "user",
        content: `Here is the JSX code:\n\n${code}`
      },
      ...(messages || []), 
      {
        role: "user",
        content: userMessage
      }
    ];
  
    try {
      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: promptMessages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1
      });
  
      const reply = chatCompletion.choices[0].message.content;
  
      res.status(200).json({
        success: true,
        message: reply
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Internal error occurred during API call to LLM"
      });
    }
  };
  