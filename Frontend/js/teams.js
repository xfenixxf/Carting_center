let teamsCache = [];
let selectedTeamId = null;

async function loadTeams() {
    teamsCache = await api.get('/teams');
    renderTeams(teamsCache);
}

function renderTeams(list) {
    const tbody = document.getElementById('teamsBody');
    tbody.innerHTML = list.map(t => `
        <tr data-id="${t.id}" class="${selectedTeamId === t.id ? 'selected' : ''}">
            <td>${t.id}</td>
            <td>${t.name}</td>
            <td><span class="badge ${t.is_active ? 'badge-green' : 'badge-gray'}">
                ${t.is_active ? 'Да' : 'Нет'}
            </span></td>
        </tr>`).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
        tr.onclick = () => {
            selectedTeamId = Number(tr.dataset.id);
            renderTeams(teamsCache);
        };
    });
}

const TEAM_FIELDS = [
    { name: 'name', label: 'Название', required: true },
    { name: 'is_active', label: 'Активна', type: 'select',
      options: [{ value: 'true', label: 'Да' }, { value: 'false', label: 'Нет' }] }
];

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(['manager', 'admin'])) return;
    loadTeams();

    document.getElementById('searchInput').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        renderTeams(teamsCache.filter(t => t.name.toLowerCase().includes(q)));
    };

    document.getElementById('addBtn').onclick = () => openModal({
        title: 'Новая команда',
        fields: TEAM_FIELDS,
        onSubmit: async (v) => {
            await api.post('/teams', {
                name: v.name, is_active: v.is_active === 'true'
            });
            await loadTeams();
            return true;
        }
    });

    document.getElementById('editBtn').onclick = () => {
        const t = teamsCache.find(x => x.id === selectedTeamId);
        if (!t) return alert('Выберите команду');
        openModal({
            title: `Изменить "${t.name}"`,
            initial: { name: t.name, is_active: t.is_active ? 'true' : 'false' },
            fields: TEAM_FIELDS,
            onSubmit: async (v) => {
                await api.put(`/teams/${t.id}`, {
                    name: v.name, is_active: v.is_active === 'true'
                });
                await loadTeams();
                return true;
            }
        });
    };

    document.getElementById('deleteBtn').onclick = async () => {
        if (!selectedTeamId) return alert('Выберите команду');
        if (!confirm('Удалить команду?')) return;

        try {
            await api.delete(`/teams/${selectedTeamId}`);
            selectedTeamId = null;
            await loadTeams();
        } catch (err) {
            alert('Ошибка удаления: ' + err.message);
        }
    };
});