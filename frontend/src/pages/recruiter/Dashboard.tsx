import { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    FileText,
    Trophy,
    Users,
    UploadCloud,
    Sparkles,
    History,
} from "lucide-react";
import { Link } from "react-router-dom";

import Loader from "../../components/ui/Loader";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import RecruiterStatCard from "../../components/recruiter/RecruiterStatCard";
import RecentAnalysisPanel from "../../components/recruiter/RecentAnalysisPanel";

import {
    getAnalysisHistory,
    getDisplayResults,
} from "../../services/analysisApi";

export default function Dashboard() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await getAnalysisHistory();
                setHistory(response.data || []);
            } catch (err: any) {
                setError(
                    err?.response?.data?.detail ||
                        err?.response?.data?.message ||
                        err?.message ||
                        "Failed to load dashboard.",
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const stats = useMemo(() => {
        const allMatches = history.flatMap((item) => getDisplayResults(item));

        const totalResumes = history.reduce(
            (sum, item) => sum + (item.total_resumes || 0),
            0,
        );

        const averageScore =
            allMatches.length > 0
                ? Math.round(
                      allMatches.reduce(
                          (sum, item: any) => sum + Number(item.final_score || 0),
                          0,
                      ) / allMatches.length,
                  )
                : 0;

        const topScore =
            allMatches.length > 0
                ? Math.max(
                      ...allMatches.map((item: any) =>
                          Number(item.final_score || 0),
                      ),
                  )
                : 0;

        return {
            totalAnalyses: history.length,
            totalResumes,
            averageScore,
            topScore,
        };
    }, [history]);

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-100 blur-[90px]" />
                <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#F7F0E8] blur-[80px]" />

                <div className="relative flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                            <Sparkles size={16} />
                            AI Recruiter Workspace
                        </div>

                        <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#1E3A5F] md:text-5xl">
                            Welcome back to your hiring intelligence console.
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                            Upload JDs, analyze multilingual resumes, compare candidates,
                            and use deterministic ranking backed by AI parsing.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                        <Link to="/recruiter/resumes">
                            <Button className="w-full px-8 py-4">
                                <UploadCloud size={18} className="mr-2" />
                                Start New Analysis
                            </Button>
                        </Link>

                        <Link to="/recruiter/history">
                            <Button variant="secondary" className="w-full px-8 py-4">
                                <History size={18} className="mr-2" />
                                View History
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {loading && <Loader text="Loading recruiter dashboard..." />}

            {error && <Alert type="error" message={error} />}

            {!loading && !error && (
                <>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <RecruiterStatCard
                            title="Total Analyses"
                            value={stats.totalAnalyses}
                            icon={FileText}
                            tone="sky"
                        />

                        <RecruiterStatCard
                            title="Resumes Processed"
                            value={stats.totalResumes}
                            icon={Users}
                            tone="violet"
                        />

                        <RecruiterStatCard
                            title="Average Score"
                            value={`${stats.averageScore}%`}
                            icon={BarChart3}
                            tone="emerald"
                        />

                        <RecruiterStatCard
                            title="Top Match"
                            value={`${stats.topScore}%`}
                            icon={Trophy}
                            tone="brown"
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <RecentAnalysisPanel history={history} />

                        <GlassCard className="relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-100 blur-3xl" />

                            <div className="relative">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E6D8C8] bg-[#F7F0E8] text-[#7A5A47]">
                                    <Trophy size={24} />
                                </div>

                                <h2 className="mt-6 text-2xl font-black text-[#1E3A5F]">
                                    Recruiter Decisions
                                </h2>

                                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
                                    Review ranked candidates, shortlist strong matches,
                                    hold uncertain profiles, and reject poor fits with
                                    auditable feedback.
                                </p>

                                <Link to="/recruiter/ranking" className="mt-8 block">
                                    <Button className="w-full">
                                        View Candidate Ranking
                                    </Button>
                                </Link>
                            </div>
                        </GlassCard>
                    </div>
                </>
            )}
        </div>
    );
}