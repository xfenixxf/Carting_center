from datetime import date
from pydantic import BaseModel, Field

class PartBase(BaseModel):
    name_parts: str
    description: str | None = None
    quantity: int = Field(ge=0)
    price: float = Field(ge=0)

class PartCreate(PartBase): ...
class PartUpdate(PartBase): ...
class PartOut(PartBase):
    id_parts: int

class MaintenanceTypeBase(BaseModel):
    name_type: str
    description: str | None = None
    recommended_interval: float | None = None

class MaintenanceTypeCreate(MaintenanceTypeBase): ...
class MaintenanceTypeUpdate(MaintenanceTypeBase): ...
class MaintenanceTypeOut(MaintenanceTypeBase):
    id: int

class MaintenanceCreate(BaseModel):
    kart_id: int
    type_to_id: int
    master_id: int
    date: date
    description: str | None = None

class MaintenanceOut(MaintenanceCreate):
    id: int
    type_to_name: str
    master_name: str
    is_completed: bool

class UsingPartCreate(BaseModel):
    parts_id: int
    to_id: int
    quantity: int = Field(gt=0)

class UsingPartOut(BaseModel):
    id: int
    parts_id: int
    to_id: int
    quantity: int
    part_name: str

class StaffOut(BaseModel):
    id: int
    full_name: str
    account_id: int
    email: str
    role: str