


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


//apply for leave management section
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Select Elements ---
    const modal = document.getElementById('lmLeaveModal');
    
    // Select your EXISTING buttons. 
    // We use querySelectorAll to find ANY button with text "Apply New Leave" or "Apply Leave"
    const allButtons = document.querySelectorAll('button');
    const openBtns = [];

    allButtons.forEach(btn => {
        const text = btn.innerText.toLowerCase();
        // Check if button text matches your buttons
        if (text.includes('apply new leave') || text.includes('apply leave')) {
            openBtns.push(btn);
        }
    });

    // Close Buttons inside modal
    const closeBtn = document.getElementById('lmCloseBtn');
    const cancelBtn = document.getElementById('lmCancelBtn');
    const submitBtn = document.getElementById('lmSubmitBtn');

    // Form Inputs
    const empName = document.getElementById('lmEmpName');
    const leaveType = document.getElementById('lmLeaveType');
    const fromDate = document.getElementById('lmFromDate');
    const toDate = document.getElementById('lmToDate');
    const numDays = document.getElementById('lmNumDays');
    const balanceDisplay = document.getElementById('lmBalance');
    const reason = document.getElementById('lmReason');

    // Toast
    const toast = document.getElementById('lmToast');
    const toastMsg = document.getElementById('lmToastMsg');
    const toastIcon = toast.querySelector('i');

    // Fake Database
    const leaveDatabase = {
        'casual': 12,
        'medical': 10,
        'nopay': 99
    };

    // --- 2. Event Listeners ---

    // Open Modal (Attach to all matching buttons)
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission if inside a form
            modal.classList.add('active');
        });
    });

    // Close Modal
    const closeModal = () => {
        modal.classList.remove('active');
        // Optional: Reset form
        document.getElementById('lmLeaveForm').reset();
        numDays.value = "0";
        balanceDisplay.value = "-";
    };

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Calculate Days & Check Balance
    const calculateLeave = () => {
        const type = leaveType.value;
        const start = new Date(fromDate.value);
        const end = new Date(toDate.value);

        // Update Balance Display
        if(type && leaveDatabase[type]) {
            balanceDisplay.value = leaveDatabase[type];
        } else {
            balanceDisplay.value = "-";
        }

        // Calculate Days
        if (fromDate.value && toDate.value) {
            if (end < start) {
                numDays.value = "Invalid Date";
                return;
            }
            // Diff in ms -> days
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
            numDays.value = diffDays;
        } else {
            numDays.value = "0";
        }
    };

    leaveType.addEventListener('change', calculateLeave);
    fromDate.addEventListener('change', calculateLeave);
    toDate.addEventListener('change', calculateLeave);

    // Submit Logic
    if(submitBtn) {
        submitBtn.addEventListener('click', () => {
            const days = parseInt(numDays.value);
            const currentBal = parseInt(balanceDisplay.value);
            const name = empName.value.trim();
            const reasonText = reason.value.trim();

            // Validation
            if(!name || !leaveType.value || !fromDate.value || !toDate.value || !reasonText) {
                showToast("Please fill all required fields", "error");
                return;
            }

            if(isNaN(days) || days <= 0) {
                showToast("Invalid date range", "error");
                return;
            }

            if(currentBal !== 99 && days > currentBal) { // 99 is nopay code
                showToast("Insufficient leave balance!", "error");
                return;
            }

            // Success
            showToast("Leave request submitted successfully!", "success");
            
            // Deduct from fake DB (visual only)
            if(leaveDatabase[leaveType.value] !== 99) {
                leaveDatabase[leaveType.value] -= days;
            }

            setTimeout(() => {
                closeModal();
            }, 1500);
        });
    }

    // --- 3. Toast Function ---
    function showToast(message, type) {
        toastMsg.innerText = message;
        toast.classList.remove('success', 'error');
        toast.classList.add('active');
        
        if (type === 'success') {
            toast.classList.add('success');
            toastIcon.className = 'fa-solid fa-circle-check';
        } else {
            toast.classList.add('error');
            toastIcon.className = 'fa-solid fa-circle-exclamation';
        }

        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
});




// Dashboard JS (Refactored Modular)
// ==============================
// document.addEventListener("DOMContentLoaded", () => {

