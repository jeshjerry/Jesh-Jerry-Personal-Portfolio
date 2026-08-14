// Canvas WebGL-like dot grid logic
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let width, height;
    const dots = [];
    const spacing = 32;
    let mouse = { x: -1000, y: -1000 };
    
    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        dots.length = 0;
        
        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                dots.push({ x, y, baseAlpha: 0.1 });
            }
        }
    }
    
    window.addEventListener('resize', init);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    function animate() {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);
        
        dots.forEach(dot => {
            const dx = mouse.x - dot.x;
            const dy = mouse.y - dot.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            let alpha = dot.baseAlpha;
            let radius = 1.5;
            
            if (dist < 150) {
                alpha = Math.min(0.8, dot.baseAlpha + (150 - dist) / 150 * 0.5);
                radius = 2;
            }
            
            ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}

// Intersection observer for reveal animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// Navigation active state logic with smooth scroll tracking
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-primary', 'border-b-2', 'border-primary', 'pb-1');
        link.classList.add('text-on-surface-variant');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('text-primary', 'border-b-2', 'border-primary', 'pb-1');
            link.classList.remove('text-on-surface-variant');
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

// Contact Form Submission Handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
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
