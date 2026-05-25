from pydantic import BaseModel, EmailStr
from typing import Literal


class RegisterUserRequest(BaseModel):
    firebase_uid: str
    name: str
    email: EmailStr
    role: Literal["recruiter", "admin"] = "recruiter"
    company_name: str | None = None