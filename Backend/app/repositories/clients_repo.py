from app.models import User
from .base import BaseRepo

class UserRepo(BaseRepo[User]): model = User