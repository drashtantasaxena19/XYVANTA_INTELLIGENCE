from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from src.core.security import get_current_user
from src.schemas.auth_schema import RegisterUserRequest
from src.utils.db_handler import db_handler
from src.utils.response_handler import success_response


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post("/register")
async def register_user(payload: RegisterUserRequest):
    if payload.role not in ["recruiter", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role",
        )

    collection = (
        db_handler.admins
        if payload.role == "admin"
        else db_handler.recruiters
    )

    existing_user = await collection.find_one(
        {
            "$or": [
                {"firebase_uid": payload.firebase_uid},
                {"email": payload.email},
            ]
        }
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already registered",
        )

    user_doc = {
        "firebase_uid": payload.firebase_uid,
        "name": payload.name,
        "email": payload.email,
        "role": payload.role,
        "company_name": payload.company_name,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = await collection.insert_one(user_doc)

    return success_response(
        "User registered successfully",
        {
            "id": str(result.inserted_id),
            "name": payload.name,
            "email": payload.email,
            "role": payload.role,
            "company_name": payload.company_name,
        },
    )


@router.get("/me")
async def get_me(current_user=Depends(get_current_user)):
    return success_response(
        "Current user fetched successfully",
        current_user,
    )