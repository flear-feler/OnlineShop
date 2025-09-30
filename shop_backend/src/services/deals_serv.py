from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_pagination import Page
from models.deals import Deals
from repositories.deals_repo import DealsRepository
from schemas.deals import GetDeals, CreateDealSchema
from exceptions.base import ResourceNotFoundException, AccessDeniedException

class DealsService:
    def __init__(self, session: AsyncSession):
        self.repository = DealsRepository(session)

    async def get_deals_list(self, id: int, user_id: int | None, role: str) -> Page[GetDeals]:
        if user_id != None:
            if role == 'user':
                raise AccessDeniedException("Only managers and admins could view deals that are not theirs")
            else:
                return await self.repository.deals_get(user_id)
        return await self.repository.deals_get(id)

    async def create_deal(
        self, deal:CreateDealSchema, id: int
        ) -> None:
        deal_db = Deals(
            user_id=id, good_id=deal.good_id, price=deal.price
            )
        await self.repository.save(deal_db)

    async def delete_deal(
        self,
        deal_id: int, 
        id: int, 
        is_super_user: bool
    ) -> None:
        deal_db = await self.repository.deal_get(deal_id)
        if deal_db.user_id != id and not is_super_user:
            raise AccessDeniedException("Only managers and admins could delete deals that are not theirs")
        if deal_db is None:
            raise ResourceNotFoundException("Deal not found")

        await self.repository.deal_delete(deal_id)