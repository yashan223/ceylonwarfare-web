(function () {
    document.addEventListener('DOMContentLoaded', function () {
        initializeNavigation();
        initializeTabs();
        initializeCopyButtons();
    });

    function initializeNavigation() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuIcon = mobileMenuButton ? mobileMenuButton.querySelector('.material-symbols-outlined') : null;

        if (!mobileMenuButton || !mobileMenu) return;

        const setMobileMenuState = (isOpen) => {
            mobileMenu.classList.toggle('hidden', !isOpen);
            mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
            if (mobileMenuIcon) {
                mobileMenuIcon.textContent = isOpen ? 'close' : 'menu';
                mobileMenuIcon.setAttribute('data-icon', isOpen ? 'close' : 'menu');
            }
        };

        mobileMenuButton.addEventListener('click', function () {
            const isOpen = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            setMobileMenuState(!isOpen);
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMobileMenuState(false));
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 768) {
                setMobileMenuState(false);
            }
        });
    }

    function initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        if (!tabBtns || !tabContents) return;

        tabBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const targetTab = this.getAttribute('data-tab');
                if (!targetTab) return;

                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active class to this button and active tab content panel
                this.classList.add('active');
                const activePanel = document.getElementById(targetTab);
                if (activePanel) {
                    activePanel.classList.add('active');
                }
            });
        });
    }

    function initializeCopyButtons() {
        const copyButtons = document.querySelectorAll('[data-copy]');
        copyButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const textToCopy = this.getAttribute('data-copy');
                if (!textToCopy) return;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    showNotification(`COPIED TO CLIPBOARD`);
                    
                    // Add temporal feedback animation on button
                    const iconElement = this.querySelector('.material-symbols-outlined');
                    const originalIcon = iconElement ? iconElement.textContent : null;
                    
                    if (iconElement) {
                        iconElement.textContent = 'check';
                        setTimeout(() => {
                            iconElement.textContent = originalIcon || 'content_copy';
                        }, 1500);
                    }
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    showNotification('COPY FAILED');
                });
            });
        });
    }

    function showNotification(message) {
        // Remove any existing notifications to avoid stacking overlay
        const existing = document.querySelectorAll('.toast-notification');
        existing.forEach(el => el.remove());

        const notification = document.createElement('div');
        notification.className = 'toast-notification';
        
        // Inline styles for absolute premium look & self-containment
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4d9fff', // cw-primary color
            color: '#04101d', // cw-on-primary
            padding: '12px 24px',
            borderRadius: '2px',
            boxShadow: '0 10px 30px rgba(77, 159, 255, 0.35)',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: '700',
            fontSize: '0.85rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
        });

        notification.textContent = message;
        document.body.appendChild(notification);

        // Force browser layout reflow to trigger transition
        notification.offsetHeight;

        // Slide down animation
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(10px)';

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(0)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 250);
        }, 2000);
    }
})();
