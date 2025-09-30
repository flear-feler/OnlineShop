from fastapi import APIRouter, Depends, UploadFile
from starlette.responses import StreamingResponse
from api.deps import get_images_service
from api.endpoints.user import current_active_user
from schemas.images import InputFile, OutputFile, UploadOutFile
from typing import Annotated
from models import User
from services.images_serv import ImagesService

router = APIRouter()
ImagesServiceDeps = Annotated[
    ImagesService,
    Depends(get_images_service)
    ]

UserDeps = Annotated[
    User,
    Depends(current_active_user)
    ]

@router.post("/create/")
async def upload_photo(
    service: ImagesServiceDeps, user: UserDeps, good_id: int, data: UploadFile
) -> None:
    """
   Upload photo
    """
    return await service.save_photo(good_id, data, user.role, user.is_superuser)

@router.delete("/delete/{image_id}/")
async def delete_photo(
    image_id: int, user: UserDeps, service: ImagesServiceDeps
) -> None:
    await service.delete_image(
        image_id, user.role, user.is_superuser
    )

@router.post("/list/")
async def images_list(
    service: ImagesServiceDeps, good_ids: list[int]
) -> list[UploadOutFile]:
    """
   Get images
    """
    return await service.get_images_list(good_ids)

@router.patch("/update/{image_id}/")
async def update_photo(
    image_id: int,
    image_update: InputFile, 
    user: UserDeps,
    service: ImagesServiceDeps,
) -> OutputFile:
    return await service.update_image(
        image_id, image_update, user.role, user.is_superuser
    )

@router.get("/download/{image_id}/")
async def download_photo(
    image_id: int,
    service: ImagesServiceDeps,
) -> StreamingResponse:
    stream, headers = await service.download_file(image_id)
    return StreamingResponse(
        stream, headers=headers
    )