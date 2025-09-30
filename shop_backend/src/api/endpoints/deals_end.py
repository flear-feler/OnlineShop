from fastapi import APIRouter, Depends
from api.deps import get_deals_service
from api.endpoints.user import current_active_user
from schemas.deals import CreateDealSchema, GetDeals
from typing import Annotated
from models import User
from fastapi_pagination import Page
from services.deals_serv import DealsService

router = APIRouter()
DealsServiceDeps = Annotated[
    DealsService,
    Depends(get_deals_service)
    ]

UserDeps = Annotated[
    User,
    Depends(current_active_user)
    ]

@router.get("/list/")
async def deals_list(
    service: DealsServiceDeps, user: UserDeps, user_id: int | None = None
) -> Page[GetDeals]:
    """
   Get deals
    """
    return await service.get_deals_list(user.id,user_id, user.role)

@router.post("/create/")
async def deal_create(
    deal: CreateDealSchema, user: UserDeps, service: DealsServiceDeps
) -> None:
    """
   Create deal
    """
    return await service.create_deal(deal, user.id)

@router.delete("/delete/{good_id}/")
async def delete_deal(
    deal_id: int, user: UserDeps, service: DealsServiceDeps
) -> None:
    await service.delete_deal(
        deal_id, user.id, user.is_superuser
    )