from sqlalchemy import select, delete, update
from base.base_repository import BaseRepository
from models.deals import Deals
from models.goods import Goods
from fastapi_pagination import Page
from schemas.deals import GetDeals, CreateDealSchema

class DealsRepository(BaseRepository):

    async def deals_get(self, id: int) -> Page[GetDeals]:
        statement =( (select(Deals.id,Deals.user_id, Goods.name, Deals.price).join(Goods, Goods.id == Deals.good_id)).where(Deals.user_id==id))
        #result =(await self.session.execute(statement)).all()
        return await self.paginate(statement)

    async def deal_get(self, id: int) -> Deals | None:
        statement = select(Deals).where(Deals.id == int(id))
        return await self.one_or_none(statement)

    async def deal_delete(self, id: int) -> None:
        statement = delete(Deals).where(Deals.id == int(id))
        await self.session.execute(statement)