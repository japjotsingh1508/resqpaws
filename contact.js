document.addEventListener('DOMContentLoaded', function() {
    // Contact form functionality
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--error-color)';
                    isValid = false;
                    
                    // Remove error highlight after 2 seconds
                    setTimeout(() => {
                        field.style.borderColor = '';
                    }, 2000);
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Here you would typically send the data to your server
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    // Volunteer form functionality
    const volunteerForms = document.querySelectorAll('.volunteer-form, .newsletter-form');
    
    volunteerForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const nameInput = this.querySelector('input[type="text"]');
            
            if (emailInput && !emailInput.value.trim()) {
                alert('Please enter your email address');
                return;
            }
            
            if (nameInput && !nameInput.value.trim()) {
                alert('Please enter your name');
                return;
            }
            
            // Here you would typically send the data to your server
            alert('Thank you for your interest! We will contact you with more information.');
            this.reset();
        });
    });
    
    // Social share buttons
    const shareButtons = document.querySelectorAll('.btn-share');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('facebook') ? 'Facebook' :
                            this.classList.contains('twitter') ? 'Twitter' : 'WhatsApp';
            
            alert(`In a real application, this would share on ${platform}`);
        });
    });
});