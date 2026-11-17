let partsCache = [];
let selectedPartId = null;

async function loadParts() {
    partsCache = await api.get('/parts');
    renderParts(partsCache);
}

function renderParts(list) {
    const tbody = document.getElementById('partsBody');
    tbody.innerHTML = list.map(p => `
        <tr data-id="${p.id_parts}" class="${selectedPartId === p.id_parts ? 'selected' : ''}">
            <td>${p.id_parts}</td>
            <td>${p.name_parts}</td>
            <td>${p.description || '—'}</td>
            <td>${p.quantity}</td>
            <td>${p.price.toLocaleString('ru-RU')} ₽</td>
        </tr>`).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
        tr.onclick = () => {
            selectedPartId = Number(tr.dataset.id);
            renderParts(partsCache);
        };
    });
}

const PART_FIELDS = [
    { name: 'name_parts', label: 'Название', required: true },
    { name: 'description', label: 'Описание', type: 'textarea' },
    { name: 'quantity', label: 'Количество', type: 'number', required: true },
    { name: 'price', label: 'Цена, ₽', type: 'number', required: true }
];

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(['mechanic', 'admin'])) return;
    loadParts();

    document.getElementById('searchInput').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        renderParts(partsCache.filter(p =>
            p.name_parts.toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q)));
    };

    document.getElementById('addBtn').onclick = () => openModal({
        title: 'Новая запчасть',
        fields: PART_FIELDS,
        onSubmit: async (v) => {
            await api.post('/parts', {
                name_parts: v.name_parts,
                description: v.description || null,
                quantity: +v.quantity, price: +v.price
            });
            await loadParts();
            return true;
        }
    });

    document.getElementById('editBtn').onclick = () => {
        const p = partsCache.find(x => x.id_parts === selectedPartId);
        if (!p) return alert('Выберите запчасть');
        openModal({
            title: `Изменить "${p.name_parts}"`,
            initial: { name_parts: p.name_parts, description: p.description,
                       quantity: p.quantity, price: p.price },
            fields: PART_FIELDS,
            onSubmit: async (v) => {
                await api.put(`/parts/${p.id_parts}`, {
                    name_parts: v.name_parts,
                    description: v.description || null,
                    quantity: +v.quantity, price: +v.price
                });
                await loadParts();
                return true;
            }
        });
    };

    document.getElementById('deleteBtn').onclick = async () => {
        if (!selectedPartId) return alert('Выберите запчасть');
        if (!confirm('Удалить?')) return;
        await api.delete(`/parts/${selectedPartId}`);
        selectedPartId = null;
        await loadParts();
    };
});