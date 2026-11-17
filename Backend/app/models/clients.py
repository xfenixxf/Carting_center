from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core import Base
from .auth import Account

class User(Base):
    __tablename__ = "users"
    id:         Mapped[int] = mapped_column(Integer, primary_key=True)
    account_id: Mapped[int | None] = mapped_column(ForeignKey("accounts.id"), nullable=True)
    full_name:  Mapped[str] = mapped_column(String(200))

    account: Mapped[Account | None] = relationship(lazy="joined")