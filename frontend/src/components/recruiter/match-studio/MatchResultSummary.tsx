import { CheckCircle2, FileSearch, Grid3X3 } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../ui/Button";
import GlassCard from "../../ui/GlassCard";
import MatchMiniStat from "./MatchMiniStat";
import MatchTopList from "./MatchTopList";
import { getDisplayResults } from "../../../services/analysisApi";

export default function MatchResultSummary({
    result,
}: {
    result: any;
}) {
    const displayResults = getDisplayResults(result);

    return (
        <section className="space-y-6">
            <GlassCard className="overflow-hidden">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                            <CheckCircle2 size={16} />
                            Analysis completed
                        </div>

                        <h2 className="mt-5 text-3xl font-black text-[#1E3A5F]">
                            Match intelligence is ready.
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                            Results are mode-aware. Single JD, multiple JD and
                            full matrix outputs are handled using primary backend results.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {result?.analysis_id && (
                            <Link to={`/recruiter/report/${result.analysis_id}`}>
                                <Button>
                                    <FileSearch size={17} className="mr-2" />
                                    View Full Report
                                </Button>
                            </Link>
                        )}

                        <Link to="/recruiter/ranking">
                            <Button variant="beige">
                                <Grid3X3 size={17} className="mr-2" />
                                Ranking Workspace
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MatchMiniStat
                        label="Analysis ID"
                        value={result.analysis_id}
                    />

                    <MatchMiniStat
                        label="Mode"
                        value={
                            result.comparison_mode ||
                            "single_jd_multiple_cv"
                        }
                    />

                    <MatchMiniStat
                        label="JDs"
                        value={result.total_jds ?? 1}
                    />

                    <MatchMiniStat
                        label="CVs"
                        value={result.total_resumes ?? 0}
                    />
                </div>
            </GlassCard>

            <GlassCard>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                            Top Results
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-[#1E3A5F]">
                            Ranked JD-CV Matches
                        </h2>
                    </div>

                    <p className="text-xs font-semibold text-slate-500">
                        Showing top {Math.min(displayResults.length, 10)} of{" "}
                        {displayResults.length} result(s)
                    </p>
                </div>

                <MatchTopList items={displayResults} />
            </GlassCard>
        </section>
    );
}