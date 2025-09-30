from fastapi import Depends
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    RedisStrategy,
)
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from base.base import get_async_session
from base.deps import get_settings
from base.redis import redis_db
from models.user import User

settings = get_settings()


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)  # noqa


bearer_transport = BearerTransport(tokenUrl="/api/users/login")


def get_redis_strategy() -> RedisStrategy:
    return RedisStrategy(redis_db, lifetime_seconds=86400)


auth_backend = AuthenticationBackend(
    name="redis",
    transport=bearer_transport,
    get_strategy=get_redis_strategy,
)
