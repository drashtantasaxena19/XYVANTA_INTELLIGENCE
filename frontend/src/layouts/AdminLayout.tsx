import { Link, Outlet, useLocation } from "react-router-dom";
import { BarChart3, Users, Activity, FileClock, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
    { label: "Dashboard", path: "/admin/dashboard", icon: BarChart3 },
    { label: "Recruiters", path: "/admin/recruiters", icon: Users },
    { label: "Usage", path: "/admin/usage", icon: Activity },
    { label: "Logs", path: "/admin/logs", icon: FileClock },
    { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
    const location = useLocation();
    const { backendUser, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <aside className="fixed left-0 top-0 h-full w-72 border-r border-slate-200 bg-white p-5">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-slate-950">Xyvanta Admin</h1>
                    <p className="text-sm text-slate-500">Platform Control</p>
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
                                        ? "bg-violet-100 text-violet-700"
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
                    <p className="text-sm text-slate-500">Admin Workspace</p>
                    <h2 className="text-lg font-semibold text-slate-950">
                        {backendUser?.user?.name || "Admin"}
                    </h2>
                </header>

                <section className="p-8">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}