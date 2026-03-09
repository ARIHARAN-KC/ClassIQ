import { useState } from "react";
import { sendChatMessage, getClassSummary } from "../api/ai";

interface Message {
    role: "user" | "bot";
    text: string;
}

export default function AIChatBot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async (type: "chat" | "summary") => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: "user",
            text: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {

            let res;

            if (type === "chat") {
                res = await sendChatMessage(input);
            } else {
                res = await getClassSummary(input);
            }

            const botMessage: Message = {
                role: "bot",
                text: res.data.data,
            };

            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {
            console.error("AI Error:", error);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 rounded-xl shadow-lg">

            {/* Header */}
            <div className="p-4 bg-indigo-600 text-white font-semibold text-lg rounded-t-xl">
                AI Assistant
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-lg ${msg.role === "user"
                                ? "bg-indigo-600 text-white"
                                : "bg-white border"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="text-gray-500 text-sm">AI is thinking...</div>
                )}

            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2">

                <input
                    type="text"
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="Ask something or paste class notes..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button
                    onClick={() => sendMessage("chat")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                    Chat
                </button>

                <button
                    onClick={() => sendMessage("summary")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                    Summarize
                </button>

            </div>
        </div>
    );
}