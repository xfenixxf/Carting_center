from datetime import date, time
from pydantic import BaseModel

class RideBase(BaseModel):
    location_id: int
    ride_date: date
    start_time: time
    end_time: time
    max_participants: int = 10
    status: str = "open"
    amount_paid: float = 0
    ride_data: str | None = None

class RideCreate(RideBase): ...
class RideUpdate(RideBase): ...
class RideOut(RideBase):
    id: int
    duration_minutes: int

class TeamBase(BaseModel):
    name: str
    is_active: bool = True

class TeamCreate(TeamBase): ...
class TeamUpdate(TeamBase): ...
class TeamOut(TeamBase):
    id: int
