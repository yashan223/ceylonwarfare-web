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
    initializeOfferModal();
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
    const navLinks = document.querySelectorAll('nav a[href*="#"]');
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

    const updateActiveLink = (targetId) => {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isMobile = !!link.closest('#mobile-menu');
            if (href === targetId) {
                if (isMobile) {
                    link.classList.add('text-secondary');
                } else {
                    link.classList.add('border-b-2', 'border-secondary', 'text-secondary');
                }
            } else {
                if (isMobile) {
                    link.classList.remove('text-secondary');
                } else {
                    link.classList.remove('border-b-2', 'border-secondary', 'text-secondary');
                }
            }
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            let href = this.getAttribute('href');
            if (!href || !href.includes('#')) return;

            const hashIndex = href.indexOf('#');
            const path = href.substring(0, hashIndex);
            const currentPath = window.location.pathname;
            
            if (path === '' || path === '/' || path === currentPath || currentPath.endsWith(path)) {
                href = href.substring(hashIndex);
                
                e.preventDefault();
                PageUtils.smoothScroll(href);
                history.replaceState(null, '', href);
                updateActiveLink(href);

                if (mobileMenuButton && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
                    setMobileMenuState(false);
                }
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = (window.scrollY || window.pageYOffset || document.documentElement.scrollTop) + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            updateActiveLink(currentSectionId);
        }
    });

    const currentHash = window.location.hash;
    if (currentHash) {
        updateActiveLink(currentHash);
    }

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

function initializeOfferModal() {
    const modal = document.getElementById('offer-modal');
    const modalCard = document.getElementById('offer-modal-card');
    const closeBtn = document.getElementById('btn-close-offer-modal');
    const declineBtn = document.getElementById('btn-decline-offer');

    if (!modal || !modalCard) return;

    const COOLDOWN_MS = 24 * 60 * 60 * 1000;
    const lastShown = localStorage.getItem('cw_offer_modal_last_shown');
    const now = Date.now();

    if (lastShown && (now - parseInt(lastShown, 10) < COOLDOWN_MS)) {
        return;
    }

    const showModal = () => {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100');
        
        modalCard.classList.remove('scale-95', 'opacity-0');
        modalCard.classList.add('scale-100', 'opacity-100');

        localStorage.setItem('cw_offer_modal_last_shown', String(now));
    };

    const hideModal = () => {
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0', 'pointer-events-none');
        
        modalCard.classList.remove('scale-100', 'opacity-100');
        modalCard.classList.add('scale-95', 'opacity-0');
    };

    setTimeout(showModal, 1500);

    if (closeBtn) closeBtn.addEventListener('click', hideModal);
    if (declineBtn) declineBtn.addEventListener('click', hideModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
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
        if (target && target.includes('#')) {
            target = target.substring(target.indexOf('#'));
        }
        const element = document.querySelector(target);
        if (element) {
            if ('scrollBehavior' in document.documentElement.style) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                element.scrollIntoView();
            }
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
