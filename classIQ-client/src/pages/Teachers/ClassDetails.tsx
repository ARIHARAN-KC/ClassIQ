import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleClass } from "../../api/classes";
import { getAssignmentsByClass, deleteAssignment } from "../../api/classes";
import CreateStreamModal from "./CreateStreamModal";

interface Teacher {
    _id: string;
    name: string;
    email: string;
}

interface Student {
    _id: string;
    name: string;
    email: string;
}

interface ClassData {
    _id: string;
    title: string;
    description: string;
    joinCode: string;
    teachers: Teacher[];
    students: Student[];
    createdAt: string;
}

interface Assignment {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    totalMarks: number;
    attachments: string[];
    createdAt: string;
}

export default function ClassDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState<ClassData | null>(null);
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [createStreamOpen, setCreateStreamOpen] = useState(false);

    useEffect(() => {

        const fetchClass = async () => {
            try {
                const res = await getSingleClass(id as string);
                setClassData(res.data.data);
            } catch (err) {
                console.error("Error fetching class", err);
            }
        };

        const fetchAssignments = async () => {
            try {
                const res = await getAssignmentsByClass(id as string);
                setAssignments(res.data.data);
            } catch (err) {
                console.error("Error fetching assignments", err);
            }
        };

        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchClass(), fetchAssignments()]);
            setLoading(false);
        };

        loadData();

    }, [id]);

    if (loading) {
        return <p className="text-center mt-10">Loading class...</p>;
    }

    if (!classData) {
        return <p className="text-center mt-10">Class not found</p>;
    }

    const handleDeleteAssignment = async (assignmentId: string) => {
        try {
            await deleteAssignment(assignmentId);
            setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
        } catch (error) {
            console.error("Error deleting assignment", error);
        }
    }


    return (
        <div className="max-w-5xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-4">
                {classData.title}
            </h1>

            <p className="text-gray-600 mb-4">
                {classData.description}
            </p>

            <div className="bg-gray-100 p-4 rounded mb-6">
                <p className="font-semibold">
                    Join Code: {classData.joinCode}
                </p>
            </div>

            {/* Teachers */}
            <h2 className="text-xl font-semibold mb-2">
                Teachers
            </h2>

            <div className="space-y-2 mb-6">
                {classData.teachers.map((teacher) => (
                    <div
                        key={teacher._id}
                        className="p-3 border rounded"
                    >
                        <p>{teacher.name}</p>
                        <p className="text-sm text-gray-500">
                            {teacher.email}
                        </p>
                    </div>
                ))}
            </div>

            {/* Students */}
            <h2 className="text-xl font-semibold mb-2">
                Students ({classData.students.length})
            </h2>

            <div className="space-y-2">
                {classData.students.map((student) => (
                    <div
                        key={student._id}
                        className="p-3 border rounded"
                    >
                        <p>{student.name}</p>
                        <p className="text-sm text-gray-500">
                            {student.email}
                        </p>
                    </div>
                ))}
            </div>

            {/* Assignments */}
            <div className="flex items-center justify-between mt-10 mb-4">

                <h2 className="text-xl font-semibold">
                    Assignments ({assignments.length})
                </h2>

                <button
                    onClick={() => setCreateStreamOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                >
                    + Create Stream
                </button>

            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Due Date</th>
                            <th className="p-3 text-left">Marks</th>
                            <th className="p-3 text-left">Attachments</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {assignments.map((a) => (
                            <tr key={a._id} className="border-t">

                                <td className="p-3">{a.title}</td>

                                <td className="p-3">
                                    {new Date(a.dueDate).toLocaleDateString()}
                                </td>

                                <td className="p-3">{a.totalMarks}</td>

                                <td className="p-3">
                                    {a.attachments.length > 0 ? (
                                        <span className="text-blue-600">
                                            {a.attachments.length} files
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">None</span>
                                    )}
                                </td>

                                <td className="p-3 space-x-2">

                                    <button
                                        onClick={() => navigate(`/assignmentdetails/${a._id}`)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() => navigate(`/updateassignment/${a._id}`)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDeleteAssignment(a._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>
                        ))}

                        {assignments.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center p-4 text-gray-500">
                                    No assignments found
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>
            </div>
            <CreateStreamModal
                classId={classData._id}
                isOpen={createStreamOpen}
                onClose={() => setCreateStreamOpen(false)}
                onSuccess={() => { }}
            />
        </div>
    );
}