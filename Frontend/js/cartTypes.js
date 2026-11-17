let typesCache = [];
let selectedTypeId = null;

async function loadTypes() {
    typesCache = await api.get('/cart-types');
    renderTypes(typesCache);
}

function renderTypes(list) {
    const tbody = document.getElementById('cartTypesBody');
    tbody.innerHTML = list.map(t => `
        <tr data-id="${t.id}" class="${selectedTypeId === t.id ? 'selected' : ''}">
            <td>${t.id}</td>
            <td>${t.name}</td>
            <td>${t.price_per_race.toLocaleString('ru-RU')} ₽</td>
        </tr>`).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
        tr.onclick = () => {
            selectedTypeId = Number(tr.dataset.id);
            renderTypes(typesCache);
        };
    });
}

const TYPE_FIELDS = [
    { name: 'name', label: 'Название (например, Взрослый 9 л.с.)', required: true },
    { name: 'price_per_race', label: 'Цена за заезд, ₽', type: 'number', required: true }
];

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(['mechanic', 'admin'])) return;
    loadTypes();

    document.getElementById('searchInput').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        renderTypes(typesCache.filter(t => t.name.toLowerCase().includes(q)));
    };

    document.getElementById('addBtn').onclick = () => openModal({
        title: 'Новый тип карта',
        fields: TYPE_FIELDS,
        onSubmit: async (v) => {
            try {
                await api.post('/cart-types', {
                    name: v.name,
                    price_per_race: +v.price_per_race
                });
                await loadTypes();
                return true;
            } catch (err) {
                return err.message;
            }
        }
    });

    document.getElementById('editBtn').onclick = () => {
        const t = typesCache.find(x => x.id === selectedTypeId);
        if (!t) return alert('Выберите тип');
        openModal({
            title: `Изменить "${t.name}"`,
            initial: { name: t.name, price_per_race: t.price_per_race },
            fields: TYPE_FIELDS,
            onSubmit: async (v) => {
                try {
                    await api.put(`/cart-types/${t.id}`, {
                        name: v.name,
                        price_per_race: +v.price_per_race
                    });
                    await loadTypes();
                    return true;
                } catch (err) {
                    return err.message;
                }
            }
        });
    };

    document.getElementById('deleteBtn').onclick = async () => {
        if (!selectedTypeId) return alert('Выберите тип');
        if (!confirm('Удалить тип карта?')) return;

        try {
            await api.delete(`/cart-types/${selectedTypeId}`);
            selectedTypeId = null;
            await loadTypes();
        } catch (err) {
            alert('Ошибка удаления: ' + err.message);
        }
    };
});