let maintenanceCache = [];
let selectedMaintenanceId = null;
let kartsCache = [];
let mastersCache = [];
let typesCache = [];

async function loadMaintenance() {
    maintenanceCache = await api.get('/maintenance');
    renderMaintenance(maintenanceCache);
}

async function loadDictionaries() {
    try {
        kartsCache = await api.get('/karts');
        mastersCache = await api.get('/staff').catch(() => []);
        typesCache = await api.get('/maintenance-types');
    } catch (e) {
        console.log("Ошибка загрузки справочников", e);
    }
}

function renderMaintenance(list) {
    const tbody = document.getElementById('maintenanceBody');
    tbody.innerHTML = list.map(m => `
        <tr data-id="${m.id}" class="${selectedMaintenanceId === m.id ? 'selected' : ''}">
            <td>${m.id}</td>
            <td>K-${String(m.kart_id).padStart(3, '0')}</td>
            <td>${m.type_to_name}</td>
            <td>${m.master_name}</td>
            <td>${m.date}</td>
            <td><span class="badge ${m.is_completed ? 'badge-green' : 'badge-gray'}">
                ${m.is_completed ? 'Завершено' : 'В работе'}
            </span></td>
            <td>${m.description || '—'}</td>
        </tr>`).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
        tr.onclick = () => {
            selectedMaintenanceId = Number(tr.dataset.id);
            renderMaintenance(maintenanceCache);
        };
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['mechanic', 'admin'])) return;
    await loadDictionaries();
    loadMaintenance();

    document.getElementById('searchInput').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        renderMaintenance(maintenanceCache.filter(m =>
            m.type_to_name.toLowerCase().includes(q) ||
            m.master_name.toLowerCase().includes(q) ||
            String(m.kart_id).includes(q)));
    };

    const MAINT_FIELDS = [
        { name: 'kart_id', label: 'Карт', type: 'select',
          options: kartsCache.map(k => ({ value: k.id, label: `Карт ${k.serial_number}` })), required: true },
        { name: 'type_to_id', label: 'Тип ТО', type: 'select',
          options: typesCache.map(t => ({ value: t.id, label: t.name_type })), required: true },
        { name: 'master_id', label: 'Мастер', type: 'select',
          options: mastersCache.map(s => ({ value: s.id, label: s.full_name })), required: true },
        { name: 'date', label: 'Дата', type: 'date', required: true },
        { name: 'description', label: 'Описание', type: 'textarea' }
    ];

    document.getElementById('addBtn').onclick = () => openModal({
        title: 'Новая запись ТО',
        fields: MAINT_FIELDS,
        onSubmit: async (v) => {
            try {
                await api.post('/maintenance', {
                    kart_id: +v.kart_id, type_to_id: +v.type_to_id,
                    master_id: +v.master_id, date: v.date,
                    description: v.description || null
                });
                await loadMaintenance();
                return true;
            } catch (err) {
                return err.message;
            }
        }
    });

    document.getElementById('editBtn').onclick = () => {
        const m = maintenanceCache.find(x => x.id === selectedMaintenanceId);
        if (!m) return alert('Выберите запись');
        openModal({
            title: `Изменить запись #${m.id}`,
            initial: { kart_id: m.kart_id, type_to_id: m.type_to_id,
                       master_id: m.master_id, date: m.date,
                       description: m.description },
            fields: MAINT_FIELDS,
            onSubmit: async (v) => {
                try {
                    await api.put(`/maintenance/${m.id}`, {
                        kart_id: +v.kart_id, type_to_id: +v.type_to_id,
                        master_id: +v.master_id, date: v.date,
                        description: v.description || null
                    });
                    await loadMaintenance();
                    return true;
                } catch (err) {
                    return err.message;
                }
            }
        });
    };

    document.getElementById('deleteBtn').onclick = async () => {
        if (!selectedMaintenanceId) return alert('Выберите запись');
        if (!confirm('Удалить запись?')) return;
        try {
            await api.delete(`/maintenance/${selectedMaintenanceId}`);
            selectedMaintenanceId = null;
            await loadMaintenance();
        } catch (err) {
            alert('Ошибка удаления: ' + err.message);
        }
    };
});