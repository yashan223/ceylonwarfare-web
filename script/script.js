const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CEYLON WARFARE",
    "description": "COD4 ProMod servers, custom mods, and public assets. Ultra low latency.",
    "url": "https://ceylonwarfare.tech",
    "logo": "https://ceylonwarfare.tech/ceylon_warfare.ico",
    "sameAs": [
        "https://discord.ceylonwarfare.tech",
    ]
};

function addStructuredData() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function() {
    addStructuredData();
    initializeAnimations();
    initializeCopyButtons();
    initializeNavigation();
    initializeWhatsAppPopup();
});

function initializeAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-copy');
            copyToClipboard(targetId);
        });
    });
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuButton ? mobileMenuButton.querySelector('.material-symbols-outlined') : null;

    const setMobileMenuState = (isOpen) => {
        if (!mobileMenu || !mobileMenuButton) return;

        mobileMenu.classList.toggle('hidden', !isOpen);
        mobileMenuButton.setAttribute('aria-expanded', String(isOpen));

        if (mobileMenuIcon) {
            mobileMenuIcon.textContent = isOpen ? 'close' : 'menu';
            mobileMenuIcon.setAttribute('data-icon', isOpen ? 'close' : 'menu');
        }
    };

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isOpen = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            setMobileMenuState(!isOpen);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href) return;

            e.preventDefault();
            PageUtils.smoothScroll(href);
            history.replaceState(null, '', href);

            if (mobileMenuButton && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
                setMobileMenuState(false);
            }
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            setMobileMenuState(false);
        }
    });
}

function initializeWhatsAppPopup() {
    const rentalsSection = document.getElementById('rentals');
    const popup = document.getElementById('whatsapp-popup');
    const whatsappLink = document.getElementById('whatsapp-chat-link');

    if (!rentalsSection || !popup || !whatsappLink) return;

    const whatsappNumber = '94788901407';
    const message = encodeURIComponent('Hi, I need details about server rentals and custom mod making.');
    whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${message}`;

    const showPopup = () => {
        popup.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        popup.classList.add('opacity-100', 'translate-y-0');
    };

    const hidePopup = () => {
        popup.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
        popup.classList.remove('opacity-100', 'translate-y-0');
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    showPopup();
                } else {
                    hidePopup();
                }
            });
        }, { threshold: 0.25 });

        observer.observe(rentalsSection);
    } else {
        const onScroll = () => {
            const rect = rentalsSection.getBoundingClientRect();
            const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
            if (inView) {
                showPopup();
            } else {
                hidePopup();
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
}

function copyToClipboard(elementId) {
    const textElement = document.getElementById(elementId);
    if (!textElement) return;

    const text = textElement.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showNotification(`COPIED: ${text}`);
        
        const originalText = textElement.textContent;
        textElement.textContent = "COPIED!";
        
        setTimeout(() => {
            textElement.textContent = originalText;
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('COPY FAILED');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'var(--primary-color)';
    notification.style.color = '#000';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '2px';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    notification.style.fontFamily = 'Space Grotesk';
    notification.style.fontWeight = '600';
    notification.style.fontSize = '0.875rem';
    notification.style.letterSpacing = '0.1em';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2500);
}

const ServerData = {
    servers: [
        {
            id: 'snd',
            name: 'Search & Destroy',
            ip: 'snd.ceylonwarfare.tech:28960',
            players: '22/24',
            features: ['ProMod Ruleset v2.11', 'Anti-Cheat Enabled', 'Global Rankings'],
            description: 'High stakes, no respawn. Competitive ruleset optimized for tournament play.'
        },
        {
            id: 'tdm',
            name: 'Team Deathmatch',
            ip: 'ceylonwarfare.tech:28964',
            players: '30/32',
            features: ['ProMod TDM Configuration', 'High-Performance Tickrate', 'Active Administration'],
            description: 'Fast-paced classic action. No perks, high skill ceiling, instant respawn.'
        },
        {
            id: 'war',
            name: 'War Server',
            ip: 'ceylonwarfare.tech:28968',
            players: '24/30',
            features: ['Intense War Configuration', 'Extended Match Duration', 'Strategic Gameplay'],
            description: 'Large-scale battles with complex map control and team coordination.'
        },
        {
            id: 'sniper',
            name: 'Sniper Only',
            ip: 'ceylonwarfare.tech:28970',
            players: '14/18',
            features: ['Custom Sniper Configuration', 'Exclusive Sniper Maps', 'Precision Gameplay'],
            description: 'M40A3 & R700 focus. Precision training on custom rotation maps.'
        }
    ],
    
    getServerById(id) {
        return this.servers.find(s => s.id === id);
    },
    
    getAllServers() {
        return this.servers;
    }
};

const PageUtils = {
    smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const nav = document.querySelector('nav');
            const navOffset = nav ? nav.offsetHeight + 8 : 0;
            const top = element.getBoundingClientRect().top + window.pageYOffset - navOffset;

            window.scrollTo({
                top: Math.max(0, top),
                behavior: 'smooth'
            });
        }
    },
    
    isScrolled() {
        return window.scrollY > 50;
    },
    
    handleNavigation(href) {
        if (href.startsWith('#')) {
            this.smoothScroll(href);
        } else if (href.startsWith('cod4://')) {
            window.location.href = href;
        }
    }
};

window.TACTICAL = {
    ServerData,
    PageUtils,
    copyToClipboard,
    showNotification
};
