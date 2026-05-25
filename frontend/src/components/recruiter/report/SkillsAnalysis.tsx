import { CheckCircle2, XCircle } from "lucide-react";

import GlassCard from "../../ui/GlassCard";
import { formatValue } from "./reportFormatters";

export default function SkillsAnalysis({ selected }: { selected: any }) {
    const matched = selected?.matched_skills || [];
    const missing = selected?.missing_skills || [];

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <SkillCard
                title="Matched Skills"
                subtitle="Skills found in candidate profile"
                icon={<CheckCircle2 size={22} />}
                items={matched}
                empty="No matched skills detected."
                tone="emerald"
            />

            <SkillCard
                title="Missing Skills"
                subtitle="Important skills not found or weakly detected"
                icon={<XCircle size={22} />}
                items={missing}
                empty="No major missing skill detected."
                tone="red"
            />
        </div>
    );
}

function SkillCard({
    title,
    subtitle,
    icon,
    items,
    empty,
    tone,
}: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    items: any[];
    empty: string;
    tone: "emerald" | "red";
}) {
    const isGood = tone === "emerald";

    return (
        <GlassCard>
            <div className="flex items-start gap-4">
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                        isGood
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                            : "border-red-200 bg-red-50 text-red-500"
                    }`}
                >
                    {icon}
                </div>

                <div>
                    <h3
                        className={`text-xl font-black ${
                            isGood ? "text-emerald-700" : "text-red-600"
                        }`}
                    >
                        {title}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-slate-500">
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
                {items.length > 0 ? (
                    items.map((skill, index) => (
                        <span
                            key={`${formatValue(skill)}-${index}`}
                            className={`rounded-xl border px-3 py-2 text-xs font-black shadow-sm ${
                                isGood
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-red-200 bg-red-50 text-red-600"
                            }`}
                        >
                            {formatValue(skill)}
                        </span>
                    ))
                ) : (
                    <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
                        {empty}
                    </p>
                )}
            </div>
        </GlassCard>
    );
}