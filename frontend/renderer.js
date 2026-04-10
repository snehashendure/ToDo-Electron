const apiBase = window.APP_CONFIG?.apiBase || 'http://localhost:3001';
const taskList = document.getElementById('task-list');
const form = document.getElementById('task-form');
const parentSelect = document.getElementById('parent_id');
const progressSlider = document.getElementById('progress-slider');
const progressInput = document.getElementById('progress-input');
const statusMessage = document.getElementById('status-message');

function setStatus(message, type = 'error') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type === 'success' ? 'success' : ''}`.trim();
}

function progressColor(progress) {
  const hue = Math.round((progress / 100) * 120);
  return `hsl(${hue}, 78%, 47%)`;
}

function dateLabel(task) {
  if (!task.start_date && !task.end_date) return '';
  return `📅 ${task.start_date || '--'} → ${task.end_date || '--'}`;
}

function taskCard(task, isSubtask = false) {
  const card = document.createElement('div');
  card.className = isSubtask ? 'subtask-item' : 'task-card';
  card.innerHTML = taskCardTemplate(task);
  attachCardEvents(card, task);
  return card;
}

function taskCardTemplate(task) {
  const date = dateLabel(task);
  const subtasksHtml =
    task.subtasks && task.subtasks.length
      ? `<details class="subtasks"><summary>Subtasks (${task.subtasks.length})</summary>${task.subtasks
          .map((sub) => `<div class="subtask-item">${taskCardTemplate(sub)}</div>`)
          .join('')}</details>`
      : '';
  return `
    <div class="task-header">
      <h3 class="task-title">${task.title}</h3>
      ${date ? `<span class="date-pill" title="Start and end dates">${date}</span>` : ''}
    </div>
    <p>${task.description || ''}</p>
    <div class="progress-track">
      <div class="progress-fill" style="width:${task.progress}%;background: linear-gradient(90deg, #ef4444 0%, #facc15 50%, #22c55e 100%); filter: saturate(${0.6 + task.progress / 100});"></div>
    </div>
    <small style="color:${progressColor(task.progress)};font-weight:600;">
      ${task.progress}% ${task.completed ? '(Complete)' : '(In progress)'}
    </small>
    <div class="task-actions">
      <button data-action="complete" data-id="${task.id}" class="btn-secondary">Mark Completed</button>
      <button data-action="edit" data-id="${task.id}" class="btn-secondary">Edit</button>
      <button data-action="add-subtask" data-id="${task.id}" class="btn-secondary">Add Subtask</button>
      <button data-action="delete" data-id="${task.id}" class="btn-secondary">Delete</button>
    </div>
    ${subtasksHtml}
  `;
}

function attachCardEvents(card, task) {
  card.querySelectorAll('button[data-action]').forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const action = event.target.getAttribute('data-action');
      if (action === 'complete') {
        try {
          await fetchJsonOrThrow(`${apiBase}/api/tasks/${task.id}/complete`, { method: 'POST' });
          setStatus('Task marked completed.', 'success');
          await refresh();
        } catch (error) {
          setStatus(error.message || 'Could not mark task completed.');
        }
      } else if (action === 'edit') {
        loadToForm(task);
      } else if (action === 'delete') {
        const confirmed = window.confirm(`Delete "${task.title}" and all its subtasks?`);
        if (!confirmed) {
          return;
        }
        try {
          await fetchJsonOrThrow(`${apiBase}/api/tasks/${task.id}`, { method: 'DELETE' });
          setStatus('Task deleted.', 'success');
          await refresh();
        } catch (error) {
          setStatus(error.message || 'Could not delete task.');
        }
      } else if (action === 'add-subtask') {
        form.reset();
        document.getElementById('task-id').value = '';
        parentSelect.value = String(task.id);
      }
    });
  });
}

function flattenTasks(tasks, acc = []) {
  tasks.forEach((task) => {
    acc.push(task);
    if (task.subtasks?.length) {
      flattenTasks(task.subtasks, acc);
    }
  });
  return acc;
}

function loadToForm(task) {
  document.getElementById('task-id').value = task.id;
  document.getElementById('title').value = task.title;
  document.getElementById('description').value = task.description || '';
  parentSelect.value = task.parent_id || '';
  document.getElementById('start_date').value = task.start_date || '';
  document.getElementById('end_date').value = task.end_date || '';
  progressSlider.value = task.progress || 0;
  progressInput.value = task.progress || 0;
}

async function getTasks() {
  const response = await fetch(`${apiBase}/api/tasks`);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: 'Failed to load tasks' }));
    throw new Error(payload.message || 'Failed to load tasks');
  }
  return response.json();
}

async function refresh() {
  try {
    const tasks = await getTasks();
    taskList.innerHTML = '';
    tasks.forEach((task) => taskList.appendChild(taskCard(task)));

    const all = flattenTasks(tasks);
    parentSelect.innerHTML = '<option value="">None</option>';
    all.forEach((task) => {
      const option = document.createElement('option');
      option.value = task.id;
      option.textContent = `#${task.id} ${task.title}`;
      parentSelect.appendChild(option);
    });
    setStatus('');
  } catch (error) {
    setStatus(error.message || 'Unable to load tasks.');
  }
}

async function fetchJsonOrThrow(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(payload.message || 'Request failed');
  }
  return response.status === 204 ? null : response.json();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('task-id').value;
  const payload = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value || null,
    parent_id: parentSelect.value ? Number(parentSelect.value) : null,
    start_date: document.getElementById('start_date').value || null,
    end_date: document.getElementById('end_date').value || null,
    progress: Number(progressInput.value || progressSlider.value || 0)
  };

  try {
    if (id) {
      await fetchJsonOrThrow(`${apiBase}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setStatus('Task updated.', 'success');
    } else if (payload.parent_id) {
      await fetchJsonOrThrow(`${apiBase}/api/tasks/${payload.parent_id}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setStatus('Subtask saved.', 'success');
    } else {
      await fetchJsonOrThrow(`${apiBase}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setStatus('Task saved.', 'success');
    }

    form.reset();
    document.getElementById('task-id').value = '';
    progressSlider.value = 0;
    progressInput.value = 0;
    await refresh();
  } catch (error) {
    setStatus(error.message || 'Could not save task.');
  }
});

document.getElementById('reset-form').addEventListener('click', () => {
  form.reset();
  document.getElementById('task-id').value = '';
  progressSlider.value = 0;
  progressInput.value = 0;
});

document.getElementById('reload-btn').addEventListener('click', refresh);

progressSlider.addEventListener('input', () => {
  progressInput.value = progressSlider.value;
});
progressInput.addEventListener('input', () => {
  const value = Math.min(100, Math.max(0, Number(progressInput.value || 0)));
  progressSlider.value = value;
});

refresh();
