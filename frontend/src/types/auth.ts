export type UserRole = "recruiter" | "admin";

export type BackendUser = {
    firebase_uid: string;
    email: string;
    role: UserRole;
    user: {
        _id: string;
        firebase_uid: string;
        name: string;
        email: string;
        role: UserRole;
        company_name?: string;
        is_active: boolean;
    };
};