from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_pagination import Page
from repositories.users_repo import UsersRepository
from schemas.user import UserView

class UsersService:
    def __init__(self, session: AsyncSession):
        self.repository = UsersRepository(session)

    async def get_users_list(self) -> Page[UserView]:
        return await self.repository.users_get()

    