import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Used by the AI-Assisted Learning feature (curated prompt -> Gemini)
// and by AI Code Evaluation (submitted code -> correctness/quality feedback).
export async function askGemini(promptText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(promptText);
  return result.response.text();
}

// Builds a structured evaluation prompt for the Code Practice feature.
// Keeps the JSON contract simple so the frontend can render it directly.
export function buildCodeEvalPrompt({ challengeTitle, language, code }) {
  return `You are a code reviewer for a learning platform. A student submitted the following ${language} code for the challenge "${challengeTitle}".

Respond ONLY with strict JSON, no markdown fences, in this shape:
{
  "correct": boolean,
  "score": number (0-100),
  "errors": string[],
  "suggestions": string[],
  "feedback": string (2-3 sentences, encouraging but honest)
}

Student code:
---
${code}
---`;
}

// Parses Gemini's JSON response defensively (models occasionally wrap
// output in markdown fences despite instructions).
export function parseJsonResponse(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
