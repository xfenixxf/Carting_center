let participantsCache = [];
let selectedParticipantId = null;

async function loadParticipants() {
    participantsCache = await api.get('/participants');
    renderParticipants(participantsCache);
}

function renderParticipants(list) {
    const tbody = document.getElementById('participantsBody');
    tbody.innerHTML = list.map(p => `
        <tr data-id="${p.id}" class="${selectedParticipantId === p.id ? 'selected' : ''}">
            <td>${p.id}</td>
            <td>#${p.user_id}</td>
            <td>#${p.team_id ?? '—'}</td>
            <td>#${p.ride_id}</td>
            <td>K-${String(p.kart_id).padStart(3, '0')}</td>
            <td>${p.participant_date}</td>
            <td><span class="badge badge-gray">${p.status}</span></td>
        </tr>`).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
        tr.onclick = () => {
            selectedParticipantId = Number(tr.dataset.id);
            renderParticipants(participantsCache);
        };
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(['manager', 'admin'])) return;
    loadParticipants();

    document.getElementById('searchInput').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        renderParticipants(participantsCache.filter(p =>
            String(p.user_id).includes(q) || String(p.ride_id).includes(q) ||
            String(p.kart_id).includes(q) || String(p.team_id).includes(q)));
    };

    document.getElementById('addBtn').onclick = () => openModal({
        title: 'Записать участника',
        fields: [
            { name: 'client_id', label: 'Клиент (ID)', type: 'number', required: true },
            { name: 'ride_id',   label: 'Заезд (ID)',  type: 'number', required: true },
            { name: 'team_id',   label: 'Команда (ID)',type: 'number', required: true },
            { name: 'kart_id',   label: 'Карт (ID)',   type: 'number', required: true }
        ],
        onSubmit: async (v) => {
            await api.post('/participants', {
                client_id: +v.client_id, ride_id: +v.ride_id,
                team_id: +v.team_id, kart_id: +v.kart_id
            });
            await loadParticipants();
            return true;
        }
    });

    document.getElementById('deleteBtn').onclick = async () => {
        if (!selectedParticipantId) return alert('Выберите запись');
        if (!confirm('Удалить запись?')) return;
        try {
        await api.delete(`/participants/${selectedParticipantId}`);
        selectedParticipantId = null;
        await loadParticipants();
        } catch (err) {
        alert('Ошибка удаления: ' + err.message);
        }
    };
});