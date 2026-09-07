import { Router } from "express";
import Groq from "groq-sdk";

export const aiRouter = Router();

let groqClient: Groq | null = null;

function getGroq(): Groq | null {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
}

const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// 1. AI Text Enhancer, Code Explainer, & Security Auditor
aiRouter.post("/enhance", async (req, res) => {
  try {
    const { text, mode, tone } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    const groq = getGroq();
    if (!groq) {
      return res.status(503).json({
        error: "GROQ_API_KEY is not configured on the server. Please add your Groq API key to your environment variables.",
      });
    }

    let systemInstruction = "You are an expert developer and technical writer. Improve and polish the following text with high clarity.";

    switch (mode) {
      case "summarize":
        systemInstruction = "Summarize the provided content concisely, highlighting key points, takeaways, and implications with bullet points.";
        break;
      case "grammar":
        systemInstruction = "Fix all grammar, spelling, punctuation, and phrasing issues while strictly preserving the original meaning and technical terms.";
        break;
      case "paraphrase":
        systemInstruction = `Rewrite and paraphrase the provided text in an articulate ${tone || "professional"} tone with rich vocabulary and natural flow.`;
        break;
      case "bullet_points":
        systemInstruction = "Convert the primary ideas, requirements, and steps of the provided text into organized, clean markdown bullet points.";
        break;
      case "bugs":
        systemInstruction = "Perform a rigorous security and logic audit on this code. Detail subtle bugs, edge case vulnerabilities, memory/performance leaks, and provide corrected, secure code.";
        break;
      case "code_explain":
        systemInstruction = "Explain how this code works step-by-step in clear, easy-to-understand terms with Big-O time and space complexity analysis.";
        break;
      case "code_optimize":
        systemInstruction = "Refactor and optimize this code for maximum execution speed, clean architecture, minimal resource footprint, and modern best practices.";
        break;
    }

    const completion = await groq.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: text },
      ],
      temperature: 0.2,
      max_tokens: 3000,
    });

    const resultText = completion.choices[0]?.message?.content || "";

    res.json({
      result: resultText,
      model: DEFAULT_MODEL,
    });
  } catch (error: any) {
    console.error("Groq AI Enhance error:", error);
    res.status(500).json({ error: error.message || "Failed to process text with Groq AI" });
  }
});

// 2. AI Regex Generator & Explainer
aiRouter.post("/regex", async (req, res) => {
  try {
    const { prompt, mode, regex } = req.body;
    const groq = getGroq();
    if (!groq) {
      return res.status(503).json({
        error: "GROQ_API_KEY is not configured on the server. Please add your Groq API key to your environment variables.",
      });
    }

    let userPrompt = "";
    let systemInstruction = "You are a world-class Regular Expression (Regex) specialist. Provide clean, robust, well-explained regex patterns.";

    if (mode === "explain") {
      userPrompt = `Explain this Regular Expression in clear, step-by-step detail with examples of what matches and what does not:\nRegex: \`${regex}\``;
    } else {
      userPrompt = `Create a Regular Expression (Regex) for this requirement: "${prompt}".\n\nProvide the response with:
1. The exact Regex pattern in a markdown \`regex\` code block
2. Recommended flags (e.g. g, i, m)
3. Concise explanation of each token/group
4. Valid test case examples that match
5. Invalid test case examples that fail`;
    }

    const completion = await groq.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const resultText = completion.choices[0]?.message?.content || "";

    res.json({
      result: resultText,
      model: DEFAULT_MODEL,
    });
  } catch (error: any) {
    console.error("Groq AI Regex error:", error);
    res.status(500).json({ error: error.message || "Failed to process regex with Groq AI" });
  }
});
