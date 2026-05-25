import { useState } from "react";

import {
    sendPasswordResetEmail,
} from "firebase/auth";

import {
    Mail,
    ShieldCheck,
    X,
} from "lucide-react";

import { auth } from "../../firebase/firebaseConfig";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({
    open,
    onClose,
}: Props) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    if (!open) return null;

    const handleReset = async () => {
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        setLoading(true);

        try {
            await sendPasswordResetEmail(
                auth,
                email.trim(),
            );

            setSuccess(
                "Password reset email sent successfully.",
            );

            setEmail("");
        } catch (error) {
            console.error(error);

            setError(
                "Failed to send password reset email.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-md">
            <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
                <div className="border-b border-slate-200 bg-gradient-to-br from-slate-100 via-white to-sky-50 p-7">
                    <div className="flex items-start justify-between gap-5">
                        <div className="flex gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 ring-1 ring-sky-200">
                                <ShieldCheck size={24} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-[#1E3A5F]">
                                    Forgot Password
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Enter your recruiter email to receive a secure reset link.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-7">
                    {success && (
                        <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm font-semibold text-sky-700">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-2xl border border-[#B08968]/30 bg-[#B08968]/10 p-4 text-sm font-semibold text-[#7A5A47]">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-black text-[#1E3A5F]">
                            Email Address
                        </label>

                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-sky-400 focus-within:bg-white">
                            <Mail
                                size={18}
                                className="text-sky-500"
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value,
                                    )
                                }
                                placeholder="name@company.com"
                                className="w-full bg-transparent py-4 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className="mt-6 w-full rounded-2xl bg-[#B08968] px-5 py-4 text-sm font-black text-white shadow-[0_10px_24px_rgba(176,137,104,0.28)] transition hover:bg-sky-500 hover:shadow-[0_12px_28px_rgba(14,165,233,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Sending Reset Link..."
                            : "Send Reset Email"}
                    </button>
                </div>
            </div>
        </div>
    );
}