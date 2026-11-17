from app.models import Kart, KartType
from app.schemas import KartCreate, KartUpdate, KartOut, KartTypeCreate, KartTypeUpdate, KartTypeOut
from app.repositories import KartRepo, KartTypeRepo


class KartService:
    def __init__(self, repo: KartRepo):
        self.repo = repo

    def list(self):
        return [self._o(k) for k in self.repo.list()]

    def get(self, i):
        k = self.repo.get(i)
        return self._o(k) if k else None

    def create(self, d: KartCreate):
        return self._o(self.repo.add(Kart(
            serial_number=d.serial_number, kart_type_id=d.kart_type_id,
            price=d.price, is_active=d.is_active)))

    def update(self, i, d: KartUpdate):
        k = self.repo.get(i)
        if not k: return None
        k.serial_number = d.serial_number;
        k.kart_type_id = d.kart_type_id
        k.price = d.price;
        k.is_active = d.is_active
        return self._o(self.repo.update(k))

    def delete(self, i):
        self.repo.delete(i)

    @staticmethod
    def _o(k):
        return KartOut(id=k.id, serial_number=k.serial_number,
                       kart_type_id=k.kart_type_id, price=float(k.price),
                       is_active=k.is_active)


class KartTypeService:
    def __init__(self, repo: KartTypeRepo):
        self.repo = repo

    def list(self):
        return [KartTypeOut(id=t.id, name=t.name, price_per_race=float(t.price_per_race))
                for t in self.repo.list()]

    def create(self, d: KartTypeCreate):
        t = self.repo.add(KartType(name=d.name, price_per_race=d.price_per_race))
        return KartTypeOut(id=t.id, name=t.name, price_per_race=float(t.price_per_race))

    def update(self, i, d):
        t = self.repo.get(i)
        if not t: return None
        t.name = d.name;
        t.price_per_race = d.price_per_race
        self.repo.update(t)
        return KartTypeOut(id=t.id, name=t.name, price_per_race=float(t.price_per_race))

    def delete(self, i):
        self.repo.delete(i)