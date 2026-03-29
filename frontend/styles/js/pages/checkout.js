// =============================
// CHECKOUT PAGE MODULE
// =============================

async function renderCheckoutContent() {

const app = document.getElementById("app");
const user = Auth.getCurrentUser();

if (!user) {
Router.navigate("");
return;
}

const cart = Storage.getCart();

if (cart.length === 0) {
Router.navigate("");
return;
}

const subtotal = cart.reduce((sum,item)=> sum + (item.price * item.quantity),0);
const shipping = subtotal >= 5000 ? 0 : 49;
const total = subtotal + shipping;

showShippingPage(cart,total);

}


// =============================
// STEP BAR
// =============================

function renderSteps(active){

return `
<div class="checkout-steps">

<div class="step ${active > 1 ? "completed" : active === 1 ? "active" : ""}">
<div class="step-number">
${active > 1 ? "✓" : "1"}
</div>
<span>Shipping</span>
</div>

<div class="step-line"></div>

<div class="step ${active === 2 ? "active" : ""}">
<div class="step-number">2</div>
<span>Payment</span>
</div>

</div>
`;

}


// =============================
// STEP 1 → SHIPPING PAGE
// =============================

function showShippingPage(cart,total){

window.checkoutTotal = total;

const user = Auth.getCurrentUser();

const savedShippingData =
JSON.parse(localStorage.getItem("shippingData") || "null");

const app = document.getElementById("app");

app.innerHTML = `

<div class="container">

<a class="back-link"
onclick="Router.navigate('cart')"
style="cursor:pointer;margin-bottom:15px;display:inline-block;">
← Back to Cart
</a>

<h1 class="checkout-title">Checkout</h1>

${renderSteps(1)}

<div class="checkout-layout">

<div>

<div class="checkout-card">

<h2>Shipping Address</h2>

<div class="form-group">
<label>Full Name</label>
<input id="fullName"
value="${savedShippingData?.fullName || user.full_name || ""}">
</div>

<div class="form-group">
<label>Phone</label>
<input id="phone"
value="${savedShippingData?.phone || ""}">
</div>

<div class="form-group">
<label>Street Address</label>
<textarea id="address">${savedShippingData?.address || ""}</textarea>
</div>

<div class="form-group">
<label>City</label>
<input id="city"
value="${savedShippingData?.city || ""}">
</div>

<div class="form-group">
<label>State</label>
<input id="state"
value="${savedShippingData?.state || ""}">
</div>

<div class="form-group">
<label>Postal Code</label>
<input id="postal"
value="${savedShippingData?.postal || ""}">
</div>

<button class="btn btn-primary btn-block"
onclick="saveShippingAndContinue(${total})">

Continue to Payment

</button>

</div>

</div>

${renderSummary(cart,total)}

</div>

</div>
`;

}


// =============================
// STEP 2 → PAYMENT PAGE
// =============================

function showPaymentPage(total){

const cart = Storage.getCart();
const app = document.getElementById("app");

app.innerHTML = `

<div class="container">

<a class="back-link"
onclick="showShippingPage(Storage.getCart(),${total})"
style="cursor:pointer;margin-bottom:15px;display:inline-block;">
← Back to Shipping
</a>

<h1 class="checkout-title">Checkout</h1>

${renderSteps(2)}

<div class="checkout-layout">

<div>

<div class="checkout-card">

<h2>Payment Method</h2>

<div class="payment-options">

<label class="payment-option active">
<input type="radio" name="payment" value="cod" checked>

<div class="payment-content">
<div class="payment-icon">💰</div>
<div>
<div class="payment-title">Cash on Delivery</div>
<div class="payment-desc">Pay when your order arrives</div>
</div>
</div>

</label>

<label class="payment-option">
<input type="radio" name="payment" value="mobile">

<div class="payment-content">
<div class="payment-icon">📱</div>
<div>
<div class="payment-title">UPI / PhonePe / Paytm</div>
</div>
</div>

</label>

<label class="payment-option">
<input type="radio" name="payment" value="card">

<div class="payment-content">
<div class="payment-icon">💳</div>
<div>
<div class="payment-title">Credit / Debit Card</div>
</div>
</div>

</label>

</div>

<button class="btn btn-primary btn-block"
onclick="placeOrder(${total})"
style="margin-top:20px">

Place Order - ${Format.indianCurrency(total)}

</button>

</div>

</div>

${renderSummary(cart,total)}

</div>

</div>
`;

activatePaymentOptions();

}