//   // ==============================
//   // 1. Calendar Module
//   // ==============================
//   const monthSelect = document.getElementById('monthSelect');
//   const yearSelect = document.getElementById('yearSelect');
//   const daysGrid = document.getElementById('daysGrid');
//   const monthNames = [
//     "January","February","March","April","May","June",
//     "July","August","September","October","November","December"
//   ];

//   function initCalendarDropdowns() {
//     // Months
//     monthNames.forEach((month, index) => {
//       const option = document.createElement('option');
//       option.value = index;
//       option.textContent = month;
//       monthSelect.appendChild(option);
//     });
//     // Years
//     const currentYear = new Date().getFullYear();
//     for(let i = 1950; i <= 2050; i++){
//       const option = document.createElement('option');
//       option.value = i;
//       option.textContent = i;
//       yearSelect.appendChild(option);
//     }
//     // Set current date
//     const today = new Date();
//     monthSelect.value = today.getMonth();
//     yearSelect.value = today.getFullYear();
//   }

//   function renderCalendar() {
//     const year = parseInt(yearSelect.value);
//     const month = parseInt(monthSelect.value);
//     const firstDayIndex = new Date(year, month, 1).getDay();
//     const lastDate = new Date(year, month + 1, 0).getDate();
//     const prevLastDate = new Date(year, month, 0).getDate();
//     const today = new Date();

//     let html = "";

//     // Previous month padding
//     for(let i = firstDayIndex; i > 0; i--){
//       html += `<div class="day other-month">${prevLastDate - i + 1}</div>`;
//     }

//     // Current month
//     for(let i = 1; i <= lastDate; i++){
//       const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
//       html += `<div class="day${isToday ? ' today' : ''}">${i}</div>`;
//     }

//     // Next month padding
//     const totalCells = firstDayIndex + lastDate;
//     const nextDays = 42 - totalCells;
//     for(let i = 1; i <= nextDays; i++){
//       html += `<div class="day other-month">${i}</div>`;
//     }

//     daysGrid.innerHTML = html;
//   }

//   monthSelect.addEventListener('change', renderCalendar);
//   yearSelect.addEventListener('change', renderCalendar);

//   function resetCalendarToToday() {
//     const today = new Date();
//     monthSelect.value = today.getMonth();
//     yearSelect.value = today.getFullYear();
//     renderCalendar();
//   }

//   initCalendarDropdowns();
//   renderCalendar();

//   // ==============================
//   // 2. Sidebar Module
//   // ==============================
//   const sidebar = document.getElementById("sidebar");
//   const mainContent = document.getElementById("mainContent");
//   const toggleBtn = document.getElementById("sidebarToggle");
//   const mobileMenuBtn = document.getElementById("mobileMenuBtn");

//   const sidebarToggle = () => {
//     sidebar.classList.toggle("collapsed");
//     mainContent.classList.toggle("expanded");
//   };

//   if(toggleBtn) toggleBtn.addEventListener("click", sidebarToggle);
//   if(mobileMenuBtn) {
//     mobileMenuBtn.addEventListener("click", (e) => {
//       e.stopPropagation();
//       sidebar.classList.toggle("active");
//     });
//   }

//   document.addEventListener("click", (e) => {
//     if(window.innerWidth <= 992){
//       if(!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)){
//         sidebar.classList.remove("active");
//       }
//     }
//   });

//   // Sidebar accordion
//   document.querySelectorAll(".has-submenu > .menu-link").forEach(item => {
//     item.addEventListener("click", (e) => {
//       e.preventDefault();
//       item.parentElement.classList.toggle("open");
//     });
//   });

//   // ==============================
//   // 3. Punch In/Out Module
//   // ==============================
//   const punchBtn = document.getElementById("punchBtn");
//   const timerDisplay = document.getElementById("timerDisplay");
//   const productionDisplay = document.getElementById("productionDisplay");
//   const statusMsg = document.getElementById("punchStatusMsg");
//   const dateDisplay = document.getElementById("currentDateDisplay");

//   let timerInterval = null, secondsElapsed = 0, isPunchedIn = false;

//   // Header date update
//   const updateHeaderDate = () => {
//     const now = new Date();
//     dateDisplay.innerText = now.toLocaleDateString("en-GB", {
//       hour:"2-digit", minute:"2-digit", day:"numeric", month:"short", year:"numeric"
//     });
//   };
//   setInterval(updateHeaderDate, 1000);
//   updateHeaderDate();

