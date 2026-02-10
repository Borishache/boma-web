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

    // Progressive Enhancement: Add class to body to enable JS-dependent styles
    document.body.classList.add('js-active');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select specific elements to animate
    const elementsToAnimate = [
        ...document.querySelectorAll('.section-title'),
        ...document.querySelectorAll('.service-card'),
        ...document.querySelectorAll('.portfolio-item'),
        ...document.querySelectorAll('.contact-wrapper'),
        ...document.querySelectorAll('.why-card'),
        document.querySelector('.hero-text') // Added hero-text here instead of separate logic
    ];

    elementsToAnimate.forEach(el => {
        if (el) {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        }
    });

    // Add class for CSS animation control if preferred over inline styles
    // But inline is safer for the initial "hide" without FOUC if CSS isn't perfectly synced.
    // Actually, let's rely on the CSS class 'fade-in-up' defined in style.css which has the animation.
    // We just need to ensure they start invisible.

    // Cleaned up redundant loop used to be here


    // Hero text animation is now handled by the general observer above

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

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const navLinksMobile = document.querySelectorAll('.nav-link, .nav-cta');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            // Toggle body scroll
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinksMobile.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});
