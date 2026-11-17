from sqlalchemy import select
from app.models import Ride, Team, RideParticipant
from .base import BaseRepo

class RideRepo(BaseRepo[Ride]):
    model = Ride

    def list_by_status(self, status: str):
        return self.db.scalars(
            select(self.model).where(self.model.status == status)
        ).all()
class TeamRepo(BaseRepo[Team]): model = Team
class ParticipantRepo(BaseRepo[RideParticipant]): model = RideParticipant
