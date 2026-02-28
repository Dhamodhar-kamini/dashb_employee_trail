document.getElementById('loginForm').addEventListener('submit', function(e) {
    // Prevent the form from reloading the page
    e.preventDefault();
    
    // Redirect to user.html
    window.location.href = '../employee_page/user.html';
});