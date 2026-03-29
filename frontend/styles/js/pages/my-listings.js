// My Listings Page Module

async function renderMyListingsContent(params) {

const app = document.getElementById("app");
const user = Auth.getCurrentUser();

if (!user) {

app.innerHTML = `
<div class="container">
<div class="empty-state">
<h2>Please sign in</h2>
<p>Sign in to view your listings</p>
<button class="btn btn-primary"
onclick="document.getElementById('authModal').style.display='flex'">
Sign In
</button>
</div>
</div>
`;

return;
}

app.innerHTML = `
<div class="container" style="padding-top:2rem;padding-bottom:2rem;max-width:1200px;margin:auto;">

<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;">

<div id="listingHeader">
<h1 style="font-size:2rem;font-weight:700;color:var(--color-forest);">
My Listings
</h1>
<p style="color:#6B7280;font-size:14px;">Loading...</p>
</div>

<a href="#/sell" class="btn btn-primary">Add New Product</a>

</div>

<div id="listingsContainer">
<div class="spinner"></div>
</div>

</div>
`;

try {

const listings = await API.getUserListings(user.email);

// SELLER ORDERS FETCH
const sellerOrders = await API.getSellerOrders(user.email);

const pendingOrders = sellerOrders.length;

const totalListings = listings.length;

const activeListings = listings.filter(
item => item.status === "active" || !item.status
).length;

const totalStock = listings.reduce(
(sum,item)=> sum + (item.stock_quantity || 0),
0
);

document.getElementById("listingHeader").innerHTML = `
<h1 style="font-size:2rem;font-weight:700;color:var(--color-forest);">
My Listings
</h1>
<p style="color:#6B7280;font-size:14px;">
${totalListings} products - ${activeListings} active
</p>
`;

const container = document.getElementById("listingsContainer");

container.innerHTML = `

<div style="display:flex;flex-direction:column;width:100%;">

<div style="margin-bottom:1.5rem;border-bottom:1px solid #E5E7EB;display:flex;gap:30px;">

<span id="listingsTab"
style="padding-bottom:8px;border-bottom:2px solid var(--color-forest);font-weight:600;cursor:pointer;">
My Listings (${totalListings})
</span>

<span id="ordersTab"
style="padding-bottom:8px;font-weight:500;cursor:pointer;color:#6B7280;">
Orders to Confirm (${pendingOrders})
</span>

</div>

<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-bottom:2rem;">

<div class="stat-card">
<div class="stat-number">${totalListings}</div>
<div class="stat-label">Total Listings</div>
</div>

<div class="stat-card">
<div class="stat-number">${activeListings}</div>
<div class="stat-label">Active</div>
</div>

<div class="stat-card">
<div class="stat-number">${totalStock}</div>
<div class="stat-label">Total Stock</div>
</div>

</div>

<div id="productsSection">

<div class="products-grid">

${listings.map(listing => `

<div id="listing-${listing.id}" class="product-card">

<div class="product-image">
<img 
  src="${listing.image_url || 'https://via.placeholder.com/300'}"
  onerror="this.src='https://via.placeholder.com/300'"
>
<div class="product-category">${listing.category}</div>
</div>

<div class="product-content">

<h3 class="product-title">${listing.title}</h3>

<div class="product-footer">

<div>
<div class="product-price">${Format.indianCurrency(listing.price)}</div>
<div class="product-unit">per ${listing.unit}</div>
</div>

</div>

<div class="product-actions">

<button onclick="editListing('${listing.id}')" class="btn btn-primary">
Edit
</button>

<button onclick="deleteListing('${listing.id}')" class="btn" style="background:#EF4444;color:white;">
Delete
</button>

</div>

</div>

</div>

`).join("")}

</div>

</div>

<div id="ordersSection" style="display:none"></div>

</div>
`;

document.getElementById("listingsTab").onclick = () => {

document.getElementById("productsSection").style.display = "block";
document.getElementById("ordersSection").style.display = "none";

/* active tab style */
document.getElementById("listingsTab").style.borderBottom =
"2px solid var(--color-forest)";
document.getElementById("ordersTab").style.borderBottom =
"2px solid transparent";

};

document.getElementById("ordersTab").onclick = () => {

document.getElementById("productsSection").style.display = "none";
document.getElementById("ordersSection").style.display = "block";

renderOrdersToConfirm(sellerOrders);

/* active tab style */
document.getElementById("ordersTab").style.borderBottom =
"2px solid var(--color-forest)";
document.getElementById("listingsTab").style.borderBottom =
"2px solid transparent";

};

} catch (error) {

console.error("Failed to load listings", error);

}

}


