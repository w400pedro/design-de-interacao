document.getElementById('add-task').addEventListener('click', function() {
    const tarefa = document.getElementById('new-task').value;
    const responsavel = document.getElementById('responsavel-task').value;

    if (tarefa && responsavel) {
        AdicionarTarefa('project', tarefa, responsavel);
        document.getElementById('new-task').value = '';
        document.getElementById('responsavel-task').value = '';
    }
});

function AdicionarTarefa(columnId, tarefa, responsavel) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('kanban-task');
    taskDiv.innerHTML = `
        <span><strong>Atividade:</strong> ${tarefa}</span><br>
        <span><strong>Responsável:</strong> ${responsavel}</span>
        <div class="task-buttons">
            ${columnId !== 'project' ? '<button onclick="moverTarefa(this, \'volta\')">Voltar</button>' : ''}
            <button onclick="moverTarefa(this, 'avanca')">Avançar</button>
        </div>
    `;
    document.getElementById(`${columnId}-tasks`).appendChild(taskDiv);
    atualizaTarefaButtons(taskDiv, columnId);
}

function moverTarefa(button, direction) {
    const task = button.parentElement.parentElement;
    const currentColumn = task.parentElement.id.split('-')[0];

    let newColumn;
    if (direction === 'avanca') {
        if (currentColumn === 'project') newColumn = 'implementation';
        else if (currentColumn === 'implementation') newColumn = 'test';
    } else if (direction === 'volta') {
        if (currentColumn === 'test') newColumn = 'implementation';
        else if (currentColumn === 'implementation') newColumn = 'project';
    }

    if (newColumn) {
        document.getElementById(`${newColumn}-tasks`).appendChild(task);
        atualizaTarefaButtons(task, newColumn);
    }
}

function atualizaTarefaButtons(task, columnId) {
    const buttonsDiv = task.querySelector('.task-buttons');
    buttonsDiv.innerHTML = `
        ${columnId !== 'project' ? '<button onclick="moverTarefa(this, \'volta\')">Voltar</button>' : ''}
        ${columnId !== 'test' ? '<button onclick="moverTarefa(this, \'avanca\')">Avançar</button>' : ''}
        ${columnId === 'test' ? '<button onclick="deletaTarefa(this)">Finalizar</button>' : ''}
    `;
}

function deletaTarefa(button) {
    const task = button.parentElement.parentElement;
    task.remove();
}
