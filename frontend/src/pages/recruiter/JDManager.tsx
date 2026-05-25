import { useEffect, useMemo, useState } from "react";
import {
    BriefcaseBusiness,
    FileSearch,
    Globe2,
    Layers3,
    UploadCloud,
} from "lucide-react";
import { Link } from "react-router-dom";

import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import Loader from "../../components/ui/Loader";

import JDInsightCard from "../../components/recruiter/JDInsightCard";
import JDPreviewPanel from "../../components/recruiter/JDPreviewPanel";

import {
    getAnalysisDetail,
    getAnalysisHistory,
} from "../../services/analysisApi";

export default function JDManager() {
    const [history, setHistory] = useState<any[]>([]);
    const [latestDetail, setLatestDetail] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadJDManager = async () => {
            setLoading(true);
            setError("");

            try {
                const historyResponse = await getAnalysisHistory();
                const historyData = historyResponse.data || [];

                setHistory(historyData);

                if (historyData.length > 0) {
                    const detailResponse = await getAnalysisDetail(
                        historyData[0].analysis_id,
                    );

                    setLatestDetail(detailResponse.data);
                }
            } catch (err: any) {
                setError(
                    err?.response?.data?.detail ||
                        err?.response?.data?.message ||
                        err?.message ||
                        "Failed to load JD Manager.",
                );
            } finally {
                setLoading(false);
            }
        };

        loadJDManager();
    }, []);

    const stats = useMemo(() => {
        const totalJDs = history.reduce(
            (sum, item) => sum + (item.total_jds || item.jd_file_names?.length || 1),
            0,
        );

        const totalResumes = history.reduce(
            (sum, item) => sum + (item.total_resumes || 0),
            0,
        );

        const languages = new Set(
            history
                .map((item) => item.jd_language_name)
                .filter(Boolean),
        );

        return {
            totalJDs,
            totalResumes,
            languages: languages.size,
        };
    }, [history]);

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-100 blur-[90px]" />
                <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#F7F0E8] blur-[80px]" />

                <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                            <FileSearch size={16} />
                            JD Intelligence Center
                        </div>

                        <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#1E3A5F] md:text-5xl">
                            Manage parsed job descriptions and hiring requirements.
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                            Track extracted JD titles, required skills, languages,
                            experience, location, salary and candidate coverage.
                        </p>
                    </div>

                    <Link to="/recruiter/resumes">
                        <Button className="w-full px-8 py-4 lg:w-auto">
                            <UploadCloud size={18} className="mr-2" />
                            Upload New JD
                        </Button>
                    </Link>
                </div>
            </section>

            {loading && <Loader text="Loading JD intelligence..." />}

            {error && <Alert type="error" message={error} />}

            {!loading && !error && (
                <>
                    <div className="grid gap-5 md:grid-cols-3">
                        <JDInsightCard
                            title="Total JDs"
                            value={stats.totalJDs}
                            icon={BriefcaseBusiness}
                        />

                        <JDInsightCard
                            title="Resumes Compared"
                            value={stats.totalResumes}
                            icon={Layers3}
                        />

                        <JDInsightCard
                            title="Languages Detected"
                            value={stats.languages}
                            icon={Globe2}
                        />
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                        <JDPreviewPanel latest={latestDetail} />

                        <GlassCard>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                                        Library
                                    </p>

                                    <h2 className="mt-2 text-2xl font-black text-[#1E3A5F]">
                                        Recent JDs
                                    </h2>

                                    <p className="mt-2 text-sm font-medium text-slate-500">
                                        Recently uploaded job descriptions.
                                    </p>
                                </div>

                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                                    {history.length}
                                </span>
                            </div>

                            <div className="custom-scrollbar mt-6 max-h-[520px] space-y-3 overflow-y-auto pr-2">
                                {history.length === 0 && (
                                    <div className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                                        <p className="font-black text-[#1E3A5F]">
                                            No JD available
                                        </p>

                                        <p className="mt-2 text-sm font-medium text-slate-500">
                                            Upload a JD to begin parsing and ranking.
                                        </p>
                                    </div>
                                )}

                                {history.slice(0, 12).map((item) => (
                                    <Link
                                        key={item.analysis_id}
                                        to={`/recruiter/report/${item.analysis_id}`}
                                        className="block rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-100 hover:bg-slate-50 hover:shadow-md"
                                    >
                                        <p className="truncate font-black text-[#1E3A5F]">
                                            {item.jd_file_name ||
                                                item.jd_file_names?.[0] ||
                                                "Job Description"}
                                        </p>

                                        <p className="mt-1.5 text-xs font-semibold text-slate-500">
                                            {item.total_resumes || 0} resumes ·{" "}
                                            {item.jd_language_name || "Unknown language"}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </>
            )}
        </div>
    );
}