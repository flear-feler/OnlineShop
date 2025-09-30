from fastapi import APIRouter
from api.endpoints.user import router as user_router
from api.endpoints.categories_end import router as categories_router
from api.endpoints.goods_end import router as goods_router
from api.endpoints.images_end import router as images_router
from api.endpoints.deals_end import router as deals_router

router = APIRouter()

router.include_router(user_router, prefix="/users", tags=["users"])
router.include_router(categories_router, prefix="/categories", tags=["categories"])
router.include_router(goods_router, prefix="/goods", tags=["goods"])
router.include_router(images_router, prefix="/images", tags=["images"])
router.include_router(deals_router, prefix="/deals", tags=["deals"])