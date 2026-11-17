document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = '';
        errorDiv.classList.remove('show');

        const body = {
            email:    document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            // api уже подключен глобально через api.js
            const data = await api.post('/auth/login', body);

            localStorage.setItem('karting_user', JSON.stringify(data.user));
            localStorage.setItem('karting_token', data.token);

            const redirect = {
                admin:    'mainadmin.html',
                manager:  'rides.html',
                mechanic: 'maintenance.html',
                user:     'user_cabinet.html'
            };
            // Если роль неизвестна, кидаем на главную
            window.location.href = redirect[data.user.role] || 'mainadmin.html';

        } catch (err) {
            let text = 'Неверный email или пароль';
            if (typeof err.message === 'string' && !err.message.includes('[object Object]')) {
                text = err.message;
            }
            errorDiv.textContent = text;
            errorDiv.classList.add('show');
        }
    });
});