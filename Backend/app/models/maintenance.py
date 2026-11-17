from sqlalchemy import Integer, String, Float, Boolean, Date, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date
from app.core import Base
from .karts import Kart
from .auth  import Personnel

class Part(Base):
    __tablename__ = "parts"
    id_parts:    Mapped[int] = mapped_column(Integer, primary_key=True)
    name_parts:  Mapped[str] = mapped_column(String(50))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    quantity:    Mapped[int] = mapped_column(Integer)
    price:       Mapped[float] = mapped_column(Float)

class TypeTO(Base):
    __tablename__ = "type_to"
    id:                   Mapped[int] = mapped_column(Integer, primary_key=True)
    name_type:            Mapped[str] = mapped_column(String(50), unique=True)
    description:          Mapped[str | None] = mapped_column(Text, nullable=True)
    recommended_interval: Mapped[float | None] = mapped_column(Float, nullable=True)

class Maintenance(Base):
    __tablename__ = "to_maintenance"
    id_to:        Mapped[int] = mapped_column(Integer, primary_key=True)
    kart_id:      Mapped[int] = mapped_column(ForeignKey("karts.id"))
    id_type_to:   Mapped[int] = mapped_column(ForeignKey("type_to.id"))
    id_master:    Mapped[int] = mapped_column(ForeignKey("personnel.id"))
    date:         Mapped[date] = mapped_column(Date)
    description:  Mapped[str | None] = mapped_column(Text, nullable=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    kart:    Mapped[Kart]      = relationship(lazy="joined")
    type_to: Mapped[TypeTO]    = relationship(lazy="joined")
    master:  Mapped[Personnel] = relationship(lazy="joined")

class UsingPart(Base):
    __tablename__ = "using_parts"
    id:       Mapped[int] = mapped_column(Integer, primary_key=True)
    parts_id: Mapped[int] = mapped_column(ForeignKey("parts.id_parts"))
    to_id:    Mapped[int] = mapped_column(ForeignKey("to_maintenance.id_to"))
    quantity: Mapped[int] = mapped_column(Integer)

    part: Mapped[Part] = relationship(lazy="joined")