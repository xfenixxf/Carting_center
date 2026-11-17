from fastapi import APIRouter, Depends
from app.services import LocationService
from app.repositories import LocationRepo
from app.schemas import LocationOut, LocationCreate, LocationUpdate
from app.routers.deps import require_roles
from app.routers.crud_builder import build_crud

router = APIRouter(prefix="/api/locations", tags=["locations"], dependencies=[Depends(require_roles("admin"))])
build_crud(router, LocationService, LocationRepo, LocationOut, LocationCreate, LocationUpdate)