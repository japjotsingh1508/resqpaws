document.addEventListener('DOMContentLoaded', function() {
    // Auth modal elements
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const authModal = document.getElementById('auth-modal');
    const closeAuth = document.getElementById('close-auth');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    // Show auth modal
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Switch to signup tab
            authTabs.forEach(tab => tab.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            document.querySelector('.auth-tab[data-tab="signup"]').classList.add('active');
            document.getElementById('signup-form').classList.add('active');
        });
    }
    
    // Close auth modal
    if (closeAuth) {
        closeAuth.addEventListener('click', function() {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Click outside modal to close
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Switch between login and signup tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${tabName}-form`).classList.add('active');
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Simple validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Here you would typically send the data to your server
            // For demo purposes, we'll just show a success message
            alert('Login successful! Redirecting to dashboard...');
            authModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset form
            loginForm.reset();
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            const agreeTerms = document.getElementById('agree-terms').checked;
            
            // Validation
            if (!name || !email || !phone || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!agreeTerms) {
                alert('You must agree to the terms and conditions');
                return;
            }
            
            // Here you would typically send the data to your server
            // For demo purposes, we'll just show a success message
            alert('Account created successfully! You can now login.');
            
            // Switch to login tab
            authTabs.forEach(tab => tab.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
            document.getElementById('login-form').classList.add('active');
            
            // Reset form
            signupForm.reset();
        });
    }
    
    // Forgot password link
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            const email = prompt('Please enter your email address to reset your password:');
            
            if (email) {
                // Here you would typically send a password reset email
                alert(`Password reset instructions have been sent to ${email}`);
            }
        });
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert(`In a real application, this would redirect to ${this.textContent.trim()} login`);
        });
    });
});