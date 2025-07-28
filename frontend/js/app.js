/**
 * Main Application File for XumtechBot
 * Handles general UI functionality, navigation, and animations
 */

class App {
    constructor() {
        this.currentSection = 'home';
        this.isScrolling = false;
        this.mobileMenuOpen = false;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeAnimations();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.header = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.sections = document.querySelectorAll('section');
        this.learnMoreBtn = document.getElementById('learnMoreBtn');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Navigation events
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToSection(targetId);
            });
        });

        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Learn more button
        if (this.learnMoreBtn) {
            this.learnMoreBtn.addEventListener('click', () => {
                this.navigateToSection('about');
            });
        }

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.navigateToSection(targetId);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    /**
     * Navigate to a specific section
     */
    navigateToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) return;

        // Update active nav link
        this.updateActiveNavLink(sectionId);

        // Smooth scroll to section
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Update current section
        this.currentSection = sectionId;

        // Close mobile menu if open
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Update active navigation link
     */
    updateActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        if (this.isScrolling) return;

        this.isScrolling = true;
        requestAnimationFrame(() => {
            this.updateHeaderOnScroll();
            this.updateActiveSectionOnScroll();
            this.isScrolling = false;
        });
    }

    /**
     * Update header appearance on scroll
     */
    updateHeaderOnScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }

    /**
     * Update active section based on scroll position
     */
    updateActiveSectionOnScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                const sectionId = section.id;
                if (this.currentSection !== sectionId) {
                    this.currentSection = sectionId;
                    this.updateActiveNavLink(sectionId);
                }
            }
        });
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        this.mobileMenuOpen = true;
        this.header.classList.add('mobile-menu-open');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.mobileMenuOpen = false;
        this.header.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboardNavigation(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }

        // Arrow keys for section navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateWithArrowKeys(e.key);
        }
    }

    /**
     * Navigate sections with arrow keys
     */
    navigateWithArrowKeys(key) {
        const sectionIds = ['home', 'about', 'services', 'contact'];
        const currentIndex = sectionIds.indexOf(this.currentSection);
        
        let nextIndex;
        if (key === 'ArrowDown') {
            nextIndex = Math.min(currentIndex + 1, sectionIds.length - 1);
        } else {
            nextIndex = Math.max(currentIndex - 1, 0);
        }

        if (nextIndex !== currentIndex) {
            this.navigateToSection(sectionIds[nextIndex]);
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * Setup intersection observer for animations
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.service-card, .contact-item, .stat');
        animateElements.forEach(el => observer.observe(el));
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        // Add animation classes to elements
        this.addAnimationClasses();
        
        // Initialize counter animations
        this.initializeCounters();
    }

    /**
     * Add animation classes to elements
     */
    addAnimationClasses() {
        // Service cards
        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Contact items
        document.querySelectorAll('.contact-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });

        // Stats
        document.querySelectorAll('.stat').forEach((stat, index) => {
            stat.style.animationDelay = `${index * 0.1}s`;
        });
    }

    /**
     * Initialize counter animations
     */
    initializeCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    /**
     * Animate counter number
     */
    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const suffix = element.textContent.replace(/\d/g, '');
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    /**
     * Show loading state
     */
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('show');
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('show');
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.showLoading();
            
            // Wait for DOM to be fully loaded
            await new Promise(resolve => {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', resolve);
                } else {
                    resolve();
                }
            });

            // Initialize animations
            this.initializeAnimations();
            
            // Handle initial scroll position
            this.handleScroll();
            
            // App initialized successfully
        } catch (error) {
            this.showNotification('Error initializing application', 'error');
        } finally {
            this.hideLoading();
        }
    }
}

// Create and initialize app instance
const app = new App();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Add additional CSS for animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    /* Header scroll effect */
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    /* Mobile menu styles */
    .header.mobile-menu-open .nav {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        border-top: 1px solid #e2e8f0;
    }

    .header.mobile-menu-open .nav-link {
        padding: 0.75rem 0;
        border-bottom: 1px solid #f1f5f9;
    }

    .header.mobile-menu-open .nav-link:last-child {
        border-bottom: none;
    }

    /* Animation classes */
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    .service-card,
    .contact-item,
    .stat {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Notification animations */
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    /* Smooth transitions */
    .nav-link,
    .btn,
    .service-card,
    .contact-item {
        transition: all 0.3s ease;
    }

    /* Hover effects */
    .service-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .contact-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    /* Loading animation */
    .loading-spinner {
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .header.mobile-menu-open .nav {
            display: flex;
        }
        
        .nav {
            display: none;
        }
    }
`;
document.head.appendChild(additionalStyles); 