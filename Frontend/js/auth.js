const ROLE_PERMISSIONS = {
    admin: {
        label: 'Владелец',
        pages: {
            'mainadmin.html':   'Главная',
            'clients.html':     'Клиенты',
            'locations.html':   'Локации',
            'rides.html':       'Заезды',
            'staff.html':       'Сотрудники',
            'teams.html':       'Команды',
            'participants.html':'Участие',
            'karts.html':       'Карты',
            'cartTypes.html':  'Типы картов',
            'maintenance.html': 'ТО',
            'maintenanceTypes.html': 'Типы ТО',
            'parts.html':       'Запчасти'
        }
    },
    manager: {
        label: 'Администратор',
        pages: {
            'mainadmin.html':   'Главная',
            'rides.html':       'Заезды',
            'participants.html':'Участие в заездах',
            'teams.html':       'Команды'
        }
    },
    mechanic: {
        label: 'Механик',
        pages: {
            'mainadmin.html':   'Главная',
            'maintenance.html': 'Журнал ТО',
            'maintenanceTypes.html': 'Типы ТО',
            'karts.html':       'Карты',
            'cartTypes.html':  'Типы картов',
            'parts.html':       'Запчасти',
            'using_parts.html': 'Используемые запчасти'
        }
    },
    user: {
    label: 'Пользователь',
        pages: {
            'user_cabinet.html': 'Личный кабинет',
            'user_rides.html':   'Записаться на заезд',
            'user_view_rides.html': 'Расписание заездов',
            'user_view_karts.html': 'Наш парк картов',
            'user_view_teams.html': 'Команды'
        }
}
};

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('karting_user') || 'null');
    } catch { return null; }
}

function requireAuth(allowedRoles) {
    const user = getCurrentUser();
    if (!user) { window.location.href = 'login.html'; return null; }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        window.location.href = '403.html';
        return null;
    }
    return user;
}

function buildNav() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    const user = getCurrentUser();
    if (!user) return;

    const perms = ROLE_PERMISSIONS[user.role];
    if (!perms) return;

    const links = Object.entries(perms.pages)
        .map(([file, title]) => `<a href="${file}">${title}</a>`)
        .join(' | ');

    nav.innerHTML = `${links} | <span>${user.full_name} (${perms.label})</span>
                     <button id="logoutBtn">Выйти</button>`;
    document.getElementById('logoutBtn').onclick = () => {
        localStorage.removeItem('karting_user');
        localStorage.removeItem('karting_token');
        window.location.href = 'login.html';
    };
}

document.addEventListener('DOMContentLoaded', buildNav);