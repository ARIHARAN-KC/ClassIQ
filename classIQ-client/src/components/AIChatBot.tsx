import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
    sendChatMessage,
    getClassSummary,
    getStudyPlan,
    explainAssignment,
    generateNotes,
    checkPlagiarism,
    generateStudyPlan,
    generateQuiz,
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
    | "plagiarism"
    | "studyplanner"
    | "quiz";

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

    const [studyData, setStudyData] = useState({
        subjects: "",
        examDate: "",
        hoursPerDay: "",
    });

    const [quizData, setQuizData] = useState({
        topic: "",
        numberOfQuestions: "",
        difficulty: "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [instructions, setInstructions] = useState("");

    const sendMessage = async () => {
        setLoading(true);

        try {
            let res;

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

            else if (mode === "assignment") {
                const { topic, difficulty, classLevel } = assignmentData;
                if (!topic || !difficulty || !classLevel) {
                    alert("Please fill all fields");
                    setLoading(false);
                    return;
                }

                res = await getStudyPlan({ topic, difficulty, classLevel });

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "user",
                        text: `Topic: ${topic}\nDifficulty: ${difficulty}\nClass: ${classLevel}`,
                    },
                    { role: "bot", text: res.data.data },
                ]);

                setAssignmentData({ topic: "", difficulty: "", classLevel: "" });
            }

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

            else if (mode === "studyplanner") {
                const { subjects, examDate, hoursPerDay } = studyData;

                if (!subjects || !examDate || !hoursPerDay) {
                    alert("Fill all fields");
                    setLoading(false);
                    return;
                }

                res = await generateStudyPlan({
                    subjects: subjects.split(",").map((s) => s.trim()),
                    examDate,
                    hoursPerDay: Number(hoursPerDay),
                });

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "user",
                        text: `Subjects: ${subjects}\nDate: ${examDate}\nHours: ${hoursPerDay}`,
                    },
                    { role: "bot", text: res.data.data },
                ]);

                setStudyData({ subjects: "", examDate: "", hoursPerDay: "" });
            }

            else if (mode === "quiz") {
                const { topic, numberOfQuestions, difficulty } = quizData;

                if (!topic || !numberOfQuestions || !difficulty) {
                    alert("Fill all fields");
                    setLoading(false);
                    return;
                }

                res = await generateQuiz({
                    topic,
                    numberOfQuestions: Number(numberOfQuestions),
                    difficulty,
                });

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "user",
                        text: `Topic: ${topic}\nQuestions: ${numberOfQuestions}\nDifficulty: ${difficulty}`,
                    },
                    { role: "bot", text: res.data.data },
                ]);

                setQuizData({ topic: "", numberOfQuestions: "", difficulty: "" });
            }
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    const getModeIcon = (modeName: string) => {
        const icons: Record<string, string> = {
            chat: "💬",
            summary: "📝",
            assignment: "📚",
            explain: "🔍",
            notes: "📓",
            plagiarism: "⚖️",
            studyplanner: "📅",
            quiz: "❓"
        };
        return icons[modeName] || "🤖";
    };

    const getModeColor = (currentMode: Mode, buttonMode: string) => {
        return currentMode === buttonMode
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    <h2 className="font-semibold text-lg">AI Assistant</h2>
                </div>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                    {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                </span>
            </div>

            {/* Mode Selector */}
            <div className="p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                        "chat",
                        "summary",
                        "assignment",
                        "explain",
                        "notes",
                        "plagiarism",
                        "studyplanner",
                        "quiz",
                    ].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m as Mode)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${getModeColor(mode, m)}`}
                        >
                            <span>{getModeIcon(m)}</span>
                            <span className="hidden sm:inline">{m}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <span className="text-6xl mb-4">💭</span>
                        <p className="text-center max-w-xs">
                            {mode === "chat" && "Start a conversation with the AI assistant"}
                            {mode === "summary" && "Enter text to get a summary"}
                            {mode === "assignment" && "Get help with your assignments"}
                            {mode === "explain" && "Ask for explanations on any topic"}
                            {mode === "notes" && "Upload notes to generate summaries"}
                            {mode === "plagiarism" && "Check text for plagiarism"}
                            {mode === "studyplanner" && "Create a personalized study plan"}
                            {mode === "quiz" && "Generate quizzes on any topic"}
                        </p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 ${
                                    msg.role === "user"
                                        ? "bg-indigo-600 text-white rounded-br-none"
                                        : "bg-white text-gray-800 shadow-md rounded-bl-none"
                                }`}
                            >
                                <div
                                 className={`prose max-w-none ${
                                        msg.role === "user" ? "prose-invert" : ""
                                    }`}
                                    >
                                <ReactMarkdown>
                                    {msg.text}
                                </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-4 shadow-md">
                            <div className="flex gap-1">
                                <span className="animate-bounce">●</span>
                                <span className="animate-bounce delay-100">●</span>
                                <span className="animate-bounce delay-200">●</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
                {mode === "quiz" ? (
                    <div className="space-y-3">
                        <input
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="Enter topic..."
                            value={quizData.topic}
                            onChange={(e)=>setQuizData({...quizData,topic:e.target.value})}
                        />
                        <div className="flex gap-2">
                            <input
                                className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="Number of questions..."
                                value={quizData.numberOfQuestions}
                                onChange={(e)=>setQuizData({...quizData,numberOfQuestions:e.target.value})}
                            />
                            <select
                                className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                                value={quizData.difficulty}
                                onChange={(e)=>setQuizData({...quizData,difficulty:e.target.value})}
                            >
                                <option value="">Difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Generating..." : "Generate Quiz"}
                        </button>
                    </div>
                ) : mode === "notes" ? (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <label className="flex-1">
                                <div className="relative">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    <div className="p-3 border border-gray-300 rounded-xl text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors text-center">
                                        {file ? file.name : "Choose a file..."}
                                    </div>
                                </div>
                            </label>
                            <button className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors">
                                Browse
                            </button>
                        </div>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                            placeholder="Additional instructions (optional)"
                            rows={2}
                            value={instructions}
                            onChange={(e)=>setInstructions(e.target.value)}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !file}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Generating..." : "Generate Notes"}
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <textarea
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                            placeholder={`Type your ${mode} message here...`}
                            rows={2}
                            value={input}
                            onChange={(e)=>setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="self-end px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}