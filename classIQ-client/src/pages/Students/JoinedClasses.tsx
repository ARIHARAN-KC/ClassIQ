import { useEffect, useState } from "react";
import { getClasses, getSingleClass, getAssignmentsByClass, submitAssignment } from "../../api/classes";

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

interface ClassItem {
    _id: string;
    title: string;
    description: string;
    joinCode: string;
    teachers: Teacher[];
}

interface ClassDetails extends ClassItem {
    students: Student[];
    createdAt: string;
}

interface Assignment {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    createdAt: string;
}

export default function JoinedClassesPage() {

    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);

    const fetchClasses = async () => {
        try {
            const res = await getClasses();
            setClasses(res.data.data);
        } catch (error) {
            console.error("Error fetching classes", error);
        }
    };

    const openSubmitModal = (assignmentId: string) => {
        setSelectedAssignmentId(assignmentId);
        setIsModalOpen(true);
    };

    const handleSubmitAssignment = async () => {
        if (!selectedAssignmentId) return;

        try {

            const formData = new FormData();
            formData.append("comment", comment);

            if (files) {
                Array.from(files).forEach((file) => {
                    formData.append("files", file);
                });
            }

            await submitAssignment(selectedAssignmentId, formData);

            alert("Assignment submitted successfully");

            setIsModalOpen(false);
            setComment("");
            setFiles(null);

        } catch (error) {
            console.error("Submission failed", error);
        }
    };

    const handleView = async (classId: string) => {
        try {
            const classRes = await getSingleClass(classId);
            setSelectedClass(classRes.data.data);

            const assignmentRes = await getAssignmentsByClass(classId);
            setAssignments(assignmentRes.data.data);

        } catch (error) {
            console.error("Error fetching class details", error);
        }
    };
    useEffect(() => {
        fetchClasses();
    }, []);


    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">Joined Classes</h1>

            {/* Classes Table */}
            <div className="bg-white shadow rounded-xl overflow-hidden">

                <table className="w-full text-left">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Teacher</th>
                            <th className="p-4">Join Code</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {classes.map((cls) => (
                            <tr key={cls._id} className="border-t">

                                <td className="p-4 font-medium">{cls.title}</td>

                                <td className="p-4">
                                    {cls.teachers[0]?.name}
                                </td>

                                <td className="p-4 text-gray-600">
                                    {cls.joinCode}
                                </td>

                                <td className="p-4">
                                    <button
                                        onClick={() => handleView(cls._id)}
                                        className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                                    >
                                        View
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

            {/* Class Details */}
            {selectedClass && (

                <div className="mt-8 bg-white shadow rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Class Details
                    </h2>

                    <div className="space-y-2">

                        <p>
                            <span className="font-semibold">Title:</span> {selectedClass.title}
                        </p>

                        <p>
                            <span className="font-semibold">Description:</span> {selectedClass.description}
                        </p>

                        <p>
                            <span className="font-semibold">Teacher:</span> {selectedClass.teachers[0]?.name}
                        </p>

                        <p>
                            <span className="font-semibold">Join Code:</span> {selectedClass.joinCode}
                        </p>

                        <p>
                            <span className="font-semibold">Created At:</span>{" "}
                            {new Date(selectedClass.createdAt).toLocaleDateString()}
                        </p>

                        <div>
                            <p className="font-semibold mt-3">Students:</p>

                            <ul className="list-disc ml-6">
                                {selectedClass.students.map((student) => (
                                    <li key={student._id}>
                                        {student.name} ({student.email})
                                    </li>
                                ))}
                            </ul>

                        </div>

                    </div>

                </div>

            )}

            {/* Assignments Section */}
            {selectedClass && (

                <div className="mt-6 bg-white shadow rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Assignments
                    </h2>

                    {assignments.length === 0 ? (

                        <p className="text-gray-500">
                            No assignments available.
                        </p>

                    ) : (

                        <div className="space-y-4">

                            {assignments.map((assignment) => (

                                <div
                                    key={assignment._id}
                                    className="border p-4 rounded-lg hover:shadow-md transition"
                                >

                                    <h3 className="font-semibold text-lg">
                                        {assignment.title}
                                    </h3>

                                    <p className="text-gray-600 mt-1">
                                        {assignment.description}
                                    </p>

                                    <div className="flex justify-between mt-3 text-sm text-gray-500">

                                        <span>
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>

                                        <span>
                                            Posted: {new Date(assignment.createdAt).toLocaleDateString()}
                                        </span>

                                    </div>

                                    <button
                                        onClick={() => openSubmitModal(assignment._id)}
                                        className="mt-3 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                                    >
                                        Submit Assignment
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            )}


            {isModalOpen && (

                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl p-6 w-[450px] shadow-lg">

                        <h2 className="text-xl font-semibold mb-4">
                            Submit Assignment
                        </h2>

                        {/* Comment */}
                        <textarea
                            placeholder="Write your comment..."
                            className="w-full border rounded p-2 mb-4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        {/* File Upload */}
                        <input
                            type="file"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                            className="mb-4"
                        />

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmitAssignment}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Submit
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}