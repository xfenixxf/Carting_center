let ridesCache = [];
let teamsCache = [];
let kartsCache = [];
let participantsCache = [];

async function loadMyRides() {
    const list = await api.get('/me/rides');
    document.getElementById('myRides').innerHTML = list.length
        ? `<table>
            <thead><tr>
            <th>Заезд</th>
            <th>Карт</th>
            <th>Команда</th>
            <th>Дата</th>
            <th>Статус</th>
            </tr>
            </thead>
            <tbody>${list.map(r => `
                <tr><td>#${r.ride_id}</td>
                <td>K-${String(r.kart_id).padStart(3, '0')}</td>
                <td>#${r.team_id ?? '—'}</td><td>${r.participant_date}</td>
                <td>${r.status}</td></tr>`).join('')}
            </tbody></table>`
        : '<p>Пока нет записей.</p>';
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['user'])) return;

    try {
        ridesCache = await api.get('/rides?status=open').catch(() => []);
        teamsCache = await api.get('/teams').catch(() => []);
        kartsCache = await api.get('/karts').catch(() => []);
        participantsCache = await api.get('/participants').catch(() => []);
    } catch { console.log('Ошибка загрузки'); }

    await loadMyRides();

    document.getElementById('bookBtn').onclick = () => {
        if (ridesCache.length === 0) return alert('Нет доступных заездов!');

        const rideOptions = ridesCache.map(r => ({
            value: r.id,
            label: `Заезд #${r.id} (Дата: ${r.ride_date}, Время: ${r.start_time.slice(0,5)})`
        }));

        const teamOptions = teamsCache.filter(t => t.is_active).map(t => ({
            value: t.id, label: t.name
        }));

        openModal({
            title: 'Записаться на заезд',
            fields: [
                { name: 'ride_id', label: 'Выберите заезд', type: 'select', options: rideOptions, required: true },
                { name: 'team_id', label: 'Выберите команду', type: 'select', options: teamOptions, required: true },
                { name: 'kart_id', label: 'Выберите карт', type: 'select', options: [], required: true }
            ],
            onSubmit: async (v) => {
                await api.post('/me/participants', {
                    ride_id: +v.ride_id, team_id: +v.team_id, kart_id: +v.kart_id
                });
                await loadMyRides();
                participantsCache = await api.get('/participants').catch(() => []);
                return true;
            }
        });

        const rideSelect = document.querySelector('select[name="ride_id"]');
        const kartSelect = document.querySelector('select[name="kart_id"]');

        function updateAvailableKarts() {
            const selectedRideId = +rideSelect.value;
            const selectedRide = ridesCache.find(r => r.id === selectedRideId);
            if (!selectedRide) return;

            const busyKartIds = participantsCache
                .filter(p => {
                    const pRide = ridesCache.find(r => r.id === p.ride_id) || { start_time: '99:99', end_time: '99:99', ride_date: '' };
                    return pRide.ride_date === selectedRide.ride_date &&
                           pRide.start_time < selectedRide.end_time &&
                           pRide.end_time > selectedRide.start_time;
                })
                .map(p => p.kart_id);

            const availableKarts = kartsCache.filter(k => k.is_active && !busyKartIds.includes(k.id));

            if (availableKarts.length === 0) {
                kartSelect.innerHTML = '<option value="">Нет свободных картов на это время</option>';
            } else {
                kartSelect.innerHTML = availableKarts.map(k =>
                    `<option value="${k.id}">Карт ${k.serial_number} (${k.price} ₽)</option>`
                ).join('');
            }
        }

        rideSelect.addEventListener('change', updateAvailableKarts);
        updateAvailableKarts();
    };
});