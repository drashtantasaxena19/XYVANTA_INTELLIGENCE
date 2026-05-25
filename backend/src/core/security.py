from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from src.core.firebase import verify_firebase_token
from src.utils.db_handler import db_handler


bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    token = credentials.credentials
    decoded = verify_firebase_token(token)

    if not decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token",
        )

    firebase_uid = decoded.get("uid")
    email = decoded.get("email")

    user = await db_handler.recruiters.find_one({"firebase_uid": firebase_uid})

    if not user:
        user = await db_handler.admins.find_one({"firebase_uid": firebase_uid})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User not registered in backend database",
        )

    user["_id"] = str(user["_id"])

    return {
        "firebase_uid": firebase_uid,
        "email": email,
        "role": user.get("role"),
        "user": user,
    }


def require_role(required_role: str):
    async def role_checker(current_user=Depends(get_current_user)):
        if current_user["role"] != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied",
            )
        return current_user

    return role_checker