import { API } from "./auth";

export interface classRequest {
    title: string;
    description: string;
}

export const createClasses = (data: classRequest, token: string) => {
    API.post("/classes", data);
};