import os

import firebase_admin
from firebase_admin import auth, credentials

from src.core.config import settings


def initialize_firebase():
    if firebase_admin._apps:
        return True

    firebase_path = (
        settings.FIREBASE_SERVICE_ACCOUNT_PATH
    )

    if (
        not firebase_path
        or not os.path.exists(firebase_path)
    ):
        print(
            "⚠️ Firebase service account file not found. "
            "Skipping Firebase initialization."
        )
        return False

    cred = credentials.Certificate(
        firebase_path
    )

    firebase_admin.initialize_app(
        cred
    )

    print(
        "✅ Firebase Admin initialized"
    )

    return True


def verify_firebase_token(
    id_token: str,
):
    try:
        if not firebase_admin._apps:
            initialized = (
                initialize_firebase()
            )

            if not initialized:
                return None

        decoded_token = (
            auth.verify_id_token(
                id_token
            )
        )

        return decoded_token

    except Exception as error:
        print(
            f"⚠️ Firebase token verification failed: {error}"
        )

        return None