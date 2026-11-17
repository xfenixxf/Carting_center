document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth(['user'])) return;

    try {
        const teams = await api.get('/teams');
        const tbody = document.getElementById('teamsBody');

        const activeTeams = teams.filter(t => t.is_active);

        tbody.innerHTML = activeTeams.map(t => `
            <tr>
                <td>${t.name}</td>
                <td><span class="badge badge-green">Да</span></td>
            </tr>
        `).join('');
    } catch (e) {
        document.getElementById('teamsBody').textContent = 'Ошибка загрузки команд.';
    }
});