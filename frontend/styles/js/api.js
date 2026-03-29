// API Communication Module
const API_BASE_URL = 'http://localhost:4000/api';

class API {

    // =============================
    // AUTH
    // =============================

    static async register(name, email, password) {

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: name, email, password })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Registration failed');

        return data;
    }


    static async login(email, password) {

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Login failed');

        return data;
    }


    static async getProfile(userId) {

        const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');

        return data;
    }


    static async updateProfile(userId, profileData) {

        const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to update profile');

        return data;
    }


    // =============================
    // PRODUCTS
    // =============================

    static async getProducts() {

        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch products');

        return data;
    }


    static async getProduct(productId) {

        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch product');

        return data;
    }


    // =============================
    // CART
    // =============================

    static async addToCart(userId, productId, quantity) {

        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                product_id: productId,
                quantity
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to add to cart');

        return data;
    }


    static async getCart(userId) {

        const response = await fetch(`${API_BASE_URL}/cart/user/${userId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch cart');

        return data;
    }


    static async updateCartItem(cartItemId, quantity) {

        const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to update cart item');

        return data;
    }


    static async removeFromCart(cartItemId) {

        const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to remove from cart');

        return data;
    }


    // =============================
    // ORDERS
    // =============================

    static async createOrder(userId, orderData) {

        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                ...orderData
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to create order');

        return data;
    }


    static async getOrders(userId) {

        const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch orders');

        return data;
    }


    static async getOrder(orderId) {

        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch order');

        return data;
    }


   static async getSellerOrders(email){

const response = await fetch(
`${API_BASE_URL}/orders/seller/${encodeURIComponent(email)}`
);

const data = await response.json();

if(!response.ok){
throw new Error(data.error || "Failed to fetch seller orders");
}

return data;

}


static async updateOrderStatus(orderId,status){

const response = await fetch(
`${API_BASE_URL}/orders/${orderId}/status`,
{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({status})
}
);

const data = await response.json();

if(!response.ok){
throw new Error(data.error || "Failed to update order status");
}

return data;

}


    // =============================
    // LISTINGS
    // =============================

    static async createListing(userId, listingData) {

        const response = await fetch(`${API_BASE_URL}/listings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(listingData)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to create listing');

        return data;
    }


    static async getUserListings() {

        const user = Auth.getCurrentUser();
        const email = user?.email;

        if (!email) throw new Error("User email not found");

        const response = await fetch(`${API_BASE_URL}/listings/seller/${encodeURIComponent(email)}`);

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch listings");

        return data;
    }


    static async updateListing(listingId, listingData) {

        const response = await fetch(`${API_BASE_URL}/listings/${listingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(listingData)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to update listing');

        return data;
    }


    static async deleteListing(listingId) {

        const response = await fetch(`${API_BASE_URL}/listings/${listingId}`, {
            method: "DELETE"
        });

        let data = {};

        try {
            data = await response.json();
        } catch (e) {
            data = {};
        }

        if (!response.ok) throw new Error(data.error || "Failed to delete listing");

        return data;
    }

}


// Make API global
window.API = API;