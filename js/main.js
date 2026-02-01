/* =============================================
   LA MAISON DES PALMIERS - MAIN JS
   Point d'entrée principal
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // INITIALISATION DES ICÔNES (Lucide)
    // ==========================================

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================
    // WHATSAPP LINKS
    // ==========================================

    function initWhatsAppLinks() {
        // Trouver tous les liens WhatsApp et les mettre à jour avec le bon numéro
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');

        whatsappLinks.forEach(link => {
            // Récupérer le message existant ou utiliser le défaut
            const url = new URL(link.href);
            const existingMessage = url.searchParams.get('text') || '';

            // Si CONFIG est disponible, utiliser le numéro de config
            if (typeof CONFIG !== 'undefined' && CONFIG.contact.whatsapp) {
                const newUrl = `https://wa.me/${CONFIG.contact.whatsapp}`;
                if (existingMessage) {
                    link.href = `${newUrl}?text=${encodeURIComponent(existingMessage)}`;
                } else {
                    link.href = newUrl;
                }
            }
        });
    }

    // ==========================================
    // GESTION DU PANIER (Futur e-commerce)
    // ==========================================

    const Cart = {
        items: [],

        init() {
            // Charger le panier depuis localStorage
            const saved = localStorage.getItem('mdp_cart');
            if (saved) {
                this.items = JSON.parse(saved);
                this.updateUI();
            }
        },

        add(product) {
            const existing = this.items.find(item => item.id === product.id);
            if (existing) {
                existing.quantity++;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
            this.save();
            this.updateUI();
            this.showNotification(`${product.name} ajouté au panier`);
        },

        remove(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.save();
            this.updateUI();
        },

        updateQuantity(productId, quantity) {
            const item = this.items.find(item => item.id === productId);
            if (item) {
                item.quantity = Math.max(0, quantity);
                if (item.quantity === 0) {
                    this.remove(productId);
                } else {
                    this.save();
                    this.updateUI();
                }
            }
        },

        getTotal() {
            return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        getCount() {
            return this.items.reduce((count, item) => count + item.quantity, 0);
        },

        save() {
            localStorage.setItem('mdp_cart', JSON.stringify(this.items));
        },

        clear() {
            this.items = [];
            this.save();
            this.updateUI();
        },

        updateUI() {
            // Mettre à jour le compteur du panier
            const cartCount = document.querySelectorAll('.cart-count, [data-cart-count]');
            cartCount.forEach(el => {
                el.textContent = this.getCount();
            });

            // Mettre à jour le total
            const cartTotal = document.querySelectorAll('.cart-total, [data-cart-total]');
            cartTotal.forEach(el => {
                el.textContent = formatPrice ? formatPrice(this.getTotal()) : `${this.getTotal()} MAD`;
            });
        },

        showNotification(message) {
            // Créer une notification toast
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `
                <span>${message}</span>
            `;
            toast.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 30px;
                background: var(--charcoal, #1A1A1A);
                color: var(--ivory, #F9F8F6);
                padding: 16px 24px;
                font-size: 14px;
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
            `;

            document.body.appendChild(toast);

            // Animer l'entrée
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });

            // Supprimer après 3 secondes
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },

        // Générer le message WhatsApp avec le contenu du panier
        getWhatsAppMessage() {
            if (this.items.length === 0) return 'Bonjour, je souhaite passer une commande';

            let message = 'Bonjour, je souhaite commander:\n\n';
            this.items.forEach(item => {
                message += `• ${item.name} x${item.quantity} - ${item.price * item.quantity} MAD\n`;
            });
            message += `\nTotal: ${this.getTotal()} MAD`;

            return message;
        }
    };

    // Initialiser le panier
    Cart.init();

    // Exposer le panier globalement
    window.MaisonCart = Cart;

    // ==========================================
    // BOUTONS "AJOUTER AU PANIER"
    // ==========================================

    function initAddToCartButtons() {
        document.querySelectorAll('[data-add-to-cart]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const productData = button.dataset;
                const product = {
                    id: productData.productId || productData.addToCart,
                    name: productData.productName || 'Produit',
                    price: parseInt(productData.productPrice) || 0,
                    image: productData.productImage || ''
                };

                Cart.add(product);
            });
        });
    }

    // ==========================================
    // FORMULAIRE DE CONTACT
    // ==========================================

    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validation basique
            if (!data.name || !data.email || !data.message) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }

            // Ici vous pouvez envoyer les données à votre backend
            // ou rediriger vers WhatsApp avec le message

            const whatsappMessage = `
Nouveau message de contact:
Nom: ${data.name}
Email: ${data.email}
Téléphone: ${data.phone || 'Non renseigné'}
Message: ${data.message}
            `.trim();

            // Rediriger vers WhatsApp
            const whatsappUrl = getWhatsAppLink ? getWhatsAppLink('custom', whatsappMessage) :
                `https://wa.me/${CONFIG?.contact?.whatsapp || '212600000000'}?text=${encodeURIComponent(whatsappMessage)}`;

            window.open(whatsappUrl, '_blank');

            // Reset form
            form.reset();
        });
    }

    // ==========================================
    // LAZY LOADING DES IMAGES
    // ==========================================

    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback pour navigateurs anciens
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ==========================================
    // GESTION DES ERREURS D'IMAGES
    // ==========================================

    function initImageErrorHandling() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                // Image placeholder si l'image ne charge pas
                this.src = 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
                        <rect fill="#E5DED4" width="400" height="500"/>
                        <text fill="#A68B67" font-family="serif" font-size="20" font-style="italic" x="50%" y="50%" text-anchor="middle">
                            Image non disponible
                        </text>
                    </svg>
                `);
                this.classList.add('img-error');
            });
        });
    }

    // ==========================================
    // DÉTECTION DU DEVICE
    // ==========================================

    function detectDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        document.body.classList.toggle('is-mobile', isMobile);
        document.body.classList.toggle('is-touch', isTouch);
        document.body.classList.toggle('is-desktop', !isMobile);

        return { isMobile, isTouch };
    }

    // ==========================================
    // PRÉFÉRENCES UTILISATEUR
    // ==========================================

    function checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.body.classList.toggle('reduced-motion', prefersReducedMotion);
        return prefersReducedMotion;
    }

    // ==========================================
    // ANALYTICS (Placeholder)
    // ==========================================

    const Analytics = {
        track(event, data = {}) {
            // Placeholder pour Google Analytics, etc.
            console.log('Track:', event, data);

            // Exemple avec Google Analytics
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', event, data);
            // }
        }
    };

    window.MaisonAnalytics = Analytics;

    // ==========================================
    // INITIALISATION GLOBALE
    // ==========================================

    function init() {
        detectDevice();
        checkReducedMotion();
        initWhatsAppLinks();
        initAddToCartButtons();
        initContactForm();
        initLazyLoading();
        initImageErrorHandling();

        // Log d'initialisation
        console.log('%c🌴 La Maison des Palmiers', 'font-size: 20px; font-weight: bold; color: #A68B67;');
        console.log('%cGifting & Catering de Luxe • Marrakech', 'font-size: 12px; color: #1A1A1A;');
    }

    // Lancer l'initialisation
    init();

});

// ==========================================
// UTILITAIRES GLOBAUX
// ==========================================

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Exposer les utilitaires
window.MaisonUtils = { debounce, throttle };
