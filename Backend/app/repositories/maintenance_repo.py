from app.models import Part, TypeTO, Maintenance, UsingPart
from .base import BaseRepo

class PartRepo(BaseRepo[Part]): model = Part
class TypeTORepo(BaseRepo[TypeTO]): model = TypeTO
class MaintenanceRepo(BaseRepo[Maintenance]): model = Maintenance
class UsingPartRepo(BaseRepo[UsingPart]): model = UsingPart