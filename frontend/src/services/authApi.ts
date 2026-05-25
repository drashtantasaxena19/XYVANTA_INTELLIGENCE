import api from "./api";

export type RegisterPayload = {
    firebase_uid: string;
    name: string;
    email: string;
    role: "recruiter" | "admin";
    company_name?: string;
};

export const registerUserInBackend = async (
    payload: RegisterPayload,
    token?: string,
) => {
    const response = await api.post("/auth/register", payload, {
        headers: token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : undefined,
    });

    return response.data;
};

export const getCurrentUser = async (token?: string) => {
    const response = await api.get("/auth/me", {
        headers: token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : undefined,
    });

    return response.data;
};