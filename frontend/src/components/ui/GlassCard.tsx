import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export default function GlassCard({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]",
                className,
            )}
        >
            {children}
        </div>
    );
}