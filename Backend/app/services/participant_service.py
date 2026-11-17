from datetime import date, datetime
from sqlalchemy import select, func
from app.models import RideParticipant, Kart, Ride
from app.schemas import ParticipantCreate, ParticipantOut
from app.repositories import ParticipantRepo


class ParticipantService:
    def __init__(self, repo: ParticipantRepo):
        self.repo = repo

    def list(self):
        return [ParticipantOut(
            id=p.id, user_id=p.user_id, ride_id=p.ride_id,
            team_id=p.team_id, kart_id=p.kart_id,
            participant_date=p.participant_date, status=p.status)
            for p in self.repo.list()]

    def _recalc_ride_amount(self, ride_id: int):  # Сумма заезда
        db = self.repo.db
        total = db.scalar(
            select(func.sum(Kart.price))
            .join(RideParticipant, RideParticipant.kart_id == Kart.id)
            .where(RideParticipant.ride_id == ride_id, RideParticipant.status != "cancelled")
        )
        ride = db.scalar(select(Ride).where(Ride.id == ride_id))
        if ride:
            ride.amount_paid = total or 0
            db.commit()

    def create(self, user_id: int, d: ParticipantCreate):
        db = self.repo.db

        target_ride = db.scalar(select(Ride).where(Ride.id == d.ride_id))
        if not target_ride:
            raise ValueError("Выбранный заезд не существует")


        if target_ride.status != "open":
            raise ValueError("Этот заезд закрыт для записи!")

        if datetime.combine(target_ride.ride_date, target_ride.start_time) <= datetime.now():
            raise ValueError("Этот заезд уже начался или прошел. Запись невозможна!")

        #  Лимит участников
        current_count = db.scalar(
            select(func.count(RideParticipant.id))
            .where(RideParticipant.ride_id == d.ride_id, RideParticipant.status != "cancelled")
        )
        if current_count >= target_ride.max_participants:
            raise ValueError("Заезд полностью укомплектован! Нет свободных мест.")

        # Карт не занят в других заездах в это же время
        overlapping_rides = db.scalars(
            select(Ride).where(
                Ride.ride_date == target_ride.ride_date,
                Ride.status != "cancelled",
                Ride.start_time < target_ride.end_time,
                Ride.end_time > target_ride.start_time
            )
        ).all()

        ride_ids = [r.id for r in overlapping_rides]

        existing_participant = db.scalars(
            select(RideParticipant).where(
                RideParticipant.kart_id == d.kart_id,
                RideParticipant.ride_id.in_(ride_ids),
                RideParticipant.status != "cancelled"
            )
        ).first()

        if existing_participant:
            raise ValueError(f"Карт занят! Он уже используется в заезде #{existing_participant.ride_id}")

        p = self.repo.add(RideParticipant(
            user_id=user_id, team_id=d.team_id, ride_id=d.ride_id,
            kart_id=d.kart_id, participant_date=date.today(), status="booked"))

        self._recalc_ride_amount(d.ride_id)


        #  Автоматическое закрытие при наборе максимума
        new_count = db.scalar(
            select(func.count(RideParticipant.id))
            .where(RideParticipant.ride_id == d.ride_id, RideParticipant.status != "cancelled")
        )
        if new_count >= target_ride.max_participants:
            target_ride.status = "closed"
            db.commit()

        return ParticipantOut(id=p.id, user_id=p.user_id, ride_id=p.ride_id,
                              team_id=p.team_id, kart_id=p.kart_id,
                              participant_date=p.participant_date, status=p.status)

    def delete(self, i):
        p = self.repo.get(i)
        if p:
            ride_id = p.ride_id
            self.repo.delete(i)
            self._recalc_ride_amount(ride_id)