document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expenseForm');
    const serviceForm = document.getElementById('serviceForm');
    const clientForm = document.getElementById('clientForm');
    const expensesTab = document.getElementById('expenses-tab');
    const servicesTab = document.getElementById('services-tab');
    const clientsTab = document.getElementById('clients-tab');
    const dashboardTab = document.getElementById('dashboard-tab');
    const expenseTableBody = document.querySelector('#expenseTable tbody');
    const serviceTableBody = document.querySelector('#serviceTable tbody');
    const clientTableBody = document.querySelector('#clientTable tbody');
    const clientSelect = document.getElementById('client');
    const expenseFilters = {
        date: document.getElementById('filterExpenseDate'),
        type: document.getElementById('filterExpenseType'),
        payment: document.getElementById('filterExpensePayment')
    };
    const serviceFilters = {
        date: document.getElementById('filterServiceDate'),
        vehicle: document.getElementById('filterVehicle'),
        licensePlate: document.getElementById('filterLicensePlate'),
        client: document.getElementById('filterClient')
    };
    const dashboardSection = document.getElementById('dashboard-section');
    const dailyChartCanvas = document.getElementById('dailyChart');
    const weeklyChartCanvas = document.getElementById('weeklyChart');
    const monthlyChartCanvas = document.getElementById('monthlyChart');

    // Inicializar os gráficos
    const dailyChart = new Chart(dailyChartCanvas, {
        type: 'bar',
        data: {
            labels: [], // Rótulos do gráfico
            datasets: [{
                label: 'Despesas do Dia',
                data: [], // Dados das despesas do dia
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const weeklyChart = new Chart(weeklyChartCanvas, {
        type: 'bar',
        data: {
            labels: [], // Rótulos do gráfico
            datasets: [{
                label: 'Despesas da Semana',
                data: [], // Dados das despesas da semana
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const monthlyChart = new Chart(monthlyChartCanvas, {
        type: 'bar',
        data: {
            labels: [], // Rótulos do gráfico
            datasets: [{
                label: 'Despesas do Mês',
                data: [], // Dados das despesas do mês
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    function updateChart() {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
        // Função auxiliar para filtrar despesas por data
        function filterExpensesByDate(expenses, date) {
            return expenses.filter(expense => expense.date.startsWith(date));
        }
    
        // Atualize os dados dos gráficos
        const today = new Date().toISOString().split('T')[0]; // Data no formato 'YYYY-MM-DD'
        const dailyExpenses = filterExpensesByDate(expenses, today);
    
        // Filtrar despesas da semana
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Começo da semana (domingo)
        const endOfWeek = new Date();
        endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay())); // Fim da semana (sábado)
        const weeklyExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
        });
    
        // Filtrar despesas do mês
        const startOfMonth = new Date();
        startOfMonth.setDate(1); // Começo do mês
        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0); // Fim do mês
        const monthlyExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
        });
    
        // Atualizando os gráficos com os dados filtrados
        dailyChart.data.labels = dailyExpenses.map(expense => expense.description || expense.date);
        dailyChart.data.datasets[0].data = dailyExpenses.map(expense => parseFloat(expense.amount));
        dailyChart.update();
    
        weeklyChart.data.labels = weeklyExpenses.map(expense => expense.description || expense.date);
        weeklyChart.data.datasets[0].data = weeklyExpenses.map(expense => parseFloat(expense.amount));
        weeklyChart.update();
    
        monthlyChart.data.labels = monthlyExpenses.map(expense => expense.description || expense.date);
        monthlyChart.data.datasets[0].data = monthlyExpenses.map(expense => parseFloat(expense.amount));
        monthlyChart.update();
    }
    
    function updateDailyChart() {
        const today = new Date().toISOString().split('T')[0];
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const dailyExpenses = expenses.filter(expense => expense.date.startsWith(today));
        
        dailyChart.data.labels = dailyExpenses.map(expense => expense.description || expense.date);
        dailyChart.data.datasets[0].data = dailyExpenses.map(expense => parseFloat(expense.amount));
        dailyChart.update();
    }
    
    function editExpense(index, newDetails) {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        if (expenses[index]) {
            expenses[index] = { ...expenses[index], ...newDetails };
            localStorage.setItem('expenses', JSON.stringify(expenses));
            loadExpenses();
            updateChart(); // Atualize o dashboard após a edição
        } else {
            console.error('Despesa não encontrada');
        }
    }
    
    function loadExpenses() {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenseTableBody.innerHTML = expenses.map((expense, index) => `
            <tr>
                <td>${expense.date}</td>
                <td>${expense.type}</td>
                <td>${expense.amount}</td>
                <td>${expense.description}</td>
                <td>${expense.payment}</td>
                <td>
                    <button class="edit-expense" data-index="${index}">Editar</button>
                    <button class="delete-expense" data-index="${index}">Excluir</button>
                </td>
            </tr>
        `).join('');
        updateDailyChart(); // Atualiza o gráfico diário quando as despesas são carregadas
    }

    function loadServices() {
        const services = JSON.parse(localStorage.getItem('services')) || [];
        serviceTableBody.innerHTML = services.map((service, index) => `
            <tr>
                <td>${service.date}</td>
                <td>${service.vehicle}</td>
                <td>${service.licensePlate}</td>
                <td>${service.client}</td>
                <td>${service.payment}</td>
                <td>${service.amount}</td>
                <td>${service.description}</td>
                <td>
                    <button class="edit-service" data-index="${index}">Editar</button>
                    <button class="delete-service" data-index="${index}">Excluir</button>
                </td>
            </tr>
        `).join('');
    }

    function loadClients() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        clientTableBody.innerHTML = clients.map((client, index) => `
            <tr>
                <td>${client.name}</td>
                <td>
                    <button class="edit-client" data-index="${index}">Editar</button>
                    <button class="delete-client" data-index="${index}">Excluir</button>
                </td>
            </tr>
        `).join('');

        populateClientSelect(); // Atualiza o select de clientes
    }

    function populateClientSelect() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        clientSelect.innerHTML = '<option value="">Selecione um cliente</option>'; // Adiciona uma opção padrão
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.name; // Use o nome do cliente como valor
            option.textContent = client.name;
            clientSelect.appendChild(option);
        });
    }

    expenseForm.addEventListener('submit', event => {
        event.preventDefault();
        const expense = {
            date: event.target.expenseDate.value,
            type: event.target.expenseType.value,
            amount: event.target.expenseAmount.value,
            description: event.target.expenseDescription.value,
            payment: event.target.expensePayment.value
        };
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        loadExpenses();
    });

    serviceForm.addEventListener('submit', event => {
        event.preventDefault();
        const service = {
            date: event.target.serviceDate.value,
            vehicle: event.target.vehicle.value,
            licensePlate: event.target.licensePlate.value,
            client: event.target.client.value,
            payment: event.target.servicePayment.value,
            amount: event.target.serviceAmount.value,
            description: event.target.serviceDescription.value
        };
        const services = JSON.parse(localStorage.getItem('services')) || [];
        services.push(service);
        localStorage.setItem('services', JSON.stringify(services));
        loadServices();
    });

    clientForm.addEventListener('submit', event => {
        event.preventDefault();
        const client = {
            name: event.target.clientName.value
        };
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients.push(client);
        localStorage.setItem('clients', JSON.stringify(clients));
        loadClients();
    });

    document.getElementById('expenses-tab').addEventListener('click', () => {
        showTab('expenses');
    });

    document.getElementById('services-tab').addEventListener('click', () => {
        showTab('services');
    });

    document.getElementById('clients-tab').addEventListener('click', () => {
        showTab('clients');
    });

    document.getElementById('dashboard-tab').addEventListener('click', () => {
        showTab('dashboard');
    });

    function showTab(tab) {
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${tab}-section`).classList.add('active');
        if (tab === 'dashboard') {
            updateChart();
        }
    }

    expenseTableBody.addEventListener('click', event => {
        if (event.target.classList.contains('edit-expense')) {
            const index = event.target.dataset.index;
            const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            const expense = expenses[index];
            // Preencha o formulário de edição com os dados
            // Aqui você pode implementar a lógica para editar despesas
            // Por exemplo, abrir um modal com o formulário de edição
            // e preencher os campos com os dados da despesa selecionada
        }
        if (event.target.classList.contains('delete-expense')) {
            const index = event.target.dataset.index;
            let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            expenses.splice(index, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            loadExpenses();
        }
    });

    serviceTableBody.addEventListener('click', event => {
        if (event.target.classList.contains('edit-service')) {
            const index = event.target.dataset.index;
            const services = JSON.parse(localStorage.getItem('services')) || [];
            const service = services[index];
            // Preencha o formulário de edição com os dados
            // Aqui você pode implementar a lógica para editar serviços
            // Por exemplo, abrir um modal com o formulário de edição
            // e preencher os campos com os dados do serviço selecionado
        }
        if (event.target.classList.contains('delete-service')) {
            const index = event.target.dataset.index;
            let services = JSON.parse(localStorage.getItem('services')) || [];
            services.splice(index, 1);
            localStorage.setItem('services', JSON.stringify(services));
            loadServices();
        }
    });

    clientTableBody.addEventListener('click', event => {
        if (event.target.classList.contains('edit-client')) {
            const index = event.target.dataset.index;
            const clients = JSON.parse(localStorage.getItem('clients')) || [];
            const client = clients[index];
            // Preencha o formulário de edição com os dados
            // Aqui você pode implementar a lógica para editar clientes
            // Por exemplo, abrir um modal com o formulário de edição
            // e preencher os campos com os dados do cliente selecionado
        }
        if (event.target.classList.contains('delete-client')) {
            const index = event.target.dataset.index;
            let clients = JSON.parse(localStorage.getItem('clients')) || [];
            clients.splice(index, 1);
            localStorage.setItem('clients', JSON.stringify(clients));
            loadClients();
        }
    });

    loadExpenses();
    loadServices();
    loadClients();
});
