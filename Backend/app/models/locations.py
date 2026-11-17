from sqlalchemy import Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.core import Base

class Location(Base):
    __tablename__ = "locations"
    id:       Mapped[int] = mapped_column(Integer, primary_key=True)
    name:     Mapped[str] = mapped_column(String(100))
    address:  Mapped[str | None] = mapped_column(String(200), nullable=True)
    distance: Mapped[float | None] = mapped_column(Float, nullable=True)