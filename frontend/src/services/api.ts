import axios from "axios";
import { auth } from "../firebase/firebaseConfig";

const api = axios.create({
    baseURL:
    import.meta.env.VITE_API_URL || "https://xyvanta-intelligence.onrender.com/api",
    timeout: 120000,
});

api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;

    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error?.response?.status === 401) {
            console.warn("Unauthorized request:", error.config?.url);
        }

        return Promise.reject(error);
    },
);

export default api;