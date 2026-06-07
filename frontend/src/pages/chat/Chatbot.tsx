import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../utils/api";
import ReactMarkdown from "react-markdown";

type Message = {
    sender: "user" | "ai";
    text: string;
};

export default function Chatbot() {
    const navigate = useNavigate();
    const { t, language, toggleLanguage } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: "ai",
            text: t("aiGreeting"),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        const userMessage: Message = { sender: "user", text: userText };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await api.chat(userText, language);
            const aiReply: Message = {
                sender: "ai",
                text: response.reply || t("errorOccurred"),
            };
            setMessages((prev) => [...prev, aiReply]);
        } catch (err) {
            setMessages((prev) => [...prev, { sender: "ai", text: t("errorOccurred") }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">

            {/* Header */}
            <div className="bg-green-700 dark:bg-green-800 text-white px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold">{t("aiAssistance")}</h1>
                <div className="flex gap-2">
                    <button
                        onClick={toggleLanguage}
                        className="text-sm bg-white text-green-700 hover:bg-gray-100 px-3 py-2 rounded-md transition font-medium"
                    >
                        {language === "en" ? "हिंदी" : "English"}
                    </button>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-sm bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md transition"
                    >
                        {t("backToDashboard")}
                    </button>
                </div>
            </div>

            {/* Chat Messages - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm ${msg.sender === "user"
                            ? "ml-auto bg-green-700 text-white"
                            : "mr-auto bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-100"
                            }`}
                    >
                        <div className="space-y-1 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>p]:leading-relaxed break-words">
                            <ReactMarkdown>
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area - Fixed at Bottom */}
            <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4 pb-6">
                <div className="flex gap-2 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder={t("typeQuestion")}
                        disabled={isLoading}
                        className="flex-1 border dark:border-gray-600 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition font-medium disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                    >
                        {isLoading ? "..." : t("send")}
                    </button>
                </div>
            </div>
        </div>
    );
}
