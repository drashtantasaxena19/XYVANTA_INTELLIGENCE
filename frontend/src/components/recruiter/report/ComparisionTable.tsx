import {
    AlertTriangle,
    CheckCircle2,
    MinusCircle,
} from "lucide-react";

import {
    formatLabel,
    formatScore,
    formatValue,
    getStatusTone,
} from "./reportFormatters";

export default function ComparisonTable({ selected }: { selected: any }) {
    const comparison = selected?.comparison || {};
    const rows = Object.entries(comparison);

    if (rows.length === 0) {
        return (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
                No comparison evidence received.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            <div className="hidden border-b border-slate-200 bg-[#313C4E] px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-200 xl:grid xl:grid-cols-[180px_1fr_1fr_180px]">
                <div>Field</div>
                <div>JD Requirement</div>
                <div>Candidate CV</div>
                <div>Result</div>
            </div>

            {rows.map(([field, value]: any) => {
                const tone = getStatusTone(
                    value?.status,
                    value?.applied_to_score,
                );

                return (
                    <div
                        key={field}
                        className="grid gap-4 border-b border-slate-200 bg-white p-5 last:border-b-0 hover:bg-slate-50 xl:grid-cols-[180px_1fr_1fr_180px]"
                    >
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 xl:hidden">
                                Field
                            </p>

                            <p className="mt-1 text-sm font-black capitalize text-[#1E3A5F]">
                                {formatLabel(field)}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 xl:hidden">
                                JD Requirement
                            </p>

                            <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
                                {formatValue(
                                    value?.jd_value ??
                                        value?.jd_location ??
                                        value?.jd_mode,
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 xl:hidden">
                                Candidate CV
                            </p>

                            <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
                                {formatValue(
                                    value?.resume_value ??
                                        value?.resume_location,
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 xl:hidden">
                                Result
                            </p>

                            <div
                                className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${tone.wrapper}`}
                            >
                                {value?.applied_to_score === false ? (
                                    <MinusCircle size={14} />
                                ) : value?.status === "matched" ||
                                  value?.status === "available" ? (
                                    <CheckCircle2 size={14} />
                                ) : (
                                    <AlertTriangle size={14} />
                                )}

                                {String(tone.label).replaceAll("_", " ")}
                            </div>

                            {typeof value?.score === "number" && (
                                <p className="mt-2 text-xs font-bold text-slate-400">
                                    Score:{" "}
                                    <span className="text-sky-600">
                                        {formatScore(value.score)}%
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}