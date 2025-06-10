
require("dotenv").config();
const {Groq} = require("groq-sdk");

const groq = new Groq({
    apiKey:process.env.GROQ_API_KEY,
})

exports.playgroundLayout = async (req, res) => {
    

    const prompt = [
        {
            role: "system",
            content: `
You are a layout generator. You will be provided with a list of UI components and their (x, y) positions on a canvas.

Your task is to:
- Generate a complete React code using modern React with functional components.
- Use Tailwind CSS for styling.
- Place the components in the layout exactly as per the provided coordinates.
- Assume standard sizes for components like buttons, navbars, and cards unless specified otherwise.
- Ensure the layout looks visually similar to the given positions on the canvas.
- Use absolute positioning in CSS to place the components at the exact (x, y) positions.

Input format:
Each component will have:
- "code": the JSX code of the component.
- "x": the x-coordinate.
- "y": the y-coordinate.

Please return the complete React component code that renders this layout.
`
        },
        req.body
    ];

    try {
        const layoutCode = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: prompt,
            temperature: 0.7,
            max_tokens: 2048,
            top_p: 1
        });

        const reply = layoutCode.choices[0].message.content;

        res.status(200).json({
            success: true,
            code: reply
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Could not get response from LLM"
        });
    }
};
