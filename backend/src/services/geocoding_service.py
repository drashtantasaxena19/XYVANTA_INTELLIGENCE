import httpx

from src.core.config import settings

from src.utils.db_handler import (
    db_handler,
)

from src.engines.normalization.location_normalizer import (
    normalize_location,
)


async def get_location_geo_data(
    location: str | None,
) -> dict | None:

    normalized = normalize_location(
        location,
    )

    if not normalized["raw"]:
        return None

    normalized_query = (
        normalized["normalized"]
    )

    # =========================
    # Cache Check
    # =========================

    if settings.GEOCODING_CACHE_ENABLED:

        cached = (
            await db_handler.location_cache.find_one(
                {
                    "query":
                        normalized_query,
                }
            )
        )

        if cached:
            cached.pop("_id", None)
            return cached

    try:

        async with httpx.AsyncClient(
            timeout=15,
        ) as client:

            response = await client.get(
                settings.NOMINATIM_BASE_URL,

                params={
                    "q":
                        normalized["raw"],

                    "format":
                        "jsonv2",

                    "limit":
                        1,

                    "addressdetails":
                        1,
                },

                headers={
                    "User-Agent":
                        settings.NOMINATIM_USER_AGENT,
                },
            )

        if response.status_code != 200:
            return None

        results = response.json()

        if not results:
            return None

        result = results[0]

        address = result.get(
            "address",
            {},
        )

        geo_data = {
            "query":
                normalized_query,

            "raw":
                normalized["raw"],

            "display_name":
                result.get(
                    "display_name"
                ),

            "city":
                (
                    address.get("city")
                    or address.get("town")
                    or address.get("municipality")
                    or address.get("village")
                    or address.get("county")
                ),

            "state":
                address.get("state"),

            "country":
                address.get("country"),

            "country_code":
                (
                    address.get(
                        "country_code",
                        "",
                    ).upper()
                ),

            "lat":
                float(
                    result.get("lat")
                ),

            "lng":
                float(
                    result.get("lon")
                ),

            "source":
                "nominatim",
        }

        # =========================
        # Cache Save
        # =========================

        if settings.GEOCODING_CACHE_ENABLED:

            await db_handler.location_cache.update_one(
                {
                    "query":
                        normalized_query,
                },

                {
                    "$set":
                        geo_data,
                },

                upsert=True,
            )

        return geo_data

    except Exception as error:

        print(
            f"⚠️ Geocoding failed for "
            f"{location}: {error}"
        )

        return None