from app.models import Part, TypeTO, Maintenance, UsingPart
from app.schemas import PartCreate, PartUpdate, PartOut, MaintenanceTypeCreate, MaintenanceTypeUpdate, MaintenanceTypeOut, MaintenanceCreate, MaintenanceOut, UsingPartCreate, UsingPartOut
from app.repositories import PartRepo, TypeTORepo, MaintenanceRepo, UsingPartRepo

class PartService:
    def __init__(self, repo: PartRepo): self.repo = repo
    def list(self):
        return [PartOut(id_parts=p.id_parts, name_parts=p.name_parts,
                        description=p.description, quantity=p.quantity, price=float(p.price))
                for p in self.repo.list()]
    def create(self, d):
        p = self.repo.add(Part(name_parts=d.name_parts, description=d.description,
                               quantity=d.quantity, price=d.price))
        return PartOut(id_parts=p.id_parts, name_parts=p.name_parts,
                       description=p.description, quantity=p.quantity, price=float(p.price))
    def update(self, i, d):
        p = self.repo.get(i)
        if not p: return None
        p.name_parts = d.name_parts; p.description = d.description
        p.quantity = d.quantity; p.price = d.price
        self.repo.update(p)
        return PartOut(id_parts=p.id_parts, name_parts=p.name_parts,
                       description=p.description, quantity=p.quantity, price=float(p.price))
    def delete(self, i): self.repo.delete(i)

class MaintenanceTypeService:
    def __init__(self, repo: TypeTORepo): self.repo = repo
    def list(self):
        return [MaintenanceTypeOut(id=t.id, name_type=t.name_type,
                                   description=t.description,
                                   recommended_interval=t.recommended_interval)
                for t in self.repo.list()]
    def create(self, d):
        t = self.repo.add(TypeTO(name_type=d.name_type, description=d.description,
                                 recommended_interval=d.recommended_interval))
        return MaintenanceTypeOut(id=t.id, name_type=t.name_type,
                                  description=t.description,
                                  recommended_interval=t.recommended_interval)
    def update(self, i, d):
        t = self.repo.get(i)
        if not t: return None
        t.name_type = d.name_type; t.description = d.description
        t.recommended_interval = d.recommended_interval
        self.repo.update(t)
        return MaintenanceTypeOut(id=t.id, name_type=t.name_type,
                                  description=t.description,
                                  recommended_interval=t.recommended_interval)
    def delete(self, i): self.repo.delete(i)

class MaintenanceService:
    def __init__(self, repo: MaintenanceRepo): self.repo = repo
    def list(self): return [self._o(m) for m in self.repo.list()]
    def create(self, d: MaintenanceCreate):
        m = Maintenance(kart_id=d.kart_id, id_type_to=d.type_to_id,
                        id_master=d.master_id, date=d.date,
                        description=d.description, is_completed=False)
        self.repo.add(m)
        return self._o(self.repo.get(m.id_to))
    def update(self, i, d: MaintenanceCreate):
        m = self.repo.get(i)
        if not m: return None
        m.kart_id = d.kart_id; m.id_type_to = d.type_to_id
        m.id_master = d.master_id; m.date = d.date; m.description = d.description
        self.repo.update(m)
        return self._o(m)
    def delete(self, i): self.repo.delete(i)
    def _o(self, m):
        return MaintenanceOut(id=m.id_to, kart_id=m.kart_id,
                              type_to_id=m.id_type_to, master_id=m.id_master,
                              date=m.date, description=m.description,
                              is_completed=m.is_completed,
                              type_to_name=m.type_to.name_type if m.type_to else "—",
                              master_name=m.master.full_name if m.master else "—")


class UsingPartService:
    def __init__(self, repo: UsingPartRepo):
        self.repo = repo

    def list(self):
        return [UsingPartOut(
            id=u.id,
            parts_id=u.parts_id,
            to_id=u.to_id,
            quantity=u.quantity,
            part_name=u.part.name_parts if u.part else "—")
            for u in self.repo.list()]

    def create(self, d: UsingPartCreate):
        db = self.repo.db
        part = db.get(Part, d.parts_id)
        if not part:
            raise ValueError("Запчасть не найдена")
        if part.quantity < d.quantity:
            raise ValueError(f"На складе недостаточно запчастей (остаток: {part.quantity})")

        part.quantity -= d.quantity
        db.commit()

        u = self.repo.add(UsingPart(parts_id=d.parts_id, to_id=d.to_id, quantity=d.quantity))

        u = self.repo.get(u.id)
        return UsingPartOut(id=u.id, parts_id=u.parts_id, to_id=u.to_id,
                            quantity=u.quantity,
                            part_name=u.part.name_parts if u.part else "—")

    def delete(self, i):
        db = self.repo.db
        u = self.repo.get(i)
        if u:
            part = db.get(Part, u.parts_id)
            if part:
                part.quantity += u.quantity
                db.commit()

            self.repo.delete(i)