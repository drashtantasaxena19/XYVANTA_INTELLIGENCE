import {
    BriefcaseBusiness,
    FileText,
    GitCompare,
    Layers3,
    Sparkles,
} from "lucide-react";

import type { ComparisonMode } from "../../../services/analysisApi";

const modes = [
    {
        id: "single_jd_multiple_cv",
        title: "Single JD vs Multiple CVs",
        description: "Rank many candidates against one job description.",
        icon: FileText,
        tag: "Candidate ranking",
    },
    {
        id: "multiple_jd_single_cv",
        title: "Multiple JDs vs Single CV",
        description: "Find the best job fit for one candidate profile.",
        icon: GitCompare,
        tag: "Job matching",
    },
    {
        id: "multiple_jd_multiple_cv",
        title: "Multiple JDs vs Multiple CVs",
        description: "Generate a complete JD-CV comparison matrix.",
        icon: Layers3,
        tag: "Full matrix",
    },
] as const;

export default function MatchModeSelector({
    value,
    onChange,
}: {
    value: ComparisonMode;
    onChange: (mode: ComparisonMode) => void;
}) {
    return (
        <section className="rounded-[2.5rem] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.06)] lg:p-6">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                        <Sparkles size={15} />
                        Analysis Mode
                    </div>

                    <h2 className="mt-3 text-2xl font-black text-[#1E3A5F]">
                        Choose how you want to compare files
                    </h2>
                </div>

                <p className="max-w-md text-sm font-medium leading-relaxed text-slate-500">
                    The backend returns mode-aware primary results, and the UI displays each mode clearly.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {modes.map((mode) => {
                    const Icon = mode.icon;
                    const active = value === mode.id;

                    return (
                        <button
                            key={mode.id}
                            onClick={() => onChange(mode.id)}
                            className={`group relative overflow-hidden rounded-[2rem] border p-6 text-left transition-all ${
                                active
                                    ? "border-sky-200 bg-sky-50 shadow-md ring-4 ring-sky-100"
                                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-sky-100 hover:bg-slate-50 hover:shadow-md"
                            }`}
                        >
                            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-sky-100/50 blur-2xl transition group-hover:bg-sky-200/60" />

                            <div className="relative">
                                <div className="mb-5 flex items-center justify-between gap-3">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition ${
                                            active
                                                ? "border-sky-200 bg-sky-500 text-white"
                                                : "border-slate-200 bg-white text-sky-600 group-hover:bg-sky-50"
                                        }`}
                                    >
                                        <Icon size={24} />
                                    </div>

                                    <span
                                        className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                                            active
                                                ? "border-sky-200 bg-white text-sky-700"
                                                : "border-slate-200 bg-slate-50 text-slate-400"
                                        }`}
                                    >
                                        {mode.tag}
                                    </span>
                                </div>

                                <h3
                                    className={`text-lg font-black ${
                                        active
                                            ? "text-[#1E3A5F]"
                                            : "text-slate-800"
                                    }`}
                                >
                                    {mode.title}
                                </h3>

                                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                                    {mode.description}
                                </p>

                                <div className="mt-5 flex items-center gap-2 text-xs font-black text-slate-400">
                                    <BriefcaseBusiness size={14} />
                                    Production recruiter flow
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}