import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export const getGeminiResponse = async (prompt: string, context?: string) => {
  try {
    const fullPrompt = context 
      ? `Context (Recent Emails):\n${context}\n\nUser Question: ${prompt}\n\nPlease help the user based on the context provided above.`
      : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: {
        systemInstruction: "You are a professional AI assistant for Jonni Armani Media. You have access to the user's Gmail to help them manage their business. Be concise, professional, and proactive. When asked about emails, summarize recent important threads.",
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered an error while trying to think. Please check your API key and connection.";
  }
};
