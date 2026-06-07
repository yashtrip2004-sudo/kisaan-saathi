const axios = require("axios");
const Chat = require("../models/Chat");

const PYTHON_AI_URL = process.env.PYTHON_AI_URL || "http://127.0.0.1:8000";

const askAdvisor = async (req, res) => {
  const { prompt, language } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res
      .status(400)
      .json({ error: "Prompt (question) khaali nahi hona chahiye" });
  }

  try {
    // 1. Python AI Engine ko call karo
    const aiResponse = await axios.post(`${PYTHON_AI_URL}/ask-advisor`, {
      prompt: prompt.trim(),
      language: language || "en",
    });

    const answer = aiResponse.data.answer || aiResponse.data.error;

    // 2. Consultation MongoDB mein save karo
    const chat = await Chat.create({
      user: req.user._id,
      prompt: prompt.trim(),
      answer,
    });

    // 3. Frontend ko jawab bhejo
    res.status(200).json({
      success: true,
      chatId: chat._id,
      prompt: chat.prompt,
      answer: chat.answer,
      timestamp: chat.createdAt,
    });
  } catch (error) {
    console.error("❌ AI Engine Error:", error.message);

    // Agar Python service band hai
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "AI Engine abhi available nahi hai. Python service start karo.",
      });
    }

    res.status(500).json({ error: "Server error. Dobara try karo." });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, count: chats.length, chats });
  } catch (error) {
    res.status(500).json({ error: "History laane mein problem hui." });
  }
};

module.exports = { askAdvisor, getChatHistory };
