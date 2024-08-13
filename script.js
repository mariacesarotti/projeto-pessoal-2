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
        multiplicador = createCorelation(numCats);
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
    input.setAttribute('id', `kitten`);
    input.setAttribute('name', `cat ${index + 1}`);
    input.setAttribute('value', 'kitten');
    input.required = true;
    container.appendChild(input);

    const label = document.createElement('label');
    label.setAttribute('for', `kitten`);
    label.textContent = `kitten`;
    container.appendChild(label);

    const input1 = document.createElement('input');
    input1.setAttribute('type', 'radio');
    input1.setAttribute('id', `adult`);
    input1.setAttribute('name', `cat ${index + 1}`);
    input1.setAttribute('value', 'adult');
    input1.required = true;
    container.appendChild(input1);

    const label1 = document.createElement('label');
    label1.setAttribute('for', `adult`);
    label1.textContent = `adult`;
    container.appendChild(label1);

    const input2 = document.createElement('input');
    input2.setAttribute('type', 'radio');
    input2.setAttribute('id', `senior`);
    input2.setAttribute('name', `cat ${index + 1}`);
    input2.setAttribute('value', 'senior');
    input2.required = true;
    container.appendChild(input2);

    const label2 = document.createElement('label');
    label2.setAttribute('for', `senior`);
    label2.textContent = `senior`;
    container.appendChild(label2);

    return container;
}

function createCorelation(numCats) {
    multiplicador = 1;
    for (let i = 0; i < numCats; i++) {
        const senior = document.querySelector(`input[name="cat ${i + 1}"][value="senior"]`).checked;
        const kitten = document.querySelector(`input[name="cat ${i + 1}"][value="kitten"]`).checked;
        const adult = document.querySelector(`input[name="cat ${i + 1}"][value="adult"]`).checked;

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

    calendar.forEach(month => {

        const monthHeader = document.createElement('div');
        monthHeader.classList.add('month-header');
        monthHeader.textContent = month.month;
        monthHeader.addEventListener('click', () => {
            monthContent.style.display = monthContent.style.display === 'none' ? 'block' : 'none';
        });


        const monthContent = document.createElement('div');
        monthContent.classList.add('month-content');
        monthContent.style.display = 'none';


        const calendarHeader = document.createElement('div');
        calendarHeader.classList.add('calendar-header');

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('header');
            dayHeader.textContent = day;
            calendarHeader.appendChild(dayHeader);
        });

        monthContent.appendChild(calendarHeader);


        const calendarDays = document.createElement('div');
        calendarDays.classList.add('calendar-days');

        month.days.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');

            if (day.day) {
                const dayContent = document.createElement('div');
                dayContent.innerHTML = `<strong>${day.day}</strong>`;
                dayDiv.appendChild(dayContent);

                day.items.forEach(item => {
                    const itemSpan = document.createElement('div');
                    itemSpan.textContent = `${item.item}: ${item.amount}`;
                    dayDiv.appendChild(itemSpan);
                });
            } else {
                dayDiv.textContent = '';
            }

            calendarDays.appendChild(dayDiv);
        });

        monthContent.appendChild(calendarDays);
        container.appendChild(monthHeader);
        container.appendChild(monthContent);
    });
}
