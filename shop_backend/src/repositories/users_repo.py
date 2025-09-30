from sqlalchemy import select
from base.base_repository import BaseRepository
from models.user import User
from fastapi_pagination import Page
from schemas.user import UserView

class UsersRepository(BaseRepository):

    async def users_get(self) -> Page[UserView]:
        statement = (select(User.id,User.username,User.role))
        return await self.paginate(statement)