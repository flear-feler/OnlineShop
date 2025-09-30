from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from base import Base


class Categories(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(
        String(length=64), nullable=False
    )