document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const cursor = document.querySelector('.cursor');

    // Only verify cursor exists to avoid errors on mobile if hidden
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Cursor Hover Effects
        const hoverElements = document.querySelectorAll('a, button, .nav-cta, .floating-shape');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
                cursor.style.opacity = '0.5';
                cursor.style.backgroundColor = '#fff'; // Invert effect hint
                cursor.style.mixBlendMode = 'difference';
            });

            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.opacity = '1';
                cursor.style.backgroundColor = 'var(--primary-blue)';
                cursor.style.mixBlendMode = 'multiply';
            });
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    // const animateElements = document.querySelectorAll('.section-title, .service-card, .portfolio-item, .contact-wrapper, .hero-visua'); // logic to select elements

    // Select specific elements to animate if they exist
    const elementsToAnimate = [
        ...document.querySelectorAll('.section-title'),
        ...document.querySelectorAll('.service-card'),
        ...document.querySelectorAll('.portfolio-item'),
        ...document.querySelectorAll('.contact-wrapper'),
        ...document.querySelectorAll('.why-card')
    ];

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0'; // Hide initially
        el.style.transform = 'translateY(20px)'; // Initial offset matching keyframe
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; // Ensure styling
        observer.observe(el);
    });

    // Add class for CSS animation control if preferred over inline styles
    // But inline is safer for the initial "hide" without FOUC if CSS isn't perfectly synced.
    // Actually, let's rely on the CSS class 'fade-in-up' defined in style.css which has the animation.
    // We just need to ensure they start invisible.

    // Cleaned up redundant loop used to be here


    // Smooth Entrance Animation for Hero Text
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(30px)';
        heroText.style.transition = 'opacity 1s ease-out, transform 1s ease-out';

        setTimeout(() => {
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 100);
    }

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: "-100px 0px -50% 0px" // Adjust for header height and center focus
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });
});
