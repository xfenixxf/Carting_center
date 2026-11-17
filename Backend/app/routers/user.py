from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import get_db
from app.services import ParticipantService
from app.repositories import ParticipantRepo
from app.schemas import ParticipantOut, ParticipantCreate
from app.routers.deps import require_roles

router = APIRouter(prefix="/api/me", tags=["me"])

def _me_svc(db: Session = Depends(get_db)): return ParticipantService(ParticipantRepo(db))

@router.get("/rides", response_model=list[ParticipantOut])
def my_rides(user: dict = Depends(require_roles("user")), s=Depends(_me_svc)):
    uid = int(user["sub"])
    return [p for p in s.list() if p.user_id == uid]

@router.post("/participants", response_model=ParticipantOut, status_code=201)
def book_self(data: ParticipantCreate,
              user: dict = Depends(require_roles("user")),
              s=Depends(_me_svc)):
    try:
        return s.create(int(user["sub"]), data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))