const API_BASE = 'http://localhost:8000/api';

function authHeaders() {
    const token = localStorage.getItem('karting_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, url, body) {
    const res = await fetch(API_BASE + url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: body ? JSON.stringify(body) : undefined
    });
    if (res.status === 401) {
        localStorage.removeItem('karting_user');
        localStorage.removeItem('karting_token');
        window.location.href = 'login.html';
        throw new Error('Unauthorized');
    }
    if (!res.ok) {
        let msg = res.statusText;
        try { msg = (await res.json()).detail || msg; } catch {}
        throw new Error(msg);
    }
    return res.status === 204 ? null : res.json();
}

const api = {
    get:    url       => request('GET', url),
    post:   (url, b)  => request('POST', url, b),
    put:    (url, b)  => request('PUT', url, b),
    delete: url       => request('DELETE', url)
};