import api from "./api";

export type ComparisonMode =
    | "single_jd_multiple_cv"
    | "multiple_jd_single_cv"
    | "multiple_jd_multiple_cv";

export type AnalysisResponse = {
    success: boolean;
    message: string;
    data: UniversalAnalysisData;
};

export type UniversalAnalysisData = {
    analysis_id: string;
    comparison_mode?: ComparisonMode;
    total_jds?: number;
    total_resumes?: number;
    total_comparisons?: number;

    jd?: ParsedJDResponse;
    ranked_candidates?: CandidateAnalysisResult[];

    jds?: ParsedJDResponse[];
    resumes?: ParsedResumeResponse[];
    matrix?: MatrixComparisonResult[];
    primary_results?: MatrixComparisonResult[];
    results?: MatrixComparisonResult[];
    ranked_jobs?: MatrixComparisonResult[];

    deterministic?: boolean;
    message?: string;
};

export type ParsedJDResponse = {
    jd_id?: string;
    file_name: string;
    detected_language?: string;
    language_name?: string;
    parser_source?: string;
    ai_provider?: string | null;
    parsed_jd: ParsedJD;
    original_text?: string;
    english_text?: string;
};

export type ParsedResumeResponse = {
    resume_id: string;
    file_name: string;
    candidate_name?: string | null;
    email?: string | null;
    phone?: string | null;
    detected_language?: string;
    language_name?: string;
    parser_source?: string;
    ai_provider?: string | null;
    parsed_resume: ParsedResume;
    original_text?: string;
    english_text?: string;
};

export type ParsedJD = {
    title?: string | null;
    required_skills?: string[];
    must_have_skills?: string[];
    good_to_have_skills?: string[];
    required_experience_years?: number;
    required_education?: string[];
    responsibilities?: string[];
    location?: string | null;
    mode?: string | null;
    salary?: string | null;
    notice_period?: string | null;
    employment_type?: string | null;
    address?: string | null;
    contract_to_hire?: boolean;
    shift?: string | null;
    required_languages?: string[];
    certifications?: string[];
    raw_text?: string;
    parser_source?: string;
    ai_provider?: string | null;
};

export type ParsedResume = {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    address?: string | null;
    permanent_address?: string | null;
    linkedin?: string | null;
    github?: string | null;
    portfolio?: string | null;
    current_position?: string | null;
    expected_salary?: string | null;
    notice_period?: string | null;
    employment_type?: string | null;
    languages?: any[];
    skills?: string[];
    education?: any[];
    experience_years?: number;
    certifications?: string[];
    projects?: any[];
    work_experience?: any[];
    raw_text?: string;
    parser_source?: string;
    ai_provider?: string | null;
};

export type ComparisonField = {
    jd_value?: unknown;
    resume_value?: unknown;
    jd_location?: string | null;
    jd_mode?: string | null;
    resume_location?: string | null;
    matched?: unknown[];
    missing?: unknown[];
    score?: number;
    status?: "matched" | "weak" | "available" | "not_detected" | string;
    reason?: string;
};

export type ScoreBreakdownItem = {
    weight?: number;
    percentage?: number;
    score?: number;
    reason?: string;
    matched?: unknown[];
    missing?: unknown[];
    distance_km?: number | null;
    status?: string;
    applied_to_score?: boolean;
};

export type JoinProbability = {
    percentage?: number;
    factors?: {
        skills?: number | string | null;
        role?: number | string | null;
        experience?: number | string | null;
        location?: number | string | null;
        salary?: number | string | null;
        preferences?: number | string | null;
        [key: string]:
            | number
            | string
            | null
            | undefined;
    };
    reason?: string;
};

export type CandidateAnalysisResult = {
    resume_id: string;
    file_name?: string;
    resume_file_name?: string;
    candidate_name?: string | null;
    email?: string | null;
    phone?: string | null;
    detected_language?: string;
    language_name?: string;
    parser_source?: string;
    ai_provider?: string | null;
    parsed_resume?: ParsedResume;

    jd_id?: string;
    jd_file_name?: string;
    jd_title?: string | null;

    final_score?: number;
    score_breakdown?: Record<
        string,
        ScoreBreakdownItem
    >;

    comparison?: Record<
        string,
        ComparisonField
    >;

    matched_skills?: string[];
    missing_skills?: string[];

    join_probability?: JoinProbability;

    deterministic?: boolean;

    current_decision?:
        | "shortlisted"
        | "rejected"
        | "hold"
        | null;
};

