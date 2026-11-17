let locationsCache = [];
let selectedLocationId = null;

async function loadLocations() {
    locationsCache = await api.get('/locations');
    renderLocations(locationsCache);
}

function renderLocations(list) {
    const tbody = document.getElementById('locationsBody');
    tbody.innerHTML = list.map(l => `
        <tr data-id="${l.id}" class="${selectedLocationId === l.id ? 'selected' : ''}">
            <td>${l.id}</td>
            <td>${l.name}</td>
            <td>${l.address || '—'}</td>
            <td>${l.distance ?? '—'} м</td>
        </tr>`).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
        tr.onclick = () => {
            selectedLocationId = Number(tr.dataset.id);
            renderLocations(locationsCache);
        };
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(['admin'])) return;
    loadLocations();

    document.getElementById('searchInput').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        renderLocations(locationsCache.filter(l =>
            l.name.toLowerCase().includes(q) || (l.address || '').toLowerCase().includes(q)));
    };

    document.getElementById('addBtn').onclick = () => openModal({
        title: 'Новая локация',
        fields: [
            { name: 'name', label: 'Название', required: true },
            { name: 'address', label: 'Адрес' },
            { name: 'distance', label: 'Длина, м', type: 'number' }
        ],
        onSubmit: async (v) => {
            await api.post('/locations', {
                name: v.name,
                address: v.address || null,
                distance: v.distance ? +v.distance : null
            });
            await loadLocations();
            return true;
        }
    });

    document.getElementById('editBtn').onclick = () => {
        const l = locationsCache.find(x => x.id === selectedLocationId);
        if (!l) return alert('Выберите локацию');
        openModal({
            title: `Изменить "${l.name}"`,
            initial: { name: l.name, address: l.address, distance: l.distance },
            fields: [
                { name: 'name', label: 'Название', required: true },
                { name: 'address', label: 'Адрес' },
                { name: 'distance', label: 'Длина, м', type: 'number' }
            ],
            onSubmit: async (v) => {
                await api.put(`/locations/${l.id}`, {
                    name: v.name,
                    address: v.address || null,
                    distance: v.distance ? +v.distance : null
                });
                await loadLocations();
                return true;
            }
        });
    };

    document.getElementById('deleteBtn').onclick = async () => {
        if (!selectedLocationId) return alert('Выберите локацию');
        if (!confirm('Удалить локацию?')) return;

        try {
            await api.delete(`/locations/${selectedLocationId}`);
            selectedLocationId = null;
            await loadLocations();
        } catch (err) {
            alert('Ошибка удаления: ' + err.message);
        }
    };
});