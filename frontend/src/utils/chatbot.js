import axios from "axios";

const API_URL = "http://localhost:5001/api/chatbot";

export const sendMessage = async (message, sessionId = null) => {
  try {
    const payload = {
      message,
      ...(sessionId && { sessionId }),
    };

    const response = await axios.post(`${API_URL}/chat`, payload);
    return response.data;
  } catch (error) {
    console.error("Chatbot API Error:", error);
    // Propagate full error payload if available
    if (error.response?.data) {
      throw error.response.data;
    }
    throw error.message || "Failed to send message";
  }
};

export const clearSession = async (sessionId) => {
  try {
    const response = await axios.delete(`${API_URL}/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Clear Session Error:", error);
    throw error.response?.data?.error || "Failed to clear session";
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  } catch (error) {
    console.error("Health Check Error:", error);
    throw error;
  }
};

export default { sendMessage, clearSession, checkHealth };