from app.models import Location
from app.schemas import LocationCreate, LocationUpdate, LocationOut
from app.repositories import LocationRepo

class LocationService:
    def __init__(self, repo: LocationRepo): self.repo = repo
    def list(self):
        return [LocationOut(id=l.id, name=l.name, address=l.address, distance=l.distance)
                for l in self.repo.list()]
    def create(self, d):
        l = self.repo.add(Location(name=d.name, address=d.address, distance=d.distance))
        return LocationOut(id=l.id, name=l.name, address=l.address, distance=l.distance)
    def update(self, i, d):
        l = self.repo.get(i)
        if not l: return None
        l.name = d.name; l.address = d.address; l.distance = d.distance
        self.repo.update(l)
        return LocationOut(id=l.id, name=l.name, address=l.address, distance=l.distance)
    def delete(self, i): self.repo.delete(i)