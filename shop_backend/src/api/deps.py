import fastapi_users
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from base.base import get_async_session
from services.categories_serv import CategoriesService
from services.goods_serv import GoodsService
from services.images_serv import ImagesService
from services.deals_serv import DealsService
from services.users_serv import UsersService

async def get_categories_service(session: AsyncSession = Depends(get_async_session))->CategoriesService:
    return CategoriesService(session)

async def get_goods_service(session: AsyncSession = Depends(get_async_session))->GoodsService:
    return GoodsService(session)

async def get_images_service(session: AsyncSession = Depends(get_async_session))->ImagesService:
    return ImagesService(session)

async def get_deals_service(session: AsyncSession = Depends(get_async_session))->DealsService:
    return DealsService(session)

async def get_users_service(session: AsyncSession = Depends(get_async_session))->UsersService:
    return UsersService(session)