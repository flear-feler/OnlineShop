from sqlalchemy import select, delete, update
from base.base_repository import BaseRepository
from models.goods import Goods
from models.categories import Categories
from fastapi_pagination import Page
from schemas.goods import GetGoods, CreateGoodSchema

class GoodsRepository(BaseRepository):

    async def goods_get(self,search: str | None) -> Page[GetGoods]:
        statement = (select(Goods.id,Goods.name, Goods.price, Goods.rating, Categories.name.label('category'),
                            Goods.color, Goods.size, Goods.number_in_storage, Goods.description)
                     .join(Categories, Categories.id == Goods.category_id))
        if search:
            statement = statement.where(Goods.name.ilike(f"%{search}%"))
        #result =(await self.session.execute(statement)).all()
        return await self.paginate(statement)

    async def good_get(self, id: int) -> Goods | None:
        statement = select(Goods).where(Goods.id == int(id))
        return await self.one_or_none(statement)

    async def good_delete(self, id: int) -> None:
        statement = delete(Goods).where(Goods.id == int(id))
        await self.session.execute(statement)

    async def good_update(
        self, id: int, good_update: CreateGoodSchema
    ) -> Goods | None:
        old_event: Goods | None = await self.one_or_none(
            select(Goods).where(Goods.id == int(id))
        )
        if not old_event:
            return None

        statement = (
            update(Goods)
            .where(Goods.id == int(id))
            .values(
                name=good_update.name if good_update.name else old_event.name,
                price=good_update.price if good_update.price else old_event.price,
                rating=good_update.rating if good_update.rating else old_event.rating,
                category_id=good_update.category_id if good_update.category_id else old_event.category_id,
                color=good_update.color if good_update.color else old_event.color,
                size=good_update.size if good_update.size else old_event.size,
                number_in_storage=good_update.number_in_storage if good_update.number_in_storage else old_event.number_in_storage,
                description=good_update.description if good_update.description else old_event.description
            )
            .returning(Goods)
        )
        goods_db = await self.one_or_none(statement)
        await self.session.flush()
        await self.session.refresh(goods_db)
        return goods_db