/* =============================================
   LA MAISON DES PALMIERS - ANIMATIONS
   Simple & Fonctionnel
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // LOADER
    // ==========================================

    const loader = document.getElementById('loader');

    if (loader) {
        // Attendre que la barre se remplisse puis masquer
        setTimeout(() => {
            loader.classList.add('hidden');
            animateHero();
        }, 2400);

        // Supprimer du DOM après la transition
        setTimeout(() => {
            if (loader.parentNode) {
                loader.remove();
            }
        }, 3000);
    } else {
        animateHero();
    }

    // ==========================================
    // HERO ANIMATION
    // ==========================================

    function animateHero() {
        const heroElements = document.querySelectorAll('.hero-element');
        const heroBg = document.querySelector('.hero-bg');

        heroElements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 150);
        });

        if (heroBg) {
            setTimeout(() => {
                heroBg.classList.add('loaded');
            }, 100);
        }

        // Initialiser le scroll reveal
        initScrollReveal();
    }

    // ==========================================
    // SCROLL REVEAL
    // ==========================================

    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');

        if (!reveals.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Délai progressif pour un effet en cascade
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 50);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    }

    // ==========================================
    // NAVBAR SCROLL
    // ==========================================

    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (navbar) {
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        lastScroll = currentScroll;
    });

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar?.offsetHeight || 80;
                const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});
