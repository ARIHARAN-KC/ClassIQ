import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSubmissionsByAssignment, gradeSubmission } from "../../../api/classes";

interface Student {
    _id: string;
    name: string;
    email: string;
}

interface Submission {
    _id: string;
    student: Student;
    comment: string;
    attachments: string[];
    createdAt: string;
    marksObtained?: number;
    feedback?: string;
}

export default function AssignmentSubmissionsPage() {

    const { assignmentId } = useParams();

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [openGradeModal, setOpenGradeModal] = useState(false);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
    const [marksObtained, setMarksObtained] = useState<number | "">("");
    const [feedback, setFeedback] = useState("");

    const fetchSubmissions = async () => {
        try {

            const res = await getSubmissionsByAssignment(assignmentId!);

            setSubmissions(res.data.data);

        } catch (error) {

            console.error("Error fetching submissions", error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    if (loading) {
        return <div className="p-6">Loading submissions...</div>;
    }

    const openGradePopup = (submissionId: string) => {
        setSelectedSubmissionId(submissionId);
        setOpenGradeModal(true);
    };

    const handleSubmitGrade = async () => {

        if (!selectedSubmissionId) return;

        try {

            await gradeSubmission(selectedSubmissionId, {
                marksObtained: Number(marksObtained),
                feedback
            });

            alert("Grade submitted successfully");

            setOpenGradeModal(false);
            setMarksObtained("");
            setFeedback("");

            fetchSubmissions(); // refresh list

        } catch (error) {

            console.error("Error grading submission", error);

        }
    };

    return (

        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                Assignment Submissions
            </h1>

            {submissions.length === 0 ? (

                <p className="text-gray-500">
                    No submissions yet.
                </p>

            ) : (

                <div className="grid gap-5">

                    {submissions.map((submission) => (

                        <div
                            key={submission._id}
                            className="bg-white shadow rounded-xl p-5 border hover:shadow-lg transition"
                        >

                            {/* Student Info */}
                            <div className="mb-3">

                                <h2 className="font-semibold text-lg">
                                    {submission.student.name}
                                </h2>

                                <p className="text-gray-500 text-sm">
                                    {submission.student.email}
                                </p>

                            </div>

                            {/* Comment */}
                            <div className="mb-3">

                                <p className="font-medium">
                                    Comment
                                </p>

                                <p className="text-gray-600">
                                    {submission.comment}
                                </p>

                            </div>

                            {/* Attachments */}
                            <div className="mb-3">

                                <p className="font-medium mb-1">
                                    Attachments
                                </p>

                                {submission.attachments.map((file, index) => (

                                    <a
                                        key={index}
                                        href={`http://localhost:5000${file}`}
                                        target="_blank"
                                        className="text-indigo-600 block hover:underline"
                                    >
                                        View File {index + 1}
                                    </a>

                                ))}

                            </div>

                            {/* Date */}
                            <div className="text-sm text-gray-500">

                                Submitted on:{" "}
                                {new Date(submission.createdAt).toLocaleString()}

                            </div>

                            {submission.marksObtained !== undefined ? (

                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">

                                    <p className="text-sm font-semibold text-green-700">
                                        Marks: {submission.marksObtained}
                                    </p>

                                    <p className="text-sm text-gray-700 mt-1">
                                        Feedback: {submission.feedback}
                                    </p>

                                </div>

                            ) : (

                                <button
                                    onClick={() => openGradePopup(submission._id)}
                                    className="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                    Grade Submission
                                </button>

                            )}

                        </div>

                    ))}

                </div>

            )}

            {openGradeModal && (

                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl shadow-lg p-6 w-[420px]">

                        <h2 className="text-xl font-semibold mb-4">
                            Grade Submission
                        </h2>

                        {/* Marks */}
                        <div className="mb-4">

                            <label className="block text-sm font-medium mb-1">
                                Marks Obtained
                            </label>

                            <input
                                type="number"
                                value={marksObtained}
                                onChange={(e) => setMarksObtained(Number(e.target.value))}
                                className="w-full border rounded-lg p-2"
                                placeholder="Enter marks"
                            />

                        </div>

                        {/* Feedback */}
                        <div className="mb-4">

                            <label className="block text-sm font-medium mb-1">
                                Feedback
                            </label>

                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full border rounded-lg p-2"
                                rows={3}
                                placeholder="Enter feedback"
                            />

                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3">

                            <button
                                onClick={() => setOpenGradeModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmitGrade}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Submit Grade
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}