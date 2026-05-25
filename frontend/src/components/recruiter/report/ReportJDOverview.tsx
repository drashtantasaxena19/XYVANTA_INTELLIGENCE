import {
    BriefcaseBusiness,
    FileText,
    Globe2,
    Grid3X3,
    Layers3,
} from "lucide-react";

import GlassCard from "../../ui/GlassCard";
import {
    formatLabel,
    formatValue,
} from "./reportFormatters";

export default function ReportJDOverview({ analysis }: { analysis: any }) {
    const jds = analysis?.jds || [];
    const mode = analysis?.comparison_mode || "analysis_report";

    return (
        <GlassCard className="overflow-hidden">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                        <FileText size={15} />
                        Job Description Overview
                    </div>

                    <h2 className="mt-4 text-3xl font-black capitalize text-[#1E3A5F]">
                        {formatLabel(mode)}
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                        Report generated from parsed JDs, resumes, comparison matrix,
                        deterministic scoring and recruiter decision data.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
                    <MiniStat
                        icon={<BriefcaseBusiness size={18} />}
                        label="JDs"
                        value={analysis?.total_jds || jds.length || 1}
                    />

                    <MiniStat
                        icon={<Layers3 size={18} />}
                        label="CVs"
                        value={analysis?.total_resumes || 0}
                    />

                    <MiniStat
                        icon={<Grid3X3 size={18} />}
                        label="Comparisons"
                        value={
                            analysis?.total_comparisons ||
                            analysis?.primary_results?.length ||
                            analysis?.results?.length ||
                            analysis?.matrix?.length ||
                            0
                        }
                    />
                </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {jds.length > 0 ? (
                    jds.map((jd: any, index: number) => (
                        <div
                            key={jd.jd_id || jd.file_name || index}
                            className="group rounded-[1.7rem] border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:border-sky-100 hover:bg-white hover:shadow-md"
                        >
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sky-600">
                                    <FileText size={18} />
                                </div>

                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                                    JD #{index + 1}
                                </span>
                            </div>

                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                                File
                            </p>

                            <p className="mt-1 truncate text-base font-black text-[#1E3A5F]">
                                {formatValue(jd.file_name)}
                            </p>

                            <p className="mt-2 truncate text-sm font-semibold text-slate-600">
                                {formatValue(jd.parsed_jd?.title)}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-500">
                                    <Globe2 size={13} />
                                    {jd.language_name ||
                                        jd.detected_language ||
                                        "Unknown"}
                                </span>

                                {jd.parser_source && (
                                    <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                                        {jd.parser_source}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-[1.7rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-500">
                        No JD details found.
                    </div>
                )}
            </div>
        </GlassCard>
    );
}

function MiniStat({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: any;
}) {
    return (
        <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                {icon}
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-2xl font-black text-[#1E3A5F]">
                {formatValue(value)}
            </p>
        </div>
    );
}