// Cart Page Module

async function renderCartContent(params) {
    const app = document.getElementById('app');
    const user = Auth.getCurrentUser();

    if (!user) {
        app.innerHTML = `
            <div class="container">
                <div class="empty-state" style="min-height: 400px;">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <div class="empty-state-title">Please sign in</div>
                    <p class="empty-state-message">Sign in to view your cart and start shopping</p>
                    <button class="btn btn-primary" onclick="document.getElementById('authModal').style.display = 'flex'">Sign In</button>
                </div>
            </div>
        `;
        return;
    }

    const cart = Storage.getCart();

    if (cart.length === 0) {
        app.innerHTML = `
            <div class="container">
                <div class="empty-state" style="min-height: 400px;">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 3h-2v4H10V3H8"></path></svg>
                    <div class="empty-state-title">Your cart is empty</div>
                    <p class="empty-state-message">Add some products to get started</p>
                    <button class="btn btn-primary" onclick="Router.navigate('')">Shop Now</button>
                </div>
            </div>
        `;
        return;
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 49;
    const total = subtotal + shipping;

    app.innerHTML = `
        <div class="container" style="padding-top: 2rem; padding-bottom: 2rem;">
            <button onclick="Router.navigate('')" style="display: flex; align-items: center; gap: 0.5rem; color: #6B7280; background: none; border: none; cursor: pointer; margin-bottom: 1.5rem; font-family: var(--font-family); transition: var(--transition);" onmouseover="this.style.color = 'var(--color-forest)'" onmouseout="this.style.color = '#6B7280'">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>
                Continue Shopping
            </button>

            <h1 style="font-size: 2rem; font-weight: 700; color: var(--color-forest); margin-bottom: 2rem;">
                Shopping Cart <span style="color: #9CA3AF; font-size: 1.25rem; font-weight: 400;">(${cart.length} items)</span>
            </h1>

            <div class="cart-layout">
                <!-- Cart Items -->
                <div class="cart-items-container">
                    ${cart.map((item, index) => `
                        <div class="cart-item">
                            <a href="#/product/${item.product_id}" class="cart-item-image">
                                <img src="${item.product_image || getDefaultImage(item.category)}" 
                                     alt="${item.product_title}"
                                     onerror="this.src='${getDefaultImage(item.category)}'">
                            </a>

                            <div class="cart-item-content">
                                <a href="#/product/${item.product_id}" style="text-decoration: none; color: inherit;">
                                    <h3 class="cart-item-title">${item.product_title}</h3>
                                </a>
                                <p class="cart-item-seller">Sold by: ${item.seller_email}</p>
                                <p style="font-size: 0.875rem; color: #6B7280;">Unit: ${item.unit}</p>

                                <div class="cart-item-controls">
                                    <div class="quantity-control">
                                        <button onclick="updateCartQuantity(${index}, ${item.quantity - 1})">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14"></path></svg>
                                        </button>
                                        <span>${item.quantity}</span>
                                        <button onclick="updateCartQuantity(${index}, ${item.quantity + 1})">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"></path></svg>
                                        </button>
                                    </div>

                                    <div>
                                        <div class="cart-item-price">${Format.indianCurrency(item.price * item.quantity)}</div>
                                        ${item.quantity > 1 ? `<p style="font-size: 0.75rem; color: #9CA3AF;">${Format.indianCurrency(item.price)} each</p>` : ''}
                                    </div>
                                </div>
                            </div>

                            <button onclick="removeFromCart(${index})" class="cart-item-remove" style="margin-left: auto;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    `).join('')}
                </div>

                <!-- Order Summary -->
                <div class="cart-summary">
                    <h2 class="summary-title">Order Summary</h2>

                    <div class="summary-items">
                        ${cart.map(item => `
                            <div class="summary-item">
                                <span class="summary-item-name">${item.product_title} x ${item.quantity}</span>
                                <span class="summary-item-price">${Format.indianCurrency(item.price * item.quantity)}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div style="border-bottom: 1px solid #E5E7EB; padding-bottom: 1rem; margin-bottom: 1rem;">
                        <div class="summary-row">
                            <span class="summary-label">Subtotal</span>
                            <span class="summary-value">${Format.indianCurrency(subtotal)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Shipping</span>
                            <span class="summary-value ${shipping === 0 ? 'free' : ''}">${shipping === 0 ? 'Free' : Format.indianCurrency(shipping)}</span>
                        </div>
                        ${shipping > 0 ? `
                            <p style="font-size: 0.75rem; color: #9CA3AF; margin-top: 0.5rem;">
                                Free shipping on orders over ₹5,000
                            </p>
                        ` : ''}
                    </div>

                    <div class="summary-total">
                        <span>Total</span>
                        <span>${Format.indianCurrency(total)}</span>
                    </div>

                    <button onclick="Router.navigate('checkout')" class="btn btn-primary checkout-btn">
                        Proceed to Checkout
                    </button>

                    <button onclick="Router.navigate('')" style="width: 100%; padding: 0.75rem; margin-top: 0.75rem; background: white; color: var(--color-forest); border: 1px solid #E5E7EB; border-radius: 0.5rem; font-family: var(--font-family); font-weight: 500; cursor: pointer; transition: var(--transition);" onmouseover="this.style.background = 'var(--color-cream)'" onmouseout="this.style.background = 'white'">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    `;

    // Store cart for reference
    window.currentCart = cart;
}

function updateCartQuantity(index, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }

    let cart = Storage.getCart();
    cart[index].quantity = newQuantity;
    Storage.setCart(cart);
    updateCartBadge();
    renderCartContent(new URLSearchParams());
}

function removeFromCart(index) {
    let cart = Storage.getCart();
    const removedItem = cart[index];
    cart.splice(index, 1);
    Storage.setCart(cart);
    updateCartBadge();
    showToast(`${removedItem.product_title} removed from cart`, 'success');
    renderCartContent(new URLSearchParams());
}

function updateCartBadge() {
    const cart = Storage.getCart();
    const cartCount = document.getElementById('cartCount');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (total > 0) {
        cartCount.style.display = 'flex';
        cartCount.textContent = total > 99 ? '99+' : total;
    } else {
        cartCount.style.display = 'none';
    }
}
