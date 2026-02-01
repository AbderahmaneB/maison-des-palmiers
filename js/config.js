/* =============================================
   LA MAISON DES PALMIERS - CONFIGURATION
   ============================================= */

const CONFIG = {
    // Informations de contact
    contact: {
        phone: '+212600000000', // Remplacer par le vrai numéro
        email: 'contact@maisondespalmiers.ma',
        instagram: '@maisondespalmiers',
        whatsapp: '212600000000' // Sans le +
    },

    // Messages WhatsApp prédéfinis
    whatsappMessages: {
        default: 'Bonjour, je souhaite passer une commande',
        ecrin: 'Bonjour, je souhaite commander un écrin',
        brunch: 'Bonjour, je souhaite réserver un brunch',
        traiteur: 'Bonjour, je souhaite un devis pour un événement',
        custom: 'Bonjour, j\'ai une demande personnalisée'
    },

    // Animation settings
    animations: {
        loaderDuration: 2.5,
        revealOffset: 60,
        revealDuration: 1,
        staggerDelay: 0.1,
        parallaxIntensity: 0.3
    },

    // Breakpoints (match CSS)
    breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1440
    },

    // Zones de livraison
    deliveryZones: [
        'Palmeraie',
        'Route de l\'Ourika',
        'Targa',
        'Guéliz',
        'Médina',
        'Amelkis',
        'Route de Fès',
        'Agdal'
    ],

    // Products data (pour future intégration e-commerce)
    products: {
        ecrins: [
            {
                id: 'ecrin-signature',
                name: 'L\'Écrin Signature',
                description: 'Cœurs Chocolat & Fruits Givrés',
                price: 350,
                currency: 'MAD',
                image: 'assets/images/products/ecrin-signature.jpg'
            },
            {
                id: 'coeur-geometrique',
                name: 'Le Cœur Géométrique',
                description: 'Chocolat Ruby & Feuille d\'Or',
                price: 480,
                currency: 'MAD',
                image: 'assets/images/products/coeur-geometrique.jpg'
            },
            {
                id: 'fraises-imperiales',
                name: 'Les Fraises Impériales',
                description: 'Fraises Enrobées & Perles Croustillantes',
                price: 420,
                currency: 'MAD',
                image: 'assets/images/products/fraises-imperiales.jpg'
            },
            {
                id: 'ecrin-celebration',
                name: 'L\'Écrin Célébration',
                description: 'Assortiment Premium 24 Pièces',
                price: 680,
                currency: 'MAD',
                image: 'assets/images/products/ecrin-celebration.jpg'
            },
            {
                id: 'dattes-royales',
                name: 'Les Dattes Royales',
                description: 'Medjool Fourrées & Chocolat Noir',
                price: 390,
                currency: 'MAD',
                image: 'assets/images/products/dattes-royales.jpg'
            },
            {
                id: 'coffret-marrakech',
                name: 'Le Coffret Marrakech',
                description: 'Édition Limitée Signature',
                price: 950,
                currency: 'MAD',
                image: 'assets/images/products/coffret-marrakech.jpg'
            }
        ],
        brunch: [
            {
                id: 'brunch-duo',
                name: 'Brunch Duo',
                description: 'Pour 2 personnes',
                price: 520,
                currency: 'MAD'
            },
            {
                id: 'brunch-famille',
                name: 'Brunch Famille',
                description: 'Pour 4 personnes',
                price: 920,
                currency: 'MAD'
            },
            {
                id: 'brunch-grand',
                name: 'Brunch Grand Format',
                description: 'Pour 6-8 personnes',
                price: 1450,
                currency: 'MAD'
            }
        ]
    }
};

// Fonction utilitaire pour générer les liens WhatsApp
function getWhatsAppLink(messageType = 'default', customMessage = '') {
    const message = customMessage || CONFIG.whatsappMessages[messageType] || CONFIG.whatsappMessages.default;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${CONFIG.contact.whatsapp}?text=${encodedMessage}`;
}

// Fonction pour formater les prix
function formatPrice(price, currency = 'MAD') {
    return `${price.toLocaleString('fr-FR')} ${currency}`;
}

// Export pour modules ES6 (si utilisé)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, getWhatsAppLink, formatPrice };
}
