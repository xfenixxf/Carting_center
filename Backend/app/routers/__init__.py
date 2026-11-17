from .auth import router as auth_router
from .clients import router as clients_router
from .locations import router as locations_router
from .rides import router as rides_router
from .maintenance import router as maintenance_router
from .user import router as me_router
from .karts import router as karts_router

ALL_ROUTERS = [
    auth_router,
    karts_router,
    clients_router,
    locations_router,
    rides_router,
    maintenance_router,
    me_router
]