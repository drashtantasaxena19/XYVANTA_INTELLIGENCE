import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
    ArrowLeft,
    ArrowRight,
    Loader2,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";

import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";

import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Navbar from "../../components/common/Navbar";

function getDashboardPath(role?: string) {
    return role === "admin" ? "/admin/dashboard" : "/recruiter/dashboard";
}

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const { backendUser, loading: authLoading, refreshBackendUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading && backendUser) {
            navigate(getDashboardPath(backendUser.role), { replace: true });
        }
    }, [authLoading, backendUser, navigate]);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);

            const syncedUser = await refreshBackendUser();
            const role = syncedUser?.role || "recruiter";
            const from = (location.state as any)?.from;

            navigate(
                from && from !== "/login" && from !== "/signup"
                    ? from
                    : getDashboardPath(role),
                { replace: true },
            );
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Login failed. Please check your credentials.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F5F9] font-sans text-slate-900">
            <Navbar />

            <main className="flex min-h-screen items-center justify-center px-4 pb-8 pt-28 sm:px-6 lg:px-8">
                <div className="grid w-full max-w-6xl overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
                    <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#273142] via-[#313C4E] to-[#43352D] p-8 lg:flex lg:flex-col lg:justify-between">
                        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-sky-400/20 blur-[90px]" />
                        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#B08968]/30 blur-[100px]" />

                        <div className="relative z-10">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black text-slate-200 transition hover:bg-white hover:text-[#273142]"
                            >
                                <ArrowLeft size={14} />
                                Back to Home
                            </Link>
                        </div>

                        <div className="relative z-10 py-12">
                            <div className="mb-8 flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white p-2 shadow-lg">
                                    <img
                                        src="/logo2.png"
                                        alt="Xyvanta"
                                        className="h-full w-full object-cover object-top"
                                    />
                                </div>

                                <div>
                                    <h1 className="text-3xl font-black tracking-wide text-white">
                                        XYVANTA
                                    </h1>
                                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-300">
                                        Intelligence
                                    </p>
                                </div>
                            </div>

                            <h2 className="max-w-md text-4xl font-black leading-tight text-white">
                                Sign in to your recruiter intelligence workspace.
                            </h2>

                            <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-slate-300">
                                Access candidate ranking, JD-CV reports, deterministic
                                scoring, and recruiter decisions from one clean dashboard.
                            </p>
                        </div>

                        <div className="relative z-10 grid gap-3">
                            <InfoRow text="Firebase authentication with backend role sync" />
                            <InfoRow text="Refresh-safe recruiter session cache" />
                            <InfoRow text="Protected recruiter dashboard routes" />
                        </div>
                    </section>

                    <section className="flex min-h-[620px] flex-col justify-center p-6 sm:p-8 lg:p-12">
                        <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-slate-500 hover:bg-white hover:text-sky-600"
                            >
                                <ArrowLeft size={14} />
                                Back
                            </Link>

                            <img
                                src="/logo2.png"
                                alt="Xyvanta"
                                className="h-11 w-11 rounded-2xl bg-white object-cover object-top shadow-sm"
                            />
                        </div>

                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                                <LockKeyhole size={25} />
                            </div>

                            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                                Welcome back
                            </p>

                            <h2 className="mt-2 text-4xl font-black tracking-tight text-[#1E3A5F]">
                                Login
                            </h2>

                            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                                Continue to Xyvanta Intelligence.
                            </p>

                            {error && (
                                <div className="mt-6">
                                    <Alert type="error" message={error} />
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="mt-8 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="ml-1 text-xs font-black text-[#1E3A5F]">
                                        Email Address
                                    </label>

                                    <input
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-200 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                        placeholder="name@company.com"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="ml-1 text-xs font-black text-[#1E3A5F]">
                                        Password
                                    </label>

                                    <input
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-200 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                        placeholder="••••••••"
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading || authLoading}
                                    className="w-full py-4"
                                >
                                    {loading || authLoading ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="mr-2 animate-spin"
                                            />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Secure Login
                                            <ArrowRight size={18} className="ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <p className="mt-8 text-center text-sm font-medium text-slate-500">
                                Don&apos;t have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="font-black text-[#1E3A5F] hover:text-sky-600"
                                >
                                    Create workspace
                                </Link>
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

function InfoRow({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-200">
            <ShieldCheck size={17} className="text-sky-300" />
            {text}
        </div>
    );
}