from pydantic import BaseModel, Field
from typing import Literal


class FeedbackRequest(BaseModel):
    analysis_id: str
    resume_id: str
    action: Literal[
        "shortlisted",
        "rejected",
        "hold",
        "manual_score_correction",
    ]
    notes: str | None = None
    manual_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )