import { useEffect, useMemo, useState } from "react";
import { Trophy } from "lucide-react";

import Alert from "../../components/ui/Alert";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";

import RankingCandidateList from "../../components/recruiter/ranking/RankingCandidateList";
import RankingProfilePanel from "../../components/recruiter/ranking/RankingProfilePanel";

import {
    getAnalysisDetail,
    getAnalysisHistory,
    getDisplayResults,
    submitCandidateFeedback,
} from "../../services/analysisApi";

type DecisionAction = "shortlisted" | "rejected" | "hold";

export default function CandidateRanking() {
    const [latestAnalysis, setLatestAnalysis] = useState<any | null>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

    const [loading, setLoading] = useState(true);
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const loadLatestRanking = async () => {
            setLoading(true);
            setError("");

            try {
                const historyResponse = await getAnalysisHistory();
                const history = historyResponse.data || [];

                if (history.length === 0) {
                    setLoading(false);
                    return;
                }

                const latest = history[0];

                const detailResponse = await getAnalysisDetail(
                    latest.analysis_id,
                );

                const detail = detailResponse.data;
                const ranking = getDisplayResults(detail);

                setLatestAnalysis(detail);
                setMatches(ranking);
                setSelectedMatch(ranking?.[0] || null);
            } catch (err: any) {
                setError(
                    err?.response?.data?.detail ||
                        err?.response?.data?.message ||
                        err?.message ||
                        "Failed to load candidate ranking.",
                );
            } finally {
                setLoading(false);
            }
        };

        loadLatestRanking();
    }, []);

    const filteredMatches = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) return matches;

        return matches.filter((item) => {
            return (
                item.candidate_name?.toLowerCase().includes(keyword) ||
                item.email?.toLowerCase().includes(keyword) ||
                item.resume_file_name?.toLowerCase().includes(keyword) ||
                item.file_name?.toLowerCase().includes(keyword) ||
                item.jd_title?.toLowerCase().includes(keyword) ||
                item.jd_file_name?.toLowerCase().includes(keyword)
            );
        });
    }, [matches, search]);

    const updateDecisionLocally = (
        action: DecisionAction,
        target: any,
    ) => {
        setMatches((prev) =>
            prev.map((item) => {
                if (
                    item.resume_id === target.resume_id &&
                    item.jd_id === target.jd_id
                ) {
                    return {
                        ...item,
                        current_decision: action,
                    };
                }

                return item;
            }),
        );

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
        if (!latestAnalysis || !selectedMatch) return;

        setError("");
        setSuccessMessage("");
        setFeedbackLoading(true);

        try {
            await submitCandidateFeedback({
                analysis_id: latestAnalysis.analysis_id,
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

            <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-100 blur-[90px]" />
                <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#F7F0E8] blur-[80px]" />

                <div className="relative z-10">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                        <Trophy size={16} />
                        Candidate Ranking
                    </div>

                    <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#1E3A5F] md:text-5xl">
                        Review top JD-CV matches and recruiter decisions.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                        Supports single JD, multiple JD, single CV and full matrix
                        comparison results.
                    </p>
                </div>
            </section>

            {loading && <Loader text="Loading candidate ranking..." />}

            {!loading && matches.length === 0 && (
                <EmptyState
                    title="No ranked results found"
                    description="Run an AI Match Studio analysis first to generate ranking."
                />
            )}

            {!loading && matches.length > 0 && (
                <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
                    <RankingCandidateList
                        search={search}
                        setSearch={setSearch}
                        candidates={filteredMatches}
                        selected={selectedMatch}
                        onSelect={(item) => {
                            setSelectedMatch(item);
                            setSuccessMessage("");
                            setError("");
                        }}
                    />

                    <RankingProfilePanel
                        selected={selectedMatch}
                        feedbackLoading={feedbackLoading}
                        onFeedback={handleFeedback}
                    />
                </div>
            )}
        </div>
    );
}