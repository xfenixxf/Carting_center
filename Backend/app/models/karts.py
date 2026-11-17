from sqlalchemy import Integer, String, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core import Base

class KartType(Base):
    __tablename__ = "kart_types"
    id:             Mapped[int] = mapped_column(Integer, primary_key=True)
    name:           Mapped[str] = mapped_column(String(100), unique=True)
    price_per_race: Mapped[float] = mapped_column(Numeric(10, 2))

class Kart(Base):
    __tablename__ = "karts"
    id:            Mapped[int] = mapped_column(Integer, primary_key=True)
    serial_number: Mapped[str] = mapped_column(String(50), unique=True)
    kart_type_id:  Mapped[int] = mapped_column(ForeignKey("kart_types.id"))
    price:         Mapped[float] = mapped_column(Numeric(10, 2))
    is_active:     Mapped[bool] = mapped_column(Boolean, default=True)

    kart_type: Mapped[KartType] = relationship(lazy="joined")