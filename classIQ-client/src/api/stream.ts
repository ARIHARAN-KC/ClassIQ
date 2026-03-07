import { API } from "./auth";

export interface Author {
    _id: string;
    name: string;
    email: string;
}

export interface Stream {
    _id: string;
    content: string;
    class: string;
    author: Author;
    createdAt: string;
    updatedAt: string;
}

export const getStreams = async (classId: string): Promise<Stream[]> => {
    const res = await API.get(`/classes/${classId}/streams`);
    return res.data.data;
};

export const createStream = async (
    classId: string,
    content: string
): Promise<Stream> => {
    const res = await API.post(`/classes/${classId}/streams`,{ content });
    return res.data.data;
};

export const deleteStream = async (streamId: string) => {
    return API.delete(`/streams/${streamId}`, {
    });
};