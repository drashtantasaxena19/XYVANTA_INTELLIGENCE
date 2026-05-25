import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    Mail,
    Trophy,
    UserRound,
    XCircle,
} from "lucide-react";

type Props = {
    matches: any[];
    selected: any;
    onSelect: (item: any) => void;
};

export default function ReportMatchList({
    matches,
    selected,
    onSelect,
}: Props) {
    return (
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                        <Trophy size={22} />
                    </div>

                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                            Match Matrix
                        </p>

                        <h2 className="mt-1 text-2xl font-black text-[#1E3A5F]">
                            Candidate Results
                        </h2>
                    </div>
                </div>
            </div>

            <div className="max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar p-4">
                {matches.length === 0 ? (
                    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                            <UserRound
                                size={30}
                                className="text-slate-300"
                            />
                        </div>

                        <h3 className="mt-5 text-lg font-black text-[#1E3A5F]">
                            No candidates available
                        </h3>

                        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                            Upload resumes and run analysis to generate match
                            reports.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {matches.map((item, index) => {
                            const active =
                                selected?.resume_id === item.resume_id &&
                                selected?.jd_id === item.jd_id;

                            const decision =
                                item.current_decision;

                            return (
                                <button
                                    key={`${item.resume_id}-${item.jd_id}-${index}`}
                                    onClick={() => onSelect(item)}
                                    className={`group w-full rounded-[1.8rem] border p-5 text-left transition ${
                                        active
                                            ? "border-sky-200 bg-sky-50 shadow-md"
                                            : "border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate text-lg font-black text-[#1E3A5F]">
                                                    {item.candidate_name ||
                                                        item.resume_file_name ||
                                                        item.file_name ||
                                                        "Candidate"}
                                                </h3>

                                                {decision && (
                                                    <DecisionBadge
                                                        decision={decision}
                                                    />
                                                )}
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <InfoPill
                                                    icon={
                                                        <Mail size={13} />
                                                    }
                                                    text={
                                                        item.email ||
                                                        "No email"
                                                    }
                                                />

                                                <InfoPill
                                                    icon={
                                                        <BriefcaseBusiness
                                                            size={13}
                                                        />
                                                    }
                                                    text={
                                                        item.jd_title ||
                                                        item.jd_file_name ||
                                                        "JD"
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div
                                            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition ${
                                                active
                                                    ? "bg-gradient-to-br from-sky-500 to-[#1E3A5F] text-white"
                                                    : "bg-slate-100 text-[#1E3A5F] group-hover:bg-sky-100"
                                            }`}
                                        >
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase tracking-[0.14em] opacity-70">
                                                    Score
                                                </p>

                                                <p className="mt-1 text-xl font-black leading-none">
                                                    {Math.round(
                                                        item.final_score || 0,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {item.join_probability?.percentage && (
                                        <div className="mt-5 rounded-2xl border border-[#E6D8C8] bg-[#F7F0E8] px-4 py-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7A5A47]">
                                                    Join Probability
                                                </span>

                                                <span className="text-lg font-black text-[#4B3425]">
                                                    {Math.round(
                                                        item.join_probability
                                                            .percentage || 0,
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
        shortlisted: <CheckCircle2 size={12} />,
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