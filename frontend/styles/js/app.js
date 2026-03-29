// Main Application File

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    initializeNavigation();
    initializeRouter();
    initializeVoiceAssistant();
});

// Initialize Authentication UI
function initializeAuth() {
    const authModal = document.getElementById('authModal');
    const authBtn = document.getElementById('authBtn');
    const authModalClose = document.getElementById('authModalClose');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameEl = document.getElementById('userName');
    const userMenuContainer = document.querySelector('.user-menu');

    // Check if user is logged in
    updateAuthUI();

    // Auth Button Click
    authBtn.addEventListener('click', () => {
        authModal.style.display = 'flex';
    });

    // Modal Close
    authModalClose.addEventListener('click', () => {
        authModal.style.display = 'none';
    });

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    // Tab Switching
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // Login Form
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!Validation.isValidEmail(email)) {
            showToast('Please enter a valid email', 'error');
            return;
        }

        if (!Validation.isValidPassword(password)) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            const response = await API.login(email, password);

// Handle backend error
if (response.error) {
    showToast(response.error, 'error');
    return;
}

// ✅ FIX: extract user correctly
const user = response.user;

Auth.login(user);
updateAuthUI();
authModal.style.display = 'none';
loginForm.reset();
showToast('Logged in successfully!', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    // Signup Form
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        if (Validation.isEmpty(name)) {
            showToast('Please enter your full name', 'error');
            return;
        }

        if (!Validation.isValidEmail(email)) {
            showToast('Please enter a valid email', 'error');
            return;
        }

        if (!Validation.isValidPassword(password)) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            await API.register(name, email, password);
            showToast('Account created! Please sign in', 'success');
            signupForm.reset();
            loginTab.click();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    // User Menu
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = userDropdown.style.display !== 'none';
        userDropdown.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
        userDropdown.style.display = 'none';
    });

    userMenuContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        Auth.logout();
        updateAuthUI();
        showToast('Logged out successfully', 'success');
    });
}

function updateAuthUI() {
    const user = Auth.getCurrentUser();
    const authBtn = document.getElementById('authBtn');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userNameEl = document.getElementById('userName');
    const userMenu = document.querySelector('.user-menu');

    if (user) {
        authBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        userNameEl.textContent = user.full_name?.split(' ')[0] || user.email;
    } else {
        authBtn.style.display = 'inline-flex';
        userMenu.style.display = 'none';
    }
}

// Initialize Navigation
function initializeNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const desktopNav = document.getElementById('desktopNav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile Menu Toggle
    mobileMenuToggle.addEventListener('click', () => {
        const isVisible = mobileNav.style.display !== 'none';
        mobileNav.style.display = isVisible ? 'none' : 'block';
        mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                mobileNav.style.display = 'none';
                mobileMenuToggle.classList.remove('active');
            }
            updateActiveNavLink(link.getAttribute('href'));
        });
    });

    // Update cart count
    updateCartCount();
}

