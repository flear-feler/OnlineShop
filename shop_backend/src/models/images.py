from sqlalchemy import BLOB, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from base import Base


class Images(Base):
    __tablename__ = "images"

    id: Mapped[int] = mapped_column(primary_key=True)
    data: Mapped[bytes]
    good_id: Mapped[int] = mapped_column(ForeignKey("goods.id"))