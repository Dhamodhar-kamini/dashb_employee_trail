document.addEventListener('DOMContentLoaded', () => {

    // --- Shift Configuration ---
    const SHIFT_START_HR = 10; // 10:00 AM
    const SHIFT_END_HR = 19;   // 07:00 PM
    const TOTAL_HOURS = SHIFT_END_HR - SHIFT_START_HR; // 9 hours span

    // Break Slots (24h format)
    const LUNCH_START = 13.00; // 1:00 PM
    const LUNCH_END = 13.75;   // 1:45 PM (45 mins = 0.75 hrs)
    const TEA_START = 16.75;   // 4:45 PM
    const TEA_END = 17.00;     // 5:00 PM

    // --- State ---
    let state = 'OUT'; // OUT, WORK, BREAK_AUTO, BREAK_MANUAL
    let startTime = null;
    let timerInterval = null;
    
    // Counters
    let workSecs = 0;
    let breakSecs = 0;

    // --- DOM ---
    const els = {
        timer: document.getElementById('timerDisplay'),
        btnPunch: document.getElementById('btnPunch'),
        btnBreak: document.getElementById('btnBreak'),
        todayVal: document.getElementById('todayVal'),
        breakVal: document.getElementById('breakVal'),
        track: document.getElementById('timelineTrack'),
        log: document.getElementById('logTableBody'),
        barToday: document.getElementById('barToday'),
        barBreak: document.getElementById('barBreak'),
        shiftText: document.getElementById('shiftText'),
        shiftDot: document.getElementById('shiftDot')
    };

    // --- 1. Init Shift Check ---
    function checkShiftValidity() {
        const today = new Date();
        const day = today.getDay(); // 0=Sun, 6=Sat
        const date = today.getDate();
        
        let isHoliday = false;

        // Saturday Logic (2nd & 4th are holidays)
        if (day === 6) {
            const weekNum = Math.ceil(date / 7);
            if (weekNum === 2 || weekNum === 4) isHoliday = true;
        } 
        // Sunday Logic
        else if (day === 0) {
            isHoliday = true;
        }

        if (isHoliday) {
            els.shiftText.innerText = "Holiday (Off)";
            els.shiftDot.className = "dot-status red";
            els.btnPunch.disabled = true;
            els.btnPunch.innerText = "Holiday";
        } else {
            els.shiftText.innerText = "Working Day (10:00 - 19:00)";
            els.shiftDot.className = "dot-status green";
        }
    }

    // --- 2. Action Handlers ---
    window.togglePunch = function() {
        if (state === 'OUT') {
            // Check Time (Optional: Only allow after 10am?)
            // For now, we allow punch anytime for testing
            state = 'WORK';
            startTime = new Date();
            
            // UI
            els.btnPunch.innerHTML = '<i class="fa-solid fa-power-off"></i> Punch Out';
            els.btnPunch.classList.add('punched-in');
            addLog("Checked In", "Shift Started");
            
            startTicker();
        } else {
            // Stop
            clearInterval(timerInterval);
            state = 'OUT';
            els.btnPunch.innerHTML = '<i class="fa-solid fa-fingerprint"></i> Punch In';
            els.btnPunch.classList.remove('punched-in');
            addLog("Checked Out", "Shift Ended");
        }
    };

    window.manualBreakToggle = function() {
        if (state === 'WORK') {
            state = 'BREAK_MANUAL';
            els.btnBreak.classList.add('active');
            addLog("Manual Break", "Paused");
        } else if (state === 'BREAK_MANUAL') {
            state = 'WORK';
            els.btnBreak.classList.remove('active');
            addLog("Work Resumed", "Manual Break Ended");
        }
    };

    // --- 3. Main Loop (Runs every second) ---
    function startTicker() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const now = new Date();
            const currentDecimalTime = now.getHours() + (now.getMinutes() / 60);

            // AUTO BREAK DETECTION
            const isLunch = currentDecimalTime >= LUNCH_START && currentDecimalTime < LUNCH_END;
            const isTea = currentDecimalTime >= TEA_START && currentDecimalTime < TEA_END;

            if (isLunch || isTea) {
                // If we were working, switch to auto break mode
                if (state === 'WORK') {
                    state = 'BREAK_AUTO';
                    addLog("Auto Break", isLunch ? "Lunch Time (1-1:45)" : "Tea Time (4:45-5)");
                }
            } else {
                // If break time is over, resume work automatically
                if (state === 'BREAK_AUTO') {
                    state = 'WORK';
                    addLog("Auto Resume", "Break Slot Ended");
                }
            }

            // --- Time Accumulation ---
            if (state === 'WORK') {
                workSecs++;
                els.timer.innerText = formatHHMMSS(workSecs);
                updateStats();
                renderLiveSegment(currentDecimalTime, 'work');
            } 
            else if (state.includes('BREAK')) {
                breakSecs++;
                updateStats();
                renderLiveSegment(currentDecimalTime, 'break');
            }

        }, 1000);
    }

    // --- 4. Render Logic ---
    function updateStats() {
        // Today Hours
        const hrs = workSecs / 3600;
        els.todayVal.innerText = hrs.toFixed(2);
        els.barToday.style.width = Math.min((hrs / 8) * 100, 100) + '%'; // 8h active target

        // Break Mins
        const mins = Math.floor(breakSecs / 60);
        els.breakVal.innerText = mins + 'm';
        els.barBreak.style.width = Math.min((mins / 60) * 100, 100) + '%';
    }

    function renderLiveSegment(currentTimeDec, type) {
        // Calculate position based on 10am start
        // Map: 10am -> 0%, 19pm -> 100%
        const percent = ((currentTimeDec - SHIFT_START_HR) / TOTAL_HOURS) * 100;
        
        // This is a simplified "Growing Bar" visualization
        // In a full app, you'd push segments array to prevent overlapping divs
        // Here we just append small slices for the effect
        const seg = document.createElement('div');
        seg.className = `segment ${type}`;
        seg.style.left = percent + '%';
        seg.style.width = '0.5%'; // Tiny slice added every update
        els.track.appendChild(seg);
    }

    // --- Helpers ---
    function formatHHMMSS(s) {
        const h = Math.floor(s / 3600).toString().padStart(2,'0');
        const m = Math.floor((s % 3600) / 60).toString().padStart(2,'0');
        const sec = (s % 60).toString().padStart(2,'0');
        return `${h}:${m}:${sec}`;
    }

    function addLog(status, note) {
        const row = `<tr><td>${new Date().toLocaleTimeString()}</td><td><strong>${status}</strong></td><td>${note}</td></tr>`;
        els.log.innerHTML = row + els.log.innerHTML;
    }

    checkShiftValidity();
});