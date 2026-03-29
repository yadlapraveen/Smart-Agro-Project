// Home Page Module

async function renderHomeContent(params) {
    const app = document.getElementById('app');
    const categoryFilter = getQueryParam(params, 'category') || 'All';

    app.innerHTML = `
        <section class="hero">
<img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1920&q=80"
class="hero-image"
alt="Farm Field">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1>Fresh from the Farm</h1>
                <p>Buy seeds, fresh products and livestocks directly from farmers</p>
                <div class="search-box">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
                    <input type="text" id="searchInput" placeholder="Search products...">
                </div>
            </div>
        </section>

        <div class="container">
            <!-- Categories Section -->
            <div class="products-section">
                <h2 class="section-title">Shop by Category</h2>
                <div class="category-filters" id="categoryFilters"></div>

                <!-- Sort and Filter Controls -->
                <div style="display:flex;justify-content:flex-end;margin-bottom:20px;">
                    <select id="sortSelect" class="sort-dropdown">
    <option value="default">Default</option>
    <option value="price-asc">Price: Low to High</option>
    <option value="price-desc">Price: High to Low</option>
    <option value="rating">Top Rated</option>
    <option value="name">Name: A-Z</option>
</select>
                </div>

                <!-- Products Grid -->
                <div class="products-grid" id="productsGrid"></div>
            </div>

         
            </div>
        </div>
    `;

    // Fetch and render products
    await loadProducts(categoryFilter);

    // Setup event listeners
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const categoryBtns = document.querySelectorAll('.category-btn');

    searchInput.addEventListener('input', debounce(() => filterProducts(), 300));
searchInput.addEventListener("keypress", function(e){

if(e.key === "Enter"){

e.preventDefault();

/* run search */

filterProducts();

/* scroll to products */

const productsSection = document.querySelector(".products-section");

if(productsSection){

productsSection.scrollIntoView({
behavior:"smooth"
});

}

}

});
    sortSelect.addEventListener('change', filterProducts);
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts();
        });
    });
}

async function loadProducts(selectedCategory = 'All') {
    try {
        const products = await API.getProducts();
        window.allProducts = products.filter(p => p.category && p.category !== 'Tools');

        // Render categories
        const categories = ['All',...new Set(products.map(p => p.category).filter(cat => cat && cat !== 'Tools'))];
        const categoryFilters = document.getElementById('categoryFilters');
        categoryFilters.innerHTML = categories.map(cat => 
            `<button class="category-btn ${cat === selectedCategory ? 'active' : ''}">${cat}</button>`
        ).join('');

        // Initial products display
        filterProducts();
    } catch (error) {
        console.error('Failed to load products:', error);
        showToast('Failed to load products', 'error');
        document.getElementById('productsGrid').innerHTML = '<div class="empty-state"><div class="empty-state-title">Failed to load products</div></div>';
    }
}

function filterProducts() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const sort = document.getElementById('sortSelect').value;
    const activeCategory = document.querySelector('.category-btn.active').textContent;

    let filtered = window.allProducts || [];

    // Category filter
    if (activeCategory !== 'All') {
        filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Search filter
    if (search.trim()) {
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.location?.toLowerCase().includes(search)
        );
    }

    // Sorting
    if (sort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'name') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    renderProductsGrid(filtered);

    
}

function renderProductsGrid(products) {
    const grid = document.getElementById('productsGrid');

    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0;">
                <div class="empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
                    <div class="empty-state-title">No products found</div>
                    <p class="empty-state-message">Try adjusting your filters or search terms</p>
                </div>
            </div>
        `;
        return;
    }

    grid.innerHTML = products.map(product => `

<a href="#/product/${product.id}" class="product-card">

<div class="product-image">

<img 
  src="${product.image_url || 'https://via.placeholder.com/300'}"
  onerror="this.src='https://via.placeholder.com/300'"
>

${product.is_organic ? `
<div class="badge-organic">🍃 Organic</div>
` : ""}

<div class="product-category">
${product.category}
</div>

</div>

<div class="product-content">

<h3 class="product-title">${product.title}</h3>

<div class="product-location">
📍 ${product.location}
</div>

<div class="product-price">
${Format.indianCurrency(product.price)}
<span class="product-unit">/${product.unit}</span>
</div>

<div class="product-footer">

<span>📦 ${product.stock_quantity} in stock</span>

<span>${product.seller_name}</span>

</div>

<button class="product-add-btn"
data-title="${product.title.replace(/"/g,'&quot;')}"
onclick="event.preventDefault(); event.stopPropagation(); addToCartQuick('${product.id}', this.dataset.title)">
🛒 Add to Cart
</button>

</div>

</a>

`).join("");
}

function addToCartQuick(productId, productTitle){

if(!Auth.isLoggedIn()){

showToast("Please sign in first","info");
document.getElementById("authModal").style.display="flex";
return;

}

const product = window.allProducts.find(p => p.id == productId);

if(!product){
showToast("Product not found","error");
return;
}

/* CART DATA */

let cart = Storage.getCart() || [];

/* CHECK EXISTING */

const existing = cart.find(item => item.product_id == productId);

if(existing){

existing.quantity += 1;

}else{

cart.push({
product_id: product.id,
product_title: product.title,
product_image: product.image_url,
price: product.price,
unit: product.unit,
seller_email: product.seller_email,
quantity: 1
});

}

Storage.setCart(cart);

updateCartBadge();

showToast(productTitle + " added to cart","success");

}
function updateCartBadge(){

const cart = Storage.getCart() || [];

const cartCount = document.getElementById("cartCount");

const total = cart.reduce((sum,item)=>sum + item.quantity,0);

if(total > 0){
cartCount.style.display="flex";
cartCount.textContent=total;
}else{
cartCount.style.display="none";
}

}

// Update cart badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);
