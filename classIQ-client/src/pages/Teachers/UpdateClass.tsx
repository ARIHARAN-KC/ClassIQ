import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateClass } from "../../api/classes";

const UpdateClass: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const token = localStorage.getItem("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) return;

        try {
            const res = await updateClass(id, { title, description });

            alert("Class updated successfully");

            console.log(res.data);

            navigate("/teacher-dashboard");

        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Update Class</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Update Class
                </button>

            </form>
        </div>
    );
};

export default UpdateClass;