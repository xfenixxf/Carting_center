from pydantic import BaseModel

class LocationBase(BaseModel):
    name: str
    address: str | None = None
    distance: float | None = None

class LocationCreate(LocationBase): ...
class LocationUpdate(LocationBase): ...
class LocationOut(LocationBase):
    id: int