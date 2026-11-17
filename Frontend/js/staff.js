let staffCache = [];
let selectedStaffId = null;

async function loadStaff() {
    staffCache = await api.get('/staff');
    renderStaff(staffCache);
}

function renderStaff(list) {
    const tbody = document.getElementById('staffBody');
    tbody.innerHTML = list.map(s => `
        <tr data-id="${s.id}" class="${selectedStaffId === s.id ? 'selected' : ''}">
            <td>${s.id}</td>
            <td>${s.full_name}</td>
            <td>${s.email}</td>
            <td><span class="badge badge-green">${s.role}</span></td>
        </tr>`).join('');

    tbody.querySelectorAll('tr[data-id]').forEach(tr => {
        tr.onclick = () => {
            selectedStaffId = Number(tr.dataset.id);
            renderStaff(staffCache);
        };
    });
}

const STAFF_FIELDS = [
    { name: 'full_name', label: 'ФИО', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Пароль', type: 'password' },
    { name: 'role', label: 'Роль', type: 'select',
      options: [
          {value:'admin', label:'Владелец'},
          {value:'manager', label:'Администратор'},
          {value:'mechanic', label:'Механик'}
      ], required: true }
];

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(['admin'])) return;
    loadStaff();

    document.getElementById('searchInput').oninput = (e) => {
        const q = e.target.value.toLowerCase();
        renderStaff(staffCache.filter(s =>
            s.full_name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.role.toLowerCase().includes(q)));
    };

    document.getElementById('addBtn').onclick = () => openModal({
        title: 'Новый сотрудник',
        fields: STAFF_FIELDS,
        onSubmit: async (v) => {
            try {
                if (!v.password) return "Введите пароль для нового сотрудника";
                await api.post('/staff', {
                    full_name: v.full_name,
                    email: v.email,
                    password: v.password,
                    role: v.role
                });
                await loadStaff();
                return true;
            } catch (err) {
                return err.message;
            }
        }
    });

    document.getElementById('editBtn').onclick = () => {
        const s = staffCache.find(x => x.id === selectedStaffId);
        if (!s) return alert('Выберите сотрудника');
        openModal({
            title: `Изменить "${s.full_name}"`,
            initial: { full_name: s.full_name, email: s.email, role: s.role },
            fields: STAFF_FIELDS,
            onSubmit: async (v) => {
                try {
                    await api.put(`/staff/${s.id}`, {
                        full_name: v.full_name,
                        email: v.email,
                        role: v.role,
                        password: v.password || null
                    });
                    await loadStaff();
                    return true;
                } catch (err) {
                    return err.message;
                }
            }
        });
    };

    document.getElementById('deleteBtn').onclick = async () => {
        if (!selectedStaffId) return alert('Выберите сотрудника');
        if (!confirm('Удалить сотрудника?')) return;

        try {
            await api.delete(`/staff/${selectedStaffId}`);
            selectedStaffId = null;
            await loadStaff();
        } catch (err) {
            alert('Ошибка удаления: ' + err.message);
        }
    };
});