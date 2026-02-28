// Database
const userDatabase = {};

// DOM Elements
const modal = document.getElementById('leaveModal');
const empNameIn = document.getElementById('empName');
const leaveTypeIn = document.getElementById('leaveType');
const fromDateIn = document.getElementById('fromDate');
const toDateIn = document.getElementById('toDate');
const numDaysIn = document.getElementById('numDays');
const balanceIn = document.getElementById('balance');
const toast = document.getElementById('customToast');
const toastMsg = document.getElementById('toastMsg');

// --- 1. Modal Functions ---
function openModal() { modal.classList.add('active'); }
function closeModal() { modal.classList.remove('active'); resetForm(); }

// --- 2. Toast Notification Function ---
// type = 'error' (default) or 'success'
function showToast(message, type = 'error') {
    toastMsg.innerText = message;
    
    if(type === 'success') {
        toast.classList.add('success');
        toast.querySelector('i').className = "fa-solid fa-circle-check";
    } else {
        toast.classList.remove('success');
        toast.querySelector('i').className = "fa-solid fa-circle-exclamation";
    }

    toast.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- 3. User Balance Logic ---
function checkUserBalance() {
    const rawName = empNameIn.value.trim();
    const type = leaveTypeIn.value;
    
    if (!rawName) { balanceIn.value = "-"; return; }
    
    const userKey = rawName.toLowerCase();

    // Auto-create user if not exists
    if (!userDatabase[userKey]) {
        userDatabase[userKey] = { medical: 12, casual: 12 };
    }

    if (type) {
        balanceIn.value = userDatabase[userKey][type];
    }
}

// --- 4. Date Logic (The Fix) ---
function calculateDuration() {
    // Reset error styles
    toDateIn.classList.remove('input-error');

    // Only calc if both dates are picked
    if (fromDateIn.value && toDateIn.value) {
        
        // Create Date objects (set time to midnight to compare just dates)
        const start = new Date(fromDateIn.value);
        start.setHours(0,0,0,0);
        
        const end = new Date(toDateIn.value);
        end.setHours(0,0,0,0);

        // Validation: End date BEFORE Start date
        if (end.getTime() < start.getTime()) {
            showToast("End date cannot be before Start date");
            
            // Visual feedback
            toDateIn.classList.add('input-error');
            toDateIn.value = ""; // Clear invalid date
            numDaysIn.value = 0;
            return;
        }

        // Calculate days (Inclusive logic: 1st to 1st = 1 day)
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        numDaysIn.value = diffDays + 1;
    } else {
        numDaysIn.value = 0;
    }
}

// --- 5. Submit Logic ---
function submitLeave() {
    const rawName = empNameIn.value.trim();
    const type = leaveTypeIn.value;
    const reqDays = parseInt(numDaysIn.value);

    // Basic Validation
    if (!rawName || !type || !fromDateIn.value || !toDateIn.value || reqDays <= 0) {
        showToast("Please fill all required fields correctly.");
        return;
    }

    const userKey = rawName.toLowerCase();
    const currentBalance = userDatabase[userKey][type];

    // Balance Check
    if (reqDays > currentBalance) {
        showToast(`Insufficient Balance! You only have ${currentBalance} leaves.`);
        return;
    }

    // Success
    userDatabase[userKey][type] = currentBalance - reqDays;
    showToast(`Success! Approved ${reqDays} days.`, 'success');
    
    // Delay close slightly so user sees success message
    setTimeout(() => { closeModal(); }, 1500);
}

function resetForm() {
    document.getElementById('leaveForm').reset();
    balanceIn.value = "-";
    numDaysIn.value = "0";
    toDateIn.classList.remove('input-error');
}