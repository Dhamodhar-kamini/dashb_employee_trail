const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');
const daysGrid = document.getElementById('daysGrid');

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// 1. Initialize Dropdowns
function initDropdowns() {
    // Populate Months
    monthNames.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // Populate Years (Range: 1950 - 2050)
    const currentYear = new Date().getFullYear();
    for (let i = 1950; i <= 2050; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Set dropdowns to Current Date
    const today = new Date();
    monthSelect.value = today.getMonth();
    yearSelect.value = today.getFullYear();
}

// 2. Render Calendar
function renderCalendar() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);

    // First day of the month (0-6)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Total days in current month
    const lastDate = new Date(year, month + 1, 0).getDate();
    // Total days in previous month (for padding)
    const prevLastDate = new Date(year, month, 0).getDate();

    // Real-time "Today" for highlighting
    const today = new Date();
    
    let html = "";

    // A. Previous Month Padding
    for (let i = firstDayIndex; i > 0; i--) {
        html += `<div class="day other-month">${prevLastDate - i + 1}</div>`;
    }

    // B. Current Month Days
    for (let i = 1; i <= lastDate; i++) {
        // Check if this cell is Today
        const isToday = 
            i === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear();

        if (isToday) {
            html += `<div class="day today">${i}</div>`;
        } else {
            html += `<div class="day">${i}</div>`;
        }
    }

    // C. Next Month Padding (Fill remaining grid slots)
    // 42 cells ensures consistent height (6 rows * 7 cols)
    const totalCells = firstDayIndex + lastDate;
    const nextDays = 42 - totalCells;

    for (let i = 1; i <= nextDays; i++) {
        html += `<div class="day other-month">${i}</div>`;
    }

    daysGrid.innerHTML = html;
}

// 3. Event Listeners
monthSelect.addEventListener('change', renderCalendar);
yearSelect.addEventListener('change', renderCalendar);

// 4. Reset Button
function resetToToday() {
    const today = new Date();
    monthSelect.value = today.getMonth();
    yearSelect.value = today.getFullYear();
    renderCalendar();
}

// Start
initDropdowns();
renderCalendar();