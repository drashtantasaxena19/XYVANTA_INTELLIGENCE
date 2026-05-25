import {
    ChevronDown,
    LogOut,
    Settings,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function ProfileDropdown() {
    const navigate = useNavigate();

    const {
        backendUser,
        firebaseUser,
        logout,
    } = useAuth();

    const role =
        backendUser?.role || "recruiter";

    const name =
        backendUser?.user?.name ||
        firebaseUser?.displayName ||
        "Recruiter";

    const email =
        backendUser?.email ||
        firebaseUser?.email ||
        "workspace@xyvanta.ai";

    const settingsPath =
        role === "admin"
            ? "/admin/settings/profile"
            : "/recruiter/settings/profile";

    const dashboardPath =
        role === "admin"
            ? "/admin/dashboard"
            : "/recruiter/dashboard";

    const handleLogout = async () => {
        await logout();

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <div className="group relative">
            <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-1.5 pr-4 shadow-sm transition hover:bg-slate-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                    <UserRound size={18} />
                </div>

                <div className="hidden text-left lg:block">
                    <p className="max-w-[140px] truncate text-sm font-black text-[#1E3A5F]">
                        {name}
                    </p>

                    <p className="max-w-[160px] truncate text-[11px] font-semibold text-slate-400">
                        {email}
                    </p>
                </div>

                <ChevronDown
                    size={16}
                    className="hidden text-slate-400 transition group-hover:rotate-180 lg:block"
                />
            </button>

            <div className="invisible absolute right-0 top-14 z-50 w-72 translate-y-2 rounded-[1.7rem] border border-slate-200 bg-white p-3 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="font-black text-[#1E3A5F]">
                                {name}
                            </p>

                            <p className="mt-1 truncate text-xs font-medium text-slate-500">
                                {email}
                            </p>
                        </div>

                        <div className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-sky-700">
                            {role}
                        </div>
                    </div>
                </div>

                <div className="mt-2 space-y-1">
                    <Link
                        to={dashboardPath}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-sky-50 hover:text-sky-600"
                    >
                        <ShieldCheck size={17} />
                        Dashboard
                    </Link>

                    <Link
                        to={settingsPath}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-sky-50 hover:text-sky-600"
                    >
                        <Settings size={17} />
                        Profile Settings
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}