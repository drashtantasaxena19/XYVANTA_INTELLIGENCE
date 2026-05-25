import { FileText, Globe2, Sparkles } from "lucide-react";

import GlassCard from "../ui/GlassCard";
import { formatValue } from "./report/reportFormatters";

export default function JDPreviewPanel({ latest }: { latest: any }) {
    if (!latest) {
        return (
            <GlassCard>
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                        <FileText size={28} />
                    </div>

                    <h3 className="text-xl font-black text-[#1E3A5F]">
                        No JD parsed yet
                    </h3>

                    <p className="mt-2 max-w-sm text-sm font-medium text-slate-500">
                        Upload a JD with resumes to generate structured job intelligence.
                    </p>
                </div>
            </GlassCard>
        );
    }

    const jd = latest.jd_parsed || latest.jds?.[0]?.parsed_jd || {};

    return (
        <GlassCard>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                <Sparkles size={15} />
                Latest Parsed JD
            </div>

            <h2 className="mt-4 text-3xl font-black text-[#1E3A5F]">
                {formatValue(jd.title || "Untitled Job Description")}
            </h2>

            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                    <Globe2 size={16} className="text-sky-600" />
                    {latest.jd_language_name ||
                        latest.jds?.[0]?.language_name ||
                        "Unknown language"}
                </span>

                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                    {latest.total_resumes || 0} resumes analyzed
                </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Info label="Location" value={jd.location} />
                <Info label="Mode" value={jd.mode} />
                <Info label="Salary" value={jd.salary} />
                <Info
                    label="Experience"
                    value={
                        jd.required_experience_years !== undefined
                            ? `${jd.required_experience_years} years`
                            : null
                    }
                />
                <Info label="Employment Type" value={jd.employment_type} />
                <Info label="Notice Period" value={jd.notice_period} />
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Required Skills
                </p>

                <div className="flex flex-wrap gap-2">
                    {(jd.required_skills || []).length > 0 ? (
                        jd.required_skills.slice(0, 25).map((skill: string) => (
                            <span
                                key={skill}
                                className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-700"
                            >
                                {formatValue(skill)}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm font-medium text-slate-500">
                            No required skills detected
                        </span>
                    )}
                </div>
            </div>
        </GlassCard>
    );
}

function Info({ label, value }: { label: string; value: any }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-100 hover:bg-white">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-black text-slate-700">
                {formatValue(value)}
            </p>
        </div>
    );
}