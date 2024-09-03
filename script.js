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
        date: document.getElementById('filterExpenseDate')
    };
    const serviceFilters = {
        vehicle: document.getElementById('filterVehicle'),
        licensePlate: document.getElementById('filterLicensePlate'),
        client: document.getElementById('filterClient')
    };
    const dashboardSection = document.getElementById('dashboard-section');
    const dailyChartCanvas = document.getElementById('dailyChart');
    const weeklyChartCanvas = document.getElementById('weeklyChart');
    const monthlyChartCanvas = document.getElementById('monthlyChart');

    let expenses = [];
    let services = [];
    let clients = [];

    const initChart = (canvas, label) => new Chart(canvas, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label,
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const dailyChart = initChart(dailyChartCanvas, 'Despesas Diárias');
    const weeklyChart = initChart(weeklyChartCanvas, 'Despesas Semanais');
    const monthlyChart = initChart(monthlyChartCanvas, 'Despesas Mensais');

    const switchTab = (activeTabId) => {
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.toggle('active', section.id === activeTabId);
        });
    };

    const filterExpenses = () => {
        const filterDate = expenseFilters.date.value;
        let filteredExpenses = expenses;

        if (filterDate) {
            filteredExpenses = expenses.filter(expense => expense.date === filterDate);
        }

        updateExpenseTable(filteredExpenses);
    };

    expenseFilters.date.addEventListener('change', filterExpenses);

    const updateExpenseTable = (filteredExpenses = expenses) => {
        expenseTableBody.innerHTML = '';
        filteredExpenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.type}</td>
                <td>${expense.amount}</td>
                <td>${expense.description}</td>
                <td>${expense.payment}</td>
                <td>
                    <button onclick="editExpense(${expense.id})">Editar</button>
                    <button onclick="deleteExpense(${expense.id})">Excluir</button>
                </td>
            `;
            expenseTableBody.appendChild(row);
        });
    };

    const getClientNameById = (id) => {
        const client = clients.find(c => c.id === id);
        return client ? client.name : '';
    };

    const filterServices = () => {
        const filterVehicle = serviceFilters.vehicle.value.toLowerCase();
        const filterLicensePlate = serviceFilters.licensePlate.value.toLowerCase();
        const filterClient = serviceFilters.client.value;

        let filteredServices = services;

        if (filterVehicle) {
            filteredServices = filteredServices.filter(service => service.vehicle.toLowerCase().includes(filterVehicle));
        }

        if (filterLicensePlate) {
            filteredServices = filteredServices.filter(service => service.licensePlate.toLowerCase().includes(filterLicensePlate));
        }

        if (filterClient) {
            filteredServices = filteredServices.filter(service => {
                const clientName = getClientNameById(service.client);
                return clientName.toLowerCase().includes(filterClient.toLowerCase());
            });
        }

        updateServiceTable(filteredServices);
    };

    serviceFilters.vehicle.addEventListener('input', filterServices);
    serviceFilters.licensePlate.addEventListener('input', filterServices);
    serviceFilters.client.addEventListener('change', filterServices);

    const updateServiceTable = (filteredServices = services) => {
        serviceTableBody.innerHTML = '';
        filteredServices.forEach(service => {
            const clientName = getClientNameById(service.client);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.date}</td>
                <td>${service.vehicle}</td>
                <td>${service.licensePlate}</td>
                <td>${clientName}</td>
                <td>${service.payment}</td>
                <td>${service.amount}</td>
                <td>${service.description}</td>
                <td>
                    <button onclick="editService(${service.id})">Editar</button>
                    <button onclick="deleteService(${service.id})">Excluir</button>
                </td>
            `;
            serviceTableBody.appendChild(row);
        });
    };

    const updateClientTable = () => {
        clientTableBody.innerHTML = '';
        clients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.name}</td>
                <td>
                    <button onclick="editClient(${client.id})">Editar</button>
                    <button onclick="deleteClient(${client.id})">Excluir</button>
                </td>
            `;
            clientTableBody.appendChild(row);
        });
    };

    const addExpense = (expense) => {
        expenses.push(expense);
        updateExpenseTable();
    };

    const addService = (service) => {
        services.push(service);
        updateServiceTable();
    };

    const addClient = (client) => {
        clients.push(client);
        updateClientTable();
        clientSelect.innerHTML = clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    };

    window.editExpense = (id) => {
        const expense = expenses.find(e => e.id === id);
        if (expense) {
            document.getElementById('expenseId').value = expense.id;
            document.getElementById('expenseDate').value = expense.date;
            document.getElementById('expenseType').value = expense.type;
            document.getElementById('expenseAmount').value = expense.amount;
            document.getElementById('expenseDescription').value = expense.description;
            document.getElementById('expensePayment').value = expense.payment;
        }
    };

    window.deleteExpense = (id) => {
        expenses = expenses.filter(e => e.id !== id);
        updateExpenseTable();
    };

    window.editService = (id) => {
        const service = services.find(s => s.id === id);
        if (service) {
            document.getElementById('serviceId').value = service.id;
            document.getElementById('serviceDate').value = service.date;
            document.getElementById('vehicle').value = service.vehicle;
            document.getElementById('licensePlate').value = service.licensePlate;
            document.getElementById('client').value = service.client;  // Aqui será o ID
            document.getElementById('servicePayment').value = service.payment;
            document.getElementById('serviceAmount').value = service.amount;
            document.getElementById('serviceDescription').value = service.description;
        }
    };

    window.deleteService = (id) => {
        services = services.filter(s => s.id !== id);
        updateServiceTable();
    };

    window.editClient = (id) => {
        const client = clients.find(c => c.id === id);
        if (client) {
            document.getElementById('clientId').value = client.id;
            document.getElementById('clientName').value = client.name;
        }
    };

    window.deleteClient = (id) => {
        clients = clients.filter(c => c.id !== id);
        updateClientTable();
        clientSelect.innerHTML = clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    };

    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.getElementById('expenseId').value;
        const expense = {
            id: id ? parseInt(id) : Date.now(),
            date: event.target.expenseDate.value,
            type: event.target.expenseType.value,
            amount: event.target.expenseAmount.value,
            description: event.target.expenseDescription.value,
            payment: event.target.expensePayment.value
        };
        if (id) {
            expenses = expenses.map(e => e.id === expense.id ? expense : e);
        } else {
            addExpense(expense);
        }
        expenseForm.reset();
        updateExpenseTable();
    });

    serviceForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.getElementById('serviceId').value;
        const service = {
            id: id ? parseInt(id) : Date.now(),
            date: event.target.serviceDate.value,
            vehicle: event.target.vehicle.value,
            licensePlate: event.target.licensePlate.value,
            client: parseInt(event.target.client.value), // Convertendo o valor para número
            payment: event.target.servicePayment.value,
            amount: event.target.serviceAmount.value,
            description: event.target.serviceDescription.value
        };
        if (id) {
            services = services.map(s => s.id === service.id ? service : s);
        } else {
            addService(service);
        }
        serviceForm.reset();
        updateServiceTable();
    });

    clientForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.getElementById('clientId').value;
        const client = {
            id: id ? parseInt(id) : Date.now(),
            name: event.target.clientName.value
        };
        if (id) {
            clients = clients.map(c => c.id === client.id ? client : c);
        } else {
            addClient(client);
        }
        clientForm.reset();
    });

    expensesTab.addEventListener('click', () => switchTab('expenses-section'));
    servicesTab.addEventListener('click', () => switchTab('services-section'));
    clientsTab.addEventListener('click', () => switchTab('clients-section'));
    dashboardTab.addEventListener('click', () => switchTab('dashboard-section'));
});