//   const pad = (v) => v < 10 ? "0" + v : v;
//   const formatTime = (s) => {
//     const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
//     return `${pad(h)}:${pad(m)}:${pad(sec)}`;
//   };
//   const formatProduction = (s) => (s/3600).toFixed(2);

//   const startTimer = () => {
//     timerInterval = setInterval(() => {
//       secondsElapsed++;
//       timerDisplay.innerText = formatTime(secondsElapsed);
//       productionDisplay.innerText = `Production : ${formatProduction(secondsElapsed)} hrs`;
//     }, 1000);
//   };
//   const stopTimer = () => clearInterval(timerInterval);

//   if(punchBtn){
//     punchBtn.addEventListener("click", () => {
//       const now = new Date();
//       const timeStr = now.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
//       if(!isPunchedIn){
//         isPunchedIn = true;
//         punchBtn.innerText = "Punch Out";
//         punchBtn.classList.add("punched-out-mode");
//         statusMsg.innerHTML = `<i class="fa-solid fa-fingerprint"></i> Punch In at ${timeStr}`;
//         statusMsg.style.color = "green";
//         startTimer();
//       } else {
//         isPunchedIn = false;
//         punchBtn.innerText = "Punch In";
//         punchBtn.classList.remove("punched-out-mode");
//         statusMsg.innerHTML = `<i class="fa-solid fa-check"></i> Punch Out at ${timeStr}`;
//         statusMsg.style.color = "var(--primary)";
//         stopTimer();
//       }
//     });
//   }

//   // ==============================
//   // 4. Break Management Module
//   // ==============================
//   const BM_LIMITS = { lunch:45, normal:15 };
//   let bmTimerInterval = null, bmStartTime = null, bmIsBreakActive = false;
//   let bmUsage = { lunch:0, normal:0 };

//   const bmEls = {
//     timerDisplay: document.getElementById('bmTimerDisplay'),
//     btnIn: document.getElementById('bmBtnIn'),
//     btnOut: document.getElementById('bmBtnOut'),
//     breakSelect: document.getElementById('bmBreakTypeSelect'),
//     statusBadge: document.getElementById('bmStatusBadge'),
//     limitWarning: document.getElementById('bmLimitWarning'),
//     logTable: document.getElementById('bmLogTableBody'),
//     emptyState: document.getElementById('bmEmptyState'),
//     lunchUsed: document.getElementById('bmLunchUsed'),
//     lunchBar: document.getElementById('bmLunchBar'),
//     normalUsed: document.getElementById('bmNormalUsed'),
//     normalBar: document.getElementById('bmNormalBar'),
//     totalTime: document.getElementById('bmTotalTime'),
//     remainingTime: document.getElementById('bmRemainingTime')
//   };

//   const bmFormatTime = (s) => `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

//   const bmUpdateTimerDisplay = () => {
//     if(!bmStartTime) return;
//     const diff = Math.floor((Date.now()-bmStartTime)/1000);
//     bmEls.timerDisplay.textContent = bmFormatTime(diff);
//   };

//   const bmCheckLimits = () => {
//     const type = bmEls.breakSelect.value;
//     const limitSec = BM_LIMITS[type]*60;
//     const currentSession = Math.floor((Date.now()-bmStartTime)/1000);
//     if(bmUsage[type]+currentSession > limitSec){
//       bmEls.timerDisplay.style.color = 'var(--bm-danger)';
//       bmEls.limitWarning.style.display = 'block';
//     }
//   };

//   const bmUpdateProgressStats = () => {
//     const updateBar = (type, limit) => {
//       const mins = Math.floor(bmUsage[type]/60);
//       const pct = Math.min((bmUsage[type]/(limit*60))*100, 100);
//       bmEls[`${type}Used`].textContent = mins;
//       bmEls[`${type}Bar`].style.width = `${pct}%`;
//       if(pct>=100) bmEls[`${type}Bar`].style.backgroundColor='var(--bm-danger)';
//     };
//     updateBar('lunch', BM_LIMITS.lunch);
//     updateBar('normal', BM_LIMITS.normal);

