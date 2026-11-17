document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['user'])) return;

    const user = getCurrentUser();
    document.getElementById('welcome').textContent =
        `Здравствуйте, ${user.full_name}!`;

    try {
        const list = await api.get('/me/rides');
        const container = document.getElementById('myRides');
        if (!list.length) {
            container.innerHTML = '<p>У вас пока нет записей.</p>';
        } else {
            container.innerHTML = `
                <table>
                    <thead><tr>
                        <th>ID</th>
                        <th>Заезд</th>
                        <th>Карт</th>
                        <th>Команда</th>
                        <th>Дата</th>
                        <th>Статус</th>
                    </tr></thead>
                    <tbody>${list.map(r => `
                        <tr>
                            <td>${r.id}</td>
                            <td>#${r.ride_id}</td>
                            <td>K-${String(r.kart_id).padStart(3, '0')}</td>
                            <td>#${r.team_id ?? '—'}</td>
                            <td>${r.participant_date}</td>
                            <td><span class="badge badge-gray">${r.status}</span></td>
                        </tr>`).join('')}
                    </tbody>
                </table>`;
        }
    } catch (e) {
        document.getElementById('myRides').textContent = 'Ошибка: ' + e.message;
    }
});