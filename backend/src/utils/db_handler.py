from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorDatabase,
    AsyncIOMotorCollection,
)

from src.core.config import settings


class DatabaseHandler:
    def __init__(self):
        self.client: AsyncIOMotorClient | None = None
        self.db: AsyncIOMotorDatabase | None = None

    async def connect(self):
        self.client = AsyncIOMotorClient(settings.MONGO_URI)

        self.db = self.client[
            settings.MONGO_DB_NAME
        ]

        print("✅ MongoDB connected")

    async def close(self):
        if self.client:
            self.client.close()
            print("🛑 MongoDB disconnected")

    def get_collection(
        self,
        name: str,
    ) -> AsyncIOMotorCollection:
        if self.db is None:
            raise RuntimeError(
                "MongoDB is not connected. Call db_handler.connect() first."
            )

        return self.db[name]

    @property
    def recruiters(self):
        return self.get_collection("recruiters")

    @property
    def admins(self):
        return self.get_collection("admins")

    @property
    def jds(self):
        return self.get_collection("jds")

    @property
    def resumes(self):
        return self.get_collection("resumes")

    @property
    def analyses(self):
        return self.get_collection("analyses")

    @property
    def analysis_logs(self):
        return self.get_collection("analysis_logs")

    @property
    def usage_metrics(self):
        return self.get_collection("usage_metrics")

    @property
    def feedback(self):
        return self.get_collection("feedback")

    @property
    def location_cache(self):
        return self.get_collection("location_cache")

    @property
    def admin_settings(self):
        return self.get_collection("admin_settings")


db_handler = DatabaseHandler()