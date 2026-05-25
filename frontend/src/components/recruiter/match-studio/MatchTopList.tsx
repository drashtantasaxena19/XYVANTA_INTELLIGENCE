import { AlertCircle, ArrowRight, BriefcaseBusiness, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../ui/Button";
import { formatScore } from "../report/reportFormatters";

export default function MatchTopList({
    items,
}: {
    items: any[];
}) {
    return (
        <div className="mt-6 space-y-4">
            {items.slice(0, 10).map((item, index) => {
                const score = formatScore(item.final_score);

                return (
                    <div
                        key={`${item.jd_id}-${item.resume_id}-${index}`}
                        className="group overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lg"
                    >
                        <div className="grid gap-4 p-5 lg:grid-cols-[72px_1fr_1fr_140px] lg:items-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-xl font-black text-sky-600 ring-1 ring-sky-100">
                                #{index + 1}
                            </div>

                            <div className="min-w-0">
                                <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                                    <UserRound size={13} />
                                    Candidate
                                </p>

                                <p className="truncate text-base font-black text-[#1E3A5F]">
                                    {item.candidate_name ||
                                        item.resume_file_name ||
                                        item.file_name ||
                                        "Candidate"}
                                </p>

                                <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                                    {item.email || item.phone || "No contact detected"}
                                </p>
                            </div>

                            <div className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 p-4 lg:bg-transparent lg:p-0 lg:border-0">
                                <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                                    <BriefcaseBusiness size={13} />
                                    Job Description
                                </p>

                                <p className="truncate text-sm font-black text-slate-700">
                                    {item.jd_title ||
                                        item.jd_file_name ||
                                        "Job Description"}
                                </p>

                                <p className="mt-1 truncate text-xs font-medium text-slate-500">
                                    {item.jd_file_name || "Matrix comparison"}
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
                                <div className="rounded-[1.4rem] bg-gradient-to-br from-sky-500 to-[#1E3A5F] px-5 py-4 text-center text-white shadow-md">
                                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/70">
                                        Score
                                    </p>

                                    <p className="mt-1 text-3xl font-black leading-none">
                                        {score}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {items.length === 0 && (
                <div className="flex items-center gap-3 rounded-[1.7rem] border border-amber-200 bg-amber-50 p-5 text-sm font-bold text-amber-700">
                    <AlertCircle size={20} className="shrink-0 text-amber-500" />
                    No ranking result found. Ensure both JD and CV files are uploaded.
                </div>
            )}
        </div>
    );
}