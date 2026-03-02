// punch in/out section
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Elements ---
    const punchBtn = document.getElementById("punchBtn");
    const timerDisplay = document.getElementById("timerDisplay");
    const productionDisplay = document.getElementById("productionDisplay");
    const statusMsg = document.getElementById("punchStatusMsg");
    const dateDisplay = document.getElementById("currentDateDisplay");
    
    const daysGrid = document.getElementById("daysGrid");
    const calLabel = document.getElementById("calMonthYear");
    const prevBtn = document.getElementById("prevMonth");
    const nextBtn = document.getElementById("nextMonth");
    
    const modal = document.getElementById("attModal");
    const viewBtn = document.getElementById("viewAttBtn");
    const closeBtn = document.getElementById("attCloseBtn");
    const bottomCloseBtn = document.getElementById("attCloseBtnBottom");
    const tableBody = document.getElementById("attTableBody");

    // --- State ---
    const STORAGE_KEY_DATE = "att_current_date";
    const STORAGE_KEY_START = "att_start_time";
    const STORAGE_KEY_END = "att_end_time";
    const STORAGE_KEY_STATUS = "att_status"; 
    const STORAGE_KEY_HISTORY = "att_history_log"; 

    let timerInterval = null;
    let currentDate = new Date(); 

    // --- 1. Header Time ---
    function updateHeaderTime() {
        const now = new Date();
        if(dateDisplay) {
            dateDisplay.innerText = now.toLocaleString("en-GB", {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', 
                hour: '2-digit', minute: '2-digit'
            });
        }
    }
    setInterval(updateHeaderTime, 1000);
    updateHeaderTime();

    // --- 2. Timer & Punch Logic ---
    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    function pad(n) { return n < 10 ? "0" + n : n; }

    function updateTimerUI(elapsedMs) {
        if(timerDisplay) timerDisplay.innerText = formatTime(elapsedMs);
        if(productionDisplay) productionDisplay.innerText = `Active : ${(elapsedMs / 3600000).toFixed(2)} hrs`;
    }

    function saveToHistory(status, inTime, outTime) {
        const todayKey = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
        let history = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || {};
        
        history[todayKey] = {
            date: todayKey,
            status: status,
            inTime: inTime,
            outTime: outTime
        };
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
        renderCalendar(); 
    }

    function setButtonState(state) {
        punchBtn.classList.remove("mode-out");
        punchBtn.disabled = false;

        if (state === 'new') {
            punchBtn.innerText = "Punch In";
            statusMsg.innerHTML = `<i class="fa-solid fa-fingerprint"></i> Not punched in yet`;
            statusMsg.style.color = "#999";
        } else if (state === 'in') {
            punchBtn.innerText = "Punch Out";
            // No class added, keeps it orange
            statusMsg.innerHTML = `<i class="fa-solid fa-clock"></i> Currently working...`;
            statusMsg.style.color = "#ff6b00";
        } else if (state === 'completed') {
            punchBtn.innerText = "Shift Completed";
            punchBtn.disabled = true; // This triggers the CSS disabled state
            statusMsg.innerHTML = `<i class="fa-solid fa-check-circle"></i> Punch out recorded`;
            statusMsg.style.color = "#2ecc71";
        }
    }

    // Logic to reset day if it's a new date
    function checkAndResetDay() {
        const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
        const today = new Date().toLocaleDateString('en-CA');

        if (savedDate !== today) {
            localStorage.setItem(STORAGE_KEY_DATE, today);
            localStorage.removeItem(STORAGE_KEY_START);
            localStorage.removeItem(STORAGE_KEY_END);
            localStorage.setItem(STORAGE_KEY_STATUS, 'new');
            return 'new';
        }
        return localStorage.getItem(STORAGE_KEY_STATUS) || 'new';
    }

    function startTicker(startTime) {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            updateTimerUI(Date.now() - startTime);
        }, 1000);
    }

    function initPunchSystem() {
        const status = checkAndResetDay();
        const startTime = parseInt(localStorage.getItem(STORAGE_KEY_START));
        const endTime = parseInt(localStorage.getItem(STORAGE_KEY_END));

        setButtonState(status);

        if (status === 'in' && startTime) {
            startTicker(startTime);
        } else if (status === 'completed' && startTime && endTime) {
            updateTimerUI(endTime - startTime);
        } else {
            updateTimerUI(0);
        }
    }

    if(punchBtn) {
        punchBtn.addEventListener("click", () => {
            const status = localStorage.getItem(STORAGE_KEY_STATUS);
            const now = Date.now();
            const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            if (status === 'new') {
                localStorage.setItem(STORAGE_KEY_START, now);
                localStorage.setItem(STORAGE_KEY_STATUS, 'in');
                setButtonState('in');
                startTicker(now);
                saveToHistory('Present', timeStr, '-');
            } 
            else if (status === 'in') {
                localStorage.setItem(STORAGE_KEY_END, now);
                localStorage.setItem(STORAGE_KEY_STATUS, 'completed');
                clearInterval(timerInterval);
                const startT = parseInt(localStorage.getItem(STORAGE_KEY_START));
                updateTimerUI(now - startT);
                setButtonState('completed');
                
                const startObj = new Date(startT);
                const inTimeStr = startObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                saveToHistory('Present', inTimeStr, timeStr);
            }
        });
    }

    // --- 3. Calendar Logic (Fixed) ---
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Label Color Fix happens in CSS, but ensure text is set here
        calLabel.innerText = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
        daysGrid.innerHTML = "";

        const history = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || {};
        
        // 1. Get first day of month (0 = Sunday, 1 = Monday, etc.)
        const firstDayIndex = new Date(year, month, 1).getDay();
        
        // 2. Get number of days in month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 3. Today's Date Key
        const todayKey = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

        // 4. Create Empty Padding Cells
        for (let i = 0; i < firstDayIndex; i++) {
            const div = document.createElement("div");
            div.classList.add("day-cell", "faded"); 
            daysGrid.appendChild(div);
        }

        // 5. Create Actual Days
        for (let i = 1; i <= daysInMonth; i++) {
            const div = document.createElement("div");
            div.classList.add("day-cell");
            div.innerText = i;

            // Construct Key: YYYY-MM-DD
            // Important: Handle Timezone offset by using local parts
            const currentMonthStr = String(month + 1).padStart(2, '0');
            const currentDayStr = String(i).padStart(2, '0');
            const dateKey = `${year}-${currentMonthStr}-${currentDayStr}`;

            if (dateKey === todayKey) div.classList.add("today");
            
            // Check History (ensure exact string match)
            if (history[dateKey]) {
                div.classList.add("present");
            }

            daysGrid.appendChild(div);
        }
    }

    if(prevBtn) prevBtn.addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
    if(nextBtn) nextBtn.addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

    // --- 4. Modal Logic ---
    function loadHistoryTable() {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || {};
        tableBody.innerHTML = "";
        
        const rows = Object.values(history).sort((a,b) => new Date(b.date) - new Date(a.date));

        if(rows.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:#999;">No records found</td></tr>`;
            return;
        }

        rows.forEach(row => {
            const tr = document.createElement("tr");
            let badgeClass = 'status-present'; 
            if (row.status && row.status.toLowerCase().includes('absent')) badgeClass = 'status-absent';

            // Safe date formatting
            const [y, m, d] = row.date.split('-');
            const dateObj = new Date(y, m-1, d); // Construct safely without timezone issues
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            tr.innerHTML = `
                <td>${formattedDate}</td>
                <td><span class="status-pill ${badgeClass}">${row.status}</span></td>
                <td style="font-family:monospace; color:#333;">${row.inTime}</td>
                <td style="font-family:monospace; color:#333;">${row.outTime}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    if(viewBtn) {
        viewBtn.addEventListener("click", () => {
            loadHistoryTable();
            modal.classList.add("show");
        });
    }

    const closeModal = () => modal.classList.remove("show");
    if(closeBtn) closeBtn.addEventListener("click", closeModal);
    if(bottomCloseBtn) bottomCloseBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    // Initialize
    initPunchSystem();
    renderCalendar();
});

// breakmanagement section
document.addEventListener("DOMContentLoaded", () => {
  const BM_LIMITS = {
    lunch: 45, // minutes
    normal: 15, // minutes
  };

  let bmTimerInterval = null;
  let bmStartTime = null;
  let bmIsBreakActive = false;
  let bmUsage = { lunch: 0, normal: 0 };

  const bmEls = {
    timerDisplay: document.getElementById("bmTimerDisplay"),
    btnIn: document.getElementById("bmBtnIn"),
    btnOut: document.getElementById("bmBtnOut"),
    breakSelect: document.getElementById("bmBreakTypeSelect"),
    statusBadge: document.getElementById("bmStatusBadge"),
    limitWarning: document.getElementById("bmLimitWarning"),
    logTable: document.getElementById("bmLogTableBody"),
    emptyState: document.getElementById("bmEmptyState"),
    lunchUsed: document.getElementById("bmLunchUsed"),
    lunchBar: document.getElementById("bmLunchBar"),
    normalUsed: document.getElementById("bmNormalUsed"),
    normalBar: document.getElementById("bmNormalBar"),
    totalTime: document.getElementById("bmTotalTime"),
    remainingTime: document.getElementById("bmRemainingTime"),
  };

  if (bmEls.btnIn) {
    bmEls.btnIn.addEventListener("click", () => {
      bmIsBreakActive = true;
      bmStartTime = Date.now();
      const type = bmEls.breakSelect.value;
      const typeLabel = type === "lunch" ? "Lunch Break" : "Normal Break";

      bmEls.btnIn.style.display = "none";
      bmEls.btnOut.style.display = "flex";
      bmEls.breakSelect.disabled = true;

      bmEls.statusBadge.textContent = `On ${typeLabel}`;
      bmEls.statusBadge.className = "bm-badge bm-badge-primary";

      if (bmTimerInterval) clearInterval(bmTimerInterval);
      bmTimerInterval = setInterval(() => {
        bmUpdateTimerDisplay();
        bmCheckLimits();
      }, 1000);
    });
  }

  if (bmEls.btnOut) {
    bmEls.btnOut.addEventListener("click", () => {
      if (!bmIsBreakActive) return;

      clearInterval(bmTimerInterval);
      const endTime = Date.now();
      const durationSeconds = Math.floor((endTime - bmStartTime) / 1000);
      const type = bmEls.breakSelect.value;

      bmUsage[type] += durationSeconds;
      bmIsBreakActive = false;

      bmEls.btnIn.style.display = "flex";
      bmEls.btnOut.style.display = "none";
      bmEls.breakSelect.disabled = false;

      bmEls.timerDisplay.textContent = "00:00:00";
      bmEls.timerDisplay.style.color = "var(--bm-dark)";
      bmEls.limitWarning.style.display = "none";

      bmEls.statusBadge.textContent = "Not Active";
      bmEls.statusBadge.className = "bm-badge bm-badge-light";

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
      bmEls.timerDisplay.style.color = "var(--bm-danger)";
      bmEls.limitWarning.style.display = "block";
    }
  }

  function bmUpdateProgressStats() {
    const lunchMins = Math.floor(bmUsage.lunch / 60);
    const lunchPct = Math.min(
      (bmUsage.lunch / (BM_LIMITS.lunch * 60)) * 100,
      100,
    );
    bmEls.lunchUsed.textContent = lunchMins;
    bmEls.lunchBar.style.width = `${lunchPct}%`;
    if (lunchPct >= 100)
      bmEls.lunchBar.style.backgroundColor = "var(--bm-danger)";

    const normalMins = Math.floor(bmUsage.normal / 60);
    const normalPct = Math.min(
      (bmUsage.normal / (BM_LIMITS.normal * 60)) * 100,
      100,
    );
    bmEls.normalUsed.textContent = normalMins;
    bmEls.normalBar.style.width = `${normalPct}%`;
    if (normalPct >= 100)
      bmEls.normalBar.style.backgroundColor = "var(--bm-danger)";

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
    if (bmEls.emptyState) bmEls.emptyState.style.display = "none";

    const startDate = new Date(start);
    const endDate = new Date(end);

    const timeStartStr = startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const timeEndStr = endDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const durStr = bmFormatTime(duration);

    const typeLabel = type === "lunch" ? "Lunch Break" : "Normal Break";
    const limitSec = BM_LIMITS[type] * 60;

    let statusHtml = '<span class="bm-badge bm-badge-success">On Time</span>';
    if (duration > limitSec) {
      statusHtml = '<span class="bm-badge bm-badge-danger">Overtime</span>';
    }

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fa-solid ${type === "lunch" ? "fa-utensils" : "fa-mug-hot"}" style="color:var(--bm-text-muted)"></i>
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
    const h = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  }
});