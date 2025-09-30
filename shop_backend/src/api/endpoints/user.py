from getpass import getuser
from fastapi import APIRouter, Depends
from api.deps import get_users_service
from fastapi_users import FastAPIUsers

from typing import Annotated
from auth.auth import auth_backend
from auth.manager import get_user_manager
from models.user import User
from schemas.user import UserRead, UserCreate, UserUpdate,UserView
from services.users_serv import UsersService
from fastapi_pagination import Page

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

UsersServiceDeps = Annotated[
    UsersService,
    Depends(get_users_service)
    ]

router = APIRouter()

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
)

router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
)

@router.get("/list/")
async def user_list(
    service: UsersServiceDeps
) -> Page[UserView]:
    """
   Get goods
    """
    return await service.get_users_list()

current_active_user = fastapi_users.current_user(active=True)