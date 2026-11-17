from app.models import User, Personnel, Account, Role
from app.schemas import ClientOut, StaffOut, StaffCreate, StaffUpdate
from app.repositories import UserRepo
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core import hash_password

class ClientService:
    def __init__(self, repo: UserRepo):
        self.repo = repo

    def list(self):
        return [ClientOut(
                    id=u.id,
                    full_name=u.full_name,
                    email=u.account.email if u.account else "",
                    created_at=u.account.created_at if u.account else None
                )
                for u in self.repo.list()]

class StaffService:
    def __init__(self, db: Session):
        self.db = db

    def list(self):
        rows = self.db.execute(
            select(Personnel, Account, Role)
            .join(Account, Personnel.account_id == Account.id)
            .join(Role, Account.role_id == Role.id)
        ).all()
        return [StaffOut(id=p.id, full_name=p.full_name, account_id=p.account_id,
                         email=a.email, role=r.name)
                for p, a, r in rows]

    def create(self, d: StaffCreate):
        if self.db.scalar(select(Account).where(Account.email == d.email)):
            raise ValueError("Сотрудник с таким email уже существует")

        role = self.db.scalar(select(Role).where(Role.name == d.role))
        if not role:
            raise ValueError(f"Роль '{d.role}' не найдена")

        acc = Account(
            email=d.email,
            role_id=role.id,
            password_hash=hash_password(d.password)
        )
        self.db.add(acc)
        self.db.flush()

        person = Personnel(
            account_id=acc.id,
            full_name=d.full_name
        )
        self.db.add(person)
        self.db.commit()
        self.db.refresh(person)

        return StaffOut(id=person.id, full_name=person.full_name,
                        account_id=acc.id, email=acc.email, role=role.name)

    def update(self, i: int, d: StaffUpdate):
        person = self.db.scalar(select(Personnel).where(Personnel.id == i))
        if not person:
            return None

        acc = person.account
        role = self.db.scalar(select(Role).where(Role.name == d.role))

        person.full_name = d.full_name
        acc.email = d.email
        acc.role_id = role.id

        if d.password:
            acc.password_hash = hash_password(d.password)

        self.db.commit()
        self.db.refresh(person)

        return StaffOut(id=person.id, full_name=person.full_name,
                        account_id=acc.id, email=acc.email, role=role.name)

    def delete(self, i: int):
        person = self.db.scalar(select(Personnel).where(Personnel.id == i))
        if person:
            acc = person.account
            try:
                self.db.delete(person)
                self.db.delete(acc)
                self.db.commit()
            except Exception:
                self.db.rollback()
                raise ValueError("Невозможно удалить сотрудника: он привязан к заездам или ТО.")