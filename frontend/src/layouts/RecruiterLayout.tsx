import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Upload, Trophy, History, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
    { label: "Dashboard", path: "/recruiter/dashboard", icon: LayoutDashboard },
    { label: "JD Manager", path: "/recruiter/jds", icon: FileText },
    { label: "Resume Upload", path: "/recruiter/resumes", icon: Upload },
    { label: "Candidate Ranking", path: "/recruiter/ranking", icon: Trophy },
    { label: "History", path: "/recruiter/history", icon: History },
];

export default function RecruiterLayout() {
    const location = useLocation();
    const { backendUser, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <aside className="fixed left-0 top-0 h-full w-72 border-r border-slate-200 bg-white p-5">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-slate-950">Xyvanta</h1>
                    <p className="text-sm text-slate-500">Recruiter Intelligence</p>
                </div>

                <nav className="space-y-2">
                    {links.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                    active
                                        ? "bg-sky-100 text-sky-700"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={logout}
                    className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </aside>

            <main className="ml-72 min-h-screen">
                <header className="border-b border-slate-200 bg-white px-8 py-4">
                    <p className="text-sm text-slate-500">Welcome back</p>
                    <h2 className="text-lg font-semibold text-slate-950">
                        {backendUser?.user?.name || "Recruiter"}
                    </h2>
                </header>

                <section className="p-8">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}