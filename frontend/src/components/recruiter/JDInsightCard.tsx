import type { LucideIcon } from "lucide-react";

import GlassCard from "../ui/GlassCard";

export default function JDInsightCard({
    title,
    value,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    icon: LucideIcon;
}) {
    return (
        <GlassCard className="group overflow-hidden">
            <div className="relative flex items-center gap-5">
                <Icon
                    size={120}
                    className="absolute -right-8 -top-10 text-slate-900 opacity-[0.025] transition group-hover:scale-110"
                />

                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600">
                    <Icon size={24} />
                </div>

                <div className="relative min-w-0">
                    <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                        {title}
                    </p>

                    <p className="mt-1 truncate text-3xl font-black text-[#1E3A5F]">
                        {value}
                    </p>
                </div>
            </div>
        </GlassCard>
    );
}