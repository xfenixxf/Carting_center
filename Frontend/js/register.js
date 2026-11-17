document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('regForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let errorDiv = document.getElementById('errorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'error-message';
            form.appendChild(errorDiv);
        }
        errorDiv.textContent = '';
        errorDiv.classList.remove('show');

        const body = {
            full_name: document.getElementById('full_name').value,
            email:     document.getElementById('email').value,
            password:  document.getElementById('password').value
        };

        try {
            await api.post('/auth/register', body);
            alert('Готово! Теперь вы можете войти под своей учётной записью.');
            window.location.href = 'login.html';
        } catch (err) {
            errorDiv.textContent = err.message || 'Ошибка регистрации';
            errorDiv.classList.add('show');
        }
    });
});