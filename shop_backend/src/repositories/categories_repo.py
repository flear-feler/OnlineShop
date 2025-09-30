from sqlalchemy import select, delete, update
from base.base_repository import BaseRepository
from models.categories import Categories
from schemas.categories import CreateCategory, Category
from fastapi_pagination import Page

class CategoriesRepository(BaseRepository):

    async def categories_get(self) -> Page[Category]:
        statement = (select(Categories.id, Categories.name))

        # result = (await self.session.execute(statement)).all()
        # return [CreateCategory.model_validate(item, from_attributes=True) for item in result]
        return await self.paginate(statement)

    async def category_delete(self, id: int) -> None:
        statement = delete(Categories).where(Categories.id == int(id))
        await self.session.execute(statement)

    async def category_get(self, id: int) -> Categories | None:
        statement = select(Categories).where(Categories.id == int(id))
        return await self.one_or_none(statement)

    async def category_update(
        self, id: int, category_update: CreateCategory
    ) -> Categories | None:
        old_event: Categories | None = await self.one_or_none(
            select(Categories).where(Categories.id == int(id))
        )
        if not old_event:
            return None

        statement = (
            update(Categories)
            .where(Categories.id == int(id))
            .values(
                name=category_update.name if category_update.name else old_event.name
            )
            .returning(Categories)
        )
        category_db = await self.one_or_none(statement)
        await self.session.flush()
        await self.session.refresh(category_db)
        return category_db