import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRelevantContext } from "../utils/knowledgeBase.js";

// Initialize Gemini API lazily so missing key doesn't crash the app on startup
let genAI = null;
let model = null;

function getModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });
  }
  return model;
}

// In-memory chat history (session-based)
const chatSessions = new Map();

// Build a helpful fallback response purely from the knowledge base
function buildFallbackResponse(message, relevantContext) {
  return (
    "I'm currently running in offline mode, but here's what I found in the BBMS knowledge base:\n\n" +
    (relevantContext || "I don't have specific information on that topic. Try asking about donor registration, hospital blood requests, blood labs, or admin features.")
  );
}

export const chatWithBot = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Use provided sessionId or generate a new one
    const session = sessionId || `session_${Date.now()}`;

    // Get or initialize chat history for this session
    if (!chatSessions.has(session)) {
      chatSessions.set(session, []);
    }

    const chatHistory = chatSessions.get(session);

    // Get relevant context from knowledge base using RAG
    const relevantContext = getRelevantContext(message);

    let responseText = "";
    let isFallback = false;

    try {
      const activeModel = getModel();

      // Build the prompt with context
      const systemPrompt = `You are a helpful assistant for the Blood Bank Management System (BBMS). 
Your role is to help users understand and use the BBMS platform effectively.

IMPORTANT RULES:
1. Only answer questions related to BBMS (Blood Bank Management System)
2. If a question is not related to BBMS, politely redirect to BBMS topics
3. Use the provided context to give accurate, specific answers
4. Keep responses concise but informative
5. Always be polite and helpful

CONTEXT FROM BBMS KNOWLEDGE BASE:
${relevantContext}

Guidelines:
- When explaining how to do something, provide step-by-step instructions
- Include relevant URLs or paths when available (e.g., /donor, /hospital, /login)
- Mention eligibility criteria when relevant
- If you don't have enough information, ask for clarification

Now, please respond to the user's question.`;

      // Build conversation history for context
      const conversationHistory = chatHistory
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n");

      const fullPrompt = conversationHistory
        ? `${systemPrompt}\n\nConversation History:\n${conversationHistory}\n\nUser: ${message}`
        : `${systemPrompt}\n\nUser: ${message}`;

      // Generate response using Gemini
      const result = await activeModel.generateContent(fullPrompt);
      responseText = result.response.text();
    } catch (geminiError) {
      console.error("Gemini API Error:", geminiError.message || geminiError);
      // Fallback to knowledge base response
      responseText = buildFallbackResponse(message, relevantContext);
      isFallback = true;
    }

    // Update chat history
    chatHistory.push({ role: "user", content: message });
    chatHistory.push({ role: "assistant", content: responseText });

    // Keep only last 20 messages to prevent memory issues
    if (chatHistory.length > 20) {
      chatHistory.splice(0, chatHistory.length - 20);
    }

    res.json({
      response: responseText,
      sessionId: session,
      fallback: isFallback,
      context: relevantContext.substring(0, 200) + "...", // Return truncated context for debugging
    });
  } catch (error) {
    console.error("Chatbot Error:", error);

    if (error.message?.includes("API_KEY") || error.message?.includes("not configured")) {
      return res.status(503).json({
        error: "Chatbot AI service is not configured. The administrator needs to set the GEMINI_API_KEY environment variable.",
        fallback: true,
      });
    }

    res.status(500).json({
      error: error.message || "Sorry, I'm having trouble processing your request right now. Please try again.",
    });
  }
};

export const clearChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    if (chatSessions.has(sessionId)) {
      chatSessions.delete(sessionId);
      res.json({ success: true, message: "Chat session cleared successfully" });
    } else {
      res.status(404).json({ error: "Chat session not found" });
    }
  } catch (error) {
    console.error("Clear Session Error:", error);
    res.status(500).json({
      error: error.message || "Failed to clear chat session",
    });
  }
};

