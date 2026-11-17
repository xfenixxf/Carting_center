from .auth import LoginIn, UserInfo, LoginOut, RegisterIn, RegisterOut
from .karts import KartBase, KartCreate, KartUpdate, KartOut, KartTypeBase, KartTypeCreate, KartTypeUpdate, KartTypeOut
from .clients import ClientOut, StaffCreate, StaffUpdate
from .locations import LocationBase, LocationCreate, LocationUpdate, LocationOut
from .rides import RideBase, RideCreate, RideUpdate, RideOut, TeamBase, TeamCreate, TeamUpdate, TeamOut
from .participants import ParticipantCreate, ParticipantOut
from .maintenance import (
    PartBase, PartCreate, PartUpdate, PartOut,
    MaintenanceTypeBase, MaintenanceTypeCreate, MaintenanceTypeUpdate, MaintenanceTypeOut,
    MaintenanceCreate, MaintenanceOut,
    UsingPartCreate, UsingPartOut,
    StaffOut,
)

__all__ = [
    # Auth
    "LoginIn", "UserInfo", "LoginOut", "RegisterIn", "RegisterOut",
    # Karts
    "KartBase", "KartCreate", "KartUpdate", "KartOut",
    "KartTypeBase", "KartTypeCreate", "KartTypeUpdate", "KartTypeOut",
    # Clients
    "ClientOut","StaffCreate", "StaffUpdate",
    # Locations
    "LocationBase", "LocationCreate", "LocationUpdate", "LocationOut",
    # Rides & Teams
    "RideBase", "RideCreate", "RideUpdate", "RideOut",
    "TeamBase", "TeamCreate", "TeamUpdate", "TeamOut",
    # Participants
    "ParticipantCreate", "ParticipantOut",
    # Maintenance & Parts
    "PartBase", "PartCreate", "PartUpdate", "PartOut",
    "MaintenanceTypeBase", "MaintenanceTypeCreate", "MaintenanceTypeUpdate", "MaintenanceTypeOut",
    "MaintenanceCreate", "MaintenanceOut",
    "UsingPartCreate", "UsingPartOut",
    # Staff
    "StaffOut",
]
