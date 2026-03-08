import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleAssignment, updateAssignment } from "../../../api/classes";
import { FileText, CalendarDays, Hash, Save, ArrowLeft } from "lucide-react";

interface Assignment {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    totalMarks: number;
}

export default function UpdateAssignment() {

    const { assignmentId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        totalMarks: 0
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {

        if (!assignmentId) return;

        const fetchAssignment = async () => {
            try {
                const res = await getSingleAssignment(assignmentId);

                const data: Assignment = res.data.data;

                setFormData({
                    title: data.title,
                    description: data.description,
                    dueDate: data.dueDate.split("T")[0],
                    totalMarks: data.totalMarks
                });

            } catch (err) {
                console.error("Error fetching assignment", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();

    }, [assignmentId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === "totalMarks" ? Number(value) : value
        });

    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!assignmentId) return;

        try {

            setUpdating(true);

            await updateAssignment(assignmentId, formData);

            navigate(-1);

        } catch (err) {

            console.error("Update failed", err);

        } finally {

            setUpdating(false);

        }

    };

    if (loading) {
        return <p className="text-center mt-10">Loading assignment...</p>;
    }

    return (

        <div className="max-w-2xl mx-auto p-6">

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 mb-6"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="bg-white shadow-lg rounded-xl p-6">

                <h1 className="text-2xl font-semibold mb-6">
                    Update Assignment
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Title */}
                    <div>

                        <label className="flex items-center gap-2 text-sm font-medium mb-1">
                            <FileText size={16} />
                            Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
                        />

                    </div>

                    {/* Description */}
                    <div>

                        <label className="text-sm font-medium mb-1 block">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
                        />

                    </div>

                    {/* Due Date */}
                    <div>

                        <label className="flex items-center gap-2 text-sm font-medium mb-1">
                            <CalendarDays size={16} />
                            Due Date
                        </label>

                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        />

                    </div>

                    {/* Total Marks */}
                    <div>

                        <label className="flex items-center gap-2 text-sm font-medium mb-1">
                            <Hash size={16} />
                            Total Marks
                        </label>

                        <input
                            type="number"
                            name="totalMarks"
                            value={formData.totalMarks}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        />

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={updating}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            <Save size={16} />
                            {updating ? "Updating..." : "Update Assignment"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}