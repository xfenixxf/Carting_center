function openModal(cfg) {
    let overlay = document.getElementById('universalModal');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'universalModal';
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <h2 id="modalTitle"></h2>
                <form id="modalForm"></form>
                <div class="modal-error" id="modalError"></div>
                <div class="modal-actions">
                    <button type="button" id="modalCancel">Отмена</button>
                    <button type="submit" form="modalForm" id="modalSave">Сохранить</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal();
        });
        document.getElementById('modalCancel').onclick = closeModal;
    }

    document.getElementById('modalTitle').textContent = cfg.title;
    const form = document.getElementById('modalForm');
    form.innerHTML = cfg.fields.map(f => {
        const val = cfg.initial?.[f.name] ?? '';
        if (f.type === 'select') {
            const opts = f.options.map(o =>
                `<option value="${o.value}" ${o.value == val ? 'selected' : ''}>${o.label}</option>`
            ).join('');
            return `<label>${f.label}${f.required ? ' *' : ''}</label>
                    <select name="${f.name}" ${f.required ? 'required' : ''}>${opts}</select>`;
        }
        if (f.type === 'textarea') {
            return `<label>${f.label}</label>
                    <textarea name="${f.name}" rows="3">${val}</textarea>`;
        }
        return `<label>${f.label}${f.required ? ' *' : ''}</label>
                <input type="${f.type || 'text'}" name="${f.name}" value="${val}" ${f.required ? 'required' : ''}>`;
    }).join('');

    document.getElementById('modalError').textContent = '';
    form.onsubmit = async (e) => {
        e.preventDefault();
        const values = Object.fromEntries(new FormData(form).entries());
        try {
            const result = await cfg.onSubmit(values);
            if (result === true) closeModal();
            else document.getElementById('modalError').textContent = result || 'Ошибка';
        } catch (err) {
            document.getElementById('modalError').textContent = err.message;
        }
    };

    overlay.classList.add('open');
}

function closeModal() {
    document.getElementById('universalModal')?.classList.remove('open');
}