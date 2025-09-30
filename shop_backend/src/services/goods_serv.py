from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_pagination import Page
from models.goods import Goods
from repositories.goods_repo import GoodsRepository
from schemas.goods import GetGoods, CreateGoodSchema
from exceptions.base import ResourceNotFoundException, AccessDeniedException

class GoodsService:
    def __init__(self, session: AsyncSession):
        self.repository = GoodsRepository(session)

    async def get_goods_list(self,search: str | None) -> Page[GetGoods]:
        return await self.repository.goods_get(search)

    async def create_good(
        self, good:CreateGoodSchema, role: str, is_super_user: bool
        ) -> None:
        if role != "manager" and not is_super_user:
            raise AccessDeniedException("Only managers and admins could create goods")
        good_db = Goods(
            name=good.name, price=good.price, rating=good.rating, 
            category_id=good.category_id,color=good.color, size=good.size, 
            number_in_storage=good.number_in_storage, description=good.description
            )
        return str((await self.repository.save(good_db)).id)

    async def delete_good(
        self,
        good_id: int, 
        role: str, 
        is_super_user: bool
    ) -> None:
        if role != "manager" and not is_super_user:
            raise AccessDeniedException("Only managers and admins could delete goods")
        good_db = await self.repository.good_get(good_id)
        if good_db is None:
            raise ResourceNotFoundException("Good not found")

        await self.repository.good_delete(good_id)

    async def update_good(
        self,
        good_id: int,
        good_update: CreateGoodSchema, 
        role: str, 
        is_super_user: bool
    ):
        if role != "manager" and not is_super_user:
            raise AccessDeniedException("Only managers and admins could update goods")
        good_db = await self.repository.good_get(good_id)
        if good_db is None:
            raise ResourceNotFoundException("Category not found")
  
        good_db = await self.repository.good_update(good_id, good_update)
        if good_db is None:
            raise ResourceNotFoundException("Category not found")

        return CreateGoodSchema(
            name=good_db.name, price=good_db.price, rating=good_db.rating, 
            category_id=good_db.category_id,color=good_db.color, size=good_db.size, 
            number_in_storage=good_db.number_in_storage, description=good_db.description
        )