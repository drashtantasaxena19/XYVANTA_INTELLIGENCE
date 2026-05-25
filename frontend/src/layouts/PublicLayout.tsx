import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link to="/" className="text-xl font-bold text-slate-950">
                        Xyvanta Intelligence
                    </Link>

                    <nav className="flex items-center gap-4 text-sm font-medium">
                        <Link to="/login" className="text-slate-600 hover:text-slate-950">
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="rounded-xl bg-slate-950 px-4 py-2 text-white hover:bg-slate-800"
                        >
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>

            <Outlet />
        </div>
    );
}