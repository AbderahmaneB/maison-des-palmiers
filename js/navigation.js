/* =============================================
   LA MAISON DES PALMIERS - NAVIGATION
   Menu Mobile, Scroll Effects, Active Links
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ÉLÉMENTS DOM
    // ==========================================

    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menu-toggle') || document.querySelector('.navbar-toggle');
    const menuClose = document.getElementById('menu-close') || document.querySelector('.mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu') || document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link, .mobile-menu a');
    const navLinks = document.querySelectorAll('.navbar-link');

    // ==========================================
    // MENU MOBILE
    // ==========================================

    function openMobileMenu() {
        if (!mobileMenu) return;

        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animation d'entrée des liens
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(mobileLinks,
                { opacity: 0, x: 50 },
                {
                    opacity: 1,
                    x: 0,
                    stagger: 0.1,
                    duration: 0.5,
                    delay: 0.3,
                    ease: 'power3.out'
                }
            );
        }
    }

    function closeMobileMenu() {
        if (!mobileMenu) return;

        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', openMobileMenu);
    }

    if (menuClose) {
        menuClose.addEventListener('click', closeMobileMenu);
    }

    // Fermer le menu quand on clique sur un lien
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Fermer en cliquant à l'extérieur
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================

    let lastScrollY = 0;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        // Ajouter/retirer la classe scrolled
        if (scrollY > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Optionnel : Cacher/montrer la navbar au scroll
        // Décommenter si vous voulez ce comportement
        /*
        if (scrollY > lastScrollY && scrollY > 200) {
            navbar?.classList.add('navbar-hidden');
        } else {
            navbar?.classList.remove('navbar-hidden');
        }
        */

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // ==========================================
    // LIENS ACTIFS
    // ==========================================

    function updateActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 150; // Offset pour la navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Desktop links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Mobile links
                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Mettre à jour les liens actifs au scroll
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveLinks();
            });
        }
    });

    // Initial check
    updateActiveLinks();

    // ==========================================
    // SMOOTH SCROLL (Fallback si GSAP non dispo)
    // ==========================================

    if (typeof gsap === 'undefined' || !gsap.plugins?.scrollTo) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    const navHeight = navbar?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==========================================
    // GESTION DES PAGES (Si multi-pages)
    // ==========================================

    function setActivePageLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        document.querySelectorAll('.navbar-link, .mobile-menu-link').forEach(link => {
            const linkPage = link.getAttribute('href')?.split('/').pop();

            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Appeler si on est sur une page autre que index
    if (!window.location.hash) {
        setActivePageLink();
    }

});

// ==========================================
// EXPORT API
// ==========================================

window.MaisonNav = {
    openMenu: () => document.querySelector('.mobile-menu')?.classList.add('active'),
    closeMenu: () => document.querySelector('.mobile-menu')?.classList.remove('active'),
    scrollTo: (selector) => {
        const target = document.querySelector(selector);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
};
