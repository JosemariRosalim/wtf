document.addEventListener('DOMContentLoaded', function() {
    // Functions to manage loading overlay
    function showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    function hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 800); // Short delay to ensure the dashboard is rendered
        }
    }

    // Show loading overlay immediately
    showLoadingOverlay();

    // Check if user is logged in
    if (!isLoggedIn()) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Load user data
    const userData = getUserData();
    
    // Display user information
    displayUserInfo(userData);
    
    // Set up logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Show loading overlay for logout
            showLoadingOverlay();
            // Update the loading text
            const loadingText = document.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = 'Logging out...';
            }
            // Proceed with logout
            logout();
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
        });
    }

    // Add fade-in animation to profile sections
    const profileSections = document.querySelectorAll('.card-body > div');
    profileSections.forEach(section => {
        section.classList.add('fade-in');
    });

    // Hide loading overlay when everything is loaded
    hideLoadingOverlay();
});

// Function to check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Function to get user data from local storage
function getUserData() {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        return JSON.parse(savedUserData);
    }
    
    // Default user data if nothing in storage
    return {
        fullName: 'John Doe',
        email: 'user@gmail.com',
        age: 28,
        gender: 'Male',
        memberSince: 'August 2023'
    };
}

// Function to display user information on the dashboard
function displayUserInfo(userData) {
    // Update sidebar user info
    const userFullNameElement = document.getElementById('userFullName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (userFullNameElement) {
        userFullNameElement.textContent = userData.fullName;
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = userData.email;
    }
    
    // Update profile information
    document.getElementById('profileName').textContent = userData.fullName;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('profileAge').textContent = userData.age;
    document.getElementById('profileGender').textContent = userData.gender;
    document.getElementById('profileMemberSince').textContent = userData.memberSince;
    
    // Update page title with user name
    document.title = `${userData.fullName}'s Dashboard`;
}

// Function to log out user
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
} 