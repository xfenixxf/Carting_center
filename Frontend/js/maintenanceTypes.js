let mtCache = [];
let selectedMtId = null;

async function loadMt() {
    mtCache = await api.get('/maintenance-types');
    renderMt(mtCache);
}

function renderMt(list) {
    const tbody = document.getElementById('maintenanceTypesBody');
    tbody.innerHTML = list.map(t => `
        <tr data-id="${t.id}" class="${selectedMtId === t.id ? 'selected' : ''}">
            <td>${t.id}</td>
            <td>${t.name_type}</td>
            <td>${t.description || '—'}</td>
            <td>${t.recommended_interval ?? '—'}</td>
        </tr>`).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
        tr.onclick = () => {
            selectedMtId = Number(tr.dataset.id);
            renderMt(mtCache);
        };
    });
}

const MT_FIELDS = [
    { name: 'name_type', label: 'Название', required: true },
    { name: 'description', label: 'Описание', type: 'textarea' },
    { name: 'recommended_interval', label: 'Интервал (дни)', type: 'number' }
];

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(['mechanic', 'admin'])) return;
    loadMt();

    document.getElementById('searchInput').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        renderMt(mtCache.filter(t =>
            t.name_type.toLowerCase().includes(q) ||
            (t.description || '').toLowerCase().includes(q)));
    };

    document.getElementById('addBtn').onclick = () => openModal({
        title: 'Новый тип ТО',
        fields: MT_FIELDS,
        onSubmit: async (v) => {
            try {
                await api.post('/maintenance-types', {
                    name_type: v.name_type,
                    description: v.description || null,
                    recommended_interval: v.recommended_interval ? +v.recommended_interval : null
                });
                await loadMt();
                return true;
            } catch (err) {
                return err.message;
            }
        }
    });

    document.getElementById('editBtn').onclick = () => {
        const t = mtCache.find(x => x.id === selectedMtId);
        if (!t) return alert('Выберите тип');
        openModal({
            title: `Изменить "${t.name_type}"`,
            initial: { name_type: t.name_type, description: t.description,
                       recommended_interval: t.recommended_interval },
            fields: MT_FIELDS,
            onSubmit: async (v) => {
                try {
                    await api.put(`/maintenance-types/${t.id}`, {
                        name_type: v.name_type,
                        description: v.description || null,
                        recommended_interval: v.recommended_interval ? +v.recommended_interval : null
                    });
                    await loadMt();
                    return true;
                } catch (err) {
                    return err.message;
                }
            }
        });
    };

    document.getElementById('deleteBtn').onclick = async () => {
        if (!selectedMtId) return alert('Выберите тип');
        if (!confirm('Удалить?')) return;
        try {
            await api.delete(`/maintenance-types/${selectedMtId}`);
            selectedMtId = null;
            await loadMt();
        } catch (err) {
            alert('Ошибка удаления: ' + err.message);
        }
    };
});