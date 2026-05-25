import { useEffect, useMemo, useState } from "react";
import {
    BriefcaseBusiness,
    Filter,
    Mail,
    Phone,
    Search,
    Trash2,
    UserCheck,
} from "lucide-react";

import Alert from "../../components/ui/Alert";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";

import {
    clearCandidateDecisions,
    deleteCandidateDecision,
    getCandidateDecisions,
    type CandidateDecisionAction,
} from "../../services/analysisApi";

const tabs: {
    label: string;
    value: CandidateDecisionAction | "all";
}[] = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Shortlisted",
        value: "shortlisted",
    },
    {
        label: "Hold",
        value: "hold",
    },
    {
        label: "Rejected",
        value: "rejected",
    },
];

export default function CandidateDecisions() {
    const [decisions, setDecisions] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<
        CandidateDecisionAction | "all"
    >("all");

    const [selectedJd, setSelectedJd] = useState("all");
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] =
        useState("");

    const [deleteTarget, setDeleteTarget] =
        useState<any | null>(null);

    const [clearOpen, setClearOpen] =
        useState(false);

    const loadDecisions = async () => {
        setLoading(true);
        setError("");

        try {
            const response =
                await getCandidateDecisions();

            setDecisions(response.data || []);
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load candidate decisions.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDecisions();
    }, []);

    const jdOptions = useMemo(() => {
        const map = new Map<string, string>();

        decisions.forEach((item) => {
            const id =
                item.jd_id ||
                item.jd_file_name ||
                "unknown";

            const label =
                item.jd_title ||
                item.jd_file_name ||
                "Unknown JD";

            map.set(id, label);
        });

        return Array.from(map.entries()).map(
            ([id, label]) => ({
                id,
                label,
            }),
        );
    }, [decisions]);

    const filtered = useMemo(() => {
        const keyword =
            search.trim().toLowerCase();

        return decisions.filter((item) => {
            const actionMatch =
                activeTab === "all" ||
                item.action === activeTab;

            const jdKey =
                item.jd_id ||
                item.jd_file_name ||
                "unknown";

            const jdMatch =
                selectedJd === "all" ||
                jdKey === selectedJd;

            const searchMatch =
                !keyword ||
                item.candidate_name
                    ?.toLowerCase?.()
                    .includes(keyword) ||
                item.email
                    ?.toLowerCase?.()
                    .includes(keyword) ||
                item.resume_file_name
                    ?.toLowerCase?.()
                    .includes(keyword) ||
                item.jd_title
                    ?.toLowerCase?.()
                    .includes(keyword) ||
                item.jd_file_name
                    ?.toLowerCase?.()
                    .includes(keyword);

            return (
                actionMatch &&
                jdMatch &&
                searchMatch
            );
        });
    }, [
        activeTab,
        decisions,
        search,
        selectedJd,
    ]);

    const handleDelete = async () => {
        if (!deleteTarget) return;

        setActionLoading(true);

        try {
            await deleteCandidateDecision({
                analysis_id:
                    deleteTarget.analysis_id,
                resume_id:
                    deleteTarget.resume_id,
                jd_id: deleteTarget.jd_id,
            });

            setSuccessMessage(
                "Decision deleted successfully.",
            );

            setDeleteTarget(null);

            await loadDecisions();
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to delete decision.",
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleClearAll = async () => {
        setActionLoading(true);

        try {
            await clearCandidateDecisions({
                action:
                    activeTab === "all"
                        ? undefined
                        : activeTab,
            });

            setSuccessMessage(
                "Decisions cleared successfully.",
            );

            setClearOpen(false);

            await loadDecisions();
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to clear decisions.",
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

                <div className="relative z-10">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                        <UserCheck size={16} />
                        Candidate Decisions
                    </div>

                    <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#1E3A5F] md:text-5xl">
                        Manage recruiter shortlist,
                        hold and rejected candidates.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                        Filter candidates by job
                        description and recruiter
                        decision state.
                    </p>
                </div>
            </section>

            {loading && (
                <Loader text="Loading candidate decisions..." />
            )}

            {error && (
                <Alert
                    type="error"
                    message={error}
                />
            )}

            {successMessage && (
                <Alert
                    type="success"
                    message={successMessage}
                />
            )}

            {!loading && !error && (
                <>
                    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                            <div className="relative">
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target
                                                .value,
                                        )
                                    }
                                    placeholder="Search candidate, email, resume, JD..."
                                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                />
                            </div>

                            <div className="relative">
                                <Filter
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                                />

                                <select
                                    value={
                                        selectedJd
                                    }
                                    onChange={(e) =>
                                        setSelectedJd(
                                            e.target
                                                .value,
                                        )
                                    }
                                    className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                >
                                    <option value="all">
                                        All Job
                                        Descriptions
                                    </option>

                                    {jdOptions.map(
                                        (jd) => (
                                            <option
                                                key={
                                                    jd.id
                                                }
                                                value={
                                                    jd.id
                                                }
                                            >
                                                {
                                                    jd.label
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-3">
                                {tabs.map((tab) => (
                                    <button
                                        key={
                                            tab.value
                                        }
                                        onClick={() =>
                                            setActiveTab(
                                                tab.value,
                                            )
                                        }
                                        className={`rounded-2xl border px-5 py-2.5 text-sm font-black transition ${
                                            activeTab ===
                                            tab.value
                                                ? "border-sky-200 bg-sky-50 text-sky-700"
                                                : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-white"
                                        }`}
                                    >
                                        {
                                            tab.label
                                        }
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() =>
                                    setClearOpen(
                                        true,
                                    )
                                }
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                            >
                                Clear{" "}
                                {activeTab ===
                                "all"
                                    ? "All"
                                    : activeTab}
                            </button>
                        </div>
                    </section>

                    {filtered.length === 0 ? (
                        <EmptyState
                            title="No candidates found"
                            description="No candidates match the selected filter."
                        />
                    ) : (
                        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {filtered.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <DecisionCard
                                        key={`${item.resume_id}-${index}`}
                                        item={
                                            item
                                        }
                                        onDelete={() =>
                                            setDeleteTarget(
                                                item,
                                            )
                                        }
                                    />
                                ),
                            )}
                        </section>
                    )}
                </>
            )}

            <Modal
                open={Boolean(deleteTarget)}
                title="Delete this decision?"
                description="This recruiter decision will be removed permanently."
                onClose={() =>
                    setDeleteTarget(null)
                }
            >
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() =>
                            setDeleteTarget(null)
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-black text-slate-600"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={
                            actionLoading
                        }
                        className="rounded-2xl bg-red-500 px-5 py-2.5 text-sm font-black text-white transition hover:bg-red-600 disabled:opacity-60"
                    >
                        {actionLoading
                            ? "Deleting..."
                            : "Delete"}
                    </button>
                </div>
            </Modal>

            <Modal
                open={clearOpen}
                title="Clear decisions?"
                description={`This will remove ${
                    activeTab === "all"
                        ? "all recruiter decisions"
                        : activeTab
                } decisions.`}
                onClose={() =>
                    setClearOpen(false)
                }
            >
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() =>
                            setClearOpen(false)
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-black text-slate-600"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleClearAll}
                        disabled={
                            actionLoading
                        }
                        className="rounded-2xl bg-red-500 px-5 py-2.5 text-sm font-black text-white transition hover:bg-red-600 disabled:opacity-60"
                    >
                        {actionLoading
                            ? "Clearing..."
                            : "Clear"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}

function DecisionCard({
    item,
    onDelete,
}: {
    item: any;
    onDelete: () => void;
}) {
    const tone =
        item.action === "shortlisted"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : item.action === "rejected"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-[#E6D8C8] bg-[#F7F0E8] text-[#7A5A47]";

    return (
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                        <UserCheck size={22} />
                    </div>

                    <div>
                        <h3 className="truncate text-xl font-black text-[#1E3A5F]">
                            {item.candidate_name ||
                                item.resume_file_name ||
                                "Candidate"}
                        </h3>

                        <span
                            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-black capitalize ${tone}`}
                        >
                            {String(
                                item.action ||
                                    "decision",
                            ).replaceAll(
                                "_",
                                " ",
                            )}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onDelete}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="mt-5 space-y-2 text-sm font-semibold text-slate-500">
                <p className="flex items-center gap-2">
                    <Mail size={15} />
                    {item.email ||
                        "No email"}
                </p>

                <p className="flex items-center gap-2">
                    <Phone size={15} />
                    {item.phone ||
                        "No phone"}
                </p>

                <p className="flex items-start gap-2">
                    <BriefcaseBusiness
                        size={15}
                        className="mt-0.5"
                    />

                    <span>
                        {item.jd_title ||
                            item.jd_file_name ||
                            "Job Description"}
                    </span>
                </p>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Match Score
                </span>

                <span className="text-lg font-black text-[#1E3A5F]">
                    {item.final_score ??
                        0}
                    %
                </span>
            </div>
        </article>
    );
}