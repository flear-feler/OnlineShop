from fastapi import APIRouter, Depends
from api.deps import get_goods_service
from api.endpoints.user import current_active_user
from schemas.goods import GetGoods, CreateGoodSchema
from typing import Annotated
from models import User
from fastapi_pagination import Page
from services.goods_serv import GoodsService

router = APIRouter()
GoodsServiceDeps = Annotated[
    GoodsService,
    Depends(get_goods_service)
    ]

UserDeps = Annotated[
    User,
    Depends(current_active_user)
    ]

@router.get("/list/")
async def goods_list(
    service: GoodsServiceDeps, search: str | None = None
) -> Page[GetGoods]:
    """
   Get goods
    """
    return await service.get_goods_list(search)

@router.post("/create/")
async def good_create(
    good: CreateGoodSchema, user: UserDeps, service: GoodsServiceDeps
) -> None:
    """
   Create good
    """
    return await service.create_good(good, user.role, user.is_superuser)

@router.delete("/delete/{good_id}/")
async def delete_good(
    good_id: int, user: UserDeps, service: GoodsServiceDeps
) -> None:
    await service.delete_good(
        good_id, user.role, user.is_superuser
    )

@router.patch("/update/{good_id}/")
async def update_good(
    good_id: int,
    good_update: CreateGoodSchema,
    service: GoodsServiceDeps, 
    user: UserDeps
) -> CreateGoodSchema:
    return await service.update_good(
        good_id, good_update, user.role, user.is_superuser
    )