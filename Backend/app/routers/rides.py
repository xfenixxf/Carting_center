from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import get_db
from app.services import RideService, TeamService, ParticipantService
from app.repositories import RideRepo, TeamRepo, ParticipantRepo
from app.schemas import RideOut, RideCreate, RideUpdate, TeamOut, TeamCreate, TeamUpdate, ParticipantCreate, ParticipantOut
from app.routers.deps import require_roles

router = APIRouter(prefix="/api", tags=["rides"])

# ЗАЕЗДЫ
rides_router = APIRouter(prefix="/rides")
def _ride_svc(db: Session = Depends(get_db)): return RideService(RideRepo(db))

@rides_router.get("", response_model=list[RideOut], dependencies=[Depends(require_roles("user", "manager", "admin"))])
def ride_list(status: str | None = None, s=Depends(_ride_svc)):
    return s.list(status)

@rides_router.post("", response_model=RideOut, status_code=201, dependencies=[Depends(require_roles("manager", "admin"))])
def ride_create(data: RideCreate, s=Depends(_ride_svc)):
    try:
        return s.create(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@rides_router.put("/{id_}", response_model=RideOut, dependencies=[Depends(require_roles("manager", "admin"))])
def ride_update(id_: int, data: RideUpdate, s=Depends(_ride_svc)):
    r = s.update(id_, data)
    if not r: raise HTTPException(404, "Not found")
    return r

@rides_router.delete("/{id_}", status_code=204, dependencies=[Depends(require_roles("manager", "admin"))])
def ride_delete(id_: int, s=Depends(_ride_svc)):
    try:
        s.delete(id_)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
router.include_router(rides_router)

#  КОМАНДЫ
teams_router = APIRouter(prefix="/teams")
def _team_svc(db: Session = Depends(get_db)): return TeamService(TeamRepo(db))

@teams_router.get("", response_model=list[TeamOut], dependencies=[Depends(require_roles("user", "manager", "admin"))])
def team_list(s=Depends(_team_svc)): return s.list()

@teams_router.post("", response_model=TeamOut, status_code=201, dependencies=[Depends(require_roles("manager", "admin"))])
def team_create(data: TeamCreate, s=Depends(_team_svc)): return s.create(data)

@teams_router.put("/{id_}", response_model=TeamOut, dependencies=[Depends(require_roles("manager", "admin"))])
def team_update(id_: int, data: TeamUpdate, s=Depends(_team_svc)):
    r = s.update(id_, data)
    if not r: raise HTTPException(404, "Not found")
    return r

@teams_router.delete("/{id_}", status_code=204, dependencies=[Depends(require_roles("manager", "admin"))])
def team_delete(id_: int, s=Depends(_team_svc)):
    try:
        s.delete(id_)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
router.include_router(teams_router)

#  УЧАСТНИКИ
part_router = APIRouter(prefix="/participants")
def _part_svc(db: Session = Depends(get_db)): return ParticipantService(ParticipantRepo(db))

@part_router.get("", response_model=list[ParticipantOut], dependencies=[Depends(require_roles("user", "manager", "admin"))])
def part_list(s=Depends(_part_svc)): return s.list()

@part_router.post("", response_model=ParticipantOut, status_code=201, dependencies=[Depends(require_roles("manager", "admin"))])
def part_create(data: ParticipantCreate, s=Depends(_part_svc)):
    if not data.client_id:
        raise HTTPException(400, "client_id required")
    try:
        return s.create(data.client_id, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@part_router.delete("/{id_}", status_code=204, dependencies=[Depends(require_roles("manager", "admin"))])
def part_delete(id_: int, s=Depends(_part_svc)):
    try:
        s.delete(id_)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
router.include_router(part_router)