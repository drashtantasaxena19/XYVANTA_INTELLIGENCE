import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface Props {
    allowedRoles?: string[];
}

export default function ProtectedRoute({
    allowedRoles = [],
}: Props) {
    const {
        backendUser,
        loading,
    } = useAuth();

    const location = useLocation();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#020617]">
                <div className="flex flex-col items-center">
                    <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />

                    <p className="mt-5 text-sm font-bold text-slate-400">
                        Loading workspace...
                    </p>
                </div>
            </div>
        );
    }

    if (!backendUser) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(
            backendUser.role,
        )
    ) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <Outlet />;
}