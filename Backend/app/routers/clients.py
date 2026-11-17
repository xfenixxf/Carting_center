from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import get_db
from app.services import ClientService, StaffService
from app.repositories import UserRepo
from app.schemas import ClientOut, StaffOut, StaffCreate, StaffUpdate
from app.routers.deps import require_roles
from app.routers.crud_builder import build_crud

router = APIRouter(prefix="/api", tags=["clients"])

@router.get("/clients", response_model=list[ClientOut], dependencies=[Depends(require_roles("manager", "admin"))])
def clients_list(db: Session = Depends(get_db)):
    return ClientService(UserRepo(db)).list()

@router.get("/staff", response_model=list[StaffOut], dependencies=[Depends(require_roles("admin"))])
def staff_list(db: Session = Depends(get_db)):
    return StaffService(db).list()

@router.post("/staff", response_model=StaffOut, status_code=201, dependencies=[Depends(require_roles("admin"))])
def staff_create(data: StaffCreate, db: Session = Depends(get_db)):
    try:
        return StaffService(db).create(data)
    except ValueError as e:
        raise HTTPException(400, str(e))

@router.put("/staff/{id_}", response_model=StaffOut, dependencies=[Depends(require_roles("admin"))])
def staff_update(id_: int, data: StaffUpdate, db: Session = Depends(get_db)):
    try:
        res = StaffService(db).update(id_, data)
        if not res: raise HTTPException(404, "Сотрудник не найден")
        return res
    except ValueError as e:
        raise HTTPException(400, str(e))

@router.delete("/staff/{id_}", status_code=204, dependencies=[Depends(require_roles("mechanic", "admin"))])
def staff_delete(id_: int, db: Session = Depends(get_db)):
    try:
        StaffService(db).delete(id_)
    except ValueError as e:
        raise HTTPException(400, str(e))