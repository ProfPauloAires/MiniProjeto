const databaseUrl = 'https://miniprojeto-c778b-default-rtdb.firebaseio.com/';

/** Funções de Requisição API **/

// Função GET: Buscar todos os dados
function apiGet() {
    return fetch(`${databaseUrl}.json`)
        .then(response => response.json());
}

// Função POST: Criar um novo dado
function apiPost(word) {
    return fetch(`${databaseUrl}.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: word })
        })
        .then(response => response.json());
}

// Função PUT: Atualizar um dado existente
function apiPut(id, word) {
    return fetch(`${databaseUrl}/${id}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: word })
        })
        .then(response => response.json());
}

// Função DELETE: Remover um dado existente
function apiDelete(id) {
    return fetch(`${databaseUrl}/${id}.json`, {
            method: 'DELETE'
        })
        .then(response => response.json());
}

/** Funções de Processamento de Dados **/

// Função para renderizar os dados na página
function renderData(data) {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';

    if (data) {
        Object.keys(data).forEach(id => {
            const li = document.createElement('li');

            // Campo de input para edição
            const input = document.createElement('input');
            input.type = 'text';
            input.value = data[id].text;
            input.id = `input-${id}`;

            // Botão de salvar edição
            const saveButton = document.createElement('button');
            saveButton.classList.add('save-btn');
            saveButton.textContent = 'Editar';
            saveButton.onclick = () => {
                const newText = input.value;
                handleUpdate(id, newText);
            };

            // Botão de deletar
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'Deletar';
            deleteButton.onclick = () => handleDelete(id);

            li.appendChild(input);
            li.appendChild(saveButton);
            li.appendChild(deleteButton);
            dataList.appendChild(li);
        });
    } else {
        dataList.innerHTML = '<li>Nenhum dado encontrado.</li>';
    }
}

// Função para buscar e renderizar os dados
function getData() {
    apiGet()
        .then(data => {
            renderData(data);
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}

// Função para criar um novo dado
function handleCreate() {
    const inputText = document.getElementById('inputText').value;
    if (inputText.trim() === '') return; // Evita criar entradas vazias

    apiPost(inputText)
        .then(() => {
            document.getElementById('inputText').value = ''; // Limpa o campo de entrada
            getData(); // Atualiza a lista de dados
        })
        .catch(error => console.error('Erro ao criar dado:', error));
}

// Função para atualizar um dado existente
function handleUpdate(id, newText) {
    apiPut(id, newText)
        .then(() => {
            getData(); // Atualiza a lista de dados
        })
        .catch(error => console.error('Erro ao atualizar dado:', error));
}

// Função para deletar um dado existente
function handleDelete(id) {
    apiDelete(id)
        .then(() => {
            getData(); // Atualiza a lista de dados
        })
        .catch(error => console.error('Erro ao deletar dado:', error));
}

/** Configuração de Event Listeners **/

// Função para configurar os event listeners
function setupEventListeners() {
    const createButton = document.getElementById('createButton');
    createButton.addEventListener('click', handleCreate);
}

// Função de inicialização
function init() {
    setupEventListeners();
    getData();
}

// Inicializa a aplicação ao carregar a página
window.onload = init;