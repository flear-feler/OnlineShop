from sqlalchemy.ext.asyncio import AsyncSession

from models.categories import Categories
from repositories.categories_repo import CategoriesRepository
from schemas.categories import CreateCategory, Category
from exceptions.base import ResourceNotFoundException, AccessDeniedException
from fastapi_pagination import Page

class CategoriesService:
    def __init__(self, session: AsyncSession):
        self.repository = CategoriesRepository(session)

    async def get_categories_list(self) -> Page[Category]:
        return await self.repository.categories_get()

    async def create_category(
        self, category:CreateCategory, 
        role: str, 
        is_super_user: bool
        ) -> None:
        if role != "manager" and not is_super_user:
            raise AccessDeniedException("Only managers and admins could create categories")
        category_db = Categories(
            name=category.name 
            )
        await self.repository.save(category_db)

    async def delete_category(
        self,
        category_id: int, 
        role: str, 
        is_super_user: bool
    ) -> None:
        if role != "manager" and not is_super_user:
            raise AccessDeniedException("Only managers and admins could delete categories")
        category_db = await self.repository.category_get(category_id)
        if category_db is None:
            raise ResourceNotFoundException("Category not found")
        await self.repository.category_delete(category_id)

    async def update_category(
        self,
        category_id: int,
        category_update: CreateCategory, 
        role: str, 
        is_super_user: bool
    ):
        if role != "manager" and not is_super_user:
            raise AccessDeniedException("Only managers and admins could update categories")
        category_db = await self.repository.category_get(category_id)
        if category_db is None:
            raise ResourceNotFoundException("Category not found")
  
        category_db = await self.repository.category_update(category_id, category_update)
        if category_db is None:
            raise ResourceNotFoundException("Category not found")

        return CreateCategory(
            name=category_db.name,
        )