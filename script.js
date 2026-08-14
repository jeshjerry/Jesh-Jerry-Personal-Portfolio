document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('span');
            if (navLinks.classList.contains('active')) {
                icon.textContent = 'close';
            } else {
                icon.textContent = 'menu';
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.querySelector('span').textContent = 'menu';
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll event to change navbar appearance
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Contact Form Submission Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const messageInput = document.getElementById('contact-message');
            const submitBtn = contactForm.querySelector('.submit-btn');
            
            // Simple validation
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showToast('Please fill in all fields.', 'error');
                return;
            }
            
            // Basic email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }
            
            // Disable button and show sending state
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Prepare form data
            const formData = new URLSearchParams(new FormData(contactForm));
            
            // Submit form to Google Forms
            fetch(contactForm.action, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            })
            .then(() => {
                showToast('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('Error submitting form:', error);
                showToast('Something went wrong. Please try again.', 'error');
            })
            .finally(() => {
                // Re-enable button and restore original text
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    function showToast(message, type = 'success') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        
        const icon = type === 'success' ? 'check_circle' : 'error';
        toast.innerHTML = `
            <span class="material-symbols-outlined">${icon}</span>
            <p>${message}</p>
        `;
        
        document.body.appendChild(toast);
        
        // Trigger show class after a small timeout for transition
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }
});
