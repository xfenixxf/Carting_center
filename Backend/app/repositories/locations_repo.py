from app.models import Location
from .base import BaseRepo

class LocationRepo(BaseRepo[Location]): model = Location