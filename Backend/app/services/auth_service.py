from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core import verify_password, issue_token, hash_password
from app.models import Account, Personnel, User, Role
from app.schemas import LoginOut, UserInfo, RegisterIn, RegisterOut

ROLE_MAP = {
    "admin": "admin", "manager": "manager",
    "mechanic": "mechanic", "user": "user",
}


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def login(self, email: str, password: str) -> LoginOut | None:
        acc = self.db.scalar(select(Account).where(Account.email == email))
        if not acc or not acc.password_hash:
            return None
        if not verify_password(password, acc.password_hash):
            return None

        person = self.db.scalar(select(Personnel).where(Personnel.account_id == acc.id))
        if not person:
            u = self.db.scalar(select(User).where(User.account_id == acc.id))
            full_name = u.full_name if u else acc.email
            user_id = u.id
            db_role = "user"
        else:
            full_name = person.full_name
            user_id = person.id
            db_role = acc.role.name

        return LoginOut(
            token=issue_token(user_id, acc.email, db_role),
            user=UserInfo(id=user_id, full_name=full_name,
                          email=acc.email, role=db_role),
        )

    def register(self, d: RegisterIn) -> RegisterOut:
        if self.db.scalar(select(Account).where(Account.email == d.email)):
            raise ValueError("Email уже используется")
        user_role = self.db.scalar(select(Role).where(Role.name == "user"))
        if not user_role:
            raise ValueError("Роль 'user' не найдена")
        acc = Account(email=d.email, role_id=user_role.id,
                      password_hash=hash_password(d.password))
        self.db.add(acc)
        self.db.flush()
        usr = User(account_id=acc.id, full_name=d.full_name)
        self.db.add(usr)
        self.db.commit()
        self.db.refresh(usr)
        return RegisterOut(id=usr.id, full_name=usr.full_name,
                           email=d.email, role="user")