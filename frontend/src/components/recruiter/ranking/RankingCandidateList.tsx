import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    Mail,
    Search,
    UserRound,
    XCircle,
} from "lucide-react";

type Props = {
    search: string;
    setSearch: (value: string) => void;
    candidates: any[];
    selected: any;
    onSelect: (candidate: any) => void;
};

export default function RankingCandidateList({
    search,
    setSearch,
    candidates,
    selected,
    onSelect,
}: Props) {
    return (
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
                <div className="flex items-center gap-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                        <UserRound size={20} />
                    </div>

                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                            Ranked Candidates
                        </p>

                        <h2 className="mt-1 text-xl font-black text-[#1E3A5F]">
                            Match Results
                        </h2>
                    </div>
                </div>

                <div className="relative mt-5">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search candidate..."
                        className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                </div>
            </div>

            <div className="max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar p-4">
                {candidates.length === 0 ? (
                    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                            <UserRound
                                size={30}
                                className="text-slate-300"
                            />
                        </div>

                        <h3 className="mt-5 text-lg font-black text-[#1E3A5F]">
                            No candidates found
                        </h3>

                        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                            Try changing search keyword or run a new
                            analysis.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {candidates.map((candidate, index) => {
                            const active =
                                selected?.resume_id ===
                                    candidate.resume_id &&
                                selected?.jd_id === candidate.jd_id;

                            const decision =
                                candidate.current_decision;

                            return (
                                <button
                                    key={`${candidate.resume_id}-${candidate.jd_id}-${index}`}
                                    onClick={() =>
                                        onSelect(candidate)
                                    }
                                    className={`group w-full rounded-[1.8rem] border p-5 text-left transition ${
                                        active
                                            ? "border-sky-200 bg-sky-50 shadow-md"
                                            : "border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate text-lg font-black text-[#1E3A5F]">
                                                    {candidate.candidate_name ||
                                                        candidate.resume_file_name ||
                                                        candidate.file_name ||
                                                        "Candidate"}
                                                </h3>

                                                {decision && (
                                                    <DecisionBadge
                                                        decision={
                                                            decision
                                                        }
                                                    />
                                                )}
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <InfoPill
                                                    icon={
                                                        <Mail
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    }
                                                    text={
                                                        candidate.email ||
                                                        "No email"
                                                    }
                                                />

                                                <InfoPill
                                                    icon={
                                                        <BriefcaseBusiness
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    }
                                                    text={
                                                        candidate.jd_title ||
                                                        candidate.jd_file_name ||
                                                        "JD"
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div
                                            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-center transition ${
                                                active
                                                    ? "bg-gradient-to-br from-sky-500 to-[#1E3A5F] text-white"
                                                    : "bg-slate-100 text-[#1E3A5F] group-hover:bg-sky-100"
                                            }`}
                                        >
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.14em] opacity-70">
                                                    Score
                                                </p>

                                                <p className="mt-1 text-xl font-black leading-none">
                                                    {Math.round(
                                                        candidate.final_score ||
                                                            0,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {candidate.join_probability
                                        ?.percentage && (
                                        <div className="mt-5 rounded-2xl border border-[#E6D8C8] bg-[#F7F0E8] px-4 py-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7A5A47]">
                                                    Join Probability
                                                </span>

                                                <span className="text-lg font-black text-[#4B3425]">
                                                    {Math.round(
                                                        candidate
                                                            .join_probability
                                                            .percentage ||
                                                            0,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

function InfoPill({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <span className="shrink-0 text-slate-400">{icon}</span>

            <span className="truncate">{text}</span>
        </div>
    );
}

function DecisionBadge({
    decision,
}: {
    decision: "shortlisted" | "hold" | "rejected";
}) {
    const styles = {
        shortlisted:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        hold:
            "border-[#E6D8C8] bg-[#F7F0E8] text-[#7A5A47]",

        rejected:
            "border-red-200 bg-red-50 text-red-700",
    };

    const icons = {
        shortlisted: (
            <CheckCircle2 size={12} />
        ),

        hold: <Clock3 size={12} />,

        rejected: <XCircle size={12} />,
    };

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${styles[decision]}`}
        >
            {icons[decision]}
            {decision}
        </span>
    );
}