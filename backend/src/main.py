from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import settings
from src.core.firebase import initialize_firebase
from src.utils.db_handler import db_handler

from src.api.auth_routes import router as auth_router
from src.api.analysis_routes import router as analysis_router
from src.api.admin_routes import router as admin_router

def get_allowed_origins() -> list[str]:
    origins = [
        origin.strip()
        for origin in settings.ALLOWED_ORIGINS.split(",")
        if origin.strip()
    ]

    if settings.FRONTEND_URL not in origins:
        origins.append(settings.FRONTEND_URL)

    return origins


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_firebase()
    await db_handler.connect()

    yield

    await db_handler.close()


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend-name.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    analysis_router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    admin_router,
    prefix=settings.API_PREFIX,
)


@app.get("/")
async def root():
    return {
        "success": True,
        "message": "Xyvanta Intelligence API is running",
    }


@app.get("/health")
async def health_check():
    return {
        "success": True,
        "status": "healthy",
    }