from datetime import datetime, date
from sqlalchemy import select
from app.models import Ride, Team
from app.schemas import RideCreate, RideUpdate, RideOut, TeamCreate, TeamUpdate, TeamOut
from app.repositories import RideRepo, TeamRepo

class RideService:
    def __init__(self, repo: RideRepo):
        self.repo = repo

    @staticmethod
    def _calc_duration(start_time, end_time) -> int:
        t1 = datetime.combine(date.today(), start_time)
        t2 = datetime.combine(date.today(), end_time)
        diff = t2 - t1
        return int(diff.total_seconds() // 60)

    def list(self, status: str | None = None):
        #Автоматическое закрытие заездов по времени
        now = datetime.now()
        all_rides = self.repo.list()

        for r in all_rides:
            if r.status == "open":
                ride_start_datetime = datetime.combine(r.ride_date, r.start_time)
                if ride_start_datetime <= now:
                    r.status = "closed"
                    self.repo.db.commit()

        if status:
            return [self._o(r) for r in self.repo.list_by_status(status)]
        return [self._o(r) for r in self.repo.list()]

    # Одна локация — один заезд в одно время
    def _check_location_overlap(self, location_id, ride_date, start_time, end_time, exclude_id=None):
        query = select(Ride).where(
            Ride.location_id == location_id,
            Ride.ride_date == ride_date,
            Ride.status != "cancelled",
            Ride.start_time < end_time,
            Ride.end_time > start_time
        )
        if exclude_id:
            query = query.where(Ride.id != exclude_id)

        existing = self.repo.db.scalars(query).first()
        if existing:
            raise ValueError(f"На этой локации уже есть заезд #{existing.id} в это время!")

    def create(self, d: RideCreate):
        # Нельзя создавать заезд в прошлом
        if datetime.combine(d.ride_date, d.start_time) < datetime.now():
            raise ValueError("Нельзя создать заезд в прошлом!")

        # Проверка на пересечение локаций
        self._check_location_overlap(d.location_id, d.ride_date, d.start_time, d.end_time)

        # Вычисление длительности и проверка времени
        calc_duration = self._calc_duration(d.start_time, d.end_time)
        if calc_duration <= 0:
            raise ValueError("Время окончания должно быть позже времени начала!")

        r = self.repo.add(Ride(
            location_id=d.location_id, ride_date=d.ride_date,
            start_time=d.start_time, end_time=d.end_time,
            duration_minutes=calc_duration,
            max_participants=d.max_participants,
            status=d.status, amount_paid=d.amount_paid, ride_data=d.ride_data))
        return self._o(r)

    def update(self, i, d: RideUpdate):
        r = self.repo.get(i)
        if not r: return None

        self._check_location_overlap(d.location_id, d.ride_date, d.start_time, d.end_time, exclude_id=i)

        calc_duration = self._calc_duration(d.start_time, d.end_time)
        if calc_duration <= 0:
            raise ValueError("Время окончания должно быть позже времени начала!")

        r.location_id = d.location_id
        r.ride_date = d.ride_date
        r.start_time = d.start_time
        r.end_time = d.end_time
        r.duration_minutes = calc_duration
        r.max_participants = d.max_participants
        r.status = d.status
        r.amount_paid = d.amount_paid
        r.ride_data = d.ride_data
        return self._o(self.repo.update(r))

    def delete(self, i):
        self.repo.delete(i)

    @staticmethod
    def _o(r):
        return RideOut(
            id=r.id, location_id=r.location_id, ride_date=r.ride_date,
            start_time=r.start_time, end_time=r.end_time,
            duration_minutes=r.duration_minutes, max_participants=r.max_participants,
            status=r.status, amount_paid=float(r.amount_paid or 0),
            ride_data=r.ride_data)

class TeamService:
    def __init__(self, repo: TeamRepo):
        self.repo = repo
    def list(self):
        return [TeamOut(id=t.id, name=t.name, is_active=t.is_active) for t in self.repo.list()]
    def create(self, d):
        t = self.repo.add(Team(name=d.name, is_active=d.is_active))
        return TeamOut(id=t.id, name=t.name, is_active=t.is_active)
    def update(self, i, d):
        t = self.repo.get(i)
        if not t: return None
        t.name = d.name; t.is_active = d.is_active
        self.repo.update(t)
        return TeamOut(id=t.id, name=t.name, is_active=t.is_active)
    def delete(self, i):
        self.repo.delete(i)