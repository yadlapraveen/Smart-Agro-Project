// Orders Page Module

async function renderOrdersContent(params = {}) {

const app = document.getElementById("app");
const user = Auth.getCurrentUser();

if (!user) {
app.innerHTML = `
<div class="container">
<div class="empty-state" style="min-height:400px;">
<h2>Please sign in</h2>
<p>Sign in to view your orders</p>
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
<div class="container" style="padding-top:2rem;padding-bottom:2rem;">

<div style="margin-bottom:1.5rem;">
<h1 style="font-size:2rem;font-weight:700;color:var(--color-forest);">
📦 My Orders
</h1>
<p id="ordersCount">Loading orders...</p>
</div>

<div style="display:flex;gap:10px;margin-bottom:2rem;flex-wrap:wrap;">
<button class="order-filter active">All</button>
<button class="order-filter">Pending</button>
<button class="order-filter">Confirmed</button>
<button class="order-filter">Shipped</button>
<button class="order-filter">Delivered</button>
<button class="order-filter">Cancelled</button>
</div>

<div id="ordersContainer" class="loading">
<div class="spinner"></div>
</div>

</div>
`;

try {

const orders = await API.getOrders(user.id) || [];

const pendingCount = orders.filter(o => (o.status || "").toLowerCase() === "pending").length;
const confirmedCount = orders.filter(o => (o.status || "").toLowerCase() === "confirmed").length;
const shippedCount = orders.filter(o => (o.status || "").toLowerCase() === "shipped").length;
const deliveredCount = orders.filter(o => (o.status || "").toLowerCase() === "delivered").length;
const cancelledCount = orders.filter(o => (o.status || "").toLowerCase() === "cancelled").length;

const filters = document.querySelectorAll(".order-filter");

filters[0].textContent = `All (${orders.length})`;
filters[1].textContent = `Pending (${pendingCount})`;
filters[2].textContent = `Confirmed (${confirmedCount})`;
filters[3].textContent = `Shipped (${shippedCount})`;
filters[4].textContent = `Delivered (${deliveredCount})`;
filters[5].textContent = `Cancelled (${cancelledCount})`;

const container = document.getElementById("ordersContainer");
const ordersCountEl = document.getElementById("ordersCount");

ordersCountEl.textContent = `Total Orders (${orders.length})`;

if(orders.length === 0){

container.innerHTML = `
<div class="empty-state">
<h3>No Orders</h3>
<p>You haven't placed any orders yet</p>
</div>
`;

return;

}

renderOrdersList(orders, container);

const filterButtons = document.querySelectorAll(".order-filter");

filterButtons.forEach(btn => {

btn.addEventListener("click", () => {

filterButtons.forEach(b => b.classList.remove("active"));
btn.classList.add("active");

const status = btn.innerText.split(" ")[0].toLowerCase();

let filtered = orders;

if(status !== "all"){
filtered = orders.filter(o =>
(o.status || "").toLowerCase() === status
);
}

renderOrdersList(filtered, container);

});

});

} catch(error){

console.error(error);

document.getElementById("ordersContainer").innerHTML =
"<p>Failed to load orders</p>";

}

}



function renderOrdersList(orders, container){

container.innerHTML = `
<div style="display:flex;flex-direction:column;gap:1.5rem;width:100%;">

${orders.map(order => {

const steps = ["pending","confirmed","shipped","delivered"];
const current = steps.indexOf((order.status || "").toLowerCase());

return `

<div class="order-card" style="
background:white;
border-radius:12px;
padding:20px;
box-shadow:0 4px 14px rgba(0,0,0,0.08);
width:100%;
max-width:1000px;
margin:auto;
">

<div style="display:flex;justify-content:space-between;">

<div>
<strong>${order.order_number || order.id}</strong>
<span style="
background:#FDE68A;
padding:4px 10px;
border-radius:20px;
font-size:12px;
margin-left:10px;
">
${order.status}
</span>

<div style="font-size:13px;color:#6B7280;margin-top:4px;">
${order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : ""}
</div>
</div>

<div style="text-align:right">
<div style="font-weight:700;font-size:20px;color:#1B4332;">
${Format.indianCurrency(order.total_amount)}
</div>
</div>

</div>

<div style="display:flex;align-items:center;margin-top:15px;">

${steps.map((step,i)=>`

<div style="
width:14px;
height:14px;
border-radius:50%;
background:${i <= current ? "#1B4332" : "#E5E7EB"};
"></div>

${i < steps.length-1 ?
`<div style="flex:1;height:2px;background:${i < current ? "#1B4332" : "#E5E7EB"};"></div>`
: ""}

`).join("")}

</div>

<div style="display:flex;justify-content:space-between;font-size:13px;margin-top:8px;color:#6B7280;">
<span>Pending</span>
<span>Confirmed</span>
<span>Shipped</span>
<span>Delivered</span>
</div>

<div onclick="toggleOrderDetails('${order.id}')" style="
margin-top:12px;
font-size:14px;
color:#1B4332;
cursor:pointer;
font-weight:500;
">
▼ View details
</div>

<div id="orderDetails-${order.id}" style="
display:none;
margin-top:15px;
padding-top:15px;
border-top:1px solid #E5E7EB;
">

<p><strong>Shipping Address:</strong><br>
${(order.shipping_address || "India").replace(/\n/g,"<br>")}
</p>

<p>
<strong>Payment Method:</strong>
${order.payment_method || "Cash on Delivery"}
</p>

<p>
<strong>Total Items:</strong>
${order.items && order.items.length
? order.items.reduce((sum,item)=> sum + Number(item.quantity || 0),0)
: 0}
</p>

<div style="margin-top:10px">

${Array.isArray(order.items) ? order.items.map(item => `

<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">

<img src="${item.image_url}" style="
width:40px;
height:40px;
object-fit:cover;
border-radius:6px;
">

<div>

<div style="font-size:14px;font-weight:500">
${item.title}
</div>

<div style="font-size:12px;color:#6B7280">
Qty: ${item.quantity}
</div>

</div>

</div>

`).join("") : ""}

</div>

<p style="margin-top:10px">
<strong>Status:</strong>
${order.status}
</p>

${order.status === "pending" ? `
<button onclick="cancelOrder('${order.id}')"
style="margin-top:10px;background:#EF4444;color:white"
class="btn">
Cancel Order
</button>
` : ""}

</div>

</div>

`;

}).join("")}

</div>
`;

}



function toggleOrderDetails(orderId){

const box = document.getElementById("orderDetails-"+orderId);

if(box.style.display === "none"){
box.style.display = "block";
}else{
box.style.display = "none";
}

}



// CANCEL ORDER

async function cancelOrder(orderId){

try{

await API.updateOrderStatus(orderId,"cancelled");

showToast("Order cancelled successfully","success");

renderOrdersContent({});

}catch(error){

console.error(error);

showToast("Failed to cancel order","error");

}

}