// =============================
// PAYMENT OPTION UI
// =============================

function activatePaymentOptions(){

document.querySelectorAll(".payment-option").forEach(option=>{

option.addEventListener("click",()=>{

document.querySelectorAll(".payment-option")
.forEach(o=>o.classList.remove("active"));

option.classList.add("active");

option.querySelector("input").checked = true;

});

});

}


// =============================
// STEP 3 → PLACE ORDER
// =============================

async function placeOrder(total){

const user = Auth.getCurrentUser();
const cart = Storage.getCart();

if(cart.length === 0){
showToast("Cart is empty","error");
return;
}

try{

const payment =
document.querySelector('input[name="payment"]:checked').value;

const orderId = "SA-"+Date.now();

const savedShippingData =
JSON.parse(localStorage.getItem("shippingData") || "null");

if(!savedShippingData){

showToast("Enter shipping address","error");

showShippingPage(cart,total);

return;

}

const shippingAddress = `
${savedShippingData.fullName}
${savedShippingData.phone}
${savedShippingData.address}
${savedShippingData.city}
${savedShippingData.state}
${savedShippingData.postal}
`.trim();

const orderData = {

order_number: orderId,

total_amount: total,

payment_method: payment,

shipping_address: shippingAddress,

items: cart.map(item=>({

product_id: item.product_id || item.id,

quantity: item.quantity,

unit_price: item.price

}))

};

await API.createOrder(user.id, orderData);

localStorage.removeItem("shippingData");

Storage.clearCart();

updateCartBadge();

showOrderSuccess(orderId,total,payment);

}catch(err){

console.error(err);

showToast("Failed to place order","error");

}

}


// =============================
// SUCCESS PAGE
// =============================

function showOrderSuccess(orderId,total,payment){

const user = Auth.getCurrentUser();
const app = document.getElementById("app");

app.innerHTML = `

<div class="order-success-wrapper">

<div class="order-success-card">

<div style="font-size:60px;color:#16a34a;margin-bottom:20px;">
✔
</div>

<h1 style="color:#1B4332;margin-bottom:10px;">
Order Placed!
</h1>

<p>Thank you, ${user.full_name}!</p>

<p>Your order <b>${orderId}</b> has been placed successfully.</p>

<div style="margin:20px 0">

<div>Payment Method: <b>${payment}</b></div>

<div>Total: <b>${Format.indianCurrency(total)}</b></div>

</div>

<div style="display:flex;gap:12px;justify-content:center;">

<button class="btn"
onclick="Router.navigate('orders')">

View Orders

</button>

<button class="btn btn-primary"
onclick="Router.navigate('')">

Shop More

</button>

</div>

</div>

</div>
`;

}


// =============================
// ORDER SUMMARY
// =============================

function renderSummary(cart,total){

return `
<div class="cart-summary">

<h2>Order Summary</h2>

${cart.map(item=>`

<div class="summary-item">

<span>${item.product_title}</span>

<span>x${item.quantity}</span>

<span>${Format.indianCurrency(item.price * item.quantity)}</span>

</div>

`).join("")}

<div class="summary-total">

Total: ${Format.indianCurrency(total)}

</div>

</div>
`;

}


// =============================
// CART BADGE
// =============================

function updateCartBadge(){

const cart = Storage.getCart();

const cartCount = document.getElementById("cartCount");

const total =
cart.reduce((sum,item)=> sum + item.quantity,0);

if(total > 0){

cartCount.style.display="flex";

cartCount.textContent = total;

}
else{

cartCount.style.display="none";

}

}


// =============================
// SAVE SHIPPING DATA
// =============================

function saveShippingAndContinue(total){

const shippingData = {

fullName:
document.getElementById("fullName").value,

phone:
document.getElementById("phone").value,

address:
document.getElementById("address").value,

city:
document.getElementById("city").value,

state:
document.getElementById("state").value,

postal:
document.getElementById("postal").value

};

if(
!shippingData.fullName ||
!shippingData.phone ||
!shippingData.address ||
!shippingData.city ||
!shippingData.state ||
!shippingData.postal
){

showToast("Fill all fields","error");

return;

}

localStorage.setItem(
"shippingData",
JSON.stringify(shippingData)
);

showPaymentPage(total);

}