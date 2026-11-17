from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import get_db
from app.services import KartService, KartTypeService
from app.repositories import KartRepo, KartTypeRepo
from app.schemas import KartOut, KartCreate, KartUpdate, KartTypeOut, KartTypeCreate, KartTypeUpdate
from app.routers.deps import require_roles
from app.routers.crud_builder import build_crud

router = APIRouter(prefix="/api", tags=["karts"])

karts_router = APIRouter(prefix="/karts")
def _kart_svc(db: Session = Depends(get_db)): return KartService(KartRepo(db))

@karts_router.get("", response_model=list[KartOut], dependencies=[Depends(require_roles("user", "mechanic", "admin"))])
def karts_list(s=Depends(_kart_svc)): return s.list()

@karts_router.post("", response_model=KartOut, status_code=201, dependencies=[Depends(require_roles("mechanic", "admin"))])
def karts_create(data: KartCreate, s=Depends(_kart_svc)): return s.create(data)

@karts_router.put("/{id_}", response_model=KartOut, dependencies=[Depends(require_roles("mechanic", "admin"))])
def karts_update(id_: int, data: KartUpdate, s=Depends(_kart_svc)):
    r = s.update(id_, data)
    if not r: raise Exception("Not found")
    return r

@karts_router.delete("/{id_}", status_code=204, dependencies=[Depends(require_roles("mechanic", "admin"))])
def karts_delete(id_: int, s=Depends(_kart_svc)):
    try:
        s.delete(id_)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
router.include_router(karts_router)

cart_types_router = APIRouter(prefix="/cart-types")

def _kart_type_svc(db: Session = Depends(get_db)):
    return KartTypeService(KartTypeRepo(db))

@cart_types_router.get("", response_model=list[KartTypeOut], dependencies=[Depends(require_roles("mechanic", "admin"))])
def cart_types_list(s=Depends(_kart_type_svc)):
    return s.list()

@cart_types_router.post("", response_model=KartTypeOut, status_code=201, dependencies=[Depends(require_roles("mechanic", "admin"))])
def cart_types_create(data: KartTypeCreate, s=Depends(_kart_type_svc)):
    return s.create(data)

@cart_types_router.put("/{id_}", response_model=KartTypeOut, dependencies=[Depends(require_roles("mechanic", "admin"))])
def cart_types_update(id_: int, data: KartTypeUpdate, s=Depends(_kart_type_svc)):
    r = s.update(id_, data)
    if not r: raise HTTPException(404, "Not found")
    return r

@cart_types_router.delete("/{id_}", status_code=204, dependencies=[Depends(require_roles("mechanic", "admin"))])
def cart_types_delete(id_: int, s=Depends(_kart_type_svc)):
    try:
        s.delete(id_)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

router.include_router(cart_types_router)