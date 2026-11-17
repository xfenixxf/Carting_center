from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import get_db


def build_crud(router, service_cls, repo_cls, out_model, create_model, update_model, roles: list[str] = None):
    def svc(db: Session = Depends(get_db)): return service_cls(repo_cls(db))

    deps = [Depends(__import__('app.routers.deps', fromlist=['require_roles']).require_roles(*roles))] if roles else []

    @router.get("", response_model=list[out_model], dependencies=deps)
    def _list(s=Depends(svc)): return s.list()

    @router.post("", response_model=out_model, status_code=201, dependencies=deps)
    def _create(data: create_model, s=Depends(svc)): return s.create(data)

    @router.put("/{id_}", response_model=out_model, dependencies=deps)
    def _update(id_: int, data: update_model, s=Depends(svc)):
        r = s.update(id_, data)
        if not r: raise HTTPException(404)
        return r

    @router.delete("/{id_}", status_code=204, dependencies=deps)
    def _delete(id_: int, s=Depends(svc)):
        try:
            s.delete(id_)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))