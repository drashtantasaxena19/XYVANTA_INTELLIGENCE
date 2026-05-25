import { useState } from "react";
import {
    Mail,
    Phone,
    Sparkles,
    UserRound,
} from "lucide-react";

import Alert from "../../ui/Alert";
import Button from "../../ui/Button";
import GlassCard from "../../ui/GlassCard";

import ScoreOverview from "./ScoreOverview";
import ScoreBreakdown from "./ScoreBreakdown";
import SkillsAnalysis from "./SkillsAnalysis";
import ComparisonTable from "./ComparisionTable";

import {
    formatLabel,
    formatScore,
    formatValue,
} from "./reportFormatters";

export default function ReportMatchDetail({
    selected,
    feedbackLoading,
    onFeedback,
}: {
    selected: any;
    feedbackLoading: boolean;
    onFeedback: (
        action:
            | "shortlisted"
            | "rejected"
            | "hold",
    ) => Promise<any>;
}) {
    const [toast, setToast] =
        useState<{
            type:
                | "success"
                | "error"
                | "info";
            message: string;
        } | null>(null);

    if (!selected) return null;

    const joinProbability =
        selected?.join_probability;

    const factors =
        joinProbability?.factors || {};

    const handleDecision =
        async (
            action:
                | "shortlisted"
                | "rejected"
                | "hold",
        ) => {
            try {
                await onFeedback(action);

                setToast({
                    type: "success",
                    message: `Candidate marked as ${action}.`,
                });
            } catch {
                setToast({
                    type: "error",
                    message:
                        "Failed to save recruiter decision.",
                });
            }
        };

    return (
        <>
            {toast && (
                <Alert
                    floating
                    type={toast.type}
                    message={
                        toast.message
                    }
                    onClose={() =>
                        setToast(null)
                    }
                />
            )}

            <div className="space-y-6">
                <ScoreOverview
                    selected={selected}
                />

                <GlassCard className="border-slate-200">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sky-600">
                                <UserRound
                                    size={18}
                                />

                                <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                                    Candidate
                                    Overview
                                </span>
                            </div>

                            <h2 className="mt-3 text-3xl font-black text-[#1E3A5F]">
                                {selected.candidate_name ||
                                    selected.resume_file_name ||
                                    selected.file_name ||
                                    "Candidate"}
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                                <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                                    <Mail
                                        size={
                                            15
                                        }
                                        className="text-slate-400"
                                    />

                                    {selected.email ||
                                        "No email"}
                                </span>

                                <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                                    <Phone
                                        size={
                                            15
                                        }
                                        className="text-slate-400"
                                    />

                                    {selected.phone ||
                                        "No phone"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                disabled={
                                    feedbackLoading
                                }
                                onClick={() =>
                                    handleDecision(
                                        "shortlisted",
                                    )
                                }
                                className="bg-emerald-500 hover:bg-emerald-600"
                            >
                                Shortlist
                            </Button>

                            <Button
                                disabled={
                                    feedbackLoading
                                }
                                onClick={() =>
                                    handleDecision(
                                        "hold",
                                    )
                                }
                                variant="beige"
                            >
                                Hold
                            </Button>

                            <Button
                                disabled={
                                    feedbackLoading
                                }
                                onClick={() =>
                                    handleDecision(
                                        "rejected",
                                    )
                                }
                                variant="danger"
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                </GlassCard>

                {joinProbability && (
                    <GlassCard className="border-[#E6D8C8] bg-[#FFFDFC]">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#E6D8C8] bg-[#F7F0E8] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#7A5A47]">
                                    <Sparkles
                                        size={
                                            15
                                        }
                                    />

                                    Probability to
                                    Join
                                </div>

                                <h3 className="mt-4 text-2xl font-black text-[#1E3A5F]">
                                    Hiring
                                    likelihood
                                    factors
                                </h3>
                            </div>

                            <div className="rounded-[2rem] bg-gradient-to-br from-[#B08968] to-[#4B3425] px-8 py-6 text-center text-white shadow-lg">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                                    Join Chance
                                </p>

                                <p className="mt-2 text-5xl font-black">
                                    {formatScore(
                                        joinProbability.percentage,
                                    )}
                                    %
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {Object.entries(
                                factors,
                            ).map(
                                ([
                                    key,
                                    value,
                                ]) => (
                                    <div
                                        key={
                                            key
                                        }
                                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                                            {formatLabel(
                                                key,
                                            )}
                                        </p>

                                        <p className="mt-2 text-lg font-black text-[#1E3A5F]">
                                            {formatValue(
                                                value,
                                            )}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </GlassCard>
                )}

                <ScoreBreakdown
                    breakdown={
                        selected.score_breakdown
                    }
                />

                <SkillsAnalysis
                    selected={selected}
                />

                <GlassCard>
                    <div className="mb-6">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                            Evidence Table
                        </p>

                        <h3 className="mt-2 text-2xl font-black text-[#1E3A5F]">
                            JD vs CV
                            Comparison
                        </h3>
                    </div>

                    <ComparisonTable
                        selected={selected}
                    />
                </GlassCard>
            </div>
        </>
    );
}