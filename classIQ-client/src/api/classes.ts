import { API } from "./auth";

// classes Types
export interface classRequest {
    title: string;
    description: string;
}

export interface Teacher {
    _id: string;
    name: string;
    email: string;
}

export interface Class {
    _id: string;
    title: string;
    description: string;
    teachers: Teacher[];
    students: string[];
    joinCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClassesResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: Class[];
}

// --- Assignment Types ---
export interface Assignment {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    totalMarks: number;
    class: string;
    createdBy: string;
    attachments: string[];
}

export interface AssignmentResponse {
    success: boolean;
    data: Assignment;
}

export const createClasses = (data: classRequest, token: string) => {
    API.post("/classes", data);
};

// --- Create Assignment ---
export const createAssignment = (
    classId: string,
    formData: FormData
) => {
    return API.post<AssignmentResponse>(
        `/classes/${classId}/assignments`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const getClasses = () =>
    API.get<ClassesResponse>("/classes");

export const joinClass = (joinCode: string) =>
    API.post("/classes/join", { joinCode });

export const getSingleClass = (classId: string) => {
    return API.get(`/classes/${classId}`, {
    });
};

export const updateClass = async (
    id: string,
    data: { title: string; description: string }
) => {
    return API.put(`classes/${id}`, data, {
    });
};

export const deleteClass = (id: string) => {
    return API.delete(`classes/${id}`);
}

export const getAssignmentsByClass = (classId: string) => {
    return API.get(`/classes/${classId}/assignments`);
}

export const getSingleAssignment = (assignmentId: string) => {
    return API.get(`/assignments/${assignmentId}`);
}

export const updateAssignment = async (assignmentId: string, data: { title?: string; description?: string; dueDate?: string; totalMarks?: number }) => {
    return API.put(`/assignments/${assignmentId}`, data);
}

export const deleteAssignment = (assignmentId: string) => {
    return API.delete(`/assignments/${assignmentId}`);
}

export const submitAssignment = (assignmentId: string, formData: FormData) => {
    return API.post(`/assignments/${assignmentId}/submissions`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const getSubmissionsByAssignment = (assignmentId: string) => {
    return API.get(`/assignments/${assignmentId}/submissions`);
};

export const gradeSubmission = (
    submissionId: string,
    data: { marksObtained: number; feedback: string }
) => {
    return API.put(`/submissions/${submissionId}/grade`, data);
};
