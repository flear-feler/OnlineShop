from io import BytesIO
import uuid
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile
from models.images import Images
from repositories.images_repo import ImagesRepository
from schemas.images import InputFile, OutputFile, UploadOutFile
from exceptions.base import ResourceNotFoundException, AccessDeniedException, ConflictingStateException


class ImagesService:
    def __init__(self, session: AsyncSession):
        self.repository = ImagesRepository(session)

    async def save_photo(self, good_id:int, data:UploadFile, role: str, is_super_user: bool) -> None:
        if role != "manager" and not is_super_user:
            raise AccessDeniedException("Only managers and admins could create images")

        existing_photo = await self.repository.get_image_by_good_id(good_id)
        if existing_photo:
            raise ConflictingStateException(f"Good with id={good_id} already has photo")

        raw_photo = await data.read()
        photo = Images(
            data=raw_photo,
            good_id=good_id
            )
        
        await data.close()
        await self.repository.save(photo)

    async def delete_image(
        self,
        image_id: int, role: str, is_super_user: bool
    ) -> None:
        if role != "manager" and not is_super_user:
            raise AccessDeniedException("Only managers and admins could delete images")
        image_db = await self.repository.image_get(image_id)
        if image_db is None:
            raise ResourceNotFoundException("Category not found")

        await self.repository.image_delete(image_id)

    async def get_images_list(self, good_ids: list[int]) -> list[UploadOutFile]:
        return await self.repository.images_get(good_ids)

    async def update_image(
        self,
        image_id: int,
        image_update: InputFile, 
        role: str, 
        is_super_user: bool
    ):
        if role != "manager" and not is_super_user:
            raise AccessDeniedException("Only managers and admins could create images")
        image_db = await self.repository.image_get(image_id)
        if image_db is None:
            raise ResourceNotFoundException("Image not found")
  
        image_db = await self.repository.image_update(image_id, image_update)
        if image_db is None:
            raise ResourceNotFoundException("Image not found")

        return OutputFile(
            id=image_db.id,
            good_id = image_db.good_id
        )

    async def download_file(
        self,
        image_id: int
    ):
        photo = await self.repository.image_get(image_id)
        headers = {
            "Content-Type": "image/jpg",
            "Content-Disposition": f"attachment; filename=\"{uuid.uuid4()}.jpg\""
        }

        return BytesIO(photo.data), headers