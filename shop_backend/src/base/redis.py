import redis.asyncio as redis  # type: ignore[import-untyped]

from base.deps import get_settings

settings = get_settings()

redis_db = redis.from_url(
    f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}", decode_responses=True
)
