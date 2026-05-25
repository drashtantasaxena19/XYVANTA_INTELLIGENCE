import { MapPin, ShieldCheck, Sparkles, Trophy } from "lucide-react";

import GlassCard from "../../ui/GlassCard";
import { formatScore } from "./reportFormatters";

export default function ScoreOverview({ selected }: { selected: any }) {
    const score = formatScore(selected?.final_score);
    const joinProbability = selected?.join_probability;
    const joinScore = formatScore(joinProbability?.percentage);

    return (
        <GlassCard className="overflow-hidden">
            <div className="grid gap-6 xl:grid-cols-[1fr_260px_260px]">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                        <Sparkles size={15} />
                        Executive Match Summary
                    </div>

                    <h2 className="mt-5 text-3xl font-black text-[#1E3A5F]">
                        {selected?.candidate_name ||
                            selected?.resume_file_name ||
                            selected?.file_name ||
                            "Candidate"}
                    </h2>

                    <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
                        Matched against{" "}
                        <span className="font-black text-slate-700">
                            {selected?.jd_title ||
                                selected?.jd_file_name ||
                                "Job Description"}
                        </span>
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <InfoPill
                            icon={<ShieldCheck size={14} />}
                            label={
                                selected?.deterministic
                                    ? "Deterministic scoring"
                                    : "AI assisted"
                            }
                        />

                        <InfoPill
                            icon={<MapPin size={14} />}
                            label={
                                selected?.comparison?.location?.status
                                    ? `Location ${selected.comparison.location.status}`
                                    : "Location neutral"
                            }
                        />
                    </div>
                </div>

                <ScoreCard
                    title="Match Score"
                    value={score}
                    icon={<Trophy size={28} />}
                    tone="sky"
                    description="Deterministic fit score"
                />

                <ScoreCard
                    title="Probability to Join"
                    value={joinScore}
                    icon={<Sparkles size={28} />}
                    tone="brown"
                    description="Separate hiring likelihood"
                />
            </div>
        </GlassCard>
    );
}

function InfoPill({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
            {icon}
            {label}
        </span>
    );
}

function ScoreCard({
    title,
    value,
    icon,
    tone,
    description,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    tone: "sky" | "brown";
    description: string;
}) {
    const style =
        tone === "sky"
            ? "from-sky-500 to-[#1E3A5F]"
            : "from-[#B08968] to-[#4B3425]";

    return (
        <div
            className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${style} p-7 text-white shadow-lg`}
        >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                    {icon}
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                    {title}
                </p>

                <p className="mt-2 text-6xl font-black leading-none">
                    {value}
                    <span className="text-2xl">%</span>
                </p>

                <p className="mt-3 text-xs font-semibold text-white/75">
                    {description}
                </p>
            </div>
        </div>
    );
}