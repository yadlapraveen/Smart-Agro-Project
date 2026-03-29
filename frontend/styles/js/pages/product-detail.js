// Product Detail Page Module

async function renderProductDetailContent(params) {
    const app = document.getElementById('app');
    const hashPath = window.location.hash.slice(1);
    const productId = hashPath.split('/').pop();

    // Show loading state
    app.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        const product = await API.getProduct(productId);
        
        if (!product) {
            app.innerHTML = `
                <div class="container">
                    <div class="empty-state">
                        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path></svg>
                        <div class="empty-state-title">Product not found</div>
                        <p class="empty-state-message">This product is no longer available</p>
                        <button class="btn btn-primary" onclick="Router.navigate('')">Back to Home</button>
                    </div>
                </div>
            `;
            return;
        }

        const imgSrc = product.image_url || getDefaultImage(product.category);
        const rating = Number(product.rating || 0);
        const inStock = product.stock_quantity > 0;

        app.innerHTML = `
            <div class="container" style="padding-top: 2rem; padding-bottom: 2rem;">
                <!-- Breadcrumb -->
                <nav style="display: flex; gap: 0.5rem; font-size: 0.875rem; color: #6B7280; margin-bottom: 1.5rem;">
                    <a href="#/" style="color: var(--color-forest); text-decoration: none;">Home</a>
                    <span>/</span>
                    <a href="#/?category=${encodeURIComponent(product.category)}" style="color: var(--color-forest); text-decoration: none;">${product.category}</a>
                    <span>/</span>
                    <span style="color: #111827; font-weight: 500; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${product.title}</span>
                </nav>

                <button onclick="Router.navigate('')" style="display: flex; align-items: center; gap: 0.5rem; color: #6B7280; background: none; border: none; cursor: pointer; margin-bottom: 1.5rem; font-family: var(--font-family); transition: var(--transition);" onmouseover="this.style.color = 'var(--color-forest)'" onmouseout="this.style.color = '#6B7280'">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>
                    Back
                </button>

                <div class="cart-layout">
                    <!-- Product Image -->
                    <div>
                        <div style="position: relative; border-radius: 1rem; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
                            <img src="${imgSrc}" alt="${product.title}" 
                                 onerror="this.src='${getDefaultImage(product.category)}'"
                                 style="width: 100%; aspect-ratio: 1 / 1; object-fit: cover;">
                            
                            <button style="position: absolute; top: 1rem; right: 1rem; width: 2.5rem; height: 2.5rem; background: white; border: none; border-radius: 9999px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); cursor: pointer; display: flex; align-items: center; justify-content: center; color: #9CA3AF; transition: var(--transition);" onmouseover="this.style.color = '#EF4444'" onmouseout="this.style.color = '#9CA3AF'">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </button>

                            <button style="position: absolute; top: 1rem; right: 5.5rem; width: 2.5rem; height: 2.5rem; background: white; border: none; border-radius: 9999px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); cursor: pointer; display: flex; align-items: center; justify-content: center; color: #9CA3AF; transition: var(--transition);" onmouseover="this.style.color = 'var(--color-forest)'" onmouseout="this.style.color = '#9CA3AF'">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 2L11 13M22 2l-7 20L11 13m0 0L2 9m9 4l7-20"></path></svg>
                            </button>

                            ${product.is_organic ? `
                                <div style="position: absolute; top: 1rem; left: 1rem; background: rgba(34, 197, 94, 0.9); color: white; padding: 0.5rem 0.75rem; border-radius: 0.25rem; font-size: 0.875rem; font-weight: 600; display: flex; align-items: center; gap: 0.25rem;">
                                    <span>🍃</span>
                                    Certified Organic
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Product Details -->
                    <div style="flex: 1;">
                        <!-- Badges -->
                        <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;">
                            <span style="background: var(--color-cream); color: var(--color-forest); padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500;">
                                ${product.category}
                            </span>
                            ${inStock ? `
                                <span style="background: rgba(16, 185, 129, 0.1); color: #10B981; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; gap: 0.25rem;">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path></svg>
                                    In Stock
                                </span>
                            ` : `
                                <span style="background: rgba(239, 68, 68, 0.1); color: #EF4444; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500;">
                                    Out of Stock
                                </span>
                            `}
                        </div>

                        <h1 style="font-size: 2rem; font-weight: 700; color: #111827; margin-bottom: 0.75rem;">${product.title}</h1>

                        <!-- Rating -->
                        ${rating > 0 ? `
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                                <div class="stars">${renderStars(rating)}</div>
                                <span style="font-weight: 500; color: #111827;">${rating.toFixed(1)}</span>
                                <span style="font-size: 0.875rem; color: #9CA3AF;">(Seller rating)</span>
                            </div>
                        ` : ''}

                        <!-- Price -->
                        <div style="background: var(--color-cream); border: 1px solid var(--color-amber) url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22 style=%22fill:%23D4A373%3Bopacity:0.2%22><rect width=%221%22 height=%221%22/></svg>') 20%; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem;">
                            <div style="display: flex; align-items: baseline; gap: 0.5rem;">
                                <span style="font-size: 2rem; font-weight: 700; color: var(--color-forest);">${Format.indianCurrency(product.price)}</span>
                                <span style="color: #6B7280; font-size: 0.875rem;">per ${product.unit}</span>
                            </div>
                            <p style="font-size: 0.875rem; color: #6B7280; margin-top: 0.5rem;">
                                ${product.stock_quantity} units available
                            </p>
                        </div>

                        <!-- Description -->
                        <div style="margin-bottom: 1.5rem;">
                            <h3 style="font-weight: 600; color: #111827; margin-bottom: 0.5rem;">Description</h3>
                            <p style="color: #4B5563; line-height: 1.6; font-size: 0.875rem;">${product.description}</p>
                        </div>

                        <!-- Quantity & Add to Cart -->
                        ${inStock ? `
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                                <div style="display: flex; align-items: center; border: 2px solid #E5E7EB; border-radius: 0.75rem; overflow: hidden;">
                                    <button onclick="changeQuantity(-1)" style="padding: 0.75rem; background: none; border: none; cursor: pointer; transition: var(--transition);" onmouseover="this.style.background = 'var(--color-cream)'" onmouseout="this.style.background = 'none'">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14"></path></svg>
                                    </button>
                                    <span id="quantityDisplay" style="width: 3rem; text-align: center; font-weight: 600;">1</span>
                                    <button onclick="changeQuantity(1)" style="padding: 0.75rem; background: none; border: none; cursor: pointer; transition: var(--transition);" onmouseover="this.style.background = 'var(--color-cream)'" onmouseout="this.style.background = 'none'">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"></path></svg>
                                    </button>
                                </div>
                                <button id="addToCartBtn" onclick="addToCartFromDetail()" style="flex: 1; padding: 0.75rem 1.5rem; background: var(--color-forest); color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: var(--transition); display: flex; align-items: center; justify-content: center; gap: 0.5rem;" onmouseover="this.style.background = 'var(--color-forest-800)'" onmouseout="this.style.background = 'var(--color-forest)'">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                    Add to Cart
                                </button>
                            </div>
                        ` : ''}

                        <!-- Seller Info -->
                        <div style="background: var(--color-cream); padding: 1rem; border-radius: 0.75rem; margin-bottom: 1.5rem;">
                            <h3 style="font-weight: 600; color: #111827; margin-bottom: 0.75rem;">Seller Information</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.875rem;">
                                <div>
                                    <p style="color: #6B7280;">Seller</p>
                                    <p style="font-weight: 500; color: #111827;">${product.seller_name || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p style="color: #6B7280;">Location</p>
                                    <p style="font-weight: 500; color: #111827;">${product.location || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p style="color: #6B7280;">Email</p>
                                    <p style="font-weight: 500; color: #111827;">${product.seller_email || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p style="color: #6B7280;">Rating</p>
                                    <p style="font-weight: 500; color: #111827;">${rating.toFixed(1)} / 5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Related Products -->
                <div style="margin-top: 4rem;">
                    <h2 class="section-title">Related Products</h2>
                    <div class="products-grid" id="relatedProducts"></div>
                </div>
            </div>
        `;

        // Store current product for quick add to cart
        window.currentProduct = product;
        window.currentQuantity = 1;

        // Load related products
        loadRelatedProducts(product.category, product.id);

    } catch (error) {
        console.error('Failed to load product:', error);
        app.innerHTML = `
            <div class="container">
                <div class="empty-state">
                    <div class="empty-state-title">Failed to load product</div>
                    <p class="empty-state-message">${error.message}</p>
                    <button class="btn btn-primary" onclick="Router.navigate('')">Back to Home</button>
                </div>
            </div>
        `;
    }
}

function changeQuantity(delta) {
    window.currentQuantity = Math.max(1, window.currentQuantity + delta);
    document.getElementById('quantityDisplay').textContent = window.currentQuantity;
}

function addToCartFromDetail() {
    if (!Auth.isLoggedIn()) {
        showToast('Please sign in first', 'info');
        document.getElementById('authModal').style.display = 'flex';
        return;
    }

    const product = window.currentProduct;
    const quantity = window.currentQuantity;

    const cartItem = {
        id: Date.now(),
        product_id: product.id,
        product_title: product.title,
        category: product.category,
        product_image: product.image_url,
        seller_email: product.seller_email,
        unit: product.unit,
        quantity: quantity,
        price: product.price
    };

    let cart = Storage.getCart();
    const existing = cart.find(item => item.product_id === product.id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push(cartItem);
    }
    Storage.setCart(cart);
    updateCartBadge();
    showToast(`${product.title} added to cart!`, 'success');

    // Change button text temporarily
    const btn = document.getElementById('addToCartBtn');
    btn.innerHTML = '✓ Added to Cart';
    setTimeout(() => {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>Add to Cart`;
    }, 2000);
}

async function loadRelatedProducts(category, excludeId) {
    try {
        const allProducts = await API.getProducts();
        let related = allProducts
            .filter(p => p.category === category && p.id !== excludeId && p.status === 'active')
            .slice(0, 4);

        const container = document.getElementById('relatedProducts');
        if (related.length === 0) {
            container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #6B7280;">No related products</p>';
            return;
        }

        container.innerHTML = related.map(product => `
            <a href="#/product/${product.id}" class="product-card">
                <div class="product-image">
                    <img src="${product.image_url || getDefaultImage(product.category)}" 
                         alt="${product.title}"
                         onerror="this.src='${getDefaultImage(product.category)}'">
                    <div class="product-category">${product.category}</div>
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.title}</h3>
                    ${product.rating ? `
                        <div class="product-rating">
                            <div class="stars">${renderStars(product.rating)}</div>
                            <span>${product.rating.toFixed(1)}</span>
                        </div>
                    ` : ''}
                    <div class="product-footer">
                        <div>
                            <div class="product-price">${Format.indianCurrency(product.price)}</div>
                            <div class="product-unit">per ${product.unit}</div>
                        </div>
                    </div>
                </div>
            </a>
        `).join('');
    } catch (error) {
        console.error('Failed to load related products:', error);
    }
}

// Add cart badge update function
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
