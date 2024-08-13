
const remindersList = document.querySelector(".reminders-list");
const numCatsInput = document.querySelector("#numCats");
const addButton = document.querySelector("#generateBtn");
const emptyStateImage = document.querySelector(".empty-state-image");
const emptyStateQuote = document.querySelector(".empty-state span");

let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
let id = reminders.length ? Math.max(reminders.map(reminder => reminder.id)) + 1 : 0;

function addReminder(date, items) {
    const reminderItem = document.createElement("li");
    reminderItem.className = 'reminder-list-item';
    reminderItem.innerHTML = `
        <span>Buy items: ${items.join(', ')} on ${date}</span>
        <button class="delete-btn">
            <i class="material-symbols-outlined">delete</i>
        </button>
    `;
    remindersList.appendChild(reminderItem);

    reminders.push({ id: id, date: date, items: items });
    localStorage.setItem('reminders', JSON.stringify(reminders));
    id++;

    emptyStateImage.style.display = "none";
    emptyStateQuote.style.display = "none";

    reminderItem.querySelector(".delete-btn").addEventListener("click", () => {
        remindersList.removeChild(reminderItem);
        reminders = reminders.filter(reminder => reminder.id !== id);
        localStorage.setItem('reminders', JSON.stringify(reminders));
        if (reminders.length === 0) {
            emptyStateImage.style.display = "block";
            emptyStateQuote.style.display = "block";
        }
    });
}

function showAlertNotification(items) {
    alert(`Reminder: Buy the following items today: ${items.join(', ')}!`);
}


function checkAndTriggerAlerts() {
    const today = new Date().toISOString().split('T')[0]; 
    const todaysReminders = reminders.filter(reminder => reminder.date === today)
    .map(reminder => reminder.items);

    if (todaysReminders.length > 0) {
        todaysReminders.forEach(items => showAlertNotification(items));
        clearInterval(intervalId); 
    }
}


function loadReminders() {
    if (reminders.length > 0) {
        emptyStateImage.style.display = "none";
        emptyStateQuote.style.display = "none";
        reminders.forEach(reminder => {
            const reminderItem = document.createElement("li");
            reminderItem.className = 'reminder-list-item';
            reminderItem.innerHTML = `
                <span>Buy items: ${reminder.items.join(', ')} on ${reminder.date}</span>
                <button class="delete-btn">
                    <i class="material-symbols-outlined">delete</i>
                </button>
            `;
            remindersList.appendChild(reminderItem);

            reminderItem.querySelector(".delete-btn").addEventListener("click", () => {
                remindersList.removeChild(reminderItem);
                reminders = reminders.filter(r => r.id !== reminder.id);
                localStorage.setItem('reminders', JSON.stringify(reminders));
                if (reminders.length === 0) {
                    emptyStateImage.style.display = "block";
                    emptyStateQuote.style.display = "block";
                }
            });
        });
    }
}


loadReminders();


let intervalId = setInterval(checkAndTriggerAlerts, 86400000); 


document.getElementById('catForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const numCats = parseInt(document.getElementById('numCats').value);

    askAgeOfCats(numCats);

    const form = document.getElementById('catForm');
    const nextButton = form.querySelector('button');
    form.removeChild(nextButton);

    const generateBtn = document.createElement('button');
    generateBtn.textContent = 'Generate Calendar';
    generateBtn.setAttribute('id', 'generateBtn');
    generateBtn.setAttribute('type', 'button');
    form.appendChild(generateBtn);

    generateBtn.addEventListener('click', function () {
        const multiplicador = createCorelation(numCats);
        const calendar = generateCalendar(numCats, multiplicador);

        displayCalendar(calendar);
    });
});

function askAgeOfCats(numCats) {
    const idadeGatos = document.getElementById('idadeGatos');
    idadeGatos.innerHTML = '';

    for (let i = 0; i < numCats; i++) {
        idadeGatos.appendChild(createLabelAndInput(i));
    }
}

