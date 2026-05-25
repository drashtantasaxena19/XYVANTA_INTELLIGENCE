import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type User as FirebaseUser,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

import {
    getCurrentUser,
} from "../services/authApi";

import type { BackendUser } from "../types/auth";

type SignupPayload = {
    name: string;
    email: string;
    password: string;
    company?: string;
};

type AuthContextType = {
    firebaseUser: FirebaseUser | null;
    backendUser: BackendUser | null;
    loading: boolean;

    login: (
        email: string,
        password: string,
    ) => Promise<void>;

    signup: (
        payload: SignupPayload,
    ) => Promise<void>;

    logout: () => Promise<void>;

    refreshBackendUser: () => Promise<
        BackendUser | null
    >;
};

const AuthContext =
    createContext<AuthContextType | null>(
        null,
    );

const AUTH_CACHE_KEY =
    "xyvanta_backend_user_cache";

function readCachedUser():
    | BackendUser
    | null {
    try {
        const cached =
            sessionStorage.getItem(
                AUTH_CACHE_KEY,
            );

        return cached
            ? JSON.parse(cached)
            : null;
    } catch {
        return null;
    }
}

function cacheUser(
    user: BackendUser | null,
) {
    if (!user) {
        sessionStorage.removeItem(
            AUTH_CACHE_KEY,
        );

        return;
    }

    sessionStorage.setItem(
        AUTH_CACHE_KEY,
        JSON.stringify(user),
    );
}

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [firebaseUser, setFirebaseUser] =
        useState<FirebaseUser | null>(
            null,
        );

    const [backendUser, setBackendUser] =
        useState<BackendUser | null>(
            () => readCachedUser(),
        );

    const [loading, setLoading] =
        useState(true);

    const syncBackendUser = async (
        user: FirebaseUser | null,
    ): Promise<BackendUser | null> => {
        if (!user) {
            setBackendUser(null);

            cacheUser(null);

            return null;
        }

        const token =
            await user.getIdToken();

        const response =
            await getCurrentUser(
                token,
            );

        const currentUser =
            response.data as BackendUser;

        setBackendUser(currentUser);

        cacheUser(currentUser);

        return currentUser;
    };

    useEffect(() => {
        const unsubscribe =
            onAuthStateChanged(
                auth,
                async (user) => {
                    setLoading(true);

                    setFirebaseUser(user);

                    try {
                        await syncBackendUser(
                            user,
                        );
                    } catch (error: any) {
                        console.error(
                            "Backend auth sync failed:",
                            error,
                        );

                        if (
                            error?.response
                                ?.status ===
                                401 ||
                            error?.response
                                ?.status ===
                                403
                        ) {
                            setBackendUser(
                                null,
                            );

                            cacheUser(
                                null,
                            );
                        }
                    } finally {
                        setLoading(false);
                    }
                },
            );

        return () => unsubscribe();
    }, []);

    const login = async (
        email: string,
        password: string,
    ) => {
        setLoading(true);

        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
        } finally {
            setLoading(false);
        }
    };

    const signup = async ({
        name,
        email,
        password,
    }: SignupPayload) => {
        setLoading(true);

        try {
            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password,
                );

            if (
                credential.user
            ) {
                await updateProfile(
                    credential.user,
                    {
                        displayName:
                            name,
                    },
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const refreshBackendUser =
        async () => {
            setLoading(true);

            try {
                return await syncBackendUser(
                    auth.currentUser,
                );
            } finally {
                setLoading(false);
            }
        };

    const logout = async () => {
        await signOut(auth);

        setFirebaseUser(null);

        setBackendUser(null);

        cacheUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                firebaseUser,
                backendUser,
                loading,
                login,
                signup,
                logout,
                refreshBackendUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider",
        );
    }

    return context;
}