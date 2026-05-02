import express from "express";
const router = express.Router();
import { chatWithBot, clearChatSession } from "../controllers/chatbotController.js";

// POST c - Send a message to the chatbot
router.post("/chat", chatWithBot);

// DELETE /api/chatbot/session/:sessionId - Clear a chat session
router.delete("/session/:sessionId", clearChatSession);

// GET /api/chatbot/health - Health check endpoint
router.get("/health", (req, res) => {
  const geminiConfigured = !!process.env.GEMINI_API_KEY;
  res.json({
    status: "ok",
    message: "BBMS Chatbot is running",
    model: "gemini-2.5-flash-lite",
    geminiConfigured,
    mode: geminiConfigured ? "ai" : "fallback",
  });
});

export default router;