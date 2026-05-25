import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileSearch, Trash2 } from "lucide-react";

import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";

import ReportJDOverview from "../../components/recruiter/report/ReportJDOverview";
import ReportMatchList from "../../components/recruiter/report/ReportMatchList";
import ReportMatchDetail from "../../components/recruiter/report/ReportMatchDetail";

import {
    deleteAnalysis,
    getAnalysisDetail,
    getDisplayResults,
    submitCandidateFeedback,
} from "../../services/analysisApi";

type DecisionAction = "shortlisted" | "rejected" | "hold";

export default function CandidateReport() {
    const { analysisId } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState<any | null>(null);
    const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

    const [loading, setLoading] = useState(true);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const loadReport = async () => {
        if (!analysisId) {
            setError("Analysis ID is missing.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await getAnalysisDetail(analysisId);
            const data = response.data;
            const displayMatches = getDisplayResults(data);

            setAnalysis(data);

            setSelectedMatch((prev: any) => {
                if (!prev) return displayMatches?.[0] || null;

                return (
                    displayMatches.find(
                        (item: any) =>
                            item.resume_id === prev.resume_id &&
                            item.jd_id === prev.jd_id,
                    ) ||
                    displayMatches?.[0] ||
                    null
                );
            });
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load candidate report.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analysisId]);

    const matches = useMemo(() => getDisplayResults(analysis), [analysis]);

    const updateDecisionLocally = (
        action: DecisionAction,
        target: any,
    ) => {
        const updateItem = (item: any) => {
            if (
                item?.resume_id === target?.resume_id &&
                item?.jd_id === target?.jd_id
            ) {
                return {
                    ...item,
                    current_decision: action,
                };
            }

            return item;
        };

        setAnalysis((prev: any) => {
            if (!prev) return prev;

            const next = {
                ...prev,
            };

            [
                "primary_results",
                "results",
                "matrix",
                "ranked_candidates",
                "ranked_jobs",
            ].forEach((key) => {
                if (Array.isArray(next[key])) {
                    next[key] = next[key].map(updateItem);
                }
            });

            return next;
        });

        setSelectedMatch((prev: any) => {
            if (!prev) return prev;

            if (
                prev.resume_id === target.resume_id &&
                prev.jd_id === target.jd_id
            ) {
                return {
                    ...prev,
                    current_decision: action,
                };
            }

            return prev;
        });
    };

    const handleFeedback = async (action: DecisionAction) => {
        if (!analysis || !selectedMatch) return;

        setError("");
        setSuccessMessage("");
        setFeedbackLoading(true);

        try {
            await submitCandidateFeedback({
                analysis_id: analysis.analysis_id,
                resume_id: selectedMatch.resume_id,
                action,
            });

            updateDecisionLocally(action, selectedMatch);

            setSuccessMessage(
                `Candidate marked as ${action.replaceAll("_", " ")} successfully.`,
            );
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to save feedback.",
            );

            throw err;
        } finally {
            setFeedbackLoading(false);
        }
    };

    const handleDeleteReport = async () => {
        if (!analysis?.analysis_id) return;

        setDeleteLoading(true);
        setError("");

        try {
            await deleteAnalysis(analysis.analysis_id);
            navigate("/recruiter/history", { replace: true });
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to delete report.",
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {error && (
                <Alert
                    floating
                    type="error"
                    message={error}
                    onClose={() => setError("")}
                />
            )}

            {successMessage && (
                <Alert
                    floating
                    type="success"
                    message={successMessage}
                    onClose={() => setSuccessMessage("")}
                />
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link to="/recruiter/history">
                    <Button variant="secondary" className="rounded-full">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to History
                    </Button>
                </Link>

                {analysis && (
                    <Button
                        variant="danger"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2 size={17} className="mr-2" />
                        Delete Report
                    </Button>
                )}
            </div>

            <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-100 blur-[90px]" />
                <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#F7F0E8] blur-[80px]" />

                <div className="relative z-10">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                        <FileSearch size={16} />
                        Candidate Report
                    </div>

                    <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#1E3A5F] md:text-5xl">
                        Detailed match report and decision workspace.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                        Review JD-CV matrix scores, comparison evidence,
                        parsed fields, join probability and recruiter decisions.
                    </p>
                </div>
            </section>

            {loading && <Loader text="Loading candidate report..." />}

            {!loading && !analysis && (
                <EmptyState
                    title="Report not found"
                    description="This analysis report could not be loaded."
                />
            )}

            {!loading && analysis && (
                <>
                    <ReportJDOverview analysis={analysis} />

                    {matches.length === 0 ? (
                        <EmptyState
                            title="No match results"
                            description="This analysis has no JD-CV comparison matrix."
                        />
                    ) : (
                        <section className="grid gap-6 xl:grid-cols-[390px_1fr]">
                            <ReportMatchList
                                matches={matches}
                                selected={selectedMatch}
                                onSelect={(item) => {
                                    setSelectedMatch(item);
                                    setSuccessMessage("");
                                    setError("");
                                }}
                            />

                            <ReportMatchDetail
                                selected={selectedMatch}
                                feedbackLoading={feedbackLoading}
                                onFeedback={handleFeedback}
                            />
                        </section>
                    )}
                </>
            )}

            <Modal
                open={deleteOpen}
                title="Delete this report?"
                description="This will delete this analysis and its related JD, resume and feedback records."
                onClose={() => setDeleteOpen(false)}
            >
                <div className="flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => setDeleteOpen(false)}
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        onClick={handleDeleteReport}
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? "Deleting..." : "Delete Report"}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}