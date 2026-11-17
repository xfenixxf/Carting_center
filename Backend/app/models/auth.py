from datetime import date, time, datetime
from sqlalchemy import (
    Integer, String, Numeric, Boolean, Date, Time, Text,
    ForeignKey, Float, DateTime, func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core import Base

class Role(Base):
    __tablename__ = "roles"
    id:   Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)


class Account(Base):
    __tablename__ = "accounts"
    id:            Mapped[int] = mapped_column(Integer, primary_key=True)
    email:         Mapped[str] = mapped_column(String(100), unique=True)
    role_id:       Mapped[int] = mapped_column(ForeignKey("roles.id"))
    created_at:    Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    password_hash: Mapped[str | None] = mapped_column(String(200), nullable=True)

    role: Mapped[Role] = relationship(lazy="joined")


class Personnel(Base):
    __tablename__ = "personnel"
    id:         Mapped[int] = mapped_column(Integer, primary_key=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"), unique=True)
    full_name:  Mapped[str] = mapped_column(String(200))

    account: Mapped[Account] = relationship(lazy="joined")