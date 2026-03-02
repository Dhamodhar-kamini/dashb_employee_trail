document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Select Elements ---
    const formModal = document.getElementById('lmLeaveModal');
    const successModal = document.getElementById('lmSuccessModal');
    
    // Select the Trigger Button (Using the class from your HTML)
    const openBtn = document.querySelector('.btn-trigger');

    // Close Buttons
    const closeBtn = document.getElementById('lmCloseBtn');
    const cancelBtn = document.getElementById('lmCancelBtn');
    const submitBtn = document.getElementById('lmSubmitBtn');
    const successCloseBtn = document.getElementById('lmSuccessCloseBtn');

    // Form Inputs
    const empName = document.getElementById('lmEmpName');
    const leaveType = document.getElementById('lmLeaveType');
    const fromDate = document.getElementById('lmFromDate');
    const toDate = document.getElementById('lmToDate');
    const numDays = document.getElementById('lmNumDays');
    const balanceDisplay = document.getElementById('lmBalance');
    const reason = document.getElementById('lmReason');

    // Fake Database
    const leaveDatabase = {
        'casual': 12,
        'medical': 10,
        'nopay': 99
    };

    // --- 2. Open/Close Logic ---

    // Open Form Modal
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            formModal.classList.add('active');
        });
    } else {
        console.error("Apply Leave button not found. Check class .btn-trigger");
    }

    // Close Form Modal
    const closeFormModal = () => {
        formModal.classList.remove('active');
        // Reset form
        document.getElementById('lmLeaveForm').reset();
        numDays.value = "0";
        balanceDisplay.value = "-";
    };

    if(closeBtn) closeBtn.addEventListener('click', closeFormModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeFormModal);

    // Close Success Modal
    if(successCloseBtn) {
        successCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === formModal) closeFormModal();
        if (e.target === successModal) successModal.classList.remove('active');
    });

    // --- 3. Calculation Logic ---
    const calculateLeave = () => {
        const type = leaveType.value;
        const start = new Date(fromDate.value);
        const end = new Date(toDate.value);

        // Update Balance
        if(type && leaveDatabase[type]) {
            balanceDisplay.value = leaveDatabase[type];
        } else {
            balanceDisplay.value = "-";
        }

        // Calculate Days
        if (fromDate.value && toDate.value) {
            if (end < start) {
                numDays.value = "Invalid";
                return;
            }
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
            numDays.value = diffDays;
        } else {
            numDays.value = "0";
        }
    };

    if(leaveType) leaveType.addEventListener('change', calculateLeave);
    if(fromDate) fromDate.addEventListener('change', calculateLeave);
    if(toDate) toDate.addEventListener('change', calculateLeave);

    // --- 4. Submit Logic ---
    if(submitBtn) {
        submitBtn.addEventListener('click', () => {
            const days = parseInt(numDays.value);
            const currentBal = parseInt(balanceDisplay.value);
            const name = empName.value.trim();
            const reasonText = reason.value.trim();

            // Validation
            if(!name || !leaveType.value || !fromDate.value || !toDate.value || !reasonText) {
                alert("Please fill all required fields");
                return;
            }

            if(isNaN(days) || days <= 0) {
                alert("Invalid date range");
                return;
            }

            if(currentBal !== 99 && days > currentBal) {
                alert("Insufficient leave balance!");
                return;
            }

            // --- SUCCESS ACTION ---
            
            // 1. Close Form
            formModal.classList.remove('active');

            // 2. Open Success Modal
            successModal.classList.add('active');
            
            // 3. Update Fake DB
            if(leaveDatabase[leaveType.value] !== 99) {
                leaveDatabase[leaveType.value] -= days;
            }
            
            // 4. Reset form (optional delay)
            setTimeout(() => {
                document.getElementById('lmLeaveForm').reset();
                numDays.value = "0";
                balanceDisplay.value = "-";
            }, 500);
        });
    }
});