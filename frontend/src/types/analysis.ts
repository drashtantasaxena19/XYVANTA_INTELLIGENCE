export type ComparisonMode =
    | "single_jd_multiple_cv"
    | "multiple_jd_single_cv"
    | "multiple_jd_multiple_cv";

export type ScoreBreakdownItem = {
    weight?: number;
    percentage?: number;
    score?: number;
    reason?: string;
    matched?: unknown[];
    missing?: unknown[];
    status?: string;
    applied_to_score?: boolean;
};

export type JoinProbability = {
    percentage?: number;
    factors?: Record<string, number | string | null | undefined>;
    reason?: string;
};

export type MatchResult = {
    analysis_id?: string;
    jd_id?: string;
    jd_file_name?: string;
    jd_title?: string | null;

    resume_id?: string;
    resume_file_name?: string;
    file_name?: string;
    candidate_name?: string | null;
    email?: string | null;
    phone?: string | null;

    final_score?: number;
    score_breakdown?: Record<string, ScoreBreakdownItem>;
    comparison?: Record<string, any>;
    matched_skills?: string[];
    missing_skills?: string[];
    join_probability?: JoinProbability;
    deterministic?: boolean;
};

export type UniversalAnalysisData = {
    analysis_id: string;
    comparison_mode?: ComparisonMode;
    total_jds?: number;
    total_resumes?: number;
    total_comparisons?: number;
    jds?: any[];
    resumes?: any[];
    matrix?: MatchResult[];
    primary_results?: MatchResult[];
    results?: MatchResult[];
    ranked_candidates?: MatchResult[];
    ranked_jobs?: MatchResult[];
    deterministic?: boolean;
    message?: string;
};