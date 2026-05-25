import { CheckCircle2, MinusCircle } from "lucide-react";

import GlassCard from "../../ui/GlassCard";
import { formatLabel, formatScore } from "./reportFormatters";

export default function ScoreBreakdown({ breakdown }: { breakdown: any }) {
    const entries = Object.entries(breakdown || {});

    return (
        <GlassCard>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                        Weighted Evaluation
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-[#1E3A5F]">
                        Score Breakdown
                    </h3>
                </div>

                <p className="text-xs font-semibold text-slate-500">
                    Neutral factors are shown separately from failed factors.
                </p>
            </div>

            {entries.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                    No score breakdown received.
                </div>
            ) : (
                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                    {entries.map(([key, item]: any) => {
                        const percentage = formatScore(item?.percentage);
                        const appliedToScore = item?.applied_to_score !== false;

                        return (
                            <div
                                key={key}
                                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-wide text-[#1E3A5F]">
                                            {formatLabel(key)}
                                        </p>

                                        <p className="mt-1 text-xs font-medium text-slate-500">
                                            Weight:{" "}
                                            <span className="font-black text-slate-700">
                                                {item?.weight ?? "N/A"}
                                            </span>
                                        </p>
                                    </div>

                                    <div
                                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${
                                            appliedToScore
                                                ? "border-sky-200 bg-sky-50 text-sky-700"
                                                : "border-slate-200 bg-slate-50 text-slate-500"
                                        }`}
                                    >
                                        {appliedToScore ? (
                                            <CheckCircle2 size={14} />
                                        ) : (
                                            <MinusCircle size={14} />
                                        )}
                                        {appliedToScore
                                            ? "Applied"
                                            : "Neutral"}
                                    </div>
                                </div>

                                <div className="flex items-end justify-between">
                                    <p className="text-4xl font-black text-[#1E3A5F]">
                                        {percentage}
                                        <span className="text-lg text-slate-400">
                                            %
                                        </span>
                                    </p>

                                    {typeof item?.score === "number" && (
                                        <p className="text-xs font-bold text-slate-400">
                                            Score {item.score}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${
                                            appliedToScore
                                                ? "bg-gradient-to-r from-sky-400 to-sky-600"
                                                : "bg-slate-300"
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                {item?.reason && (
                                    <p className="mt-4 text-xs font-medium leading-relaxed text-slate-500">
                                        {item.reason}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </GlassCard>
    );
}