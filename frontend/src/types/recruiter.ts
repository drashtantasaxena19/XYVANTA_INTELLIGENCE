export type RecruiterDecision =
    | "shortlisted"
    | "rejected"
    | "hold"
    | "manual_score_correction";

export type RecruiterFeedbackPayload = {
    analysis_id: string;
    resume_id: string;
    action: RecruiterDecision;
    notes?: string;
    manual_score?: number;
};

export type RecruiterStats = {
    totalAnalyses: number;
    totalResumes: number;
    averageScore: number;
    topScore: number;
};