document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['user'])) return;

    try {
        const karts = await api.get('/karts');
        const grid = document.getElementById('kartsGrid');

        const activeKarts = karts.filter(k => k.is_active);

        if (activeKarts.length === 0) {
            grid.innerHTML = '<p>Свободных картов сейчас нет.</p>';
            return;
        }

        grid.innerHTML = activeKarts.map(k => `
            <div>
                <b>Карт ${k.serial_number}</b>
                <p>Тип (ID): ${k.kart_type_id}</p>
                <p>Стоимость заезда: ${k.price} ₽</p>
                <span class="badge badge-green">Готов к заезду</span>
            </div>
        `).join('');
    } catch (e) {
        document.getElementById('kartsGrid').textContent = 'Ошибка загрузки картов.';
    }
});