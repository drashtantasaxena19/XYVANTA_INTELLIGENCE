import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost" | "beige";
};

export default function Button({
    children,
    variant = "primary",
    className,
    ...props
}: ButtonProps) {
    const styles = {
        primary:
            "bg-sky-500 text-white shadow-sm hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-lg",
        secondary:
            "border border-slate-200 bg-white text-[#1E3A5F] hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700",
        danger:
            "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg",
        ghost:
            "text-slate-500 hover:bg-slate-100 hover:text-[#1E3A5F]",
        beige:
            "border border-[#E6D8C8] bg-[#F7F0E8] text-[#4B3425] hover:bg-[#EFE2D4]",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-black transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
                styles[variant],
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}