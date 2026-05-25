from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from src.core.security import require_role
from src.services.analysis_delete_service import (
    admin_delete_analysis,
    admin_clear_all_analyses,
)
from src.utils.db_handler import db_handler
from src.utils.response_handler import success_response


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


DEFAULT_AI_PROVIDER_SETTINGS = {
    "gemini": True,
    "groq": True,
    "openrouter": False,
    "openai": False,
}


@router.get("/ai-providers")
async def get_ai_provider_settings(
    current_user=Depends(require_role("admin")),
):
    settings_doc = await db_handler.admin_settings.find_one(
        {"type": "ai_provider_settings"},
        {"_id": 0},
    )

    if not settings_doc:
        settings_doc = {
            "type": "ai_provider_settings",
            "active_ai_providers": DEFAULT_AI_PROVIDER_SETTINGS,
        }

    return success_response(
        "AI provider settings fetched successfully",
        settings_doc,
    )


@router.put("/ai-providers")
async def update_ai_provider_settings(
    active_ai_providers: dict,
    current_user=Depends(require_role("admin")),
):
    allowed = {
        "gemini",
        "groq",
        "openrouter",
        "openai",
    }

    cleaned = {
        provider: bool(
            active_ai_providers.get(
                provider,
                False,
            )
        )
        for provider in allowed
    }

    update_doc = {
        "type": "ai_provider_settings",
        "active_ai_providers": cleaned,
        "updated_by": current_user["user"]["_id"],
        "updated_at": datetime.now(timezone.utc),
    }

    await db_handler.admin_settings.update_one(
        {"type": "ai_provider_settings"},
        {"$set": update_doc},
        upsert=True,
    )

    return success_response(
        "AI provider settings updated successfully",
        update_doc,
    )


@router.delete("/analysis/{analysis_id}")
async def delete_analysis_by_admin(
    analysis_id: str,
    current_user=Depends(require_role("admin")),
):
    return await admin_delete_analysis(
        analysis_id=analysis_id,
    )


@router.delete("/analysis/clear-all")
async def clear_all_analysis_history(
    current_user=Depends(require_role("admin")),
):
    return await admin_clear_all_analyses()