export type MatrixComparisonResult =
    CandidateAnalysisResult & {
        jd_id: string;
        jd_file_name: string;
        jd_title?: string | null;
        resume_id: string;
        resume_file_name?: string;
    };

export const getDisplayResults = (
    data?: UniversalAnalysisData | null,
): MatrixComparisonResult[] => {
    if (!data) return [];

    return (
        data.primary_results ||
        data.results ||
        data.ranked_candidates ||
        data.ranked_jobs ||
        data.matrix ||
        []
    ) as MatrixComparisonResult[];
};

export const analyzeUniversalComparison =
    async ({
        comparisonMode,
        jdFiles,
        resumeFiles,
    }: {
        comparisonMode: ComparisonMode;
        jdFiles: File[];
        resumeFiles: File[];
    }): Promise<AnalysisResponse> => {
        const formData = new FormData();

        formData.append(
            "comparison_mode",
            comparisonMode,
        );

        jdFiles.forEach((file) => {
            formData.append(
                "jd_files",
                file,
            );
        });

        resumeFiles.forEach((file) => {
            formData.append(
                "resume_files",
                file,
            );
        });

        const response =
            await api.post(
                "/analysis/compare",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                },
            );

        return response.data;
    };

export const analyzeJdWithResumes =
    async (
        jdFile: File,
        resumeFiles: File[],
    ): Promise<AnalysisResponse> => {
        return analyzeUniversalComparison(
            {
                comparisonMode:
                    "single_jd_multiple_cv",
                jdFiles: [jdFile],
                resumeFiles,
            },
        );
    };

export const getAnalysisHistory =
    async () => {
        const response =
            await api.get(
                "/analysis/history",
            );

        return response.data;
    };

export const getAnalysisDetail =
    async (analysisId: string) => {
        const response =
            await api.get(
                `/analysis/${analysisId}`,
            );

        return response.data;
    };

export const deleteAnalysis =
    async (analysisId: string) => {
        const response =
            await api.delete(
                `/analysis/${analysisId}`,
            );

        return response.data;
    };

export const clearAnalysisHistory =
    async () => {
        const response =
            await api.delete(
                "/analysis/history/clear",
            );

        return response.data;
    };

export const adminDeleteAnalysis =
    async (analysisId: string) => {
        const response =
            await api.delete(
                `/admin/analysis/${analysisId}`,
            );

        return response.data;
    };

export const adminClearAllAnalyses =
    async () => {
        const response =
            await api.delete(
                "/admin/analysis/clear-all",
            );

        return response.data;
    };

export type FeedbackPayload = {
    analysis_id: string;
    resume_id: string;

    action:
        | "shortlisted"
        | "rejected"
        | "hold"
        | "manual_score_correction";

    notes?: string;
    manual_score?: number;
};

export const submitCandidateFeedback =
    async (
        payload: FeedbackPayload,
    ) => {
        const response =
            await api.post(
                "/analysis/feedback",
                payload,
            );

        return response.data;
    };

export type CandidateDecisionAction =
    | "shortlisted"
    | "rejected"
    | "hold";

export const getCandidateDecisions =
    async (params?: {
        jd_id?: string;
        action?: CandidateDecisionAction;
    }) => {
        const response =
            await api.get(
                "/analysis/feedback/decisions",
                {
                    params,
                },
            );

        return response.data;
    };

export const deleteCandidateDecision =
    async ({
        analysis_id,
        resume_id,
        jd_id,
    }: {
        analysis_id: string;
        resume_id: string;
        jd_id?: string;
    }) => {
        const response =
            await api.delete(
                "/analysis/feedback/decision",
                {
                    params: {
                        analysis_id,
                        resume_id,
                        jd_id,
                    },
                },
            );

        return response.data;
    };

export const clearCandidateDecisions =
    async (params?: {
        action?: CandidateDecisionAction;
    }) => {
        const response =
            await api.delete(
                "/analysis/feedback/decisions/clear",
                {
                    params,
                },
            );

        return response.data;
    };