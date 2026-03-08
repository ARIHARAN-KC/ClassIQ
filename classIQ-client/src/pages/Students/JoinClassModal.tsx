import { useState } from "react";
import { joinClass } from "../../api/classes";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function JoinClassModal({ isOpen, onClose }: Props) {

    const [joinCode, setJoinCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (!joinCode.trim()) {
            alert("Please enter a join code");
            return;
        }

        try {
            setLoading(true);
            await joinClass(joinCode);
            alert("Joined class successfully");
            setJoinCode("");
            onClose();
        } catch (error) {
            console.error("Join failed", error);
            alert("Invalid join code");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[400px] rounded-xl shadow-lg p-6">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Join Class</h2>
                    <button onClick={onClose} className="text-gray-500">✕</button>
                </div>

                <div className="space-y-4">

                    <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Enter join code"
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        disabled={loading}
                        onClick={handleJoin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    >
                        {loading ? "Joining..." : "Join Class"}
                    </button>

                </div>

            </div>
        </div>
    );
}