// =============================
// Render Orders To Confirm
// =============================
function renderOrdersToConfirm(orders){

const container = document.getElementById("ordersSection");

if(!orders || orders.length === 0){

container.innerHTML = "<p>No orders to confirm</p>";
return;

}

container.innerHTML = orders.map(order => {

const totalItems = order.items
? order.items.reduce((sum,i)=> sum + Number(i.quantity||0),0)
: 0;

return `

<div id="order-${order.id}" style="
background:white;
padding:20px;
border-radius:10px;
margin-bottom:20px;
box-shadow:0 2px 6px rgba(0,0,0,0.1);
">

<div style="display:flex;justify-content:space-between">

<div>
<h3>${order.order_number}</h3>
<p>${totalItems} item(s)</p>
</div>

<div>
<h3>${Format.indianCurrency(order.total_amount)}</h3>
<p>Status: ${order.status}</p>
</div>

</div>


<div style="display:flex;gap:15px;margin-top:20px">

<button class="btn btn-outline"
onclick="toggleSellerOrderDetails('${order.id}')">
View Details
</button>

<button class="btn btn-primary"
onclick="confirmOrder('${order.id}')">
✔ Confirm Order
</button>

</div>


<div id="seller-order-details-${order.id}"
style="
display:none;
margin-top:15px;
border-top:1px solid #E5E7EB;
padding-top:10px;
">

${order.items.map(item => `

<div style="
display:flex;
gap:12px;
align-items:center;
margin-bottom:10px;
padding:8px;
background:#FAFAFA;
border-radius:8px;
">

<img src="${item.image_url || 'https://via.placeholder.com/60'}"
style="
width:60px;
height:60px;
object-fit:cover;
border-radius:6px;
">

<div>

<div style="font-weight:600;color:#1B4332">
${item.title}
</div>

<div style="font-size:13px;color:#6B7280">
Qty: ${item.quantity}
</div>

<div style="font-size:13px;color:#6B7280">
Price: ${Format.indianCurrency(item.unit_price)}
</div>

</div>

</div>

`).join("")}

<p style="margin-top:10px">
<strong>Status:</strong> ${order.status}
</p>

</div>

</div>

`;

}).join("");

}

// =============================
// Confirm Order
// =============================
async function confirmOrder(orderId){

try{

await API.updateOrderStatus(orderId,"confirmed");

showToast("Order confirmed successfully","success");

/* remove confirmed order from list */

const orderCard =
document.getElementById("order-"+orderId);

if(orderCard){
orderCard.remove();
}

/* update orders count */

const ordersTab =
document.getElementById("ordersTab");

const countMatch =
ordersTab.innerText.match(/\((\d+)\)/);

if(countMatch){

let count = parseInt(countMatch[1]);

count = Math.max(0, count-1);

ordersTab.innerText =
"Orders to Confirm ("+count+")";

}

}catch(err){

console.error(err);

showToast("Failed to confirm order","error");

}

}
/* ===========================
EDIT LISTING
=========================== */

async function editListing(id){

try{

const listings = await API.getUserListings(Auth.getCurrentUser().id);

const product = listings.find(p => p.id == id);

if(!product){
showToast("Product not found","error");
return;
}

window.currentEditId = id;
window.currentProduct = product;

/* fill modal fields */

document.getElementById("editTitle").value = product.title || "";
document.getElementById("editCategory").value = product.category || "";
document.getElementById("editPrice").value = product.price || "";
document.getElementById("editStock").value = product.stock_quantity || "";
document.getElementById("editImage").value = product.image_url || "";
document.getElementById("editLocation").value = product.location || "";
document.getElementById("editDescription").value = product.description || "";
document.getElementById("editOrganic").checked = product.is_organic == 1;

/* open modal */

document.getElementById("editModal").style.display = "flex";

}catch(err){

console.error(err);
showToast("Failed to load product","error");

}

}


/* ===========================
DELETE LISTING
=========================== */

async function deleteListing(id){

if(!confirm("Delete this product?")) return;

try{

await API.deleteListing(id);

showToast("Product deleted","success");

/* reload listings */

await renderMyListingsContent(new URLSearchParams());

}catch(err){

console.error(err);
showToast("Failed to delete product","error");

}

}


/* make global (IMPORTANT) */

window.editListing = editListing;
window.deleteListing = deleteListing;



function toggleSellerOrderDetails(orderId){

const box =
document.getElementById(
"seller-order-details-"+orderId
);

if(!box) return;

if(box.style.display === "none"){

box.style.display = "block";

}else{

box.style.display = "none";

}

}