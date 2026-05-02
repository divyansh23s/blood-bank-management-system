import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Trash2,
  WifiOff,
  Bot,
  User,
  AlertTriangle,
} from "lucide-react";
import { sendMessage, clearSession, checkHealth } from "../utils/chatbot";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your BBMS assistant. I can help you with questions about donor registration, blood requests, lab procedures, and more. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState(null);
  const [apiHealthy, setApiHealthy] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Check API health on mount and periodically
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const health = await checkHealth();
        setApiHealthy(health.status === "ok");
        setIsOffline(false);
      } catch (err) {
        setApiHealthy(false);
        setIsOffline(true);
      }
    };

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const data = await sendMessage(userMessage, sessionId);

      // Store session ID for continuity
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // Check if fallback mode was used
      if (data.fallback) {
        setIsOffline(true);
      } else {
        setIsOffline(false);
      }

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);

      // Display the actual error message from backend if available
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.message || "Sorry, I'm having trouble connecting right now. Please try again later.";

      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${errorMessage}`,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (sessionId) {
      try {
        await clearSession(sessionId);
      } catch (err) {
        console.error("Failed to clear session:", err);
      }
    }

    setSessionId(null);
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your BBMS assistant. I can help you with questions about donor registration, blood requests, lab procedures, and more. How can I assist you today?",
      },
    ]);
    setError(null);
    setIsOffline(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] max-w-[400px] h-[500px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-red-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">BBMS Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      apiHealthy ? "bg-green-400" : "bg-yellow-400"
                    }`}
                  />
                  <span className="text-xs opacity-80">
                    {isOffline
                      ? "Offline mode"
                      : apiHealthy
                      ? "Online"
                      : "Checking..."}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                title="Clear chat"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Offline Banner */}
          {isOffline && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 shrink-0">
              <WifiOff size={14} className="text-amber-600 shrink-0" />
              <span className="text-xs text-amber-700">
                Running in offline mode. Responses are based on the BBMS
                knowledge base.
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={14} className="text-red-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-red-600 text-white rounded-br-md"
                      : msg.isError
                      ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-md"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-md"
                  }`}
                >
                  {msg.isError && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle size={12} className="text-red-500" />
                      <span className="font-medium text-xs">Error</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center shrink-0 mt-1">
                    <User size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-red-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="border-t border-gray-200 p-3 bg-white shrink-0"
          >
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about BBMS..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent max-h-32 bg-gray-50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              Powered by BBMS AI • Responses may be limited to blood bank topics
            </p>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
          isOpen
            ? "bg-gray-700 text-white hover:bg-gray-800"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default Chatbot;

