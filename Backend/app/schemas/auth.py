from pydantic import BaseModel, Field, EmailStr

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserInfo(BaseModel):
    id: int
    full_name: str
    email: str
    role: str

class LoginOut(BaseModel):
    token: str
    user: UserInfo

class RegisterIn(BaseModel):
    full_name: str = Field(min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(min_length=6)

class RegisterOut(BaseModel):
    id: int
    full_name: str
    email: str
    role: str