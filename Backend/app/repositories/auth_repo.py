from app.models import Account, Role, Personnel
from .base import BaseRepo

class AccountRepo(BaseRepo[Account]): model = Account
class RoleRepo(BaseRepo[Role]): model = Role
class PersonnelRepo(BaseRepo[Personnel]): model = Personnel