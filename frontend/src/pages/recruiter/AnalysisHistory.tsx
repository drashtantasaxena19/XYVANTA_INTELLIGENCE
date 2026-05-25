import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Clock,
    Eye,
    FileSearch,
    FileText,
    Grid3X3,
    Layers3,
    Trash2,
} from "lucide-react";

import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";

import {
    clearAnalysisHistory,
    deleteAnalysis,
    getAnalysisHistory,
    getDisplayResults,
} from "../../services/analysisApi";

export default function AnalysisHistory() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [clearOpen, setClearOpen] = useState(false);

    const loadHistory = async () => {
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
                    "Failed to load analysis history.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const stats = useMemo(() => {
        const totalJds = history.reduce(
            (sum, item) => sum + (item.total_jds || item.jd_file_names?.length || 1),
            0,
        );

        const totalResumes = history.reduce(
            (sum, item) => sum + (item.total_resumes || 0),
            0,
        );

        const totalComparisons = history.reduce(
            (sum, item) => sum + getDisplayResults(item).length,
            0,
        );

        return {
            totalAnalyses: history.length,
            totalJds,
            totalResumes,
            totalComparisons,
        };
    }, [history]);

    const handleDelete = async () => {
        if (!deleteTarget?.analysis_id) return;

        setActionLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            await deleteAnalysis(deleteTarget.analysis_id);
            setSuccessMessage("Analysis report deleted successfully.");
            setDeleteTarget(null);
            await loadHistory();
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to delete analysis.",
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleClearAll = async () => {
        setActionLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            await clearAnalysisHistory();
            setHistory([]);
            setSuccessMessage("All analysis history cleared successfully.");
            setClearOpen(false);
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to clear analysis history.",
            );
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-100 blur-[90px]" />
                <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#F7F0E8] blur-[80px]" />

                <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                            <Clock size={16} />
                            Analysis History
                        </div>

                        <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#1E3A5F] md:text-5xl">
                            Review every JD-CV matching run.
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                            Track single JD analysis, multi-JD matching, full matrix
                            comparisons, candidate scores and recruiter decisions.
                        </p>
                    </div>

                    {history.length > 0 && (
                        <Button
                            variant="danger"
                            onClick={() => setClearOpen(true)}
                            disabled={actionLoading}
                            className="w-full lg:w-auto"
                        >
                            <Trash2 size={17} className="mr-2" />
                            Clear All
                        </Button>
                    )}
                </div>
            </section>

            {loading && <Loader text="Loading previous analysis..." />}

            {error && <Alert type="error" message={error} />}

            {successMessage && <Alert type="success" message={successMessage} />}

            {!loading && !error && (
                <>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <HistoryStat label="Total Analyses" value={stats.totalAnalyses} icon={FileSearch} />
                        <HistoryStat label="JDs Processed" value={stats.totalJds} icon={FileText} />
                        <HistoryStat label="CVs Processed" value={stats.totalResumes} icon={Layers3} />
                        <HistoryStat label="Total Comparisons" value={stats.totalComparisons} icon={Grid3X3} />
                    </div>

                    {history.length === 0 ? (
                        <EmptyState
                            title="No analysis found"
                            description="Use AI Match Studio to create your first JD-CV comparison."
                        />
                    ) : (
                        <div className="grid gap-5">
                            {history.map((item) => (
                                <HistoryCard
                                    key={item.analysis_id}
                                    item={item}
                                    onDelete={() => setDeleteTarget(item)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            <Modal
                open={Boolean(deleteTarget)}
                title="Delete this report?"
                description="This will delete this analysis and related JD, resume and feedback records."
                onClose={() => setDeleteTarget(null)}
            >
                <div className="flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => setDeleteTarget(null)}
                        disabled={actionLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={actionLoading}
                    >
                        {actionLoading ? "Deleting..." : "Delete Report"}
                    </Button>
                </div>
            </Modal>

            <Modal
                open={clearOpen}
                title="Clear all history?"
                description="This will remove all analysis reports from your recruiter history."
                onClose={() => setClearOpen(false)}
            >
                <div className="flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => setClearOpen(false)}
                        disabled={actionLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        onClick={handleClearAll}
                        disabled={actionLoading}
                    >
                        {actionLoading ? "Clearing..." : "Clear All"}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

function HistoryStat({ label, value, icon: Icon }: any) {
    return (
        <div className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-sky-100 hover:shadow-lg">
            <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600">
                    <Icon size={24} />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 truncate text-3xl font-black text-[#1E3A5F]">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function HistoryCard({ item, onDelete }: { item: any; onDelete: () => void }) {
    const mode = item.comparison_mode || "single_jd_multiple_cv";
    const modeLabel = mode.replaceAll("_", " ");
    const displayResults = getDisplayResults(item);

    const jdTitle =
        item.jd_file_name ||
        item.jd_file_names?.[0] ||
        item.jds?.[0]?.file_name ||
        "Job Description Analysis";

    return (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-100 hover:shadow-lg lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-sky-600">
                            <Grid3X3 size={12} />
                            {modeLabel}
                        </span>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                            <Clock size={13} />
                            {item.created_at
                                ? new Date(item.created_at).toLocaleString()
                                : "Unknown date"}
                        </span>
                    </div>

                    <h2 className="truncate text-2xl font-black text-[#1E3A5F]">
                        {jdTitle}
                    </h2>

                    <p className="mt-1 break-all text-xs font-medium text-slate-400">
                        Analysis ID:{" "}
                        <span className="text-slate-500">{item.analysis_id}</span>
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <MiniPill label="JDs" value={item.total_jds || item.jd_file_names?.length || 1} />
                        <MiniPill label="CVs" value={item.total_resumes || 0} />
                        <MiniPill label="Comparisons" value={item.total_comparisons || displayResults.length || 0} />
                        <MiniPill label="Language" value={item.jd_language_name || "Unknown"} />
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <Link to={`/recruiter/report/${item.analysis_id}`}>
                        <Button className="w-full">
                            <Eye size={18} className="mr-2" />
                            View Report
                        </Button>
                    </Link>

                    <Button variant="danger" onClick={onDelete} className="w-full">
                        <Trash2 size={18} className="mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {displayResults.length > 0 && (
                <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
                    <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                            Top Results
                        </p>
                    </div>

                    {displayResults.slice(0, 4).map((candidate: any, index: number) => (
                        <div
                            key={`${candidate.resume_id}-${candidate.jd_id || index}`}
                            className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 last:border-b-0"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-black text-[#1E3A5F]">
                                    {candidate.candidate_name ||
                                        candidate.resume_file_name ||
                                        candidate.file_name ||
                                        "Candidate"}
                                </p>

                                <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                                    {candidate.jd_title ||
                                        candidate.jd_file_name ||
                                        "Comparison result"}
                                </p>
                            </div>

                            <div className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-black text-emerald-700">
                                {candidate.final_score ?? 0}%
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function MiniPill({ label, value }: { label: string; value: string | number }) {
    return (
        <span className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">
            <span className="mr-1 text-[10px] uppercase tracking-wide text-slate-400">
                {label}
            </span>
            <span className="font-black text-slate-700">{value}</span>
        </span>
    );
}