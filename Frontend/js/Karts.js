let kartsCache = [];
let selectedKartId = null;

async function loadKarts() {
    kartsCache = await api.get('/karts');
    renderKarts(kartsCache);
}

function renderKarts(list) {
    const grid = document.getElementById('kartsGrid');
    grid.innerHTML = list.map(k => `
        <div data-id="${k.id}" class="${selectedKartId === k.id ? 'selected' : ''}">
            <b>${k.serial_number}</b>
            Тип #${k.kart_type_id}<br>
            ${k.price.toLocaleString('ru-RU')} ₽<br>
            <span class="badge ${k.is_active ? 'badge-green' : 'badge-red'}">
                ${k.is_active ? 'активен' : 'в ремонте'}
            </span>
        </div>`).join('');

    grid.querySelectorAll('div[data-id]').forEach(el => {
        el.style.cursor = 'pointer';
        el.onclick = () => {
            selectedKartId = Number(el.dataset.id);
            renderKarts(kartsCache);
        };
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(['mechanic', 'admin'])) return;
    loadKarts();

    document.getElementById('searchInput').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        renderKarts(kartsCache.filter(k => k.serial_number.toLowerCase().includes(q)));
    };

    document.getElementById('addBtn').onclick = () => openModal({
        title: 'Новый карт',
        fields: [
            { name: 'serial_number', label: 'Серийный номер', required: true },
            { name: 'kart_type_id', label: 'Тип (ID)', type: 'number', required: true },
            { name: 'price', label: 'Цена, ₽', type: 'number', required: true },
            { name: 'is_active', label: 'Активен', type: 'select',
              options: [{ value: 'true', label: 'Да' }, { value: 'false', label: 'Нет' }] }
        ],
        onSubmit: async (v) => {
            await api.post('/karts', {
                serial_number: v.serial_number,
                kart_type_id: +v.kart_type_id,
                price: +v.price,
                is_active: v.is_active === 'true'
            });
            await loadKarts();
            return true;
        }
    });

    document.getElementById('editBtn').onclick = () => {
        const k = kartsCache.find(x => x.id === selectedKartId);
        if (!k) return alert('Выберите карт');
        openModal({
            title: `Изменить карт ${k.serial_number}`,
            initial: { serial_number: k.serial_number, kart_type_id: k.kart_type_id,
                       price: k.price, is_active: k.is_active ? 'true' : 'false' },
            fields: [
                { name: 'serial_number', label: 'Серийный номер', required: true },
                { name: 'kart_type_id', label: 'Тип (ID)', type: 'number', required: true },
                { name: 'price', label: 'Цена, ₽', type: 'number', required: true },
                { name: 'is_active', label: 'Активен', type: 'select',
                  options: [{ value: 'true', label: 'Да' }, { value: 'false', label: 'Нет' }] }
            ],
            onSubmit: async (v) => {
                await api.put(`/karts/${k.id}`, {
                    serial_number: v.serial_number,
                    kart_type_id: +v.kart_type_id,
                    price: +v.price,
                    is_active: v.is_active === 'true'
                });
                await loadKarts();
                return true;
            }
        });
    };

    document.getElementById('deleteBtn').onclick = async () => {
        if (!selectedKartId) return alert('Выберите карт');
        if (!confirm('Удалить карт?')) return;
        try {
        await api.delete(`/karts/${selectedKartId}`);
        selectedKartId = null;
        await loadKarts();
        } catch (err) {
        alert('Ошибка удаления: ' + err.message);
        }
    };
});