// Sidebar Toggle


const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const toggleBtn = document.getElementById('sidebarToggle');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        // Desktop Toggle
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });

        // Mobile Menu Toggle
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });



document.addEventListener('DOMContentLoaded', function() {
    
    // --- Leave Details Doughnut Chart ---
    const leaveCtx = document.getElementById('leaveChart');
    if(leaveCtx) {
        new Chart(leaveCtx, {
            type: 'doughnut',
            data: {
                labels: ['Work From Home', 'Sick Leave', 'Late', 'Absent', 'On Time'],
                datasets: [{
                    data: [658, 68, 32, 14, 1254],
                    backgroundColor: ['#FF5B1E', '#ffc107', '#28a745', '#dc3545', '#000000'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%', // Thinner ring
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                }
            }
        });
    }

    // --- Attendance Radial Bar (Simulated with Doughnut) ---
    const attendCtx = document.getElementById('attendanceChart');
    if(attendCtx) {
        new Chart(attendCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [75, 25],
                    backgroundColor: ['#00c853', '#f1f1f1'],
                    borderWidth: 0,
                    circumference: 360,
                    rotation: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '90%',
                plugins: { legend: { display: false }, tooltip: { enabled: false } }
            }
        });
    }

    // --- Performance Area Chart ---
    const perfCtx = document.getElementById('performanceChart');
    if(perfCtx) {
        new Chart(perfCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Performance',
                    data: [10000, 10000, 35000, 35000, 42000, 60000, 60000],
                    borderColor: '#00c853',
                    backgroundColor: 'rgba(0, 200, 83, 0.1)',
                    fill: true,
                    tension: 0.4, // Smooth curve
                    pointRadius: 0, // No dots by default
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f0f0f0' },
                        ticks: {
                            color: '#999',
                            font: { size: 10 },
                            callback: function(value) { return value / 1000 + 'k'; }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#999', font: { size: 10 } }
                    }
                }
            }
        });
    }
});



// sidebar section
document.addEventListener('DOMContentLoaded', function() {

    /* =========================================
       1. SIDEBAR ACCORDION & TOGGLE LOGIC
       ========================================= */
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    // A. Desktop Toggle (Collapse Sidebar)
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // B. Mobile Toggle (Show Sidebar)
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });
    }

    // C. Close Mobile Sidebar on Outside Click
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // D. ACCORDION LOGIC (The Dropdown Menu)
    const menuItems = document.querySelectorAll('.has-submenu > .menu-link');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Stop link navigation
            
            const parent = this.parentElement; // The <li>

            // 1. Toggle current menu
            parent.classList.toggle('open');

            
        });
    });

    
});


// punch in/out section 
document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const punchBtn = document.getElementById('punchBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const productionDisplay = document.getElementById('productionDisplay');
    const statusMsg = document.getElementById('punchStatusMsg');
    const dateDisplay = document.getElementById('currentDateDisplay');

    // --- State Variables ---
    let timerInterval = null;
    let secondsElapsed = 0;
    let isPunchedIn = false;

    // --- 1. Set Real-time Header Date (Optional but good for UI) ---
    function updateHeaderDate() {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short', year: 'numeric' };
        dateDisplay.innerText = now.toLocaleDateString('en-GB', options);
    }
    setInterval(updateHeaderDate, 1000);
    updateHeaderDate(); // Initial call

    // --- 2. Timer Formatting Functions ---
    
    // Formats seconds into HH:MM:SS
    function formatTime(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }

    // Formats seconds into Decimal Hours (e.g., 1.50 hrs)
    function formatProduction(totalSeconds) {
        const hours = totalSeconds / 3600;
        return hours.toFixed(2); // Returns string like "3.45"
    }

    function pad(val) {
        return val < 10 ? '0' + val : val;
    }

    // --- 3. Core Logic ---

    function startTimer() {
        // Run this function every 1 second (1000ms)
        timerInterval = setInterval(() => {
            secondsElapsed++;
            
            // Update HTML
            timerDisplay.innerText = formatTime(secondsElapsed);
            productionDisplay.innerText = `Production : ${formatProduction(secondsElapsed)} hrs`;
            
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // --- 4. Click Event Handler ---
    punchBtn.addEventListener('click', () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (!isPunchedIn) {
            // ACTION: PUNCH IN
            isPunchedIn = true;
            
            // Change Button UI
            punchBtn.innerText = "Punch Out";
            punchBtn.classList.add('punched-out-mode'); // Makes it red via CSS
            
            // Update Status Message
            statusMsg.innerHTML = `<i class="fa-solid fa-fingerprint"></i> Punch In at ${timeString}`;
            statusMsg.style.color = "green";

            // Start Counting
            startTimer();

        } else {
            // ACTION: PUNCH OUT
            isPunchedIn = false;
            
            // Change Button UI
            punchBtn.innerText = "Punch In";
            punchBtn.classList.remove('punched-out-mode'); // Revert to original color
            
            // Update Status Message
            statusMsg.innerHTML = `<i class="fa-solid fa-check"></i> Punch Out at ${timeString}`;
            statusMsg.style.color = "var(--primary)";

            // Stop Counting
            stopTimer();
        }
    });
});