function createLabelAndInput(index) {
    const container = document.createElement('div');
    const question = document.createElement('p');

    question.textContent = `Is the cat ${index + 1} a kitten, an adult or senior?`;
    container.appendChild(question);

    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('id', `kitten${index}`);
    input.setAttribute('name', `cat${index}`);
    input.setAttribute('value', 'kitten');
    input.required = true;
    container.appendChild(input);

    const label = document.createElement('label');
    label.setAttribute('for', `kitten${index}`);
    label.textContent = `kitten`;
    container.appendChild(label);

    const input1 = document.createElement('input');
    input1.setAttribute('type', 'radio');
    input1.setAttribute('id', `adult${index}`);
    input1.setAttribute('name', `cat${index}`);
    input1.setAttribute('value', 'adult');
    input1.required = true;
    container.appendChild(input1);

    const label1 = document.createElement('label');
    label1.setAttribute('for', `adult${index}`);
    label1.textContent = `adult`;
    container.appendChild(label1);

    const input2 = document.createElement('input');
    input2.setAttribute('type', 'radio');
    input2.setAttribute('id', `senior${index}`);
    input2.setAttribute('name', `cat${index}`);
    input2.setAttribute('value', 'senior');
    input2.required = true;
    container.appendChild(input2);

    const label2 = document.createElement('label');
    label2.setAttribute('for', `senior${index}`);
    label2.textContent = `senior`;
    container.appendChild(label2);

    return container;
}

function createCorelation(numCats) {
    let multiplicador = 1;
    for (let i = 0; i < numCats; i++) {
        const senior = document.querySelector(`input[name="cat${i}"][value="senior"]`).checked;
        const kitten = document.querySelector(`input[name="cat${i}"][value="kitten"]`).checked;
        const adult = document.querySelector(`input[name="cat${i}"][value="adult"]`).checked;

        if (senior) {
            multiplicador += 1;
        } else if (kitten) {
            multiplicador += 2;
        }
    }
    return multiplicador;
}

function generateCalendar(numCats, multiplicador) {
    const itemsPerMonth = {
        food: { amount: (numCats * 5) * multiplicador, unit: 'kg' },
        sand: { amount: numCats * 2, unit: '2kg litter bags' },
        snacks: { amount: (numCats * 0.5) * multiplicador, unit: 'packs' },
        wetFood: { amount: (numCats * 2) * multiplicador, unit: 'cans' },
        visitasVet: { amount: numCats, unit: 'visitas' },
        vaccines: { amount: numCats, unit: 'shots' }
    };

    const calendar = [];
    for (let month = 0; month < 12; month++) {
        const monthName = new Date(2024, month).toLocaleString('default', { month: 'long' });
        const firstDay = new Date(2024, month, 1).getDay();
        const daysInMonth = new Date(2024, month + 1, 0).getDate();

        const monthDays = new Array(firstDay).fill(null).concat(
            Array.from({ length: daysInMonth }, (_, i) => i + 1)
        ).map((day, index) => ({
            day: day || '',
            items: (day && index % 7 === firstDay) ? generateMonthlyItems(itemsPerMonth, day) : []
        }));

        calendar.push({ month: monthName, days: monthDays });
    }

    return calendar;
}

function generateMonthlyItems(itemsPerMonth, day) {
    const items = [];
    if (day === 1) {
        for (const [item, { amount, unit }] of Object.entries(itemsPerMonth)) {
            if (amount > 0) {
                items.push({ item, amount: `${amount.toFixed(2)} ${unit}` });
            }
        }
    }
    return items;
}

function displayCalendar(calendar) {
    const container = document.getElementById('calendarContainer');
    container.innerHTML = '';

    calendar.forEach(({ month, days }) => {
        const monthHeader = document.createElement('h3');
        monthHeader.textContent = month;
        container.appendChild(monthHeader);

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);

        let trRow = document.createElement('tr');
        days.forEach(({ day, items }) => {
            const td = document.createElement('td');
            td.textContent = day;

            if (items.length > 0) {
                const ul = document.createElement('ul');
                items.forEach(({ item, amount }) => {
                    const li = document.createElement('li');
                    li.textContent = `${item}: ${amount}`;
                    ul.appendChild(li);
                });
                td.appendChild(ul);
            }

            trRow.appendChild(td);

            if (trRow.children.length === 7) {
                tbody.appendChild(trRow);
                trRow = document.createElement('tr');
            }
        });

        if (trRow.children.length > 0) {
            tbody.appendChild(trRow);
        }

        table.appendChild(tbody);
        container.appendChild(table);
    });
}
