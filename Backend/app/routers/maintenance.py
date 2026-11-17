from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import get_db
from app.services import PartService, MaintenanceTypeService, MaintenanceService, UsingPartService
from app.repositories import PartRepo, TypeTORepo, MaintenanceRepo, UsingPartRepo
from app.schemas import *
from app.routers.deps import require_roles

router = APIRouter(prefix="/api", tags=["maintenance"])

# ЗАПЧАСТИ
parts_router = APIRouter(prefix="/parts")
def _part_svc(db: Session = Depends(get_db)): return PartService(PartRepo(db))

@parts_router.get("", response_model=list[PartOut], dependencies=[Depends(require_roles("mechanic", "admin"))])
def parts_list(s=Depends(_part_svc)): return s.list()

@parts_router.post("", response_model=PartOut, status_code=201, dependencies=[Depends(require_roles("mechanic", "admin"))])
def parts_create(data: PartCreate, s=Depends(_part_svc)): return s.create(data)

@parts_router.put("/{id_}", response_model=PartOut, dependencies=[Depends(require_roles("mechanic", "admin"))])
def parts_update(id_: int, data: PartUpdate, s=Depends(_part_svc)):
    r = s.update(id_, data)
    if not r: raise HTTPException(404, "Not found")
    return r

@parts_router.delete("/{id_}", status_code=204, dependencies=[Depends(require_roles("mechanic", "admin"))])
def parts_delete(id_: int, s=Depends(_part_svc)):
    try:
        s.delete(id_)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
router.include_router(parts_router)

# ТИПЫ ТО
mt_router = APIRouter(prefix="/maintenance-types")
def _mt_svc(db: Session = Depends(get_db)): return MaintenanceTypeService(TypeTORepo(db))

@mt_router.get("", response_model=list[MaintenanceTypeOut], dependencies=[Depends(require_roles("mechanic", "admin"))])
def mt_list(s=Depends(_mt_svc)): return s.list()

@mt_router.post("", response_model=MaintenanceTypeOut, status_code=201, dependencies=[Depends(require_roles("mechanic", "admin"))])
def mt_create(data: MaintenanceTypeCreate, s=Depends(_mt_svc)): return s.create(data)

@mt_router.put("/{id_}", response_model=MaintenanceTypeOut, dependencies=[Depends(require_roles("mechanic", "admin"))])
def mt_update(id_: int, data: MaintenanceTypeUpdate, s=Depends(_mt_svc)):
    r = s.update(id_, data)
    if not r: raise HTTPException(404, "Not found")
    return r

@mt_router.delete("/{id_}", status_code=204, dependencies=[Depends(require_roles("mechanic", "admin"))])
def mt_delete(id_: int, s=Depends(_mt_svc)):
    try:
        s.delete(id_)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
router.include_router(mt_router)

#ТО
maint_router = APIRouter(prefix="/maintenance")
def _maint_svc(db: Session = Depends(get_db)): return MaintenanceService(MaintenanceRepo(db))

@maint_router.get("", response_model=list[MaintenanceOut], dependencies=[Depends(require_roles("mechanic", "admin"))])
def maint_list(s=Depends(_maint_svc)): return s.list()

@maint_router.post("", response_model=MaintenanceOut, status_code=201, dependencies=[Depends(require_roles("mechanic", "admin"))])
def maint_create(data: MaintenanceCreate, s=Depends(_maint_svc)):
    try:
        return s.create(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@maint_router.put("/{id_}", response_model=MaintenanceOut, dependencies=[Depends(require_roles("mechanic", "admin"))])
def maint_update(id_: int, data: MaintenanceCreate, s=Depends(_maint_svc)):
    try:
        r = s.update(id_, data)
        if not r: raise HTTPException(404, "Not found")
        return r
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@maint_router.delete("/{id_}", status_code=204, dependencies=[Depends(require_roles("mechanic", "admin"))])
def maint_delete(id_: int, s=Depends(_maint_svc)):
    try:
        s.delete(id_)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
router.include_router(maint_router)

#ИСПОЛЬЗУЕМЫЕ ЗАПЧАСТИ
up_router = APIRouter(prefix="/using-parts", dependencies=[Depends(require_roles("mechanic", "admin"))])
def _up_svc(db: Session = Depends(get_db)): return UsingPartService(UsingPartRepo(db))

@up_router.get("", response_model=list[UsingPartOut])
def up_list(s=Depends(_up_svc)): return s.list()

@up_router.post("", response_model=UsingPartOut, status_code=201)
def up_create(data: UsingPartCreate, s=Depends(_up_svc)):
    try:
        return s.create(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@up_router.delete("/{id_}", status_code=204)
def up_delete(id_: int, s=Depends(_up_svc)):
    try:
        s.delete(id_)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
router.include_router(up_router)