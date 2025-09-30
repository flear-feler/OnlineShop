# mypy: ignore-errors
from logging import getLogger
from typing import Optional

from fastapi import Depends
from fastapi_users import IntegerIDMixin, BaseUserManager
from starlette.requests import Request

from auth.auth import get_user_db
from base.deps import get_settings
from models.user import User


settings = get_settings()
logger = getLogger("api")


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = settings.SECRET
    verification_token_secret = settings.SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        logger.info(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        logger.info(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        logger.info(
            f"Verification requested for user {user.id}. Verification token: {token}"
        )


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)
