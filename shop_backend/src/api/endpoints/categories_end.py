from fastapi import APIRouter, Depends
from api.deps import get_categories_service
from api.endpoints.user import current_active_user
from schemas.categories import CreateCategory, Category
from typing import Annotated
from models import User
from services.categories_serv import CategoriesService
from fastapi_pagination import Page

router = APIRouter()
CategoriesServiceDeps = Annotated[
    CategoriesService,
    Depends(get_categories_service)
    ]

UserDeps = Annotated[
    User,
    Depends(current_active_user)
    ]

@router.get("/list/")
async def categiories_list(
    service: CategoriesServiceDeps
) -> Page[Category]:
    """
   Get categories
    """
    return await service.get_categories_list()

@router.post("/create/")
async def category_create(
    category: CreateCategory, user: UserDeps, service: CategoriesServiceDeps
) -> None:
    """
   Create new category
    """
    return await service.create_category(category, user.role, user.is_superuser)

@router.delete("/delete/{category_id}/")
async def delete_category(
    category_id: int, user: UserDeps, service: CategoriesServiceDeps
) -> None:
    await service.delete_category(
        category_id, user.role, user.is_superuser
    )

@router.patch("/update/{event_id}/")
async def update_category(
    category_id: int,
    category_update: CreateCategory,
    service: CategoriesServiceDeps, 
    user: UserDeps
) -> CreateCategory:
    return await service.update_category(
        category_id, category_update, user.role, user.is_superuser
    )