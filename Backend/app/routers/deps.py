from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core import decode_token

bearer = HTTPBearer(auto_error=False)

def current_user(creds: HTTPAuthorizationCredentials | None = Depends(bearer)) -> dict:
    if not creds: raise HTTPException(401, "No token")
    p = decode_token(creds.credentials)
    if not p: raise HTTPException(401, "Invalid token")
    return p

def require_roles(*roles: str):
    def checker(user: dict = Depends(current_user)) -> dict:
        if user.get("role") not in roles: raise HTTPException(403, "Forbidden")
        return user
    return checker