// Utility Functions Module

// LocalStorage Management
const Storage = {
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    removeUser() {
        localStorage.removeItem('user');
    },

    setCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },

    getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },

    clearCart() {
        localStorage.removeItem('cart');
    }
};

// UI Toast Notifications
function showToast(message, type = 'success', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg ${type === 'success' ? 'class="checkmark"' : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}
            ${type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><path d="M8 8l8 8M16 8l-8 8"></path>' : ''}
            ${type === 'info' ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>' : ''}
        </svg>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}

// Routing
const Router = {
    routes: {},
    currentRoute: '',

    register(route, handler) {
        this.routes[route] = handler;
    },

    navigate(route) {
        window.location.hash = `#${route}`;
    },

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    async handleRoute() {
        let route = window.location.hash.slice(1) || '/';
        const queryParams = new URLSearchParams(window.location.search);
        
        // Remove leading slash for consistency
        if (route.startsWith('/')) {
            route = route.slice(1);
        }

        this.currentRoute = route;
        const handler = this.routes[route] || this.routes['/'];

        if (handler) {
            const app = document.getElementById('app');
            app.innerHTML = '';
            try {
                await handler.call(this, queryParams);
            } catch (error) {
                console.error('Route handler error:', error);
                app.innerHTML = '<div class="empty-state"><div class="empty-state-title">Error loading page</div><p class="empty-state-message">' + error.message + '</p></div>';
            }
        }
    }
};

// Formatting
const Format = {
    currency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    indianCurrency(amount) {
        return `₹${parseFloat(amount).toFixed(0)}`;
    },

    date(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    stars(rating) {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(`<svg class="star ${i < Math.floor(rating) ? '' : 'empty'}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`);
        }
        return stars.join('');
    }
};

// Authentication Helper
const Auth = {
    isLoggedIn() {
        return Storage.getUser() !== null;
    },

    getCurrentUser() {
        return Storage.getUser();
    },

    login(user) {
        Storage.setUser(user);
    },

    logout() {
        Storage.removeUser();
        Storage.clearCart();
        location.hash = '#/';
    },

    requireAuth() {
        if (!this.isLoggedIn()) {
            showToast('Please sign in first', 'info');
            document.getElementById('authModal').style.display = 'flex';
            return false;
        }
        return true;
    }
};

// UI Helpers
const UI = {
    toggleElement(elementId, show) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = show ? 'flex' : 'none';
        }
    },

    show(elementId) {
        this.toggleElement(elementId, true);
    },

    hide(elementId) {
        this.toggleElement(elementId, false);
    },

    toggleClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.toggle(className);
        }
    },

    addClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(className);
        }
    },

    removeClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(className);
        }
    },

    setHTML(elementId, html) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    },

    getText(elementId) {
        const element = document.getElementById(elementId);
        return element ? element.textContent : '';
    },

    setValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.value = value;
        }
    },

    getValue(elementId) {
        const element = document.getElementById(elementId);
        return element ? element.value : '';
    }
};

// Form Validation
const Validation = {
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    isValidPassword(password) {
        return password && password.length >= 6;
    },

    isEmpty(value) {
        return !value || value.trim() === '';
    }
};

// Query Parameters
function getQueryParam(params, key) {
    return params.get(key) || '';
}

// Debounce Function
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Image Error Handler
function getDefaultImage(category) {
    const images = {
        'Seeds': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        'Livestock': 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400',
        'Fresh Produce': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        'Tools': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        'Default': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'
    };
    return images[category] || images['Default'];
}

// Render Stars HTML
function renderStars(rating) {
    let html = '<div class="stars">';
    for (let i = 0; i < 5; i++) {
        html += `<svg class="star ${i < Math.floor(rating) ? '' : 'empty'}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
    html += '</div>';
    return html;
}
