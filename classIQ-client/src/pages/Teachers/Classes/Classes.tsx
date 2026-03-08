import { useState } from "react";
import { createClasses } from "../../../api/classes";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    refreshClasses: () => void;
}

export default function CreateClass({ isOpen, onClose, refreshClasses }: Props) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const token = localStorage.getItem("token") || "";

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const res = await createClasses(
                { title, description },
                token
            );

            alert("Class Created Successfully");

            setTitle("");
            setDescription("");
            refreshClasses();
            onClose();

            console.log(res.data);

        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">

            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-3 text-gray-500 hover:text-black"
                >
                    ✖
                </button>

                <h2 className="text-xl font-bold mb-4 text-center">
                    Create Class
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Class Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
                    >
                        Create Class
                    </button>

                </form>

            </div>

        </div>
    );
}