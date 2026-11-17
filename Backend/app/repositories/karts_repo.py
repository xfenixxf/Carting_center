from app.models import Kart, KartType
from .base import BaseRepo

class KartRepo(BaseRepo[Kart]): model = Kart
class KartTypeRepo(BaseRepo[KartType]): model = KartType