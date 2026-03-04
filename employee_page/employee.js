


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


// Sidebar Toggle

const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");
const toggleBtn = document.getElementById("sidebarToggle");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");

// Desktop Toggle
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  mainContent.classList.toggle("expanded");
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (window.innerWidth <= 992) {
    if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      sidebar.classList.remove("active");
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // --- Leave Details Doughnut Chart ---
  const leaveCtx = document.getElementById("leaveChart");
  if (leaveCtx) {
    new Chart(leaveCtx, {
      type: "doughnut",
      data: {
        labels: ["Work From Home", "Sick Leave", "Late", "Absent", "On Time"],
        datasets: [
          {
            data: [658, 68, 32, 14, 1254],
            backgroundColor: [
              "#FF5B1E",
              "#ffc107",
              "#28a745",
              "#dc3545",
              "#000000",
            ],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%", // Thinner ring
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
      },
    });
  }

  // --- Attendance Radial Bar (Simulated with Doughnut) ---
  const attendCtx = document.getElementById("attendanceChart");
  if (attendCtx) {
    new Chart(attendCtx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [75, 25],
            backgroundColor: ["#00c853", "#f1f1f1"],
            borderWidth: 0,
            circumference: 360,
            rotation: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "90%",
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });
  }

  // --- Performance Area Chart ---
  const perfCtx = document.getElementById("performanceChart");
  if (perfCtx) {
    new Chart(perfCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Performance",
            data: [10000, 10000, 35000, 35000, 42000, 60000, 60000],
            borderColor: "#00c853",
            backgroundColor: "rgba(0, 200, 83, 0.1)",
            fill: true,
            tension: 0.4, // Smooth curve
            pointRadius: 0, // No dots by default
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#f0f0f0" },
            ticks: {
              color: "#999",
              font: { size: 10 },
              callback: function (value) {
                return value / 1000 + "k";
              },
            },
          },
          x: {
            grid: { display: false },
            ticks: { color: "#999", font: { size: 10 } },
          },
        },
      },
    });
  }
});

// sidebar section
document.addEventListener("DOMContentLoaded", function () {
  /* =========================================
       1. SIDEBAR ACCORDION & TOGGLE LOGIC
       ========================================= */
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggleBtn = document.getElementById("sidebarToggle");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  // A. Desktop Toggle (Collapse Sidebar)
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");
    });
  }

  // B. Mobile Toggle (Show Sidebar)
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("active");
    });
  }

  // C. Close Mobile Sidebar on Outside Click
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 992) {
      if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove("active");
      }
    }
  });

  // D. ACCORDION LOGIC (The Dropdown Menu)
  const menuItems = document.querySelectorAll(".has-submenu > .menu-link");

  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault(); // Stop link navigation

      const parent = this.parentElement; // The <li>

      // 1. Toggle current menu
      parent.classList.toggle("open");
    });
  });
});


//nav active element section
document.addEventListener("DOMContentLoaded", function () {
    // 1. Get the current page URL
    const currentLocation = window.location.href;

    // 2. Select all menu items and links
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    const menuLinks = document.querySelectorAll('.sidebar-menu .menu-link');

    // 3. Remove 'active' class from ALL items first (cleans up hardcoded HTML)
    menuItems.forEach(item => {
        item.classList.remove('active');
    });

    // 4. Loop through links to find the match
    menuLinks.forEach(link => {
        // Check if the link's destination matches the current URL
        if (link.href === currentLocation) {
            // Add 'active' to the parent <li> of the matching link
            link.closest('.menu-item').classList.add('active');
        }
    });
});


// punch in/out section
document.addEventListener("DOMContentLoaded", () => {
  // --- Elements ---
  const punchBtn = document.getElementById("punchBtn");
  const timerDisplay = document.getElementById("timerDisplay");
  const productionDisplay = document.getElementById("productionDisplay");
  const statusMsg = document.getElementById("punchStatusMsg");
  const dateDisplay = document.getElementById("currentDateDisplay");

  // --- State Variables ---
  let timerInterval = null;
  let secondsElapsed = 0;
  let isPunchedIn = false;

  // --- 1. Set Real-time Header Date (Optional but good for UI) ---
  function updateHeaderDate() {
    const now = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    dateDisplay.innerText = now.toLocaleDateString("en-GB", options);
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
    return val < 10 ? "0" + val : val;
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
  punchBtn.addEventListener("click", () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!isPunchedIn) {
      // ACTION: PUNCH IN
      isPunchedIn = true;

      // Change Button UI
      punchBtn.innerText = "Punch Out";
      punchBtn.classList.add("punched-out-mode"); // Makes it red via CSS

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
      punchBtn.classList.remove("punched-out-mode"); // Revert to original color

      // Update Status Message
      statusMsg.innerHTML = `<i class="fa-solid fa-check"></i> Punch Out at ${timeString}`;
      statusMsg.style.color = "var(--primary)";

      // Stop Counting
      stopTimer();
    }
  });
});


