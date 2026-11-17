document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if (!user) return;

    const menuContainer = document.getElementById('homeMenu');
    if (!menuContainer) return;

    const pages = ROLE_PERMISSIONS[user.role].pages;

    const descr = {
        'clients.html':           '— список клиентов картинг-центра',
        'rides.html':             '— расписание и учёт заездов',
        'karts.html':             '— парк картов и их состояние',
        'teams.html':             '— команды участников',
        'locations.html':         '— трассы и площадки центра',
        'participants.html':      '— записи участников на заезды',
        'parts.html':             '— склад запчастей и расходников',
        'maintenance.html':       '— журнал ТО картов',
        'maintenanceTypes.html':  '— справочник видов обслуживания',
        'staff.html':             '— персонал центра',
        'cartTypes.html':         '— типы картов',
        'using_parts.html':       '— используемые запчасти'
    };

    menuContainer.innerHTML = Object.entries(pages)
        .filter(([file]) => file !== 'mainadmin.html')
        .map(([file, title]) => `
            <li>
                <a href="${file}">${title}</a> ${descr[file] || ''}
            </li>
        `)
        .join('');
});