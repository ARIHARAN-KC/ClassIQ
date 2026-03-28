import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
    sendChatMessage,
    getClassSummary,
    getStudyPlan,
    explainAssignment,
    generateNotes,
    checkPlagiarism,
} from "../api/ai";

interface Message {
    role: "user" | "bot";
    text: string;
}

type Mode =
    | "chat"
    | "summary"
    | "assignment"
    | "explain"
    | "notes"
    | "plagiarism";

export default function AIChatBot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<Mode>("chat");

    const [assignmentData, setAssignmentData] = useState({
        topic: "",
        difficulty: "",
        classLevel: "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [instructions, setInstructions] = useState("");

    const sendMessage = async () => {
        setLoading(true);

        try {
            let res;

            // CHAT
            if (mode === "chat") {
                if (!input.trim()) return;

                res = await sendChatMessage(input);

                setMessages((prev) => [
                    ...prev,
                    { role: "user", text: input },
                    { role: "bot", text: res.data.data },
                ]);

                setInput("");
            }

            // SUMMARY
            else if (mode === "summary") {
                if (!input.trim()) return;

                res = await getClassSummary(input);

                setMessages((prev) => [
                    ...prev,
                    { role: "user", text: input },
                    { role: "bot", text: res.data.data },
                ]);

                setInput("");
            }

            // ASSIGNMENT
            else if (mode === "assignment") {
                const { topic, difficulty, classLevel } = assignmentData;

                if (!topic || !difficulty || !classLevel) {
                    alert("Please fill all fields");
                    setLoading(false);
                    return;
                }

                res = await getStudyPlan({
                    topic,
                    difficulty,
                    classLevel,
                });

                const userText = `Topic: ${topic}
Difficulty: ${difficulty}
Class: ${classLevel}`;

                setMessages((prev) => [
                    ...prev,
                    { role: "user", text: userText },
                    { role: "bot", text: res.data.data },
                ]);

                setAssignmentData({
                    topic: "",
                    difficulty: "",
                    classLevel: "",
                });
            }

            // EXPLAIN
            else if (mode === "explain") {
                if (!input.trim()) return;

                res = await explainAssignment(input);

                setMessages((prev) => [
                    ...prev,
                    { role: "user", text: input },
                    { role: "bot", text: res.data.data },
                ]);

                setInput("");
            }

            // NOTES
            else if (mode === "notes") {
                if (!file) {
                    alert("Upload a file");
                    setLoading(false);
                    return;
                }

                res = await generateNotes(file, instructions);

                setMessages((prev) => [
                    ...prev,
                    { role: "user", text: `📄 ${file.name}` },
                    { role: "bot", text: res.data.data },
                ]);

                setFile(null);
                setInstructions("");
            }

            // ✅ PLAGIARISM CHECK
            else if (mode === "plagiarism") {
                if (!input.trim()) return;

                res = await checkPlagiarism(input);

                setMessages((prev) => [
                    ...prev,
                    { role: "user", text: input },
                    {
                        role: "bot",
                        text: JSON.stringify(res.data.data, null, 2),
                    },
                ]);

                setInput("");
            }
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 rounded-xl shadow-lg">
            {/* HEADER */}
            <div className="p-4 bg-indigo-600 text-white font-semibold text-lg rounded-t-xl">
                AI Assistant
            </div>

            {/* MODES */}
            <div className="p-3 bg-white border-b flex gap-2 flex-wrap">
                {[
                    "chat",
                    "summary",
                    "assignment",
                    "explain",
                    "notes",
                    "plagiarism",
                ].map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m as Mode)}
                        className={`px-3 py-1 rounded ${
                            mode === m
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        {m.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${
                            msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-lg ${
                                msg.role === "user"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white border"
                            }`}
                        >
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}

                {loading && (
                    <p className="text-gray-500">AI is generating...</p>
                )}
            </div>

            {/* INPUT */}
            <div className="p-3 border-t flex flex-col gap-2">
                {mode === "assignment" ? (
                    <>
                        <input
                            placeholder="Topic"
                            className="border p-2 rounded"
                            value={assignmentData.topic}
                            onChange={(e) =>
                                setAssignmentData({
                                    ...assignmentData,
                                    topic: e.target.value,
                                })
                            }
                        />

                        <select
                            className="border p-2 rounded"
                            value={assignmentData.difficulty}
                            onChange={(e) =>
                                setAssignmentData({
                                    ...assignmentData,
                                    difficulty: e.target.value,
                                })
                            }
                        >
                            <option value="">Difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        <input
                            placeholder="Class Level"
                            className="border p-2 rounded"
                            value={assignmentData.classLevel}
                            onChange={(e) =>
                                setAssignmentData({
                                    ...assignmentData,
                                    classLevel: e.target.value,
                                })
                            }
                        />

                        <button
                            onClick={sendMessage}
                            className="bg-purple-600 text-white p-2 rounded"
                        >
                            Generate Assignment
                        </button>
                    </>
                ) : mode === "notes" ? (
                    <>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                                setFile(e.target.files?.[0] || null)
                            }
                        />

                        <textarea
                            placeholder="Instructions..."
                            className="border p-2 rounded"
                            value={instructions}
                            onChange={(e) =>
                                setInstructions(e.target.value)
                            }
                        />

                        <button
                            onClick={sendMessage}
                            className="bg-pink-600 text-white p-2 rounded"
                        >
                            Generate Notes
                        </button>
                    </>
                ) : (
                    <div className="flex gap-2">
                        <textarea
                            className="flex-1 border rounded p-2"
                            placeholder={
                                mode === "chat"
                                    ? "Ask anything..."
                                    : mode === "summary"
                                    ? "Paste notes..."
                                    : mode === "plagiarism"
                                    ? "Paste text to check plagiarism..."
                                    : "Paste assignment..."
                            }
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />

                        <button
                            onClick={sendMessage}
                            className="bg-indigo-600 text-white px-4 rounded"
                        >
                            Send
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}