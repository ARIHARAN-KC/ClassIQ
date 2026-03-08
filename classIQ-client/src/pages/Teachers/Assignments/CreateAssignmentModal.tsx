import React, { useState } from "react";
import { createAssignment } from "../../../api/classes";

interface Props {
    classId: string;
    isOpen: boolean;
    onClose: () => void;
}

const CreateAssignmentModal: React.FC<Props> = ({
    classId,
    isOpen,
    onClose,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [totalMarks, setTotalMarks] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("dueDate", dueDate);
        formData.append("totalMarks", totalMarks);

        if (files) {
            Array.from(files).forEach((file) => {
                formData.append("files", file);
            });
        }

        try {
            setLoading(true);

            const res = await createAssignment(classId, formData);

            console.log("Assignment created:", res.data);

            // refreshAssignments();

            alert("Assignment created successfully!");

            setTitle("");
            setDescription("");
            setDueDate("");
            setTotalMarks("");
            setFiles(null);

            onClose();
        } catch (error) {
            console.error(error);
            alert("Error creating assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Create Assignment
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Assignment title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Assignment description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />

                    {/* Due Date + Marks */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />

                        <input
                            type="number"
                            placeholder="Total Marks"
                            value={totalMarks}
                            onChange={(e) => setTotalMarks(e.target.value)}
                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* File Upload */}
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <input
                            type="file"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                            className="w-full"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Upload assignment files (optional)
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Assignment"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateAssignmentModal;