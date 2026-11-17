from sqlalchemy import Integer, String, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, datetime
from app.core import Base
from .clients import User
from .rides import Ride, Team
from .karts import Kart

class RideParticipant(Base):
    __tablename__ = "ride_participants"
    id:               Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id:          Mapped[int] = mapped_column(ForeignKey("users.id"))
    ride_id:          Mapped[int] = mapped_column(ForeignKey("rides.id"))
    team_id:          Mapped[int | None] = mapped_column(ForeignKey("teams.id"), nullable=True)
    kart_id:          Mapped[int] = mapped_column(ForeignKey("karts.id"))
    participant_date: Mapped[date] = mapped_column(Date, default=date.today)
    status:           Mapped[str] = mapped_column(String(20), default="booked")
    created_at:       Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    kart: Mapped[Kart] = relationship(lazy="joined")
    user: Mapped[User] = relationship(lazy="joined")