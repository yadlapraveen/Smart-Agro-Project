import express from 'express';
import pool from '../db.js';

const router = express.Router();


// =============================
// GET all active products
// =============================
router.get('/', async (req, res) => {

  try {

    const [products] = await pool.query(`
      SELECT
        id,
        title,
        description,
        category,
        price,
        unit,
        stock_quantity,
        image_url,
        seller_name,
        location,
        is_organic,
        createdAt
      FROM products
      WHERE status = 'active' OR status IS NULL
      ORDER BY createdAt DESC
    `);

    res.json(products);

  } catch (err) {

    console.error("PRODUCT API ERROR:", err);

    res.status(500).json({
      error: "Database error"
    });

  }

});


// =============================
// GET single product by ID
// =============================
router.get('/:id', async (req, res) => {

  try {

    const [products] = await pool.query(
      `
      SELECT *
      FROM products
      WHERE id = ?
      `,
      [req.params.id]
    );

    if(products.length === 0){
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json(products[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch product"
    });

  }

});

export default router;