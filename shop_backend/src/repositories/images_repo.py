from sqlalchemy import select, delete, update
from base.base_repository import BaseRepository
from models.goods import Goods
from models.images import Images
from schemas.images import InputFile, UploadOutFile


class ImagesRepository(BaseRepository):
   
    async def image_get(self, id: int) -> Images | None:
        statement = select(Images).where(Images.id == int(id))
        return await self.one_or_none(statement)

    async def image_delete(self, id: int) -> None:
        statement = delete(Images).where(Images.id == int(id))
        await self.session.execute(statement)

    async def get_image_by_good_id(self, good_id: int) -> Images | None:
        statement = select(Images).where(Images.good_id == good_id)

        return await self.one_or_none(statement)

    async def images_get(self, good_ids: list[int]) -> list[UploadOutFile]:
        statement = (
            select(
                Images.id.label("photo_id"),
                Goods.id.label("good_id"),
                Goods.name.label('good')
            )
            .join(Goods, Goods.id == Images.good_id)
        )
        statement = statement.where(Goods.id.in_(good_ids))
        result =(await self.session.execute(statement)).all()
        return [UploadOutFile.model_validate(item, from_attributes=True) for item in result]

    async def image_update(
        self, id: int, image_update: InputFile
    ) -> Images | None:
        old_event: Images | None = await self.one_or_none(
            select(Images).where(Images.id == int(id))
        )
        if not old_event:
            return None

        statement = (
            update(Images)
            .where(Images.id == int(id))
            .values(
                good_id=image_update.good_id if image_update.good_id else old_event.good_id
            )
            .returning(Images)
        )
        image_db = await self.one_or_none(statement)
        await self.session.flush()
        await self.session.refresh(image_db)
        return image_db