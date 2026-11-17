from pydantic import BaseModel, Field

class KartBase(BaseModel):
    serial_number: str = Field(min_length=1, max_length=50)
    kart_type_id: int
    price: float = Field(gt=0)
    is_active: bool = True

class KartCreate(KartBase): ...
class KartUpdate(KartBase): ...
class KartOut(KartBase):
    id: int

class KartTypeBase(BaseModel):
    name: str
    price_per_race: float

class KartTypeCreate(KartTypeBase): ...
class KartTypeUpdate(KartTypeBase): ...
class KartTypeOut(KartTypeBase):
    id: int