import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";

import { useState } from "react";

import { KeyRound } from "lucide-react";

import Button from "../ui/Button";
import Alert from "../ui/Alert";

import { useAuth } from "../../context/AuthContext";

export default function PasswordChangeForm() {
    const { firebaseUser } = useAuth();

    const [formData, setFormData] =
        useState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]:
                e.target.value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent,
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {
            setError(
                "Passwords do not match.",
            );

            return;
        }

        if (
            formData.newPassword.length < 6
        ) {
            setError(
                "Password must contain at least 6 characters.",
            );

            return;
        }

        if (!firebaseUser?.email) {
            setError(
                "User not authenticated.",
            );

            return;
        }

        setLoading(true);

        try {
            const credential =
                EmailAuthProvider.credential(
                    firebaseUser.email,
                    formData.currentPassword,
                );

            await reauthenticateWithCredential(
                firebaseUser,
                credential,
            );

            await updatePassword(
                firebaseUser,
                formData.newPassword,
            );

            setSuccess(
                "Password updated successfully.",
            );

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error(error);

            setError(
                "Failed to update password.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            {error && (
                <Alert
                    type="error"
                    message={error}
                />
            )}

            {success && (
                <Alert
                    type="success"
                    message={success}
                />
            )}

            <Input
                label="Current Password"
                name="currentPassword"
                value={
                    formData.currentPassword
                }
                onChange={handleChange}
            />

            <Input
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
            />

            <Input
                label="Confirm Password"
                name="confirmPassword"
                value={
                    formData.confirmPassword
                }
                onChange={handleChange}
            />

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    <KeyRound
                        size={16}
                        className="mr-2"
                    />

                    {loading
                        ? "Updating..."
                        : "Update Password"}
                </Button>
            </div>
        </form>
    );
}

function Input({
    label,
    ...props
}: any) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
                {label}
            </label>

            <input
                type="password"
                {...props}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm text-white outline-none transition focus:border-cyan-400"
            />
        </div>
    );
}