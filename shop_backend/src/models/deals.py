from sqlalchemy import Float, String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from base import Base


class Deals(Base):
    __tablename__ = "deals"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    good_id: Mapped[int] = mapped_column(ForeignKey("goods.id"))
    price: Mapped[int] = mapped_column(Integer, nullable=False)