import express from 'express';
import pool from '../db.js';

const router = express.Router();


// GET SELLER LISTINGS
router.get('/seller/:seller_email', async (req, res) => {

try {

const [products] = await pool.query(
`SELECT *
FROM products
WHERE seller_email = ?
AND (status = 'active' OR status IS NULL)
ORDER BY createdAt DESC`,
[req.params.seller_email]
);

res.json(products);

} catch (err) {

console.error("FETCH LISTINGS ERROR:", err);

res.status(500).json({
error: "Failed to fetch listings"
});

}

});


// CREATE PRODUCT
router.post('/', async (req, res) => {

try {

const {
title,
description,
category,
price,
unit,
stock_quantity,
image_url,
seller_name,
seller_email,
location,
is_organic
} = req.body;

if (!title || !price || !seller_email || !category) {

return res.status(400).json({
error: "Missing required fields"
});

}

const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

await pool.query(
`INSERT INTO products
(id,title,description,category,price,unit,stock_quantity,image_url,
seller_name,seller_email,location,is_organic,status,createdAt)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())`,
[
id,
title,
description || "",
category,
price,
unit || "",
stock_quantity || 0,
image_url || "",
seller_name || "",
seller_email,
location || "",
is_organic ? 1 : 0,
'active'
]
);

res.status(201).json({
id,
message: "Product created successfully"
});

} catch (err) {

console.error("CREATE PRODUCT ERROR:", err);

res.status(500).json({
error: "Failed to create listing"
});

}

});


// UPDATE PRODUCT
router.put('/:id', async (req, res) => {

try {

const {
title,
description,
category,
price,
unit,
stock_quantity,
image_url,
location,
is_organic
} = req.body;

const [result] = await pool.query(
`UPDATE products
SET
title = COALESCE(NULLIF(?,''),title),
description = COALESCE(NULLIF(?,''),description),
category = COALESCE(NULLIF(?,''),category),
price = COALESCE(NULLIF(?,''),price),
unit = COALESCE(NULLIF(?,''),unit),
stock_quantity = COALESCE(NULLIF(?,''),stock_quantity),
image_url = COALESCE(NULLIF(?,''),image_url),
location = COALESCE(NULLIF(?,''),location),
is_organic = COALESCE(?,is_organic),
status = 'active'
WHERE id = ?`,
[
title,
description,
category,
price,
unit,
stock_quantity,
image_url,
location,
typeof is_organic === "boolean" ? (is_organic ? 1 : 0) : null,
req.params.id
]
);

if(result.affectedRows === 0){

return res.status(404).json({
error:"Product not found"
});

}

res.json({
message:"Product updated successfully"
});

} catch (err) {

console.error("UPDATE PRODUCT ERROR:", err);

res.status(500).json({
error:"Failed to update listing"
});

}

});




// Remove product from listings (soft delete)
router.delete('/:id', async (req, res) => {

  try {

    const id = req.params.id;

    console.log("Removing product:", id);

    const [result] = await pool.query(
      "UPDATE products SET status='inactive' WHERE id=?",
      [id]
    );

    if(result.affectedRows === 0){
      return res.status(404).json({
        error:"Product not found"
      });
    }

    res.json({
      success:true,
      message:"Product removed from listings"
    });

  } catch (error) {

    console.error("DELETE ERROR:", error);

    res.status(500).json({
      error:"Failed to remove listing"
    });

  }

});


export default router;