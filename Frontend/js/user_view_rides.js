document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['user'])) return;

    try {
        const openRides = await api.get('/rides?status=open');

        const container = document.getElementById('ridesList');
        if (openRides.length === 0) {
            container.innerHTML = '<p>Сейчас нет запланированных заездов.</p>';
            return;
        }

        container.innerHTML = openRides.map(r => `
            <div class="card" style="margin-bottom: 10px; padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
                <h3 style="margin-top:0;">Заезд #${r.id}</h3>
                <p><b>Дата:</b> ${r.ride_date} | <b>Время:</b> ${r.start_time.slice(0,5)} - ${r.end_time.slice(0,5)}</p>
                <p><b>Длительность:</b> ${r.duration_minutes} мин.</p>
                <p><b>Макс. участников:</b> ${r.max_participants}</p>
                <p><b>Стоимость:</b> ${r.amount_paid} ₽</p>
                <span class="badge badge-green">Открыт для записи</span>
            </div>
        `).join('');
    } catch (e) {
        document.getElementById('ridesList').textContent = 'Ошибка загрузки заездов.';
    }
});