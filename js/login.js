// Cloudflare Turnstile site key
const CLOUDFLARE_SITE_KEY = 'YOUR_CLOUDFLARE_SITE_KEY';

// Initialize Cloudflare Turnstile
function initCloudflare() {
    turnstile.render('#loginForm', {
        sitekey: CLOUDFLARE_SITE_KEY,
        callback: function(token) {
            // Store the token for form submission
            window.cfToken = token;
        }
    });
}

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Show corresponding form
        const tabName = button.dataset.tab;
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
            if (form.id === `${tabName}Form`) {
                form.classList.add('active');
            }
        });
    });
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        // First, verify with Cloudflare
        if (!window.cfToken) {
            showError('Please complete the Cloudflare verification');
            return;
        }

        // Send login request to backend
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CF-Token': window.cfToken
            },
            body: JSON.stringify({ email, password, rememberMe })
        });

        const data = await response.json();

        if (data.requires2FA) {
            // Show 2FA form
            show2FAForm();
        } else if (data.success) {
            // Login successful
            handleSuccessfulLogin(data.token);
        } else {
            showError(data.message || 'Login failed');
        }
    } catch (error) {
        showError('An error occurred during login');
        console.error('Login error:', error);
    }
});

// Handle 2FA form submission
document.getElementById('twoFactorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const code = document.getElementById('twoFactorCode').value;

    try {
        const response = await fetch('/api/auth/verify-2fa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (data.success) {
            handleSuccessfulLogin(data.token);
        } else {
            showError(data.message || '2FA verification failed');
        }
    } catch (error) {
        showError('An error occurred during 2FA verification');
        console.error('2FA error:', error);
    }
});

// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    try {
        // Verify with Cloudflare
        if (!window.cfToken) {
            showError('Please complete the Cloudflare verification');
            return;
        }

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CF-Token': window.cfToken
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            showSuccess('Registration successful! Please check your email to set up 2FA.');
            // Switch to login tab
            document.querySelector('[data-tab="login"]').click();
        } else {
            showError(data.message || 'Registration failed');
        }
    } catch (error) {
        showError('An error occurred during registration');
        console.error('Registration error:', error);
    }
});

// Handle social login
document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const provider = button.classList.contains('google') ? 'google' : 'facebook';

        try {
            // Initialize social login
            const response = await fetch(`/api/auth/${provider}/init`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            // Redirect to provider's login page
            window.location.href = data.authUrl;
        } catch (error) {
            showError(`Failed to initialize ${provider} login`);
            console.error(`${provider} login error:`, error);
        }
    });
});

// Helper functions
function show2FAForm() {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById('twoFactorForm').classList.add('active');
}

function handleSuccessfulLogin(token) {
    // Store the token
    localStorage.setItem('authToken', token);
    
    // Redirect to dashboard
    window.location.href = '/dashboard.html';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const form = document.querySelector('.auth-form.active');
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.querySelector('.auth-form.active');
    form.insertBefore(successDiv, form.firstChild);
    
    setTimeout(() => successDiv.remove(), 5000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initCloudflare();
}); 