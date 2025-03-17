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
            }, 500);
        }
    }

    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });

    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Counter animation for statistics
    function startCounters() {
        const counters = document.querySelectorAll('.counting');
        const speed = 200;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            let count = 0;
            const inc = target / speed;
            const updateCount = () => {
                if (count < target) {
                    count += inc;
                    counter.textContent = Math.floor(count);
                    setTimeout(updateCount, 1);
                } else {
                    counter.textContent = target;
                }
            };
            updateCount();
        });
    }

    // Start counters when they come into view
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    // Add navigation transition animations
    document.querySelectorAll('a:not([href^="#"])').forEach(link => {
        // Skip links that trigger modals or toggle functionality
        if (link.hasAttribute('data-bs-toggle') || link.hasAttribute('data-bs-target')) {
            return;
        }
        
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip links that open in new tabs or external links
            if (this.target === '_blank' || href.startsWith('http') || 
                href.startsWith('//') || href.startsWith('tel:') || 
                href.startsWith('mailto:') || !href) {
                return;
            }
            
            e.preventDefault();
            
            // Show loading overlay
            showLoadingOverlay();
            
            // Update loading text based on the target page
            const loadingText = document.querySelector('.loading-text');
            if (loadingText) {
                if (href.includes('login')) {
                    loadingText.textContent = 'Going to login...';
                } else if (href.includes('signup')) {
                    loadingText.textContent = 'Going to sign up...';
                } else if (href.includes('dashboard')) {
                    loadingText.textContent = 'Loading dashboard...';
                } else {
                    loadingText.textContent = 'Loading, please wait...';
                }
            }
            
            // Navigate after a short delay
            setTimeout(() => {
                window.location.href = href;
            }, 800);
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Check if user is logged in and update navigation
    updateNavigation();
    
    // Add scroll event for navbar background change
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('bg-dark');
            navbar.classList.remove('bg-transparent');
        } else if (navbar) {
            navbar.classList.remove('bg-dark');
            navbar.classList.add('bg-transparent');
        }
    });

    // Floating animation for cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach(card => {
        const randomDelay = Math.random() * 2;
        card.style.animationDelay = `${randomDelay}s`;
    });

    // Hover effect for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Listen for beforeunload event to show loading on refresh
    window.addEventListener('beforeunload', function() {
        // Only show loading if we're staying on the same domain
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    });
});

// Function to update navigation based on login status
function updateNavigation() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navbarNav = document.getElementById('navbarNav');
    
    if (navbarNav && isLoggedIn) {
        // Find login and signup links
        const loginLink = document.querySelector('a[href="login.html"]');
        const signupLink = document.querySelector('a[href="signup.html"]');
        
        // Create dashboard link
        const dashboardLink = document.createElement('a');
        dashboardLink.href = 'dashboard.html';
        dashboardLink.className = 'nav-link';
        dashboardLink.textContent = 'Dashboard';
        
        // If links exist, replace them
        if (loginLink && loginLink.parentElement) {
            loginLink.parentElement.innerHTML = '';
            loginLink.parentElement.appendChild(dashboardLink);
        }
        
        if (signupLink && signupLink.parentElement) {
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.className = 'nav-link';
            logoutLink.textContent = 'Logout';
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Show loading overlay
                const loadingOverlay = document.getElementById('loadingOverlay');
                if (loadingOverlay) {
                    loadingOverlay.classList.add('active');
                    // Update loading text
                    const loadingText = document.querySelector('.loading-text');
                    if (loadingText) {
                        loadingText.textContent = 'Logging out...';
                    }
                }
                
                // Remove user data
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userData');
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            });
            
            signupLink.parentElement.innerHTML = '';
            signupLink.parentElement.appendChild(logoutLink);
        }
    }
} 