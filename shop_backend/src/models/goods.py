from sqlalchemy import Float, String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from base import Base


class Goods(Base):
    __tablename__ = "goods"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(
        String(length=128), nullable=False
    )
    price: Mapped[int] = mapped_column(Integer, nullable=False) 
    rating: Mapped[float] = mapped_column(Float, nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    color: Mapped[str] = mapped_column(String(length=128), nullable=False)
    size: Mapped[str] = mapped_column(String(length=64), nullable=False)
    number_in_storage: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(
        String(length=1024)
    )