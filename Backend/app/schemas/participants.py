from datetime import date
from pydantic import BaseModel

class ParticipantCreate(BaseModel):
    ride_id: int
    team_id: int | None = None
    kart_id: int
    client_id: int | None = None

class ParticipantOut(BaseModel):
    id: int
    user_id: int
    ride_id: int
    team_id: int | None
    kart_id: int
    participant_date: date
    status: str