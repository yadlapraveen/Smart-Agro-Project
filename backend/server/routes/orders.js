import express from "express";
import pool from "../db.js";

const router = express.Router();


// =============================
// Create Order
// =============================
router.post("/", async (req, res) => {

try {

const { user_id, items, total_amount, payment_method, shipping_address } = req.body;

if (!user_id || !items || !total_amount) {
return res.status(400).json({ error: "Missing required fields" });
}

const connection = await pool.getConnection();
await connection.beginTransaction();

const order_number = `ORD-${Date.now()}`;

const [orderResult] = await connection.query(
`INSERT INTO orders
(user_id, order_number, total_amount, payment_method, shipping_address, status)
VALUES (?, ?, ?, ?, ?, ?)`,
[user_id, order_number, total_amount, payment_method, shipping_address, "pending"]
);

const orderId = orderResult.insertId;

for (const item of items) {

await connection.query(
`INSERT INTO order_items
(order_id, product_id, quantity, unit_price)
VALUES (?, ?, ?, ?)`,
[orderId, item.product_id, item.quantity, item.unit_price]
);

await connection.query(
`UPDATE products
SET stock_quantity = stock_quantity - ?
WHERE id = ?`,
[item.quantity, item.product_id]
);

}

await connection.commit();
connection.release();

res.status(201).json({
id: orderId,
order_number,
message: "Order created successfully"
});

} catch (err) {

console.error(err);

res.status(500).json({
error: "Failed to create order"
});

}

});


// =============================
// Get seller orders
// =============================
router.get("/seller/:email", async (req, res) => {

try {

const email = decodeURIComponent(req.params.email);

const [rows] = await pool.query(
`
SELECT
o.id,
o.order_number,
o.total_amount,
o.status,
o.createdAt,

oi.product_id,
oi.quantity,
oi.unit_price,

p.title,
p.image_url

FROM orders o

JOIN order_items oi
ON o.id = oi.order_id

JOIN products p
ON oi.product_id = p.id

WHERE p.seller_email = ?

AND o.status = 'pending'

ORDER BY o.createdAt DESC
`,
[email]
);


const ordersMap = {};

rows.forEach(row => {

if(!ordersMap[row.id]){

ordersMap[row.id] = {

id: row.id,
order_number: row.order_number,
total_amount: row.total_amount,
status: row.status,
createdAt: row.createdAt,
items: []

};

}

ordersMap[row.id].items.push({

product_id: row.product_id,
quantity: row.quantity,
unit_price: row.unit_price,
title: row.title,
image_url: row.image_url

});

});

res.json(Object.values(ordersMap));

}
catch(err){

console.error(err);

res.status(500).json({
error:"Failed to fetch seller orders"
});

}

});


// =============================
// Get user orders
// =============================
router.get("/user/:user_id", async (req, res) => {

try {

const [rows] = await pool.query(
`
SELECT 

o.id,
o.order_number,
o.total_amount,
o.status,
o.shipping_address,
o.payment_method,
o.createdAt,

oi.product_id,
oi.quantity,
oi.unit_price,

p.title,
p.image_url

FROM orders o

LEFT JOIN order_items oi 
ON o.id = oi.order_id

LEFT JOIN products p 
ON oi.product_id = p.id

WHERE o.user_id = ?

ORDER BY o.createdAt DESC
`,
[req.params.user_id]
);


const ordersMap = {};

rows.forEach(row => {

if(!ordersMap[row.id]){

ordersMap[row.id] = {

id: row.id,
order_number: row.order_number,
total_amount: row.total_amount,
status: row.status,
shipping_address: row.shipping_address,
payment_method: row.payment_method,
createdAt: row.createdAt,
items: []

};

}

if(row.product_id){

ordersMap[row.id].items.push({

product_id: row.product_id,
quantity: row.quantity,
unit_price: row.unit_price,
title: row.title,
image_url: row.image_url

});

}

});

res.json(Object.values(ordersMap));

}
catch(err){

console.error(err);

res.status(500).json({
error:"Failed to fetch orders"
});

}

});


// =============================
// Update order status
// =============================
router.put("/:id/status", async (req, res) => {

try {

const { status } = req.body;
const orderId = req.params.id;

await pool.query(
"UPDATE orders SET status=? WHERE id=?",
[status, orderId]
);

res.json({
success:true,
message:"Order status updated"
});

} catch (err) {

console.error(err);

res.status(500).json({
error:"Failed to update order"
});

}

});

export default router;