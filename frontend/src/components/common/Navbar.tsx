import {
    Bell,
    LayoutDashboard,
    Menu,
    X,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { backendUser } = useAuth();
    const location = useLocation();

    const isLoggedIn = Boolean(backendUser);
    const role = backendUser?.role || "recruiter";

    const dashboardPath =
        role === "admin"
            ? "/admin/dashboard"
            : "/recruiter/dashboard";

    const logoPath = isLoggedIn ? dashboardPath : "/";

    const isDashboard =
        location.pathname === dashboardPath;

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#273142]/95 shadow-[0_10px_30px_rgba(15,23,42,0.16)] backdrop-blur-xl">
            <div className="flex h-20 items-center justify-between px-4 sm:px-6 xl:px-8">
                <Link
                    to={logoPath}
                    className="flex items-center gap-3"
                    onClick={closeMenu}
                >
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white shadow-sm">
                        <img
                            src="/logo.png"
                            alt="Xyvanta"
                            className="h-full w-full object-cover object-top"
                        />
                    </div>

                    <div>
                        <h1 className="text-lg font-black tracking-wide text-white">
                            XYVANTA
                        </h1>

                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Intelligence
                        </p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-4 text-sm font-bold lg:flex">
                    {!isLoggedIn ? (
                        <>
                            <Link
                                to="/"
                                className="text-slate-300 transition hover:text-sky-300"
                            >
                                Home
                            </Link>

                            <Link
                                to="/login"
                                className="text-slate-300 transition hover:text-sky-300"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="rounded-2xl border border-[#7A5A47] bg-[#B08968] px-5 py-2.5 text-sm font-black text-white shadow-[0_6px_18px_rgba(176,137,104,0.28)] transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-500 hover:shadow-[0_10px_24px_rgba(14,165,233,0.28)]"
                            >
                                Start Hiring
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to={dashboardPath}
                                className={`flex items-center gap-2 rounded-2xl border px-5 py-2.5 transition-all ${
                                    isDashboard
                                        ? "border-sky-300/30 bg-sky-400/15 text-sky-300 shadow-sm"
                                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-sky-300"
                                }`}
                            >
                                <LayoutDashboard size={17} />
                                Dashboard
                            </Link>

                            {role !== "admin" && (
                                <Link
                                    to="/recruiter/resumes"
                                    className="rounded-2xl border border-[#7A5A47] bg-[#B08968] px-5 py-2.5 text-sm font-black text-white shadow-[0_6px_18px_rgba(176,137,104,0.28)] transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-500 hover:shadow-[0_10px_24px_rgba(14,165,233,0.28)]"
                                >
                                    Start Analysis
                                </Link>
                            )}

                            <button
                                type="button"
                                className="relative rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 shadow-sm transition hover:bg-white/10 hover:text-sky-300"
                            >
                                <Bell size={18} />
                                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-sky-400" />
                            </button>

                            <ProfileDropdown />
                        </>
                    )}
                </nav>

                <button
                    type="button"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-white shadow-sm lg:hidden"
                >
                    {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {isMenuOpen && (
                <div className="border-t border-white/10 bg-[#273142] px-4 py-5 shadow-xl lg:hidden">
                    <div className="flex flex-col gap-4 text-sm font-bold text-slate-300">
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    onClick={closeMenu}
                                    to="/"
                                    className="hover:text-sky-300"
                                >
                                    Home
                                </Link>

                                <Link
                                    onClick={closeMenu}
                                    to="/login"
                                    className="hover:text-sky-300"
                                >
                                    Login
                                </Link>

                                <Link
                                    onClick={closeMenu}
                                    to="/signup"
                                    className="rounded-2xl border border-[#7A5A47] bg-[#B08968] px-5 py-3 text-center text-white"
                                >
                                    Start Hiring
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    onClick={closeMenu}
                                    to={dashboardPath}
                                    className="rounded-2xl border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sky-300"
                                >
                                    Dashboard
                                </Link>

                                {role !== "admin" && (
                                    <>
                                        <Link
                                            onClick={closeMenu}
                                            to="/recruiter/resumes"
                                            className="rounded-2xl border border-[#7A5A47] bg-[#B08968] px-4 py-3 text-white"
                                        >
                                            Start Analysis
                                        </Link>

                                        <Link
                                            onClick={closeMenu}
                                            to="/recruiter/ranking"
                                            className="hover:text-sky-300"
                                        >
                                            Ranking
                                        </Link>

                                        <Link
                                            onClick={closeMenu}
                                            to="/recruiter/history"
                                            className="hover:text-sky-300"
                                        >
                                            History
                                        </Link>
                                    </>
                                )}

                                <Link
                                    onClick={closeMenu}
                                    to="/recruiter/settings/profile"
                                    className="hover:text-sky-300"
                                >
                                    Profile Settings
                                </Link>

                                <div className="pt-2">
                                    <ProfileDropdown />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}