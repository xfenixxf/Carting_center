let ridesCache = [];
let selectedRideId = null;
let locationsCache = [];

async function loadRides() {
    ridesCache = await api.get('/rides');
    renderRides(ridesCache);
}

function renderRides(list) {
    const tbody = document.getElementById('ridesBody');
    tbody.innerHTML = list.map(r => `
        <tr data-id="${r.id}" class="${selectedRideId === r.id ? 'selected' : ''}">
            <td>${r.id}</td>
            <td>${r.ride_date}</td>
            <td>${r.start_time.slice(0,5)}–${r.end_time.slice(0,5)}</td>
            <td>Локация #${r.location_id}</td>
            <td>${r.duration_minutes} мин.</td>
            <td>${r.max_participants}</td>
            <td><span class="badge badge-gray">${r.status}</span></td>
            <td>${r.amount_paid.toLocaleString('ru-RU')} ₽</td>
        </tr>`).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
        tr.onclick = () => {
            selectedRideId = Number(tr.dataset.id);
            renderRides(ridesCache);
        };
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['manager', 'admin'])) return;

    loadRides();
    locationsCache = await api.get('/locations').catch(() => []);

    const dateFilter = document.getElementById('dateFilter');
    const clearBtn = document.getElementById('clearDateFilter');

    dateFilter.onchange = () => {
        if (!dateFilter.value) return renderRides(ridesCache);
        renderRides(ridesCache.filter(r => r.ride_date === dateFilter.value));
    };
    clearBtn.onclick = () => {
        dateFilter.value = '';
        renderRides(ridesCache);
    };

    const RIDE_FIELDS = [
        { name: 'location_id', label: 'Локация', type: 'select',
          options: locationsCache.map(l => ({ value: l.id, label: l.name })), required: true },
        { name: 'ride_date', label: 'Дата', type: 'date', required: true },
        { name: 'start_time', label: 'Время начала', type: 'time', required: true },
        { name: 'end_time', label: 'Время окончания', type: 'time', required: true },
        { name: 'max_participants', label: 'Макс. участников', type: 'number' },
        { name: 'status', label: 'Статус', type: 'select',
          options: [{value:'open',label:'Открыт'},{value:'closed',label:'Закрыт'},{value:'cancelled',label:'Отменён'}] }
    ];

    document.getElementById('addBtn').onclick = () => openModal({
        title: 'Новый заезд',
        fields: RIDE_FIELDS,
        onSubmit: async (v) => {
            try {
                await api.post('/rides', {
                    location_id: +v.location_id,
                    ride_date: v.ride_date,
                    start_time: v.start_time,
                    end_time: v.end_time,
                    duration_minutes: v.duration_minutes ? +v.duration_minutes : 10,
                    max_participants: v.max_participants ? +v.max_participants : 10,
                    status: v.status || 'open',
                    amount_paid: 0 // Сумма теперь считается автоматически на бэкенде
                });
                await loadRides();
                return true;
            } catch (err) {
                return err.message;
            }
        }
    });

    document.getElementById('editBtn').onclick = () => {
        const r = ridesCache.find(x => x.id === selectedRideId);
        if (!r) return alert('Выберите заезд');
        openModal({
            title: `Изменить заезд #${r.id}`,
            initial: { location_id: r.location_id, ride_date: r.ride_date,
                       start_time: r.start_time, end_time: r.end_time,
                       duration_minutes: r.duration_minutes, max_participants: r.max_participants,
                       status: r.status },
            fields: RIDE_FIELDS,
            onSubmit: async (v) => {
                try {
                    await api.put(`/rides/${r.id}`, {
                        location_id: +v.location_id,
                        ride_date: v.ride_date,
                        start_time: v.start_time,
                        end_time: v.end_time,
                        duration_minutes: v.duration_minutes ? +v.duration_minutes : 10,
                        max_participants: v.max_participants ? +v.max_participants : 10,
                        status: v.status || 'open',
                        amount_paid: r.amount_paid
                    });
                    await loadRides();
                    return true;
                } catch (err) {
                    return err.message;
                }
            }
        });
    };

    document.getElementById('deleteBtn').onclick = async () => {
        if (!selectedRideId) return alert('Выберите заезд');
        if (!confirm('Удалить?')) return;
        try {
            await api.delete(`/rides/${selectedRideId}`);
            selectedRideId = null;
            await loadRides();
        } catch (err) {
            alert('Ошибка удаления: ' + err.message);
        }
    };
});