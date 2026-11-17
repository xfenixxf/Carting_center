let clientsCache = [];

async function loadClients() {
    clientsCache = await api.get('/clients');
    renderClients(clientsCache);
}

function renderClients(list) {
    const tbody = document.getElementById('clientsBody');
    tbody.innerHTML = list.map(c => {
        let dateStr = '—';
        if (c.created_at) {
            const d = new Date(c.created_at);
            dateStr = d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
        }

        return `
        <tr>
            <td>${c.id}</td>
            <td>${c.full_name}</td>
            <td>${c.email || '—'}</td>
            <td>${dateStr}</td>
        </tr>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(['admin'])) return;
    loadClients();

    document.getElementById('searchInput').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        renderClients(clientsCache.filter(c =>
            c.full_name.toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q)));
    };
});