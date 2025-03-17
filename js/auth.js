// Form validation and submission handling
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
            overlay.classList.remove('active');
        }
    }

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // Basic validation
            if (!email || !password) {
                showAlert('Please fill in all fields', 'danger');
                return;
            }

            // Get stored accounts from localStorage
            const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
            
            // Check if it's the default account or a registered account
            const isDefaultAccount = email === 'user@gmail.com' && password === 'wtf143';
            const registeredAccount = accounts.find(account => account.email === email && account.password === password);

            if (isDefaultAccount || registeredAccount) {
                // Show loading overlay first
                showLoadingOverlay();
                
                // Store user data
                const userData = isDefaultAccount ? {
                    fullName: 'John Doe',
                    email: 'user@gmail.com',
                    age: 28,
                    gender: 'Male',
                    memberSince: 'August 2023'
                } : {
                    fullName: registeredAccount.fullName,
                    email: registeredAccount.email,
                    age: registeredAccount.age || '',
                    gender: registeredAccount.gender || 'Not specified',
                    memberSince: registeredAccount.memberSince
                };
                
                // Save login state and user data
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Show success message and redirect
                showLoginSuccess();
            } else {
                showAlert('Invalid email or password', 'danger');
            }
        });
    }

    // Signup form handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Get additional fields if they exist
            const age = document.getElementById('age') ? document.getElementById('age').value : '';
            const genderSelect = document.getElementById('gender');
            const gender = genderSelect ? genderSelect.value : 'Not specified';
            
            const terms = document.getElementById('terms').checked;

            // Basic validation
            if (!fullName || !email || !password || !confirmPassword) {
                showAlert('Please fill in all required fields', 'danger');
                return;
            }

            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'danger');
                return;
            }
            
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters long', 'danger');
                return;
            }

            if (!terms) {
                showAlert('Please agree to the Terms & Conditions', 'danger');
                return;
            }
            
            // Email validation
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'danger');
                return;
            }

            // Get existing accounts
            const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');

            // Check if email already exists
            if (accounts.some(account => account.email === email) || email === 'user@gmail.com') {
                showAlert('This email is already registered. Please use a different email.', 'danger');
                return;
            }

            // Show loading overlay first
            showLoadingOverlay();

            // Create user data object
            const userData = {
                fullName: fullName,
                email: email,
                password: password, // In a real app, this should be hashed
                age: age,
                gender: gender,
                memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            };
            
            // Add new account to accounts array
            accounts.push(userData);
            localStorage.setItem('accounts', JSON.stringify(accounts));
            
            // Save login state and user data (without password)
            const userDataWithoutPassword = { ...userData };
            delete userDataWithoutPassword.password;
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(userDataWithoutPassword));
            
            // For debugging
            console.log('Account created:', userDataWithoutPassword);
            
            // Show success message and redirect
            showSignupSuccess();
        });
    }
});

// Helper function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Helper function to show alerts
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Check if there's a dedicated alerts container
    const alertsContainer = document.getElementById('formAlerts');
    if (alertsContainer) {
        alertsContainer.innerHTML = ''; // Clear previous alerts
        alertsContainer.appendChild(alertDiv);
    } else {
        // Fall back to inserting before the form
        const form = document.querySelector('form');
        form.insertBefore(alertDiv, form.firstChild);
    }

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Show login success and redirect
function showLoginSuccess() {
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
    submitButton.disabled = true;

    // Show success message
    showAlert('Login successful! Redirecting...', 'success');

    // Redirect to dashboard with a delay to show loading animation
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

// Show signup success and redirect
function showSignupSuccess() {
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating account...';
    submitButton.disabled = true;

    // Show success message
    showAlert('Account created successfully! Redirecting to dashboard...', 'success');

    // Redirect to dashboard with a delay to show loading animation
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
} 