// breakmanagement section 
document.addEventListener('DOMContentLoaded', () => {
    
    const BM_LIMITS = {
        lunch: 45, // minutes
        normal: 15 // minutes
    };

    let bmTimerInterval = null;
    let bmStartTime = null;
    let bmIsBreakActive = false;
    let bmUsage = { lunch: 0, normal: 0 };

    const bmEls = {
        timerDisplay: document.getElementById('bmTimerDisplay'),
        btnIn: document.getElementById('bmBtnIn'),
        btnOut: document.getElementById('bmBtnOut'),
        breakSelect: document.getElementById('bmBreakTypeSelect'),
        statusBadge: document.getElementById('bmStatusBadge'),
        limitWarning: document.getElementById('bmLimitWarning'),
        logTable: document.getElementById('bmLogTableBody'),
        emptyState: document.getElementById('bmEmptyState'),
        lunchUsed: document.getElementById('bmLunchUsed'),
        lunchBar: document.getElementById('bmLunchBar'),
        normalUsed: document.getElementById('bmNormalUsed'),
        normalBar: document.getElementById('bmNormalBar'),
        totalTime: document.getElementById('bmTotalTime'),
        remainingTime: document.getElementById('bmRemainingTime')
    };

    if(bmEls.btnIn) {
        bmEls.btnIn.addEventListener('click', () => {
            bmIsBreakActive = true;
            bmStartTime = Date.now();
            const type = bmEls.breakSelect.value;
            const typeLabel = type === 'lunch' ? 'Lunch Break' : 'Normal Break';

            bmEls.btnIn.style.display = 'none';
            bmEls.btnOut.style.display = 'flex';
            bmEls.breakSelect.disabled = true; 
            
            bmEls.statusBadge.textContent = `On ${typeLabel}`;
            bmEls.statusBadge.className = 'bm-badge bm-badge-primary';
            
            if(bmTimerInterval) clearInterval(bmTimerInterval);
            bmTimerInterval = setInterval(() => {
                bmUpdateTimerDisplay();
                bmCheckLimits();
            }, 1000);
        });
    }

    if(bmEls.btnOut) {
        bmEls.btnOut.addEventListener('click', () => {
            if (!bmIsBreakActive) return;

            clearInterval(bmTimerInterval);
            const endTime = Date.now();
            const durationSeconds = Math.floor((endTime - bmStartTime) / 1000);
            const type = bmEls.breakSelect.value;

            bmUsage[type] += durationSeconds;
            bmIsBreakActive = false;

            bmEls.btnIn.style.display = 'flex';
            bmEls.btnOut.style.display = 'none';
            bmEls.breakSelect.disabled = false;
            
            bmEls.timerDisplay.textContent = "00:00:00";
            bmEls.timerDisplay.style.color = "var(--bm-dark)";
            bmEls.limitWarning.style.display = 'none';
            
            bmEls.statusBadge.textContent = "Not Active";
            bmEls.statusBadge.className = 'bm-badge bm-badge-light';

            bmAddToHistoryLog(type, bmStartTime, endTime, durationSeconds);
            bmUpdateProgressStats();
        });
    }

    function bmUpdateTimerDisplay() {
        const now = Date.now();
        const diffInSeconds = Math.floor((now - bmStartTime) / 1000);
        bmEls.timerDisplay.textContent = bmFormatTime(diffInSeconds);
    }

    function bmCheckLimits() {
        const type = bmEls.breakSelect.value;
        const limitInSeconds = BM_LIMITS[type] * 60;
        const now = Date.now();
        const currentSessionSeconds = Math.floor((now - bmStartTime) / 1000);
        const totalUsedSoFar = bmUsage[type] + currentSessionSeconds;

        if (totalUsedSoFar > limitInSeconds) {
            bmEls.timerDisplay.style.color = 'var(--bm-danger)';
            bmEls.limitWarning.style.display = 'block';
        }
    }

    function bmUpdateProgressStats() {
        const lunchMins = Math.floor(bmUsage.lunch / 60);
        const lunchPct = Math.min((bmUsage.lunch / (BM_LIMITS.lunch * 60)) * 100, 100);
        bmEls.lunchUsed.textContent = lunchMins;
        bmEls.lunchBar.style.width = `${lunchPct}%`;
        if (lunchPct >= 100) bmEls.lunchBar.style.backgroundColor = 'var(--bm-danger)';

        const normalMins = Math.floor(bmUsage.normal / 60);
        const normalPct = Math.min((bmUsage.normal / (BM_LIMITS.normal * 60)) * 100, 100);
        bmEls.normalUsed.textContent = normalMins;
        bmEls.normalBar.style.width = `${normalPct}%`;
        if (normalPct >= 100) bmEls.normalBar.style.backgroundColor = 'var(--bm-danger)';

        const totalSec = bmUsage.lunch + bmUsage.normal;
        const totalH = Math.floor(totalSec / 3600);
        const totalM = Math.floor((totalSec % 3600) / 60);
        bmEls.totalTime.textContent = `${totalH}h ${totalM}m`;

        const maxLimitMins = BM_LIMITS.lunch + BM_LIMITS.normal;
        const usedTotalMins = Math.floor(totalSec / 60);
        const remaining = Math.max(0, maxLimitMins - usedTotalMins);
        bmEls.remainingTime.textContent = `${remaining}m`;
    }

    function bmAddToHistoryLog(type, start, end, duration) {
        if(bmEls.emptyState) bmEls.emptyState.style.display = 'none';

        const startDate = new Date(start);
        const endDate = new Date(end);
        
        const timeStartStr = startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const timeEndStr = endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const durStr = bmFormatTime(duration); 
        
        const typeLabel = type === 'lunch' ? 'Lunch Break' : 'Normal Break';
        const limitSec = BM_LIMITS[type] * 60;
        
        let statusHtml = '<span class="bm-badge bm-badge-success">On Time</span>';
        if (duration > limitSec) {
             statusHtml = '<span class="bm-badge bm-badge-danger">Overtime</span>';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fa-solid ${type === 'lunch' ? 'fa-utensils' : 'fa-mug-hot'}" style="color:var(--bm-text-muted)"></i>
                    <span style="font-weight:500">${typeLabel}</span>
                </div>
            </td>
            <td>${timeStartStr}</td>
            <td>${timeEndStr}</td>
            <td style="font-family:monospace; font-weight:600">${durStr}</td>
            <td>${statusHtml}</td>
        `;

        bmEls.logTable.prepend(row);
    }

    function bmFormatTime(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
});

//wishes section\
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Select Elements ---
    const twTriggerBtn = document.getElementById('tw-trigger-btn');
    const twModal = document.getElementById('tw-modal-overlay');
    const twCloseBtn = document.getElementById('tw-close-btn');
    const twSendBtn = document.getElementById('tw-send-action-btn');
    
    // Data elements
    const twDashName = document.getElementById('tw-dashboard-name');
    const twModalName = document.getElementById('tw-modal-name-span');

    // --- 2. Open Modal Logic ---
    if (twTriggerBtn) {
        twTriggerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Populate the name inside the modal
            if(twDashName && twModalName) {
                twModalName.textContent = twDashName.textContent;
            }
            
            // Show Modal
            twModal.classList.add('tw-active');
        });
    }

    // --- 3. Close Modal Logic ---
    const closeTwModal = () => {
        twModal.classList.remove('tw-active');
        
        // Reset the "Send" button style after closing
        setTimeout(() => {
            if(twSendBtn) {
                twSendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Wish';
                twSendBtn.style.backgroundColor = '#164E63';
            }
        }, 300);
    };

    if (twCloseBtn) {
        twCloseBtn.addEventListener('click', closeTwModal);
    }

    // Close when clicking outside the box
    window.addEventListener('click', (e) => {
        if (e.target === twModal) {
            closeTwModal();
        }
    });

    // --- 4. Send Button Logic ---
    if (twSendBtn) {
        twSendBtn.addEventListener('click', () => {
            // A. Change visual to "Sending..."
            twSendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            
            // B. Simulate a delay (e.g., API call)
            setTimeout(() => {
                // Success Visual
                twSendBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
                twSendBtn.style.backgroundColor = '#22c55e'; // Green

                // C. Close Modal after success
                setTimeout(() => {
                    closeTwModal();
                    alert(`Birthday wish sent to ${twDashName ? twDashName.textContent : 'Employee'}!`);
                    
                    // D. Disable the dashboard button (optional)
                    if(twTriggerBtn) {
                        twTriggerBtn.innerText = "Sent";
                        twTriggerBtn.disabled = true;
                        twTriggerBtn.style.opacity = "0.6";
                        twTriggerBtn.style.cursor = "not-allowed";
                    }
                }, 800);
            }, 1000);
        });
    }
});