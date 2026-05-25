import { useMemo, useState } from "react";
import { BrainCircuit, PlayCircle, RotateCcw } from "lucide-react";

import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import Loader from "../../components/ui/Loader";

import MatchModeSelector from "../../components/recruiter/match-studio/MatchModeSelector";
import MatchUploadPanel from "../../components/recruiter/match-studio/MatchUploadPanel";
import MatchResultSummary from "../../components/recruiter/match-studio/MatchResultSummary";

import {
    analyzeUniversalComparison,
    type AnalysisResponse,
    type ComparisonMode,
} from "../../services/analysisApi";

export default function ResumeUpload() {
    const [comparisonMode, setComparisonMode] =
        useState<ComparisonMode>("single_jd_multiple_cv");

    const [jdFiles, setJdFiles] = useState<File[]>([]);
    const [resumeFiles, setResumeFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] =
        useState<AnalysisResponse["data"] | null>(null);

    const helperText = useMemo(() => {
        if (comparisonMode === "single_jd_multiple_cv") {
            return "Upload exactly 1 JD and one or more CVs.";
        }

        if (comparisonMode === "multiple_jd_single_cv") {
            return "Upload one or more JDs and exactly 1 CV.";
        }

        return "Upload one or more JDs and one or more CVs.";
    }, [comparisonMode]);

    const addFiles = (
        files: FileList | null,
        setter: React.Dispatch<React.SetStateAction<File[]>>,
        allowMultiple: boolean,
    ) => {
        if (!files) return;

        const incoming = Array.from(files);

        setter((prev) => {
            const next = allowMultiple ? [...prev, ...incoming] : incoming.slice(0, 1);

            const unique = next.filter((file, index, self) => {
                return (
                    index ===
                    self.findIndex(
                        (item) =>
                            item.name === file.name &&
                            item.size === file.size &&
                            item.lastModified === file.lastModified,
                    )
                );
            });

            return unique;
        });
    };

    const removeFile = (
        index: number,
        setter: React.Dispatch<React.SetStateAction<File[]>>,
    ) => {
        setter((prev) => prev.filter((_, i) => i !== index));
    };

    const resetStudio = () => {
        setJdFiles([]);
        setResumeFiles([]);
        setError("");
        setResult(null);
    };

    const validate = () => {
        if (jdFiles.length < 1) {
            return "Please upload at least one JD file.";
        }

        if (resumeFiles.length < 1) {
            return "Please upload at least one CV file.";
        }

        if (
            comparisonMode === "single_jd_multiple_cv" &&
            jdFiles.length !== 1
        ) {
            return "Single JD vs Multiple CVs requires exactly 1 JD file.";
        }

        if (
            comparisonMode === "multiple_jd_single_cv" &&
            resumeFiles.length !== 1
        ) {
            return "Multiple JDs vs Single CV requires exactly 1 CV file.";
        }

        return "";
    };

    const handleAnalyze = async () => {
        setError("");
        setResult(null);

        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const response = await analyzeUniversalComparison({
                comparisonMode,
                jdFiles,
                resumeFiles,
            });

            setResult(response.data);
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                    err?.response?.data?.message ||
                    err?.message ||
                    "Analysis failed.",
            );
        } finally {
            setLoading(false);
        }
    };

    const jdMultiple = comparisonMode !== "single_jd_multiple_cv";
    const resumeMultiple = comparisonMode !== "multiple_jd_single_cv";

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-100 blur-[90px]" />
                <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#F7F0E8] blur-[80px]" />

                <div className="relative z-10 flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                            <BrainCircuit size={16} />
                            AI Match Studio
                        </div>

                        <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#1E3A5F] md:text-5xl">
                            Compare JDs and CVs with structured intelligence.
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
                            Choose a comparison mode, upload your files, and generate
                            deterministic match scores with explainable recruiter reports.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={resetStudio}
                        disabled={loading}
                        className="w-full sm:w-fit"
                    >
                        <RotateCcw size={17} className="mr-2" />
                        Reset Studio
                    </Button>
                </div>
            </section>

            {error && <Alert type="error" message={error} />}

            <MatchModeSelector
                value={comparisonMode}
                onChange={(mode) => {
                    setComparisonMode(mode);
                    resetStudio();
                }}
            />

            <Alert type="info" message={helperText} />

            <div className="grid gap-6 xl:grid-cols-2">
                <MatchUploadPanel
                    title="Job Description Files"
                    subtitle="Upload PDF, DOCX, TXT, or MD files"
                    files={jdFiles}
                    inputMultiple={jdMultiple}
                    onFiles={(files) =>
                        addFiles(files, setJdFiles, jdMultiple)
                    }
                    onRemove={(index) => removeFile(index, setJdFiles)}
                />

                <MatchUploadPanel
                    title="Candidate CV / Resume Files"
                    subtitle="Upload PDF, DOCX, TXT, or MD files"
                    files={resumeFiles}
                    inputMultiple={resumeMultiple}
                    onFiles={(files) =>
                        addFiles(files, setResumeFiles, resumeMultiple)
                    }
                    onRemove={(index) => removeFile(index, setResumeFiles)}
                />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <p className="text-sm font-semibold text-slate-500">
                    {jdFiles.length} JD file(s) · {resumeFiles.length} CV file(s)
                </p>

                <Button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full px-10 py-4 sm:w-auto"
                >
                    {loading ? (
                        "Analyzing..."
                    ) : (
                        <>
                            <PlayCircle size={18} className="mr-2" />
                            Run AI Match Analysis
                        </>
                    )}
                </Button>
            </div>

            {loading && (
                <GlassCard>
                    <Loader text="Parsing files, building comparison matrix, and calculating deterministic scores..." />
                </GlassCard>
            )}

            {result && <MatchResultSummary result={result} />}
        </div>
    );
}