function updateActiveNavLink(href) {
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function updateCartCount() {
    // For now, this will be updated from cart page
    // In future, sync with backend
}

// Initialize Router
function initializeRouter() {
    // Register routes
    Router.register('/', renderHome);
    Router.register('product/:id', renderProductDetail);
    Router.register('cart', renderCart);
    Router.register('checkout', renderCheckout);
    Router.register('orders', renderOrders);
    Router.register('sell', renderSellProduct);
    Router.register('my-listings', renderMyListings);
    Router.register('settings', renderSettings);

    // Initialize routing
    Router.init();
}

// Page Renderers (stubs - will be implemented in page-specific files)
async function renderHome(params) {

window.scrollTo({
top: 0,
behavior: "smooth"
});

if (typeof renderHomeContent === 'function') {
await renderHomeContent.call(this, params);
}

}

async function renderProductDetail(params) {
    // Will be implemented in product-detail.js
    if (typeof renderProductDetailContent === 'function') {
        await renderProductDetailContent.call(this, params);
    }
}

async function renderCart(params) {

window.scrollTo({
top: 0,
behavior: "smooth"
});

if (typeof renderCartContent === 'function') {
await renderCartContent.call(this, params);
}

}

async function renderCheckout(params) {
    // Will be implemented in checkout.js
    if (typeof renderCheckoutContent === 'function') {
        await renderCheckoutContent.call(this, params);
    }
}

async function renderOrders(params) {

window.scrollTo({
top: 0,
behavior: "smooth"
});

if (typeof renderOrdersContent === 'function') {
await renderOrdersContent.call(this, params);
}

}

async function renderSellProduct(params) {
    // Will be implemented in sell-product.js
    if (typeof renderSellProductContent === 'function') {
        await renderSellProductContent.call(this, params);
    }
}

async function renderMyListings(params) {

window.scrollTo({
top: 0,
behavior: "smooth"
});

if (typeof renderMyListingsContent === 'function') {
await renderMyListingsContent.call(this, params);
}

}
async function renderSettings(params) {
    // Will be implemented in settings.js
    if (typeof renderSettingsContent === 'function') {
        await renderSettingsContent.call(this, params);
    }
}
function closeEditModal(){
    document.getElementById("editModal").style.display = "none";
}

document.addEventListener("submit", async function(e){

    if(e.target.id !== "editProductForm") return;

    e.preventDefault();

    const id = window.currentEditId;
const product = window.currentProduct || {};

const data = {
title: document.getElementById("editTitle").value || product.title,
description: document.getElementById("editDescription").value || product.description,
category: document.getElementById("editCategory").value || product.category || "General",
price: document.getElementById("editPrice").value || product.price || 0,
unit: document.getElementById("editUnit").value || product.unit || "unit",
stock_quantity: document.getElementById("editStock").value || product.stock_quantity || 0,
image_url: document.getElementById("editImage").value || product.image_url || "",
location: document.getElementById("editLocation").value || product.location || "",
is_organic: document.getElementById("editOrganic").checked
};

console.log("Updating product:", data);

    try {
        const result = await API.updateListing(id, data);
        console.log("Update response:", result);

        showToast("Product updated successfully", "success");
        closeEditModal();

        await renderMyListingsContent(new URLSearchParams());

    } catch (err) {
        console.error("Update failed:", err);
        showToast(err.message || "Update failed", "error");
    }

});

/* ===============================
VOICE ASSISTANT
=============================== */

function initializeVoiceAssistant(){

const btn = document.getElementById("voiceBtn");
if(!btn) return;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if(!SpeechRecognition){
alert("Voice not supported");
return;
}

const recognition = new SpeechRecognition();

recognition.lang = "en-IN";
recognition.continuous = false;

btn.onclick = () => {

recognition.start();

showToast("🎤 Listening...", "success");

};

recognition.onresult = (event) => {

const text = event.results[0][0].transcript.toLowerCase();

console.log("VOICE:", text);

handleVoiceCommand(text);

};

}

/* ===============================
VOICE COMMANDS
=============================== */

function handleVoiceCommand(text){

// HOME
if(text.includes("home") || text.includes("హోమ్")){
location.hash="#/";
}

// SELL PAGE
else if(text.includes("sell") || text.includes("అమ్మాలి")){
location.hash="#/sell";
}

// MY LISTINGS
else if(text.includes("listings") || text.includes("లిస్టింగ్స్")){
location.hash="#/my-listings";
}

// ORDERS
else if(text.includes("orders") || text.includes("ఆర్డర్స్")){
location.hash="#/orders";
}

// CART
else if(text.includes("cart") || text.includes("కార్ట్")){
location.hash="#/cart";
}

// LOGIN
else if(text.includes("login") || text.includes("లాగిన్")){
document.getElementById("authBtn").click();
}

// ADD PRODUCT TITLE
else if(text.includes("add") || text.includes("చేర్చు")){

const product=text.replace("add","").replace("చేర్చు","").trim();

const title=document.getElementById("productTitle");

if(title){
title.value=product;
showToast("Product: "+product,"success");
}

}

// CATEGORY
else if(text.includes("category") || text.includes("కేటగిరీ")){

const cat=document.getElementById("productCategory");

if(!cat) return;

if(text.includes("seeds")) cat.value="Seeds";

else if(text.includes("livestock")) cat.value="Livestock";

else if(text.includes("fresh")) cat.value="Fresh Produce";

showToast("Category selected","success");

}

// PRICE
else if(text.includes("price") || text.includes("ధర")){

const num=text.match(/\d+/);

const price=document.getElementById("productPrice");

if(num && price){

price.value=num[0];

showToast("Price ₹"+num[0],"success");

}

}

// STOCK
else if(text.includes("stock") || text.includes("స్టాక్")){

const num=text.match(/\d+/);

const stock=document.getElementById("productStock");

if(num && stock){

stock.value=num[0];

showToast("Stock "+num[0],"success");

}

}

// LOCATION
else if(text.includes("location") || text.includes("ప్రాంతం")){

const loc=text.replace("location","").replace("ప్రాంతం","").trim();

const locationInput=document.getElementById("productLocation");

if(locationInput){

locationInput.value=loc;

showToast("Location "+loc,"success");

}

}

// SUBMIT PRODUCT
else if(text.includes("submit") || text.includes("సబ్మిట్")){

const desc=document.getElementById("productDesc");

if(desc && !desc.value){

desc.value="Voice added product";

}

const form=document.getElementById("listingForm");

if(form){

form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));

showToast("Submitting product...","success");

}

}

}