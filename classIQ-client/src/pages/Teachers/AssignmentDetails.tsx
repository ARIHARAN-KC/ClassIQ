import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleAssignment } from "../../api/classes";

interface Teacher {
    _id: string;
    name: string;
    email: string;
}

interface Assignment {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    totalMarks: number;
    attachments: string[];
    createdAt: string;
    createdBy: Teacher;
}

export default function AssignmentDetails() {

    const { assignmentId } = useParams();

    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!assignmentId) return;

        const fetchAssignment = async () => {
            try {
                const res = await getSingleAssignment(assignmentId);
                setAssignment(res.data.data);
            } catch (err) {
                console.error("Error fetching assignment", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();

    }, [assignmentId]);

    if (loading) {
        return <p className="text-center mt-10">Loading assignment...</p>;
    }

    if (!assignment) {
        return <p className="text-center mt-10">Assignment not found</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">

            {/* Assignment Header */}
            <div className="bg-white shadow rounded-xl p-6 mb-6">

                <h1 className="text-3xl font-bold mb-2">
                    {assignment.title}
                </h1>

                <p className="text-gray-600 mb-4">
                    {assignment.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">

                    <span>
                        📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>

                    <span>
                        📝 Total Marks: {assignment.totalMarks}
                    </span>

                    <span>
                        👨‍🏫 Created by: {assignment.createdBy.name}
                    </span>

                </div>

            </div>

            {/* Attachments */}
            <div className="bg-white shadow rounded-xl p-6 mb-6">

                <h2 className="text-xl font-semibold mb-4">
                    Attachments
                </h2>

                {assignment.attachments.length === 0 ? (
                    <p className="text-gray-500">No attachments</p>
                ) : (

                    <div className="space-y-3">

                        {assignment.attachments.map((file, index) => (

                            <a
                                key={index}
                                href={`http://localhost:5000${file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block border p-3 rounded-lg hover:bg-gray-50"
                            >
                                📎 Attachment {index + 1}
                            </a>

                        ))}

                    </div>

                )}

            </div>

            {/* Assignment Info */}
            <div className="bg-white shadow rounded-xl p-6">

                <h2 className="text-xl font-semibold mb-4">
                    Assignment Info
                </h2>

                <div className="grid grid-cols-2 gap-4 text-sm">

                    <div>
                        <p className="text-gray-500">Created At</p>
                        <p className="font-medium">
                            {new Date(assignment.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Teacher Email</p>
                        <p className="font-medium">
                            {assignment.createdBy.email}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}