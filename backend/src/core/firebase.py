import firebase_admin
from firebase_admin import credentials, auth
from src.core.config import settings


def initialize_firebase():
    if firebase_admin._apps:
        return

    cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)

    print("✅ Firebase Admin initialized")


def verify_firebase_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception:
        return None