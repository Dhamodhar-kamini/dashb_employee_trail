document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Toggle Mobile Sidebar ---
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            // Simple toggle class for mobile view
            if (sidebar.style.display === 'flex') {
                sidebar.style.display = 'none';
            } else {
                sidebar.style.display = 'flex';
            }
        });
    }

    // --- 2. Chart Configuration ---
    const ctx = document.getElementById('salaryChart');
    if(ctx) {
        const ctx2d = ctx.getContext('2d');

        // Gradient
        let gradient = ctx2d.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(255, 102, 0, 0.25)'); // Orange
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        new Chart(ctx2d, {
            type: 'line',
            data: {
                labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [{
                    label: 'Gross Salary',
                    data: [21000, 21000, 21000, 21000, 21000],
                    borderColor: '#ff6600',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointBackgroundColor: '#000',
                    pointBorderColor: '#ff6600',
                    pointRadius: 4,
                    fill: true,
                    tension: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: '#333' },
                        ticks: { color: '#888' },
                        min: 20000,
                        max: 22000
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#888' }
                    }
                }
            }
        });
    }

    // --- 3. Interaction Functions ---
    window.downloadSlips = function() {
        alert("Downloading payslips for selected financial year...");
    };
});