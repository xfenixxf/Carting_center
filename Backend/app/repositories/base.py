from typing import Generic, TypeVar, Type, Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core import Base

T = TypeVar("T", bound=Base)


class BaseRepo(Generic[T]):
    model: Type[T]

    def __init__(self, db: Session):
        self.db = db

    def get(self, id_: int) -> T | None:
        return self.db.get(self.model, id_)

    def list(self) -> Sequence[T]:
        return self.db.scalars(select(self.model)).all()

    def delete(self, id_: int) -> None:
        obj = self.get(id_)
        if obj:
            try:
                self.db.delete(obj)
                self.db.commit()
            except IntegrityError:
                self.db.rollback()
                raise ValueError("Невозможно удалить запись: она используется в других таблицах.")

    def add(self, e: T) -> T:
        try:
            self.db.add(e)
            self.db.commit()
            self.db.refresh(e)
            return e
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Ошибка сохранения: указан несуществующий ID.")

    def update(self, e: T) -> T:
        try:
            self.db.commit()
            self.db.refresh(e)
            return e
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Ошибка обновления: указан несуществующий ID.")