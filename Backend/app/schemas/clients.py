from datetime import datetime
from pydantic import BaseModel
from pydantic import BaseModel, EmailStr, Field

class ClientOut(BaseModel):
    id: int
    full_name: str
    email: str = ""
    created_at: datetime | None = None

class StaffCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str = Field(min_length=6)
    role: str

class StaffUpdate(BaseModel):
    full_name: str
    email: EmailStr
    role: str
    password: str | None = None