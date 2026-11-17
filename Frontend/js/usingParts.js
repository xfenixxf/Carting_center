let upCache = [];
let selectedUpId = null;
let partsCache = [];
let maintenanceCache = [];

async function loadUsingParts() {
    upCache = await api.get('/using-parts');
    renderUsingParts(upCache);
}

async function loadDictionaries() {
    try {
        partsCache = await api.get('/parts');
        maintenanceCache = await api.get('/maintenance');
    } catch (e) {
        console.log("Ошибка загрузки справочников", e);
    }
}

function renderUsingParts(list) {
    const tbody = document.getElementById('usingPartsBody');
    tbody.innerHTML = list.map(u => `
        <tr data-id="${u.id}" class="${selectedUpId === u.id ? 'selected' : ''}">
            <td>${u.id}</td>
            <td>${u.part_name}</td>
            <td>#${u.to_id}</td>
            <td>${u.quantity} шт.</td>
        </tr>`).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
        tr.onclick = () => {
            selectedUpId = Number(tr.dataset.id);
            renderUsingParts(upCache);
        };
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['mechanic', 'admin'])) return;

    await loadDictionaries();
    loadUsingParts();

    document.getElementById('searchInput').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        renderUsingParts(upCache.filter(u => u.part_name.toLowerCase().includes(q)));
    };

    document.getElementById('addBtn').onclick = () => {
        if (partsCache.length === 0 || maintenanceCache.length === 0) {
            return alert('Нет доступных запчастей или записей ТО!');
        }

        const partOptions = partsCache.map(p => ({ value: p.id_parts, label: `${p.name_parts} (остаток: ${p.quantity})` }));
        const toOptions = maintenanceCache.map(m => ({ value: m.id, label: `ТО #${m.id} (${m.type_to_name})` }));

        openModal({
            title: 'Списать запчасть на ТО',
            fields: [
                { name: 'parts_id', label: 'Запчасть', type: 'select', options: partOptions, required: true },
                { name: 'to_id', label: 'Запись ТО', type: 'select', options: toOptions, required: true },
                { name: 'quantity', label: 'Количество', type: 'number', required: true }
            ],
            onSubmit: async (v) => {
                try {
                    await api.post('/using-parts', {
                        parts_id: +v.parts_id,
                        to_id: +v.to_id,
                        quantity: +v.quantity
                    });
                    await loadUsingParts();
                    await loadDictionaries();
                    return true;
                } catch (err) {
                    return err.message;
                }
            }
        });
    };

    document.getElementById('deleteBtn').onclick = async () => {
        if (!selectedUpId) return alert('Выберите запись');
        if (!confirm('Отменить списание этой запчасти?')) return;

        try {
            await api.delete(`/using-parts/${selectedUpId}`);
            selectedUpId = null;
            await loadUsingParts();
            await loadDictionaries();
        } catch (err) {
            alert('Ошибка удаления: ' + err.message);
        }
    };
});