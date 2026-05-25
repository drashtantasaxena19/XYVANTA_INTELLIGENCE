import { useEffect, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Info,
    X,
    XCircle,
} from "lucide-react";

type AlertType =
    | "success"
    | "error"
    | "info"
    | "warning";

type AlertProps = {
    type?: AlertType;
    message: string;
    floating?: boolean;
    autoClose?: boolean;
    duration?: number;
    onClose?: () => void;
    className?: string;
};

export default function Alert({
    type = "info",
    message,
    floating = false,
    autoClose = true,
    duration = 3500,
    onClose,
    className = "",
}: AlertProps) {
    const [visible, setVisible] =
        useState(true);

    useEffect(() => {
        setVisible(true);

        if (!floating || !autoClose)
            return;

        const timer =
            window.setTimeout(() => {
                setVisible(false);

                if (onClose) {
                    onClose();
                }
            }, duration);

        return () =>
            window.clearTimeout(timer);
    }, [
        message,
        type,
        floating,
        autoClose,
        duration,
        onClose,
    ]);

    if (!visible || !message)
        return null;

    const styles = {
        success: {
            wrapper:
                "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-100",
            icon: CheckCircle2,
            accent: "bg-emerald-500",
            button:
                "hover:bg-emerald-100",
        },

        error: {
            wrapper:
                "border-red-200 bg-red-50 text-red-800 shadow-red-100",
            icon: XCircle,
            accent: "bg-red-500",
            button:
                "hover:bg-red-100",
        },

        warning: {
            wrapper:
                "border-amber-200 bg-amber-50 text-amber-800 shadow-amber-100",
            icon: AlertCircle,
            accent: "bg-amber-500",
            button:
                "hover:bg-amber-100",
        },

        info: {
            wrapper:
                "border-sky-200 bg-sky-50 text-[#1E3A5F] shadow-sky-100",
            icon: Info,
            accent: "bg-sky-500",
            button:
                "hover:bg-sky-100",
        },
    };

    const config = styles[type];

    const Icon = config.icon;

    const alertContent = (
        <div
            className={`relative overflow-hidden rounded-[1.6rem] border px-5 py-4 shadow-xl backdrop-blur ${config.wrapper} ${className}`}
        >
            <div
                className={`absolute left-0 top-0 h-full w-1.5 ${config.accent}`}
            />

            <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                    <Icon size={20} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-relaxed">
                        {message}
                    </p>
                </div>

                {(floating ||
                    onClose) && (
                    <button
                        type="button"
                        onClick={() => {
                            setVisible(
                                false,
                            );

                            if (
                                onClose
                            ) {
                                onClose();
                            }
                        }}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${config.button}`}
                    >
                        <X size={15} />
                    </button>
                )}
            </div>
        </div>
    );

    if (!floating) {
        return alertContent;
    }

    return (
        <div className="pointer-events-none fixed left-0 right-0 top-24 z-[9999] flex justify-center px-4">
            <div className="pointer-events-auto w-full max-w-xl animate-slide-down">
                {alertContent}
            </div>
        </div>
    );
}