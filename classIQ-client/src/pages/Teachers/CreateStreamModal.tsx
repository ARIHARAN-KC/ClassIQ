import React, { useState } from "react";
import { createStream } from "../../api/stream";

interface Props {
    classId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateStreamModal: React.FC<Props> = ({ classId, isOpen, onClose, onSuccess }) => {

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        try {
            setLoading(true);

            await createStream(classId, content);
            alert("Stream created successfully!");
            setContent("");
            onSuccess();
            onClose();

        } catch (error) {
            console.error("Failed to create stream", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-[450px] p-6 shadow-lg">

                <h2 className="text-lg font-semibold mb-4">Create Stream</h2>

                <textarea
                    placeholder="Write announcement..."
                    className="w-full border rounded-lg p-3 h-28"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <div className="flex justify-end gap-3 mt-4">

                    <button
                        className="px-4 py-2 border rounded-lg"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>

                </div>
            </div>

        </div>
    );
};

export default CreateStreamModal;