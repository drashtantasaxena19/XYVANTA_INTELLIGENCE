import { ArrowRight, Clock, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import GlassCard from "../ui/GlassCard";

export default function RecentAnalysisPanel({ history }: { history: any[] }) {
    return (
        <GlassCard className="lg:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                        Activity
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-[#1E3A5F]">
                        Recent Analysis
                    </h2>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                        Latest JD and resume intelligence runs.
                    </p>
                </div>

                <Link to="/recruiter/history">
                    <Button variant="secondary">View All</Button>
                </Link>
            </div>

            <div className="mt-7 space-y-3">
                {history.slice(0, 5).map((item) => (
                    <Link
                        key={item.analysis_id}
                        to={`/recruiter/report/${item.analysis_id}`}
                        className="group flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-100 hover:bg-slate-50 hover:shadow-md"
                    >
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sky-600 group-hover:bg-sky-50">
                                <FileText size={20} />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate font-black text-[#1E3A5F]">
                                    {item.jd_file_name ||
                                        item.jd_file_names?.[0] ||
                                        "Analysis Report"}
                                </p>

                                <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-500">
                                    <Clock size={13} />
                                    {item.total_resumes || 0} resumes ·{" "}
                                    {item.jd_language_name || "Unknown"}
                                </p>
                            </div>
                        </div>

                        <ArrowRight
                            size={18}
                            className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-500"
                        />
                    </Link>
                ))}

                {history.length === 0 && (
                    <div className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                        <p className="font-black text-[#1E3A5F]">
                            No analysis yet
                        </p>

                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Upload your first JD and resumes to start ranking candidates.
                        </p>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}