import { useState } from "react";

import {
    Mail,
    Phone,
    Sparkles,
    Trophy,
    UserRound,
    BriefcaseBusiness,
} from "lucide-react";

import Alert from "../../ui/Alert";
import Button from "../../ui/Button";
import GlassCard from "../../ui/GlassCard";

import ScoreBreakdown from "../report/ScoreBreakdown";
import SkillsAnalysis from "../report/SkillsAnalysis";

import {
    formatScore,
    formatValue,
} from "../report/reportFormatters";

export default function RankingProfilePanel({
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

    const score = formatScore(
        selected.final_score,
    );

    const joinScore = formatScore(
        selected?.join_probability
            ?.percentage,
    );

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

            <section className="space-y-6">
                <GlassCard className="overflow-hidden">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                                <UserRound
                                    size={15}
                                />

                                Candidate
                                Match
                            </div>

                            <h2 className="mt-4 text-3xl font-black text-[#1E3A5F]">
                                {selected.candidate_name ||
                                    selected.resume_file_name ||
                                    selected.file_name ||
                                    "Candidate"}
                            </h2>

                            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                                <InfoPill
                                    icon={
                                        <Mail
                                            size={
                                                15
                                            }
                                        />
                                    }
                                    value={
                                        selected.email ||
                                        "No email"
                                    }
                                />

                                <InfoPill
                                    icon={
                                        <Phone
                                            size={
                                                15
                                            }
                                        />
                                    }
                                    value={
                                        selected.phone ||
                                        "No phone"
                                    }
                                />

                                <InfoPill
                                    icon={
                                        <BriefcaseBusiness
                                            size={
                                                15
                                            }
                                        />
                                    }
                                    value={
                                        selected.jd_title ||
                                        selected.jd_file_name ||
                                        "JD"
                                    }
                                />
                            </div>

                            <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
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

                        <div className="grid gap-4 sm:grid-cols-2 xl:w-[420px]">
                            <ScoreTile
                                title="Match Score"
                                value={score}
                                icon={
                                    <Trophy
                                        size={
                                            26
                                        }
                                    />
                                }
                                tone="sky"
                            />

                            <ScoreTile
                                title="Join Chance"
                                value={
                                    joinScore
                                }
                                icon={
                                    <Sparkles
                                        size={
                                            26
                                        }
                                    />
                                }
                                tone="brown"
                            />
                        </div>
                    </div>
                </GlassCard>

                {selected?.join_probability
                    ?.reason && (
                    <GlassCard className="border-[#E6D8C8] bg-[#F7F0E8]">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7A5A47]">
                            Probability
                            Explanation
                        </p>

                        <p className="mt-3 text-sm font-medium leading-relaxed text-[#7A5A47]">
                            {formatValue(
                                selected
                                    .join_probability
                                    .reason,
                            )}
                        </p>
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
            </section>
        </>
    );
}

function InfoPill({
    icon,
    value,
}: {
    icon: React.ReactNode;
    value: string;
}) {
    return (
        <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <span className="text-slate-400">
                {icon}
            </span>

            {value}
        </span>
    );
}

function ScoreTile({
    title,
    value,
    icon,
    tone,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    tone: "sky" | "brown";
}) {
    const style =
        tone === "sky"
            ? "from-sky-500 to-[#1E3A5F]"
            : "from-[#B08968] to-[#4B3425]";

    return (
        <div
            className={`rounded-[2rem] bg-gradient-to-br ${style} p-6 text-white shadow-lg`}
        >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                {icon}
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                {title}
            </p>

            <p className="mt-2 text-5xl font-black leading-none">
                {value}
                <span className="text-xl">
                    %
                </span>
            </p>
        </div>
    );
}