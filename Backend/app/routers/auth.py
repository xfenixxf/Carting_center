from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import get_db
from app.schemas import LoginIn, LoginOut, RegisterIn, RegisterOut
from app.services import AuthService

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=LoginOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    r = AuthService(db).login(data.email, data.password)
    if not r: raise HTTPException(401, "Invalid credentials")
    return r

@router.post("/register", response_model=RegisterOut, status_code=201)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    try:
        return AuthService(db).register(data)
    except ValueError as e:
        raise HTTPException(400, str(e))