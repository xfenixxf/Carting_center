from sqlalchemy import Integer, String, Numeric, Boolean, Date, Time, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, time
from app.core import Base
from .locations import Location

class Ride(Base):
    __tablename__ = "rides"
    id:               Mapped[int] = mapped_column(Integer, primary_key=True)
    location_id:      Mapped[int] = mapped_column(ForeignKey("locations.id"))
    ride_data:        Mapped[str | None] = mapped_column(String(500), nullable=True)
    ride_date:        Mapped[date] = mapped_column(Date)
    start_time:       Mapped[time] = mapped_column(Time)
    end_time:         Mapped[time] = mapped_column(Time)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=10)
    max_participants: Mapped[int] = mapped_column(Integer, default=10)
    status:           Mapped[str] = mapped_column(String(20), default="open")
    amount_paid:      Mapped[float] = mapped_column(Numeric(10, 2), default=0)

    location: Mapped[Location] = relationship(lazy="joined")

class Team(Base):
    __tablename__ = "teams"
    id:        Mapped[int] = mapped_column(Integer, primary_key=True)
    name:      Mapped[str] = mapped_column(String(200))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)