//     const totalSec = bmUsage.lunch + bmUsage.normal;
//     bmEls.totalTime.textContent = `${Math.floor(totalSec/3600)}h ${Math.floor((totalSec%3600)/60)}m`;
//     const remaining = Math.max(0, BM_LIMITS.lunch+BM_LIMITS.normal - Math.floor(totalSec/60));
//     bmEls.remainingTime.textContent = `${remaining}m`;
//   };

//   const bmAddToHistoryLog = (type, start, end, duration) => {
//     if(bmEls.emptyState) bmEls.emptyState.style.display = 'none';
//     const startStr = new Date(start).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
//     const endStr = new Date(end).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
//     const typeLabel = type==='lunch'?'Lunch Break':'Normal Break';
//     const statusHtml = duration > BM_LIMITS[type]*60 ? '<span class="bm-badge bm-badge-danger">Overtime</span>' : '<span class="bm-badge bm-badge-success">On Time</span>';
//     const row = document.createElement('tr');
//     row.innerHTML = `<td><div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid ${type==='lunch'?'fa-utensils':'fa-mug-hot'}" style="color:var(--bm-text-muted)"></i><span style="font-weight:500">${typeLabel}</span></div></td><td>${startStr}</td><td>${endStr}</td><td style="font-family:monospace; font-weight:600">${bmFormatTime(duration)}</td><td>${statusHtml}</td>`;
//     bmEls.logTable.prepend(row);
//   };

//   if(bmEls.btnIn) bmEls.btnIn.addEventListener('click', () => {
//     bmIsBreakActive=true; bmStartTime=Date.now();
//     const type = bmEls.breakSelect.value;
//     bmEls.btnIn.style.display='none'; bmEls.btnOut.style.display='flex'; bmEls.breakSelect.disabled=true;
//     bmEls.statusBadge.textContent = `On ${type==='lunch'?'Lunch Break':'Normal Break'}`;
//     bmEls.statusBadge.className = 'bm-badge bm-badge-primary';
//     if(bmTimerInterval) clearInterval(bmTimerInterval);
//     bmTimerInterval = setInterval(()=>{bmUpdateTimerDisplay(); bmCheckLimits();}, 1000);
//   });

//   if(bmEls.btnOut) bmEls.btnOut.addEventListener('click', () => {
//     if(!bmIsBreakActive) return;
//     clearInterval(bmTimerInterval);
//     const end = Date.now();
//     const duration = Math.floor((end-bmStartTime)/1000);
//     const type = bmEls.breakSelect.value;
//     bmUsage[type]+=duration; bmIsBreakActive=false;
//     bmEls.btnIn.style.display='flex'; bmEls.btnOut.style.display='none'; bmEls.breakSelect.disabled=false;
//     bmEls.timerDisplay.textContent="00:00:00"; bmEls.timerDisplay.style.color='var(--bm-dark)'; bmEls.limitWarning.style.display='none';
//     bmEls.statusBadge.textContent='Not Active'; bmEls.statusBadge.className='bm-badge bm-badge-light';
//     bmAddToHistoryLog(type, bmStartTime, end, duration);
//     bmUpdateProgressStats();
//   });

//   // ==============================
//   // 5. Leave Management Module
//   // ==============================
//   const lmModal = document.getElementById('lmLeaveModal');
//   const lmForm = document.getElementById('lmLeaveForm');
//   const lmSubmitBtn = document.getElementById('lmSubmitBtn');
//   const lmCloseBtn = document.getElementById('lmCloseBtn');
//   const lmCancelBtn = document.getElementById('lmCancelBtn');
//   const lmToast = document.getElementById('lmToast');
//   const lmToastMsg = document.getElementById('lmToastMsg');
//   const lmToastIcon = lmToast?.querySelector('i');

//   const lmEls = {
//     empName: document.getElementById('lmEmpName'),
//     leaveType: document.getElementById('lmLeaveType'),
//     fromDate: document.getElementById('lmFromDate'),
//     toDate: document.getElementById('lmToDate'),
//     numDays: document.getElementById('lmNumDays'),
//     balanceDisplay: document.getElementById('lmBalance'),
//     reason: document.getElementById('lmReason')
//   };

//   const leaveDatabase = { casual:12, medical:10, nopay:99 };

