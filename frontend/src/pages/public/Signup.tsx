import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    Loader2,
    Rocket,
    ShieldCheck,
} from "lucide-react";

import { auth } from "../../firebase/firebaseConfig";
import { registerUserInBackend } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Navbar from "../../components/common/Navbar";

function getDashboardPath(role?: string) {
    return role === "admin" ? "/admin/dashboard" : "/recruiter/dashboard";
}

export default function Signup() {
    const navigate = useNavigate();

    const { backendUser, loading: authLoading, refreshBackendUser } = useAuth();

    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"recruiter" | "admin">("recruiter");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading && backendUser) {
            navigate(getDashboardPath(backendUser.role), { replace: true });
        }
    }, [authLoading, backendUser, navigate]);

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );

            await updateProfile(result.user, {
                displayName: name,
            });

            const token = await result.user.getIdToken();

            await registerUserInBackend(
                {
                    firebase_uid: result.user.uid,
                    name,
                    email,
                    role,
                    company_name: companyName,
                },
                token,
            );

            const syncedUser = await refreshBackendUser();

            navigate(getDashboardPath(syncedUser?.role || role), {
                replace: true,
            });
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Signup failed. Please try again.",
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
                                        src="/logo.png"
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
                                Create your hiring intelligence workspace.
                            </h2>

                            <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-slate-300">
                                Set up recruiter or admin access and start building
                                structured JD-CV matching reports.
                            </p>
                        </div>

                        <div className="relative z-10 grid gap-3">
                            <InfoRow text="Professional recruiter dashboard" />
                            <InfoRow text="Role-based secure workspace" />
                            <InfoRow text="AI parsing with deterministic scoring" />
                        </div>
                    </section>

                    <section className="flex min-h-[680px] flex-col justify-center p-6 sm:p-8 lg:p-12">
                        <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-slate-500 hover:bg-white hover:text-sky-600"
                            >
                                <ArrowLeft size={14} />
                                Back
                            </Link>

                            <img
                                src="/logo.png"
                                alt="Xyvanta"
                                className="h-11 w-11 rounded-2xl bg-white object-cover object-top shadow-sm"
                            />
                        </div>

                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F0E8] text-[#7A5A47] ring-1 ring-[#E6D8C8]">
                                <Rocket size={25} />
                            </div>

                            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                                Start hiring smarter
                            </p>

                            <h2 className="mt-2 text-4xl font-black tracking-tight text-[#1E3A5F]">
                                Create account
                            </h2>

                            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                                Set up your Xyvanta workspace.
                            </p>

                            {error && (
                                <div className="mt-6">
                                    <Alert type="error" message={error} />
                                </div>
                            )}

                            <form onSubmit={handleSignup} className="mt-8 space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="ml-1 text-xs font-black text-[#1E3A5F]">
                                            Full Name
                                        </label>

                                        <input
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-200 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(event) =>
                                                setName(event.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="ml-1 text-xs font-black text-[#1E3A5F]">
                                            Company
                                        </label>

                                        <div className="relative">
                                            <Building2
                                                size={16}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-200 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                                placeholder="Acme Corp"
                                                value={companyName}
                                                onChange={(event) =>
                                                    setCompanyName(
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="ml-1 text-xs font-black text-[#1E3A5F]">
                                        Email Address
                                    </label>

                                    <input
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-200 focus:bg-white focus:ring-4 focus:ring-sky-100"
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
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-200 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                        placeholder="••••••••"
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="ml-1 text-xs font-black text-[#1E3A5F]">
                                        Workspace Role
                                    </label>

                                    <select
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 outline-none transition focus:border-sky-200 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                        value={role}
                                        onChange={(event) =>
                                            setRole(
                                                event.target.value as
                                                    | "recruiter"
                                                    | "admin",
                                            )
                                        }
                                    >
                                        <option value="recruiter">Recruiter</option>
                                        <option value="admin">System Admin</option>
                                    </select>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading || authLoading}
                                    className="mt-5 w-full py-4"
                                >
                                    {loading || authLoading ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="mr-2 animate-spin"
                                            />
                                            Creating workspace...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight size={18} className="ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <p className="mt-8 text-center text-sm font-medium text-slate-500">
                                Already registered?{" "}
                                <Link
                                    to="/login"
                                    className="font-black text-[#1E3A5F] hover:text-sky-600"
                                >
                                    Login
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