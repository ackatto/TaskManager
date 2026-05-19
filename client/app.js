async function loadTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
   
    document.getElementById('active-tasks').innerHTML = '';
    document.getElementById('completed-tasks').innerHTML = '';
    
    tasks.forEach(task => {
        let buttons = '';

        if (task.isCompleted) {            
            buttons = `
                <button onclick="openEditModal(${task.id})">Редактировать</button>
                <button onclick="deleteTask(${task.id})">Удалить</button>
                <button onclick="markIncomplete(${task.id})">Вернуть</button>
            `;
        } else {      
            buttons = `
                <button onclick="openEditModal(${task.id})">Редактировать</button>
                <button onclick="deleteTask(${task.id})">Удалить</button>
                <button onclick="markCompleted(${task.id})">Выполнено</button>
            `;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${task.title}</strong> - ${task.description || ''} 
            (до ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'})
            ${buttons}
        `;
        
        if (task.isCompleted) {
            document.getElementById('completed-tasks').appendChild(li);
        } else {
            document.getElementById('active-tasks').appendChild(li);
        }
    });
}

async function markCompleted(id) {
    const response = await fetch(`/api/tasks/${id}`);
    const task = await response.json();
    task.isCompleted = true;

    await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });

    loadTasks();
}

async function markIncomplete(id) {
    const response = await fetch(`/api/tasks/${id}`);
    const task = await response.json();
    task.isCompleted = false;

    await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });

    loadTasks();
}

async function deleteTask(id) {
    if (!confirm('Удалить задачу?')) return;

    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
}

document.getElementById('create-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    const newTask = {
        title: form.title.value,
        description: form.description.value,
        dueDate: form.dueDate.value || null,
        isCompleted: false
    };

    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    });

    form.reset();
    loadTasks();
});

async function openEditModal(id) {
    const response = await fetch(`/api/tasks/${id}`);
    const task = await response.json();

    document.getElementById('edit-id').value = task.id;
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-description').value = task.description || '';
    document.getElementById('edit-dueDate').value = task.dueDate ? task.dueDate.split('T')[0] : '';
    document.getElementById('edit-isCompleted').checked = task.isCompleted;

    document.getElementById('edit-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedTask = {
        id: parseInt(document.getElementById('edit-id').value),
        title: document.getElementById('edit-title').value,
        description: document.getElementById('edit-description').value,
        dueDate: document.getElementById('edit-dueDate').value || null,
        isCompleted: document.getElementById('edit-isCompleted').checked
    };

    await fetch(`/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
    });

    closeModal();
    loadTasks();
});

loadTasks();