//   const calculateLeave = () => {
//     const type = lmEls.leaveType.value;
//     const start = new Date(lmEls.fromDate.value);
//     const end = new Date(lmEls.toDate.value);
//     lmEls.balanceDisplay.value = leaveDatabase[type] || '-';
//     if(lmEls.fromDate.value && lmEls.toDate.value){
//       if(end<start) lmEls.numDays.value="Invalid Date";
//       else lmEls.numDays.value = Math.ceil((end-start)/(1000*60*60*24))+1;
//     } else lmEls.numDays.value="0";
//   };

//   ['change'].forEach(ev => {
//     lmEls.leaveType?.addEventListener(ev, calculateLeave);
//     lmEls.fromDate?.addEventListener(ev, calculateLeave);
//     lmEls.toDate?.addEventListener(ev, calculateLeave);
//   });

//   const showToast = (msg, type) => {
//     lmToastMsg.innerText=msg;
//     lmToast.classList.remove('success','error'); lmToast.classList.add('active');
//     if(type==='success'){ lmToast.classList.add('success'); lmToastIcon.className='fa-solid fa-circle-check'; }
//     else { lmToast.classList.add('error'); lmToastIcon.className='fa-solid fa-circle-exclamation'; }
//     setTimeout(()=>{ lmToast.classList.remove('active'); },3000);
//   };

//   const closeLmModal = () => {
//     lmModal.classList.remove('active'); lmForm?.reset(); lmEls.numDays.value="0"; lmEls.balanceDisplay.value="-";
//   };

//   [lmCloseBtn,lmCancelBtn].forEach(btn => btn?.addEventListener('click', closeLmModal));
//   lmModal?.addEventListener('click', e => { if(e.target===lmModal) closeLmModal(); });

//   document.querySelectorAll('button').forEach(btn => {
//     const text = btn.innerText.toLowerCase();
//     if(text.includes('apply new leave') || text.includes('apply leave')){
//       btn.addEventListener('click', e => { e.preventDefault(); lmModal.classList.add('active'); });
//     }
//   });

//   lmSubmitBtn?.addEventListener('click', () => {
//     const days = parseInt(lmEls.numDays.value);
//     const currentBal = parseInt(lmEls.balanceDisplay.value);
//     const name = lmEls.empName.value.trim();
//     const reasonText = lmEls.reason.value.trim();
//     if(!name || !lmEls.leaveType.value || !lmEls.fromDate.value || !lmEls.toDate.value || !reasonText){
//       showToast("Please fill all required fields","error"); return;
//     }
//     if(isNaN(days) || days<=0){ showToast("Invalid date range","error"); return; }
//     if(currentBal!==99 && days>currentBal){ showToast("Insufficient leave balance!","error"); return; }
//     showToast("Leave request submitted successfully!","success");
//     if(leaveDatabase[lmEls.leaveType.value]!==99) leaveDatabase[lmEls.leaveType.value]-=days;
//     setTimeout(closeLmModal,1500);
//   });

//   // ==============================
//   // 6. Chart.js Module
//   // ==============================
//   const renderChart = (ctx, config) => { if(ctx) new Chart(ctx, config); };

//   renderChart(document.getElementById("leaveChart"),{
//     type:"doughnut",
//     data:{ labels:["Work From Home","Sick Leave","Late","Absent","On Time"], datasets:[{data:[658,68,32,14,1254], backgroundColor:["#FF5B1E","#ffc107","#28a745","#dc3545","#000000"], borderWidth:0, hoverOffset:4}]},
//     options:{ responsive:true, maintainAspectRatio:false, cutout:"75%", plugins:{legend:{display:false}, tooltip:{enabled:true}} }
//   });

//   renderChart(document.getElementById("attendanceChart"),{
//     type:"doughnut",
//     data:{ datasets:[{data:[75,25], backgroundColor:["#00c853","#f1f1f1"], borderWidth:0, circumference:360, rotation:0}]},
//     options:{ responsive:true, maintainAspectRatio:false, cutout:"90%", plugins:{legend:{display:false}, tooltip:{enabled:false}} }
//   });

//   renderChart(document.getElementById("performanceChart"),{
//     type:"line",
//     data:{ labels:["Jan","Feb","Mar","Apr","May","Jun","Jul"], datasets:[{label:"Performance", data:[120,150,170,180,200,220,250], borderColor:"#ff6b6b", backgroundColor:"transparent", tension:0.4, fill:false, pointRadius:4} ] },
//     options:{ responsive:true, plugins:{legend:{display:false}} }
//   });

// });